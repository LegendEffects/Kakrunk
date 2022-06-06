export type Answer = {
    text: string
    correct?: boolean
}

export type Question = {
    text: string
    answers: Answer[]
    timeLimit: number
}

export type QuestionSet = Question[]

export type QuestionSetMeta = {
    title: string
    length: number
}
