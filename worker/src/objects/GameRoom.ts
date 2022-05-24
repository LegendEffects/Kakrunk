import { animals, uniqueNamesGenerator } from "unique-names-generator"
import { MAX_NAME_LENGTH } from "../config"
import { Environment } from "../types"
import { GameState } from "../types/GameState"
import { WebsocketEvent } from "../types/WebsocketEvent"

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
        // @ts-expect-error
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
                event: "HOST_CONNECT",
            }),
        )

        // TODO: Disconnect state
    }

    async handlePlayerSession(webSocket: WebSocket) {
        // @ts-expect-error
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
                const data = JSON.parse(message.data.toString())

                if (!receivedUserDetails) {
                    session.name =
                        data.name || uniqueNamesGenerator({ dictionaries: [animals], length: 2, separator: " " })

                    if (session.name.length > MAX_NAME_LENGTH) {
                        webSocket.send(JSON.stringify({ error: "Name too long." }))
                        webSocket.close(1009, "Name too long.")
                        return
                    }

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
                    event: "USER_LEAVE",
                    name: session.name,
                })
            }
        }

        webSocket.addEventListener("close", closeOrErrorHandler)
        webSocket.addEventListener("error", closeOrErrorHandler)
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
