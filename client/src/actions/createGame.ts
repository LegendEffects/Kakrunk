import { QuestionSetMeta } from "shared"

export async function createGame(
    quizId: string,
): Promise<{ roomId: string; roomCode: string; questionSetMeta: QuestionSetMeta }> {
    const res = await fetch(`${import.meta.env.VITE_BASE_API_URL}/rooms?quiz=${quizId}`, {
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
        questionSetMeta: json.set_meta,
    }
}
