import React, { useCallback, useMemo } from "react"
import { useMachine } from "@xstate/react"
import { joinStateMachine } from "../machines/joinStateMachine"
import EnterNameState from "./player/EnterNameState"
import EnterRoomCodeState from "./player/EnterRoomCodeState"
import WaitingStartState from "./player/WaitingStartState"
import { InterpreterFrom, StateFrom } from "xstate"

export type JoinScreenProps = {}

export type JoinStateScreenProps = {
    state: StateFrom<typeof joinStateMachine>
    send: InterpreterFrom<typeof joinStateMachine>["send"]
}

export const JoinScreen: React.FC<JoinScreenProps> = () => {
    const [state, send] = useMachine(useMemo(() => joinStateMachine, []))

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

    console.log(state)

    if (state.matches("roomCode")) {
        return <EnterRoomCodeState onSubmit={onSubmitRoomCode} />
    }

    if (state.matches("enterName")) {
        return <EnterNameState onSubmit={onSubmitName} />
    }

    if (state.matches("waitingStart")) {
        return <WaitingStartState state={state} send={send} />
    }

    return null
}
