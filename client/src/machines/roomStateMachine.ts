import { ClientEvent, parseWebsocketMessage, Player, ServerEvent } from "shared"
import { assign, createMachine, forwardTo } from "xstate"

export type RoomContext = {
    roomCode?: string
    players: Player[]
}

export const createRoomStateMachine = (roomCode: string) => {
    return createMachine<RoomContext, ClientEvent | ServerEvent>({
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
        },
        invoke: {
            id: "socket",
            src: () => (send, onEvent) => {
                const websocket = new WebSocket(`ws://localhost:8787/api/join/${roomCode}/websocket`)

                onEvent((event) => {
                    websocket.send(JSON.stringify(event))
                })

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
        states: {
            initializing: {},
        },
    })
}
