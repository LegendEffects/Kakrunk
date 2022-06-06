import { truncateUrl } from "../../functions/truncateUrl"
import { IRouteHandler } from "../../types"

const JoinRoomHandler: IRouteHandler = async (req, env, ctx) => {
    if (!req.params?.code) {
        return new Response(null, { status: 400 })
    }

    // Resolve the shortened room code to a full durable object ID
    const rawRoomDetails = await env.shortenedLinks.get(req.params.code)

    if (!rawRoomDetails) {
        return new Response(null, { status: 404 })
    }

    const roomDetails = JSON.parse(rawRoomDetails)

    const room = env.rooms.get(env.rooms.idFromString(roomDetails.doid))

    // We'll append the short code onto the url so that we can tell the DO what short code it belongs to
    const url = truncateUrl(req.url, 4)

    url.searchParams.set("code", roomDetails.shortCode)
    url.searchParams.set("quiz", roomDetails.quizId)

    // @ts-expect-error This works... and is shown in the chatroom example
    return room.fetch(url, req)
}

export default JoinRoomHandler
