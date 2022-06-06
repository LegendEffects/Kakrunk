import React from "react"
import { Quiz } from "shared"

export type QuizCardProps = {
    quiz: Quiz
}

export const QuizCard: React.FC<QuizCardProps> = ({ quiz }) => {
    return (
        <div className="bg-white shadow-md rounded-md overflow-hidden">
            <div
                className="bg-gray-200 min-h-[80px]"
                style={
                    quiz.coverImage
                        ? { background: `url(${quiz.coverImage})`, backgroundSize: "cover", backgroundPositionY: "50%" }
                        : undefined
                }
            />

            <div className="p-4">
                <div className="text-lg">{quiz.title}</div>
                <div className="text-sm text-gray-500">
                    {quiz.questions.length} {quiz.questions.length > 1 ? "Questions" : "Question"}
                </div>
            </div>
        </div>
    )
}
