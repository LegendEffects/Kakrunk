import { animals, uniqueNamesGenerator } from "unique-names-generator"
import { MAX_NAME_LENGTH } from "../config"
import { Environment } from "../types"
import { GameState } from "../types/GameState"
import { v4 as uuidv4 } from "uuid"
import { ClientEvent, config, parseWebsocketMessage, Player, Question, QuestionSet, ServerEvent } from "shared"
import { defaultQuestionSet, defaultQuestionSetMeta } from "../__DATA__"
import generateScoreboard from "../functions/generateScoreboard"

type WebsocketSession = {
    webSocket: WebSocket
    quit?: boolean
}

type CurrentQuestion = {
    index: number
    askedAt: Date
    timeout?: ReturnType<typeof setTimeout>
}

export type PlayerSession = WebsocketSession &
    Player & {
        answer?: number
    }

export default class GameRoom implements DurableObject {
    // CF Stuff
    protected storage: DurableObjectStorage
    protected env: Environment

    // Init
    protected setup = false

    // Sessions
    protected hostSession?: WebsocketSession = undefined
    protected sessions: PlayerSession[] = []

    // Game state
    protected state: GameState = "WAITING"
    protected questionSet: QuestionSet = defaultQuestionSet

    protected currentQuestion?: CurrentQuestion = undefined

    constructor(state: DurableObjectState, env: Environment) {
        this.storage = state.storage
        this.env = env
    }

    async fetch(request: Request): Promise<Response> {
        const url = new URL(request.url)

        if (!this.setup) {
            this.setup = true
            await this.storage.put("shortCode", url.searchParams.get("code"))
        }

        switch (url.pathname) {
            case "/websocket":
                const pair = new WebSocketPair()

                // Determine whether this is a host or player session based upon when they connected effectively
                if (!this.hostSession) {
                    await this.handleHostSession(pair[1])
                } else {
                    await this.handlePlayerSession(pair[1])
                }

                return new Response(null, { status: 101, webSocket: pair[0] })
        }

        return new Response("Not found", { status: 404 })
    }

    async handleHostSession(webSocket: WebSocket) {
        webSocket.accept()

        const session: WebsocketSession = {
            webSocket,
        }

        this.hostSession = session

        webSocket.addEventListener("message", async (message) => {
            try {
                if (session.quit) {
                    session.webSocket.close(1011, "WebSocket broken.")
                }

                // Parse message data
                const data = parseWebsocketMessage<ClientEvent>(message.data.toString())

                if (!data) {
                    return
                }

                if (this.state === "WAITING" && data.type === "START_GAME") {
                    this.state = "IN_PROGRESS"
                    setTimeout(() => {
                        this.nextQuestion()
                    }, 3000)

                    return
                }

                if (data.type === "NEXT_QUESTION") {
                    if (this.currentQuestion?.timeout) {
                        clearTimeout(this.currentQuestion.timeout)
                    }

                    this.nextQuestion()
                    return
                }
            } catch (e: any) {
                // TODO: Remove
                webSocket.send(JSON.stringify({ error: e.stack }))
            }
        })

        // We want to give the WS some data as soon as they connect as host
        this.sendToHost({
            type: "HOST_CONNECTED",
            questionSetMeta: defaultQuestionSetMeta,
        })

        // TODO: Disconnect state
    }

    async handlePlayerSession(webSocket: WebSocket) {
        webSocket.accept()

        const session: PlayerSession = {
            id: uuidv4(),
            webSocket,
            name: "",
            score: 0,
        }

        this.sessions.push(session)

        let receivedUserDetails = false

        webSocket.addEventListener("message", async (message) => {
            try {
                if (session.quit) {
                    session.webSocket.close(1011, "WebSocket broken.")
                }

                // Parse message data
                const data = parseWebsocketMessage<ClientEvent>(message.data.toString())

                if (!data) {
                    return
                }

                // Enforce a name submission before being able to submit any other events
                if (!receivedUserDetails && data.type !== "SUBMIT_NAME") {
                    return
                }

                //
                // Submit name
                if (!receivedUserDetails && data.type === "SUBMIT_NAME") {
                    session.name =
                        data.name || uniqueNamesGenerator({ dictionaries: [animals], length: 2, separator: " " })

                    // TODO: better error handling of this
                    if (session.name.length > MAX_NAME_LENGTH) {
                        webSocket.send(JSON.stringify({ error: "Name too long." }))
                        webSocket.close(1009, "Name too long.")
                        return
                    }

                    this.sendToHost({
                        type: "USER_CONNECTED",
                        player: {
                            id: session.id,
                            name: session.name,
                            score: session.score,
                        },
                    })

                    receivedUserDetails = true
                    return
                }

                //
                // Submit answer
                if (data.type === "SUBMIT_ANSWER" && !session.answer) {
                    session.answer = data.answer
                    this.sendToHost({ type: "ANSWER_RECEIVED" })

                    // Check whether all players have submitted answers
                    if (this.sessions.find((session) => session.answer === undefined) === undefined) {
                        this.finishQuestion()
                    }

                    return
                }
            } catch (e: any) {
                // TODO: Remove
                webSocket.send(JSON.stringify({ error: e.stack }))
            }
        })

        webSocket.addEventListener("close", () => this.handleQuit(session))
        webSocket.addEventListener("error", () => this.handleQuit(session))
    }

    sendToHost(event: ServerEvent) {
        const message = JSON.stringify(event)

        if (!this.hostSession) {
            // Should be unreachable
            console.warn("Managed to try send an event to a session without a host... interesting one that")
            return
        }

        try {
            this.hostSession.webSocket.send(message)
        } catch (e) {
            this.hostSession.quit = true

            this.sendToPlayers({
                type: "HOST_DISCONNECTED",
            })
        }
    }

    sendToPlayers(event: ServerEvent) {
        const message = JSON.stringify(event)

        // There's a chance that a websocket session has disconnected, so we'll just notify everyone of this
        const quitters: PlayerSession[] = []

        this.sessions = this.sessions.filter((session) => {
            try {
                session.webSocket.send(message)
                return true
            } catch (e) {
                // The websocket connection wasn't available when we sent the message
                quitters.push(session)
                return false
            }
        })

        // Notify of leavers
        quitters.forEach(this.handleQuit)
    }

    sendToSession(session: PlayerSession, event: ServerEvent) {
        try {
            session.webSocket.send(JSON.stringify(event))
        } catch (e) {
            this.handleQuit(session)
        }
    }

    broadcast(event: ServerEvent) {
        this.sendToHost(event)
        this.sendToPlayers(event)
    }

    handleQuit(session: PlayerSession) {
        session.quit = true

        // For now we'll remove the session in totality, in the future we could assign a token to each session so that a user can
        // be reauthenticated to their session
        this.sessions = this.sessions.filter((s) => s !== session)

        this.sendToHost({
            type: "USER_DISCONNECTED",
            id: session.id,
        })
    }

    //
    // Question Phasing
    //
    nextQuestion() {
        if (!this.currentQuestion) {
            this.currentQuestion = {
                index: 0,
                askedAt: new Date(),
            }
        } else {
            if (this.currentQuestion.index + 1 > this.questionSet.length - 1) {
                this.endGame()
                return
            }

            this.currentQuestion = {
                index: this.currentQuestion.index + 1,
                askedAt: new Date(),
            }
        }

        // Reset player answers
        this.sessions.forEach((session) => {
            session.answer = undefined
        })

        const question = this.questionSet[this.currentQuestion.index]

        // Send to host with full details
        this.sendToHost({
            type: "NEW_QUESTION",
            question,
            index: this.currentQuestion.index,
        })

        // Send to players without the correct answer flag
        this.sendToPlayers({
            type: "NEW_QUESTION",
            question: {
                ...question,
                answers: question.answers.map(({ correct, ...answer }) => answer),
            },
            index: this.currentQuestion.index,
        })

        setTimeout(() => {
            this.broadcast({
                type: "CHANGE_QUESTION_PHASE",
                phase: "view",
            })

            if (this.currentQuestion) {
                this.currentQuestion.timeout = setTimeout(() => {
                    this.finishQuestion()
                }, question.timeLimit * 1000)
            }
        }, config.QUESTION_PREVIEW_TIME * 1000)
    }

    finishQuestion() {
        if (!this.currentQuestion) {
            console.error("Reached question finish without a current question")
            return
        }

        const question = this.questionSet[this.currentQuestion.index]

        const answers: number[] = new Array(question.answers.length).fill(0)

        // Mark all of the players answers
        this.sessions.forEach((session) => {
            if (session.answer !== undefined && question.answers[session.answer]) {
                answers[session.answer] = answers[session.answer] + 1
            }

            const correct = session.answer !== undefined && question.answers[session.answer]?.correct === true

            if (correct) {
                session.score = session.score + 1000
            }

            this.sendToSession(session, {
                type: "ANSWER_MARKED",
                score: session.score,
                correct,
            })
        })

        this.sendToHost({
            type: "QUESTION_SUMMARY",
            summary: answers,
        })

        this.sendToHost({
            type: "UPDATE_SCOREBOARD",
            players: generateScoreboard(this.sessions),
        })
    }

    async endGame() {
        this.broadcast({
            type: "GAME_FINISHED",
            players: generateScoreboard(this.sessions),
        })

        console.log("Closed")

        // Close everything, the clients should be able to handle themselves
        this.hostSession?.webSocket.close(1011, "Game Finished")
        this.sessions.forEach((player) => player.webSocket.close(1011, "Game Finished"))

        // Delete the shortened code
        const shortCode = await this.storage.get<string>("shortCode")

        if (shortCode) {
            this.env.shortenedLinks.delete(shortCode)
        }
    }
}
