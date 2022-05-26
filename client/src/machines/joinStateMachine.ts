import { Actor, assign, createMachine, send, spawn } from "xstate"
import { createRoomStateMachine, RoomContext, RoomEvent } from "./roomStateMachine"

export type JoinStateContext = {
    room?: Actor<RoomContext, RoomEvent>
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
                        // @ts-expect-error I'm new to this whole xState thing, give me a break, I'm on a deadline!
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
                    actions: send((_, e) => ({ type: "SUBMIT_NAME", name: e.name }), { to: (ctx) => ctx.room }),
                    target: "joinRoom",
                },
            },
        },
        joinRoom: {
            type: "final",
        },
    },
})
