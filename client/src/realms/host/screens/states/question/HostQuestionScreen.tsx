import { useActor } from "@xstate/react"
import React from "react"
import { Sender, StateFrom } from "xstate"
import { createHostQuestionStateMachine, HostQuestionStateEvent } from "../../../machines/hostQuestionStateMachine"
import { HostStateScreenProps } from "../../HostScreen"
import PreviewQuestionStateScreen from "./PreviewQuestionStateScreen"
import { ViewQuestionStateScreen } from "./ViewQuestionStateScreen"

export type QuestionStateScreenProps = HostStateScreenProps & {
    questionState: StateFrom<ReturnType<typeof createHostQuestionStateMachine>>
    sendQuestion: Sender<HostQuestionStateEvent>
}

const HostQuestionScreen: React.FC<HostStateScreenProps> = ({ state, send }) => {
    if (!state.context.question || !state.context.room) {
        throw new Error("Unreachable state")
    }

    const [room] = useActor(state.context.room)
    const [questionState, sendQuestion] = useActor(state.context.question)

    const screenProps: QuestionStateScreenProps = { state, send, questionState, sendQuestion }

    if (questionState.matches("preview")) {
        return <PreviewQuestionStateScreen {...screenProps} />
    }

    if (questionState.matches("view") || questionState.matches("revealAnswers")) {
        return <ViewQuestionStateScreen {...screenProps} />
    }

    return null
}

export default HostQuestionScreen
