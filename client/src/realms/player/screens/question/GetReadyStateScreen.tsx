import React from "react"
import useCountdown from "../../../../hooks/useCountdown"
import { PlayerLayout } from "../../layouts/PlayerLayout"
import { PlayerQuestionStateScreenProps } from "./PlayerQuestionScreen"

export const GetReadyStateScreen: React.FC<PlayerQuestionStateScreenProps> = (props) => {
    const [count] = useCountdown(5)

    return (
        <PlayerLayout className="rgb-animation flex flex-col justify-center items-center" {...props}>
            <h1 className="text-white font-bold text-6xl">Question {props.questionState.context.index + 1}</h1>

            <h2 className="text-white font-bold text-7xl mt-4">{count}</h2>
        </PlayerLayout>
    )
}
