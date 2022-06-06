import { QuestionSet } from "./question"

export type Quiz = {
    id: string
    title: string
    coverImage?: string
    questions: QuestionSet
}
