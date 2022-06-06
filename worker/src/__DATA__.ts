import { QuestionSet, QuestionSetMeta } from "shared"

export const defaultQuestionSet: QuestionSet = [
    {
        text: "Question 1 :)",
        timeLimit: 30,
        answers: [
            {
                text: "Correct",
                correct: true,
            },
            {
                text: "Incorrect 1",
            },
            {
                text: "Incorrect 2",
            },
            {
                text: "Incorrect 3",
            },
        ],
    },
    {
        text: "Question 2 >:)",
        timeLimit: 30,
        answers: [
            {
                text: "Incorrect 1",
            },
            {
                text: "Correct",
                correct: true,
            },
            {
                text: "Incorrect 2",
            },
            {
                text: "Incorrect 3",
            },
        ],
    },
    {
        text: "Question 3 :(",
        timeLimit: 30,
        answers: [
            {
                text: "Incorrect 1",
            },
            {
                text: "Incorrect 2",
            },
            {
                text: "Correct",
                correct: true,
            },
            {
                text: "Incorrect 3",
            },
        ],
    },
    {
        text: "Question 4 :^)",
        timeLimit: 30,
        answers: [
            {
                text: "Incorrect 1",
            },
            {
                text: "Incorrect 2",
            },
            {
                text: "Incorrect 3",
            },
            {
                text: "Correct",
                correct: true,
            },
        ],
    },
    {
        text: "Question 5 :D",
        timeLimit: 30,
        answers: [
            {
                text: "Correct",
                correct: true,
            },
            {
                text: "Incorrect 1",
            },
            {
                text: "Correct 2",
                correct: true,
            },
            {
                text: "Incorrect 2",
            },
        ],
    },
]

export const defaultQuestionSetMeta: QuestionSetMeta = {
    title: "Default Set",
    length: defaultQuestionSet.length,
}
