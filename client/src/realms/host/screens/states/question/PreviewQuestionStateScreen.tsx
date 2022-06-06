import { useActor } from "@xstate/react"
import React, { useEffect } from "react"
import { config, Question } from "shared"
import { Footer } from "../../../../../components/Footer"
import useCountdown from "../../../../../hooks/useCountdown"
import { HostStateScreenProps } from "../../HostScreen"

const PreviewQuestionStateScreen: React.FC<HostStateScreenProps> = ({ state, send }) => {
    if (!state.context.question || !state.context.room) {
        throw new Error("Unreachable state")
    }

    const [room] = useActor(state.context.room)
    const [questionState, sendQuestion] = useActor(state.context.question)

    const [count] = useCountdown(config.QUESTION_PREVIEW_TIME)

    const question: Question = questionState.context.question

    return (
        <div className="flex flex-col flex-1 bg-gray-100">
            <div className="bg-white py-12 text-center text-7xl font-black border-b-2 border-gray-200">
                Question {questionState.context.index + 1} of {state.context.questionSet?.length}
            </div>

            <div
                className="w-0 h-2 bg-blue-600 transition duration-500"
                style={{ width: `${((config.QUESTION_PREVIEW_TIME - count) / config.QUESTION_PREVIEW_TIME) * 100}%` }}
            />

            <div className="flex flex-1 justify-center items-center px-24">
                <h1 className="text-6xl text-center">{question.text}</h1>
            </div>

            <div className="px-24 py-12 bg-blue-600 text-white text-bold text-center text-3xl">
                Win up to <span className="font-bold">1,000</span> points!
            </div>

            <div>
                <Footer>
                    Room Code: <span className="font-bold ml-1">{room.context.roomCode}</span>
                </Footer>
            </div>
        </div>
    )
}

export default PreviewQuestionStateScreen
