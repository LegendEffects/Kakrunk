import { ActorRef, assign, createMachine, spawn } from "xstate"
import { createGame } from "../actions/createGame"
import { createRoomStateMachine, RoomEvent } from "./roomStateMachine"

type Player = {
    name: string
}

export type GameContext = {
    room?: ActorRef<RoomEvent>
}

export const hostStateMachine = createMachine<GameContext>(
    {
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
                on: { NEXT: "question" },
            },
            question: {},
            error: {},
        },
        on: {
            NEW_GAME: {},
        },
    },
    {
        actions: {
            startGame: (context, event) => {},
        },
    },
)
