import React from "react"
import { Question } from "shared"
import { PlayerAnswerButton } from "../../../../components/PlayerAnswerButton"
import { PlayerLayout } from "../../layouts/PlayerLayout"
import { PlayerQuestionStateScreenProps } from "./PlayerQuestionScreen"

const ViewQuestionStateScreen: React.FC<PlayerQuestionStateScreenProps> = ({
    state,
    send,
    questionState,
    sendQuestion,
}) => {
    const question: Question = questionState.context.question

    return (
        <PlayerLayout state={state} send={send} className="flex">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                {question.answers.map((answer, i) => (
                    <PlayerAnswerButton
                        key={i}
                        answer={answer}
                        index={i + 1}
                        onClick={() => sendQuestion({ type: "SUBMIT_ANSWER", answer: i })}
                    />
                ))}
            </div>
        </PlayerLayout>
    )
}

export default ViewQuestionStateScreen
