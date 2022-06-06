import React from "react"
import { PlayerLayout } from "../../layouts/PlayerLayout"
import { PlayerQuestionStateScreenProps } from "./PlayerQuestionScreen"

const IncorrectStateScreen: React.FC<PlayerQuestionStateScreenProps> = ({ state, send }) => {
    return (
        <PlayerLayout
            state={state}
            send={send}
            className="flex flex-col justify-center items-center bg-accent-1 text-white"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-24 w-24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={4}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>

            <h1 className="text-6xl font-bold mt-4">Incorrect</h1>
        </PlayerLayout>
    )
}

export default IncorrectStateScreen
