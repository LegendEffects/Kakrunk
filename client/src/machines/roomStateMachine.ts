import { assign, createMachine, forwardTo } from "xstate"

export type Player = {
    name: string
}

export type RoomContext = {
    roomCode?: string
    players: Player[]
}

export type RoomEvent =
    | {
          type: "FIX"
      }
    | {
          type: "SEND"
      }
    | {
          type: "SUBMIT_NAME"
          name: string
      }
    | {
          type: "USER_CONNECT"
          name: string
      }

export const createRoomStateMachine = (roomCode: string) => {
    return createMachine<RoomContext, RoomEvent>({
        id: "room_machine",
        initial: "initializing",
        context: {
            players: [],
            roomCode,
        },
        on: {
            SEND: {
                actions: forwardTo("socket"),
            },
            SUBMIT_NAME: {
                actions: forwardTo("socket"),
            },
            USER_CONNECT: {
                actions: assign({
                    players: (ctx, event) => [...ctx.players, { name: event.name }],
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
                    const data = JSON.parse(e.data) as RoomEvent

                    switch (data.type) {
                        case "USER_CONNECT":
                            send({
                                type: "USER_CONNECT",
                                name: data.name,
                            })
                            break
                    }
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
