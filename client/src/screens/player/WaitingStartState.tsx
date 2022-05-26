import { useActor } from "@xstate/react"
import React from "react"
import { JoinStateScreenProps } from "../JoinScreen"

const WaitingStartState: React.FC<JoinStateScreenProps> = ({ state }) => {
    if (!state.context.room) {
        throw new Error("Should be unreachable")
    }

    const [room] = useActor(state.context.room)

    return (
        <div className="flex flex-col flex-1 rgb-animation">
            <div className="flex flex-col flex-1 justify-center items-center rgb-animation">
                <div className="p-8 px-12 text-white text-center bg-black bg-opacity-60 rounded-lg">
                    <h1 className="text-8xl font-black">You're in!</h1>
                    <h2 className="text-3xl font-bold mt-12">Check if your name is on the screen</h2>
                </div>
            </div>

            <div className="flex justify-between items-center text-lg bg-white border-t-2 border-gray-300 px-8 py-4">
                <div className="font-bold">{state.context.name}</div>
                <div>
                    Room Code: <span className="font-bold">{room.context.roomCode}</span>
                </div>
            </div>
        </div>
    )
}

export default WaitingStartState
