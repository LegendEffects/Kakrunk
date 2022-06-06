import React, { useCallback, useMemo } from "react"
import { useMachine } from "@xstate/react"
import { playerStateMachine } from "../machines/playerStateMachine"
import EnterNameState from "./EnterNameState"
import { InterpreterFrom, StateFrom } from "xstate"
import EnterRoomCodeState from "./EnterRoomCodeState"
import WaitingStartState from "./WaitingStartState"
import PlayerQuestionScreen from "./question/PlayerQuestionScreen"

export type JoinScreenProps = {}

export type JoinStateScreenProps = {
    state: StateFrom<typeof playerStateMachine>
    send: InterpreterFrom<typeof playerStateMachine>["send"]
}

export const JoinScreen: React.FC<JoinScreenProps> = () => {
    const [state, send] = useMachine(useMemo(() => playerStateMachine, []))

    const onSubmitRoomCode = useCallback(
        (roomCode: string) => {
            send({
                type: "JOIN_ROOM",
                roomCode,
            })
        },
        [send],
    )

    const onSubmitName = useCallback(
        (name: string) => {
            send({
                type: "SUBMIT_NAME",
                name,
            })
        },
        [send],
    )

    if (state.matches("roomCode")) {
        return <EnterRoomCodeState state={state} send={send} onSubmit={onSubmitRoomCode} />
    }

    if (state.matches("enterName")) {
        return <EnterNameState onSubmit={onSubmitName} />
    }

    if (state.matches("waitingStart")) {
        return <WaitingStartState state={state} send={send} />
    }

    if (state.matches("question")) {
        return <PlayerQuestionScreen state={state} send={send} />
    }

    return null
}
