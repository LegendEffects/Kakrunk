import { ClientEvent } from "shared"
import { ActorRef, assign, createMachine, send, spawn } from "xstate"
import { createRoomStateMachine } from "./roomStateMachine"

export type JoinStateContext = {
    room?: ActorRef<ClientEvent>
    name?: string
}

type JoinStateEvent =
    | {
          type: "JOIN_ROOM"
          roomCode: string
      }
    | {
          type: "SUBMIT_NAME"
          name: string
      }

export const joinStateMachine = createMachine<JoinStateContext, JoinStateEvent>({
    id: "join_machine",
    initial: "roomCode",
    context: {
        room: undefined,
    },
    states: {
        roomCode: {
            on: {
                JOIN_ROOM: {
                    actions: assign({
                        room: (_, event) => {
                            return spawn(createRoomStateMachine(event.roomCode), { sync: true })
                        },
                    }),
                    target: "enterName",
                },
            },
        },
        enterName: {
            id: "enterName",
            on: {
                SUBMIT_NAME: {
                    actions: [
                        assign({ name: (_, e) => e.name }),
                        send((_, e) => ({ type: "SUBMIT_NAME", name: e.name }), { to: (ctx) => ctx.room }),
                    ],
                    target: "waitingStart",
                },
            },
        },
        waitingStart: {},
    },
})
