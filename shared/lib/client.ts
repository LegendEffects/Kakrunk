export type SubmitNameEvent = {
    type: "SUBMIT_NAME"
    name: string
}

export type StartGameEvent = {
    type: "START_GAME"
}

export type SubmitAnswerEvent = {
    type: "SUBMIT_ANSWER"
    answer: number
}

export type NextQuestionEvent = {
    type: "NEXT_QUESTION"
}

export type ClientEvent = SubmitNameEvent | StartGameEvent | SubmitAnswerEvent | NextQuestionEvent
