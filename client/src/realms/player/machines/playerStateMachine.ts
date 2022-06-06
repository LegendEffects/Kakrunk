import { AnswerMarkedEvent, ChangeQuestionPhaseEvent, ClientEvent, NewQuestionEvent, SubmitAnswerEvent } from "shared"
import { ActorRef, assign, createMachine, send, spawn, actions } from "xstate"
import { createPlayerQuestionStateMachine, PlayerQuestionStateEvent } from "./playerQuestionStateMachine"
import { createRoomStateMachine } from "../../../machines/roomStateMachine"

export type PlayerStateContext = {
    room?: ActorRef<ClientEvent>
    question?: ActorRef<PlayerQuestionStateEvent>
    name?: string
    score: number
}

type PlayerStateEvent =
    | {
          type: "JOIN_ROOM"
          roomCode: string
      }
    | {
          type: "SUBMIT_NAME"
          name: string
      }
    | NewQuestionEvent
    | ChangeQuestionPhaseEvent
    | SubmitAnswerEvent
    | AnswerMarkedEvent

export const playerStateMachine = createMachine<PlayerStateContext, PlayerStateEvent>({
    id: "join_machine",
    initial: "roomCode",
    context: {
        room: undefined,
        question: undefined,
        score: 0,
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
                        send((_, e) => ({ type: "SUBMIT_NAME", name: e.name }), {
                            to: (ctx) => ctx.room as ActorRef<ClientEvent>,
                        }),
                    ],
                    target: "waitingStart",
                },
            },
        },
        waitingStart: {
            on: {
                NEW_QUESTION: {
                    target: "question",
                    actions: actions.pure((_, event) => actions.raise(event)), // pass it to the new_queston handler on the question screen
                },
            },
        },
        question: {
            on: {
                NEW_QUESTION: {
                    actions: assign({
                        question: (_, e) =>
                            spawn(createPlayerQuestionStateMachine(e.question, e.index), { sync: true }),
                    }),
                },
                CHANGE_QUESTION_PHASE: {
                    actions: send((_, e) => e, { to: (ctx) => ctx.question as ActorRef<PlayerQuestionStateEvent> }),
                },
                SUBMIT_ANSWER: {
                    actions: send((_, e) => e, { to: (ctx) => ctx.room as ActorRef<SubmitAnswerEvent> }),
                },
                ANSWER_MARKED: {
                    actions: [
                        send((_, e) => e, { to: (ctx) => ctx.question as ActorRef<AnswerMarkedEvent> }),
                        assign({ score: (_, e) => e.score }),
                    ],
                },
            },
        },
    },
})
