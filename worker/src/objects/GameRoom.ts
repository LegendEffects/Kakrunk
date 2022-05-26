import { animals, uniqueNamesGenerator } from "unique-names-generator"
import { MAX_NAME_LENGTH } from "../config"
import { Environment } from "../types"
import { GameState } from "../types/GameState"
import { ClientWebsocketEvent, WebsocketEvent } from "../types/WebsocketEvent"

export type HostSession = {
    webSocket: WebSocket
    quit?: boolean
}

export type PlayerSession = {
    webSocket: WebSocket
    name: string
    points: number
    quit?: boolean
}

export default class GameRoom implements DurableObject {
    protected storage: DurableObjectStorage
    protected env: Environment
    protected state: GameState = "WAITING"

    protected hostSession?: HostSession = undefined
    protected sessions: PlayerSession[] = []

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

        const session: HostSession = {
            webSocket,
        }

        this.hostSession = session

        webSocket.addEventListener("message", async (message) => {
            try {
                const data = JSON.parse(message.data.toString())
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
            webSocket,
            name: "",
            points: 0,
        }

        this.sessions.push(session)

        let receivedUserDetails = false

        webSocket.addEventListener("message", async (message) => {
            try {
                const json = JSON.parse(message.data.toString())

                // Enforce a type property to be on the event
                if (!json.type) {
                    return
                }

                const data = json as ClientWebsocketEvent

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
                        type: "USER_CONNECT",
                        name: session.name,
                    })

                    receivedUserDetails = true
                }
            } catch (e: any) {
                // TODO: Remove
                webSocket.send(JSON.stringify({ error: e.stack }))
            }
        })

        const closeOrErrorHandler = () => {
            session.quit = true
            this.sessions = this.sessions.filter((member) => member !== session)
            if (session.name) {
                this.broadcast({
                    type: "USER_LEAVE",
                    name: session.name,
                })
            }
        }

        webSocket.addEventListener("close", closeOrErrorHandler)
        webSocket.addEventListener("error", closeOrErrorHandler)
    }

    sendToHost(event: WebsocketEvent) {
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
                type: "HOST_DISCONNECT",
            })
        }
    }

    broadcast(event: WebsocketEvent) {
        const message = JSON.stringify(event)

        // There's a chance that a websocket session has disconnected, so we'll just notify everyone of this
        const quitters: PlayerSession[] = []

        this.sessions = this.sessions.filter((session) => {
            try {
                session.webSocket.send(message)
                return true
            } catch (e) {
                // The websocket connection wasn't available when we sent the message
                session.quit = true
                quitters.push(session)
                return false
            }
        })

        // Notify of leavers
        quitters.forEach((session) => {
            this.broadcast({
                event: "USER_LEAVE",
                name: session.name,
            })
        })
    }
}
