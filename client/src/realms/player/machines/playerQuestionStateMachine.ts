import { AnswerMarkedEvent, ChangeQuestionPhaseEvent, Question, SubmitAnswerEvent } from "shared"
import { assign, createMachine, sendParent } from "xstate"

type PlayerQuestionStateContext = {
    question: Question
    index: number
}

export type PlayerQuestionStateEvent =
    | {
          type: "NEXT"
      }
    | ChangeQuestionPhaseEvent
    | SubmitAnswerEvent
    | AnswerMarkedEvent

export const createPlayerQuestionStateMachine = (question: Question, index: number) => {
    return createMachine<PlayerQuestionStateContext, PlayerQuestionStateEvent>({
        initial: "getReady",
        context: {
            question,
            index,
        },
        states: {
            getReady: {
                on: {
                    NEXT: {
                        target: "view",
                    },
                },
            },
            view: {
                on: {
                    SUBMIT_ANSWER: {
                        target: "answered",
                        actions: sendParent((_, e) => e),
                    },
                },
            },
            answered: {},
            correct: {
                type: "final",
            },
            incorrect: {
                type: "final",
            },
        },
        on: {
            CHANGE_QUESTION_PHASE: [{ target: "view", cond: (_, e) => e.phase === "view" }],
            ANSWER_MARKED: [
                { target: "correct", cond: (_, e) => e.correct === true },
                { target: "incorrect", cond: (_, e) => e.correct === false },
            ],

            // ANSWER_RECEIVED: {
            //     actions: assign({
            //         answers: (ctx) => ctx.answers + 1,
            //     }),
            // },
        },
    })
}
