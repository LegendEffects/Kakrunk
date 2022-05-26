export type Answer = 1 | 2 | 3 | 4

export type Question = {
    text: string
    answer: Answer
}

export type PlayerQuestion = Omit<Question, "answer">

export type QuestionSet = Question[]
