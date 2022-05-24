import React, { useEffect, useState } from "react"
import { CreateGameScreen } from "./CreateGameScreen"
import { ViewHostGameScreen } from "./ViewHostGameScreen"

export const HostScreen: React.FC = () => {
    const [roomId, setRoomId] = useState<string | undefined>(undefined)

    useEffect(() => {
        if (!roomId) {
            return
        }

        const ws = new WebSocket(`ws://localhost:8787/api/rooms/${roomId}/websocket`)
    }, [roomId])

    if (!roomId) {
        return <CreateGameScreen onRoomCreate={setRoomId} />
    }

    return <ViewHostGameScreen roomId={roomId} />
}
