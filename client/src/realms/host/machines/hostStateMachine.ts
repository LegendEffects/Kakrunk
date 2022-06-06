import {
    AnswerReceivedEvent,
    ClientEvent,
    NextQuestionEvent,
    Player,
    QuestionSetMeta,
    QuestionSummaryEvent,
    ServerEvent,
} from "shared"
import { ActorRef, assign, createMachine, send, spawn, actions } from "xstate"
import { createGame } from "../../../actions/createGame"
import { createRoomStateMachine } from "../../../machines/roomStateMachine"
import { createHostQuestionStateMachine, HostQuestionStateEvent } from "./hostQuestionStateMachine"

export type GameContext = {
    room?: ActorRef<ClientEvent>
    question?: ActorRef<HostQuestionStateEvent>
    questionSet?: QuestionSetMeta
    scoreboard?: Player[]
}

export type HostStateEvent =
    | ServerEvent
    | NextQuestionEvent
    | {
          type: "NEXT"
      }

export const hostStateMachine = createMachine<GameContext, HostStateEvent>({
    id: "game_machine",
    initial: "chooseQuiz",
    context: {
        room: undefined,
        question: undefined,
        questionSet: undefined,
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
            entry: send({ type: "START_GAME" }, { to: (ctx) => ctx.room as ActorRef<ClientEvent> }),
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
                        question: (_, e) => spawn(createHostQuestionStateMachine(e.question, e.index), { sync: true }),
                    }),
                },
                NEXT_QUESTION: {
                    actions: send((_, e) => e, { to: (ctx) => ctx.room as ActorRef<NextQuestionEvent> }),
                },
                CHANGE_QUESTION_PHASE: {
                    actions: send((_, e) => e, { to: (ctx) => ctx.question as ActorRef<HostQuestionStateEvent> }),
                },
                ANSWER_RECEIVED: {
                    actions: send((_, e) => e, { to: (ctx) => ctx.question as ActorRef<AnswerReceivedEvent> }),
                },
                QUESTION_SUMMARY: {
                    actions: send((_, e) => e, { to: (ctx) => ctx.question as ActorRef<QuestionSummaryEvent> }),
                },
                UPDATE_SCOREBOARD: {
                    actions: assign({ scoreboard: (_, e) => e.players }),
                },
                GAME_FINISHED: {
                    target: "finished",
                    actions: assign({ scoreboard: (_, e) => e.players }),
                },
            },
        },
        finished: {},
        error: {},
    },
    on: {
        HOST_CONNECTED: {
            actions: assign({
                questionSet: (_, e) => e.questionSetMeta,
            }),
        },
    },
})
