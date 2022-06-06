import React from "react"
import { PlayerLayout } from "../layouts/PlayerLayout"
import { JoinStateScreenProps } from "./JoinScreen"

const WaitingStartState: React.FC<JoinStateScreenProps> = (props) => {
    return (
        <PlayerLayout {...props} className="rgb-animation flex justify-center items-center">
            <div className="flex flex-col flex-1 justify-center items-center rgb-animation">
                <div className="p-8 px-12 text-white text-center bg-black bg-opacity-60 rounded-lg">
                    <h1 className="text-8xl font-black">You're in!</h1>
                    <h2 className="text-3xl font-bold mt-12">Check if your name is on the screen</h2>
                </div>
            </div>
        </PlayerLayout>
    )
}

export default WaitingStartState
