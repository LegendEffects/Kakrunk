import { Quiz } from "shared"

export const hardCodedQuestionSets: Quiz[] = [
    {
        id: "HARD_CODED_GENERAL_TRIVIA_1",
        title: "General Trivia",
        coverImage:
            "https://unsplash.com/photos/jvBXiynINGE/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8M3x8cXVpenxlbnwwfHx8fDE2NTQ1MjE0MTM&w=640",
        questions: [
            {
                text: "What is the world's largest river by volume?",
                timeLimit: 20,
                answers: [
                    {
                        text: "Congo",
                    },
                    {
                        text: "Yangtze",
                    },
                    {
                        text: "Amazon",
                        correct: true,
                    },
                    {
                        text: "Nile",
                    },
                ],
            },
            {
                text: "The first person to travel into space was...",
                timeLimit: 20,
                answers: [
                    {
                        text: "Neil Armstrong",
                    },
                    {
                        text: "Yuri Gagarin",
                        correct: true,
                    },
                    {
                        text: "Alexey Leonov",
                    },
                    {
                        text: "John Glenn",
                    },
                ],
            },
            {
                text: "When did World War 1 end?",
                timeLimit: 20,
                answers: [
                    {
                        text: "1914",
                    },
                    {
                        text: "1918",
                        correct: true,
                    },
                    {
                        text: "1922",
                    },
                    {
                        text: "1926",
                    },
                ],
            },
            {
                text: "What is the capital of Australia?",
                timeLimit: 20,
                answers: [
                    {
                        text: "Sydney",
                    },
                    {
                        text: "Melbourne",
                    },
                    {
                        text: "Canberra",
                        correct: true,
                    },
                    {
                        text: "Perth",
                    },
                ],
            },
            {
                text: "Which planet is the fourth planet from the sun?",
                timeLimit: 20,
                answers: [
                    {
                        text: "Mars",
                        correct: true,
                    },
                    {
                        text: "Jupiter",
                    },
                    {
                        text: "Venus",
                    },
                    {
                        text: "Uranus",
                    },
                ],
            },
            {
                text: "Which ocean is the largest?",
                timeLimit: 20,
                answers: [
                    {
                        text: "Atlantic",
                    },
                    {
                        text: "Indian",
                    },
                    {
                        text: "Pacific",
                        correct: true,
                    },
                    {
                        text: "Arctic",
                    },
                ],
            },
            {
                text: "The world's highest waterfall is called...",
                timeLimit: 20,
                answers: [
                    {
                        text: "Tugela Falls",
                    },
                    {
                        text: "Angel Falls",
                        correct: true,
                    },
                    {
                        text: "Victoria Falls",
                    },
                    {
                        text: "Niagara Falls",
                    },
                ],
            },
            {
                text: "In Romeo and Juliet, what family does Romeo belong to?",
                timeLimit: 20,
                answers: [
                    {
                        text: "Montague",
                        correct: true,
                    },
                    {
                        text: "Capulet",
                    },
                    {
                        text: "Mercutio",
                    },
                    {
                        text: "Verona",
                    },
                ],
            },
            {
                text: "What does vexillology study?",
                timeLimit: 20,
                answers: [
                    {
                        text: "Stamps",
                    },
                    {
                        text: "Word origins",
                    },
                    {
                        text: "Human societies",
                    },
                    {
                        text: "Flags",
                        correct: true,
                    },
                ],
            },
        ],
    },
    {
        id: "TEST_QUIZ",
        title: "Test Quiz",
        questions: [
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
        ],
    },
]
