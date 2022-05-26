import React from "react"
import { useMachine } from "@xstate/react"
import { hostStateMachine } from "../../machines/hostStateMachine"
import { ChooseQuizStateScreen } from "./states/ChooseQuizStateScreen"
import { InterpreterFrom, StateFrom } from "xstate"
import { WaitingStateScreen } from "./states/WaitingStateScreen"
import CountdownStateScreen from "./states/CountdownStateScreen"

export type HostStateScreenProps = {
    state: StateFrom<typeof hostStateMachine>
    send: InterpreterFrom<typeof hostStateMachine>["send"]
}

export const HostScreen: React.FC = () => {
    const [state, send] = useMachine(hostStateMachine)

    if (state.matches("chooseQuiz")) {
        return <ChooseQuizStateScreen state={state} send={send} />
    }

    if (state.matches("waiting")) {
        return <WaitingStateScreen state={state} send={send} />
    }

    if (state.matches("countdown")) {
        return <CountdownStateScreen />
    }

    return null
}
