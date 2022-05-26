import { BASE_URL } from "../config"

export async function createGame(): Promise<{ roomId: string; roomCode: string }> {
    const res = await fetch(`${BASE_URL}/rooms`, {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })

    const json = await res.json()

    return {
        roomId: json.room_id,
        roomCode: json.room_code,
    }
}
