import React from "react"
import { useActor } from "@xstate/react"
import { Sender, StateFrom } from "xstate"
import { createPlayerQuestionStateMachine, PlayerQuestionStateEvent } from "../../machines/playerQuestionStateMachine"
import { JoinStateScreenProps } from "../JoinScreen"
import { GetReadyStateScreen } from "./GetReadyStateScreen"
import ViewQuestionStateScreen from "./ViewQuestionStateScreen"
import AnsweredQuestionStateScreen from "./AnsweredQuestionStateScreen"
import CorrectStateScreen from "./CorrectStateScreen"
import IncorrectStateScreen from "./IncorrectStateScreen"

export type PlayerQuestionStateScreenProps = JoinStateScreenProps & {
    questionState: StateFrom<ReturnType<typeof createPlayerQuestionStateMachine>>
    sendQuestion: Sender<PlayerQuestionStateEvent>
}

const PlayerQuestionScreen: React.FC<JoinStateScreenProps> = ({ state, send }) => {
    if (!state.context.question || !state.context.room) {
        throw new Error("Unreachable state")
    }

    const [questionState, sendQuestion] = useActor(state.context.question)

    const screenProps: PlayerQuestionStateScreenProps = { state, send, questionState, sendQuestion }

    if (questionState.matches("getReady")) {
        return <GetReadyStateScreen {...screenProps} />
    }

    if (questionState.matches("view")) {
        return <ViewQuestionStateScreen {...screenProps} />
    }

    if (questionState.matches("answered")) {
        return <AnsweredQuestionStateScreen {...screenProps} />
    }

    if (questionState.matches("correct")) {
        return <CorrectStateScreen {...screenProps} />
    }

    if (questionState.matches("incorrect")) {
        return <IncorrectStateScreen {...screenProps} />
    }

    return null
}

export default PlayerQuestionScreen
