import React from "react"
import { useMachine } from "@xstate/react"
import { hostStateMachine } from "../../machines/hostStateMachine"
import { ChooseQuizStateScreen } from "./states/ChooseQuizStateScreen"
import { ViewHostGameScreen } from "./ViewHostGameScreen"
import { InterpreterFrom, StateFrom } from "xstate"
import { WaitingStateScreen } from "./states/WaitingStateScreen"

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
    // const [roomId, setRoomId] = useState<string | undefined>(undefined)

    // useEffect(() => {
    //     if (!roomId) {
    //         return
    //     }

    //     const ws = new WebSocket(`ws://localhost:8787/api/rooms/${roomId}/websocket`)
    // }, [roomId])

    // if (!roomId) {
    //     return <CreateGameScreen onRoomCreate={setRoomId} />
    // }

    // return <ViewHostGameScreen roomId={roomId} />

    return null
}
