import { PlayerSession } from "../objects/GameRoom"

export default function generateScoreboard(session: PlayerSession[]) {
    return session
        .sort((a, b) => b.score - a.score)
        .map((session) => ({
            id: session.id,
            name: session.name,
            score: session.score,
        }))
}
