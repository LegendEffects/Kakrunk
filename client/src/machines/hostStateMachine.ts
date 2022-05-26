import { ClientEvent } from "shared"
import { ActorRef, assign, createMachine, send, spawn } from "xstate"
import { createGame } from "../actions/createGame"
import { createRoomStateMachine } from "./roomStateMachine"

export type GameContext = {
    room?: ActorRef<ClientEvent>
}

export const hostStateMachine = createMachine<GameContext>({
    id: "game_machine",
    initial: "chooseQuiz",
    context: {
        room: undefined,
    },
    states: {
        chooseQuiz: {
            on: {
                NEXT: "creating",
            },
        },
        creating: {
            invoke: {
                id: "create-screen",
                src: createGame,
                onDone: {
                    target: "waiting",
                    actions: assign({
                        room: (_, event) => {
                            return spawn(createRoomStateMachine(event.data.roomCode), { sync: true })
                        },
                    }),
                },
                onError: "error",
            },
        },
        waiting: {
            on: { NEXT: "countdown" },
        },
        countdown: {
            entry: send({ type: "START_GAME" }, { to: (ctx) => ctx.room }),
        },
        question: {},
        error: {},
    },
    on: {
        NEW_GAME: {},
    },
})
