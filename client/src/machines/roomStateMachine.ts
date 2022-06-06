import { ClientEvent, parseWebsocketMessage, Player, ServerEvent } from "shared"
import { assign, createMachine, forwardTo, sendParent, send } from "xstate"

export type RoomContext = {
    roomCode?: string
    players: Player[]
    error?: boolean
}

export type WebsocketEvent =
    | {
          type: "WEBSOCKET_ERROR"
      }
    | {
          type: "RESET_WEBSOCKET_ERROR"
      }

export const createRoomStateMachine = (roomCode: string) => {
    return createMachine<RoomContext, ClientEvent | ServerEvent | WebsocketEvent>({
        id: "room_machine",
        initial: "initializing",
        context: {
            players: [],
            roomCode,
        },
        on: {
            SUBMIT_NAME: {
                actions: forwardTo("socket"),
            },
            START_GAME: {
                actions: forwardTo("socket"),
            },
            SUBMIT_ANSWER: {
                actions: forwardTo("socket"),
            },
            NEXT_QUESTION: {
                actions: forwardTo("socket"),
            },
            USER_CONNECTED: {
                actions: assign({
                    players: (ctx, event) => [...ctx.players, event.player],
                }),
            },
            USER_DISCONNECTED: {
                actions: assign({
                    players: (ctx, event) => ctx.players.filter((p) => p.id !== event.id),
                }),
            },
            WEBSOCKET_ERROR: {
                target: "error",
            },
            "*": {
                actions: sendParent((_, e) => e),
            },
        },
        states: {
            initializing: {
                invoke: {
                    id: "socket",
                    src: () => (send, onEvent) => {
                        const websocket = new WebSocket(
                            `${import.meta.env.VITE_BASE_WS_URL}/join/${roomCode}/websocket`,
                        )

                        onEvent((event) => {
                            websocket.send(JSON.stringify(event))
                        })

                        websocket.addEventListener("error", () => send({ type: "WEBSOCKET_ERROR" }))

                        websocket.addEventListener("message", (e) => {
                            const data = parseWebsocketMessage<ServerEvent>(e.data)

                            if (!data) {
                                return
                            }

                            send(data)
                        })

                        return () => {
                            websocket.close()
                        }
                    },
                },
            },
            error: {},
        },
    })
}
