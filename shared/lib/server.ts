import { Question, QuestionSetMeta } from "./question"
import { Player } from "./shared/player"

export type UserDisconnectedEvent = {
    type: "USER_DISCONNECTED"
    id: string
}

export type UserConnectedEvent = {
    type: "USER_CONNECTED"
    player: Player
}

export type HostConnectedEvent = {
    type: "HOST_CONNECTED"
    questionSetMeta: QuestionSetMeta
}

export type HostDisconnectedEvent = {
    type: "HOST_DISCONNECTED"
}

export type NewQuestionEvent = {
    type: "NEW_QUESTION"
    question: Question
    index: number
}

export type ChangeQuestionPhaseEvent = {
    type: "CHANGE_QUESTION_PHASE"
    phase: "view"
}

export type AnswerReceivedEvent = {
    type: "ANSWER_RECEIVED"
}

export type AnswerMarkedEvent = {
    type: "ANSWER_MARKED"
    correct: boolean
    score: number
}

export type QuestionSummaryEvent = {
    type: "QUESTION_SUMMARY"
    summary: number[]
}

export type UpdateScoreboardEvent = {
    type: "UPDATE_SCOREBOARD"
    players: Player[]
}

export type GameFinishedEvent = {
    type: "GAME_FINISHED"
    players: Player[]
}

export type ServerEvent =
    | UserDisconnectedEvent
    | UserConnectedEvent
    | HostConnectedEvent
    | HostDisconnectedEvent
    | NewQuestionEvent
    | ChangeQuestionPhaseEvent
    | AnswerReceivedEvent
    | AnswerMarkedEvent
    | QuestionSummaryEvent
    | UpdateScoreboardEvent
    | GameFinishedEvent
