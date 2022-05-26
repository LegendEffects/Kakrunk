import React, { useCallback, useMemo } from "react"
import { useMachine } from "@xstate/react"
import { joinStateMachine } from "../machines/joinStateMachine"
import EnterNameState from "./player/EnterNameState"
import EnterRoomCodeState from "./player/EnterRoomCodeState"

export type JoinScreenProps = {}

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

    if (state.matches("roomCode")) {
        return <EnterRoomCodeState onSubmit={onSubmitRoomCode} />
    }

    if (state.matches("enterName")) {
        return <EnterNameState onSubmit={onSubmitName} />
    }

    return null
}
