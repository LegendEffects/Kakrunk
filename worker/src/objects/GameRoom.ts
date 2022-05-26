import { animals, uniqueNamesGenerator } from "unique-names-generator"
import { MAX_NAME_LENGTH } from "../config"
import { Environment } from "../types"
import { GameState } from "../types/GameState"
import { v4 as uuidv4 } from "uuid"
import { ClientEvent, parseWebsocketMessage, Player, QuestionSet, ServerEvent } from "shared"
import { defaultQuestionSet } from "../__DATA__"

type WebsocketSession = {
    webSocket: WebSocket
    quit?: boolean
}

export type PlayerSession = WebsocketSession & Player

export default class GameRoom implements DurableObject {
    // CF Stuff
    protected storage: DurableObjectStorage
    protected env: Environment

    // Sessions
    protected hostSession?: WebsocketSession = undefined
    protected sessions: PlayerSession[] = []

    // Game state
    protected state: GameState = "WAITING"
    protected questionSet: QuestionSet = defaultQuestionSet
    protected currentQuestionIndex = -1

    constructor(state: DurableObjectState, env: Environment) {
        this.storage = state.storage
        this.env = env
    }

    async fetch(request: Request): Promise<Response> {
        const url = new URL(request.url)

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
            } catch (e: any) {
                // TODO: Remove
                webSocket.send(JSON.stringify({ error: e.stack }))
            }
        })

        // We want to give the WS some data as soon as they connect as host
        webSocket.send(
            JSON.stringify({
                type: "HOST_CONNECT",
            }),
        )

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

            this.broadcast({
                type: "HOST_DISCONNECTED",
            })
        }
    }

    broadcast(event: ServerEvent) {
        const message = JSON.stringify(event)

        // There's a chance that a websocket session has disconnected, so we'll just notify everyone of this
        const quitters: PlayerSession[] = []

        if (this.hostSession) {
            try {
                this.hostSession.webSocket.send(message)
            } catch (e) {
                this.hostSession.quit = true
                console.log("Host disconnected")
            }
        }

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

    nextQuestion() {
        if (this.currentQuestionIndex + 1 > this.questionSet.length - 1) {
            // Send finish state instead...
            return
        }

        this.currentQuestionIndex++

        this.broadcast({
            type: "NEW_QUESTION",
            question: this.questionSet[this.currentQuestionIndex],
        })
    }
}
