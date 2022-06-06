import React, { PropsWithChildren } from "react"
import { useActor } from "@xstate/react"
import { Footer } from "../../../components/Footer"
import { JoinStateScreenProps } from "../screens/JoinScreen"
import { PropsWithClassName } from "../../../types"
import clsx from "clsx"

export const PlayerLayout: React.FC<PropsWithChildren<PropsWithClassName<JoinStateScreenProps>>> = ({
    children,
    className,
    state,
}) => {
    if (!state.context.room) {
        throw new Error("PlayerLayout should only be used when a room is available")
    }

    const [room] = useActor(state.context.room)

    return (
        <div className="flex flex-col flex-1">
            <div className={clsx("flex-1", className)}>{children}</div>

            <Footer className="justify-between">
                <div>
                    Room Code: <span className="font-bold ml-1">{room.context.roomCode}</span>
                </div>
                <div className="flex items-center">
                    <div className="mr-4 font-bold">{state.context.name}</div>
                    <div className="bg-gray-900 rounded-md text-white font-bold px-4 py-2 min-w-[6rem] text-center">
                        {state.context.score}
                    </div>
                </div>
            </Footer>
        </div>
    )
}
