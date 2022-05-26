import React from "react"
import clsx from "clsx"
import { useActor } from "@xstate/react"
import { PrimaryButton } from "../../../components/Button"
import { Player } from "../../../machines/roomStateMachine"
import { PropsWithClassName } from "../../../types"
import { HostStateScreenProps } from "../HostScreen"

export type WaitingStateScreenProps = HostStateScreenProps

export const WaitingStateScreen: React.FC<WaitingStateScreenProps> = ({ state, send }) => {
    if (!state.context.room) {
        throw new Error("Should be unreachable")
    }

    // TODO: Pull types in from this somehow?
    const [room] = useActor(state.context.room)

    return (
        <div className="flex flex-col flex-1">
            <div className="rgb-animation flex justify-center">
                <RoomCodeCard roomCode={room.context.roomCode} className="my-16" />
            </div>

            <div className="mx-16 mt-8 flex justify-between">
                <div className="px-6 py-4 bg-gray-100 rounded-lg text-xl">
                    Players: <span className="font-bold">{room.context.players.length}</span>
                </div>

                <PrimaryButton className="text-xl">Start Game</PrimaryButton>
            </div>

            {room.context.players.length === 0 ? (
                <div className="flex flex-1 justify-center items-center">
                    <h1 className="text-7xl font-black">Waiting for players...</h1>
                </div>
            ) : (
                <div className="flex-1 grid grid-cols-3 grid-rows-6 gap-8 mx-16 mt-16">
                    {room.context.players.map((player: Player, i: number) => (
                        <div
                            key={i}
                            className="flex justify-center items-center bg-slate-600 text-white flex-1 rounded-lg text-4xl"
                        >
                            {player.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

const RoomCodeCard: React.FC<PropsWithClassName<{ roomCode: string | null }>> = ({ className, roomCode }) => {
    return (
        <div className={clsx("rounded-md bg-white flex flex-col md:flex-row md:items-center", className)}>
            <div className="p-8 md:pr-12">
                <h2 className="text-3xl">
                    Join at <span className="font-bold">{window.location.origin}</span>
                </h2>
            </div>

            <div className="p-8 md:pl-12 md:border-l-2 border-gray-200">
                {roomCode ? (
                    <div>
                        <h1 className="text-4xl font-bold">Room code:</h1>
                        <h1 className="text-8xl font-black">{roomCode}</h1>
                    </div>
                ) : (
                    <h1 className="text-4xl">Loading Room Code...</h1>
                )}
            </div>
        </div>
    )
}
