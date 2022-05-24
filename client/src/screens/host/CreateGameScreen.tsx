import React, { useCallback } from "react"
import { PrimaryButton } from "../../components/Button"
import { BASE_URL } from "../../config"

export type CreateGameScreenProps = {
    onRoomCreate: (roomId: string) => void
}

export const CreateGameScreen: React.FC<CreateGameScreenProps> = ({ onRoomCreate }) => {
    const onCreate = useCallback(() => {
        fetch(BASE_URL + "/rooms", {
            method: "POST",
            body: JSON.stringify({}),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                onRoomCreate(data.room_id)
            })
    }, [onRoomCreate])

    return (
        <div className="flex flex-col flex-1 justify-center items-center">
            <div className="p-4 bg-white rounded-md min-w-[320px] shadow-md">
                <h3 className="mb-4 text-center text-lg">For now we'll give you a default set of questions.</h3>
                <PrimaryButton className="w-full" onClick={onCreate}>
                    Start game
                </PrimaryButton>
            </div>
        </div>
    )
}
