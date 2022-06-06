import React from "react"
import { HostStateScreenProps } from "../HostScreen"

const FinishedStateScreen: React.FC<HostStateScreenProps> = ({ state }) => {
    if (!state.context.scoreboard) {
        return null // TODO: Change loading spinner
    }

    return (
        <div className="flex flex-col flex-1 bg-accent-2">
            <div className="bg-white py-12 text-center text-7xl font-black border-b-2 border-gray-200">Game Over</div>

            <div className="flex flex-1 justify-center">
                <div className="flex flex-1 flex-col justify-center items-center mx-12 gap-4 max-w-3xl">
                    {state.context.scoreboard.map((player) => (
                        <div
                            key={player.id}
                            className="w-full flex items-center justify-between mx-24 bg-white px-12 py-6 border-b-2 border-b-gray-300"
                        >
                            <div className=" text-xl">{player.name}</div>
                            <div className="font-bold text-xl">{player.score}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default FinishedStateScreen
