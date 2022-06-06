import React, { useMemo } from "react"
import { PlayerLayout } from "../../layouts/PlayerLayout"
import { PlayerQuestionStateScreenProps } from "./PlayerQuestionScreen"

const QUOTES = [
    "Krunked!",
    "I’ll krunk with you sweetie.",
    "Master of funk or just a low tier punk?",
    "Could this one be an intellectual slam dunk?",
    "Try brushing this off you dust bunny",
    "“Always stand two meters away from the reach truck when it is operating” - Brad",
]

const AnsweredQuestionStateScreen: React.FC<PlayerQuestionStateScreenProps> = (props) => {
    const quote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], [])

    return (
        <PlayerLayout className="flex justify-center items-center rgb-animation text-white" {...props}>
            <h1 className="text-3xl font-bold text-center max-w-2xl">{quote}</h1>
        </PlayerLayout>
    )
}

export default AnsweredQuestionStateScreen
