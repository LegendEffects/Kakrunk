import { useActor } from "@xstate/react"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import { PrimaryButton, SecondaryButton } from "../../../components/Button"
import { Input } from "../../../components/Input"
import { JoinStateScreenProps } from "./JoinScreen"

export type EnterRoomCodeStateProps = JoinStateScreenProps & {
    onSubmit: (roomCode: string) => void
}

const EnterRoomCodeState: React.FC<EnterRoomCodeStateProps> = ({ state, onSubmit }) => {
    const [roomCode, setRoomCode] = useState<string>("")

    return (
        <div className="flex flex-col flex-1 rgb-animation">
            <div className="flex justify-end px-8 py-4">
                <Link to="quiz">
                    <SecondaryButton>Host a game</SecondaryButton>
                </Link>
            </div>

            <div className="flex flex-1 justify-center items-center">
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        onSubmit(roomCode)
                    }}
                    action="#"
                    className="p-4 bg-white rounded-md min-w-[320px]"
                >
                    <div>
                        <Input
                            className="w-full"
                            placeholder="Room Code"
                            minLength={6}
                            value={roomCode}
                            onChange={(v) => setRoomCode(v.target.value)}
                        />
                    </div>

                    <div>
                        <PrimaryButton className="w-full mt-4">Enter Room</PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EnterRoomCodeState
