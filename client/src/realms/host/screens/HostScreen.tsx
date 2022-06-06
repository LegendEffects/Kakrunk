import React, { useMemo } from "react"
import { InterpreterFrom, StateFrom } from "xstate"
import { useParams } from "react-router-dom"
import { WaitingStateScreen } from "./states/WaitingStateScreen"
import { useMachine } from "@xstate/react"
import { ChooseQuizStateScreen } from "./states/ChooseQuizStateScreen"
import CountdownStateScreen from "./states/CountdownStateScreen"
import HostQuestionScreen from "./states/question/HostQuestionScreen"
import { hostStateMachine } from "../machines/hostStateMachine"
import FinishedStateScreen from "./states/FinishedStateScreen"

export type HostStateScreenProps = {
    state: StateFrom<typeof hostStateMachine>
    send: InterpreterFrom<typeof hostStateMachine>["send"]
}

export const HostScreen: React.FC = () => {
    const { quizId } = useParams<{ quizId: string }>()

    const [state, send] = useMachine(useMemo(() => hostStateMachine, []))

    if (state.matches("chooseQuiz")) {
        return <ChooseQuizStateScreen state={state} send={send} />
    }

    if (state.matches("waiting")) {
        return <WaitingStateScreen state={state} send={send} />
    }

    if (state.matches("countdown")) {
        return <CountdownStateScreen />
    }

    if (state.matches("question")) {
        return <HostQuestionScreen state={state} send={send} />
    }

    if (state.matches("finished")) {
        return <FinishedStateScreen state={state} send={send} />
    }

    return null
}
