import { AnswerReceivedEvent, ChangeQuestionPhaseEvent, Question, QuestionSummaryEvent } from "shared"
import { assign, createMachine, sendParent } from "xstate"

type HostQuestionStateContext = {
    question: Question
    index: number
    answers: number
    summary?: number[]
}

export type HostQuestionStateEvent =
    | {
          type: "NEXT"
      }
    | AnswerReceivedEvent
    | ChangeQuestionPhaseEvent
    | QuestionSummaryEvent

export const createHostQuestionStateMachine = (question: Question, index: number) => {
    return createMachine<HostQuestionStateContext, HostQuestionStateEvent>({
        initial: "preview",
        context: {
            question,
            index,
            answers: 0,
        },
        states: {
            preview: {},
            view: {
                on: {
                    NEXT: "revealAnswers",
                },
            },
            revealAnswers: {
                on: {
                    NEXT: "finish",
                },
            },
            finish: {
                type: "final",
                entry: sendParent({ type: "NEXT_QUESTION" }),
            },
        },
        on: {
            ANSWER_RECEIVED: {
                actions: assign({
                    answers: (ctx) => ctx.answers + 1,
                }),
            },
            CHANGE_QUESTION_PHASE: [{ target: "view", cond: (_, e) => e.phase === "view" }],
            QUESTION_SUMMARY: {
                target: "revealAnswers",
                actions: assign({
                    summary: (_, event) => event.summary,
                }),
            },
        },
    })
}
