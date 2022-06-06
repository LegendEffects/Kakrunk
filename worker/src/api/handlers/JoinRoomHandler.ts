import { truncateUrl } from "../../functions/truncateUrl"
import { IRouteHandler } from "../../types"

// @ts-expect-error This has a weird return from the durable object, should be looked at later but
// works for now.
const JoinRoomHandler: IRouteHandler = async (req, env, ctx) => {
    if (!req.params || !req.params.code) {
        return new Response(null, { status: 400 })
    }

    // Resolve the shortened room code to a full durable object ID
    const resolvedRoomId = await env.shortenedLinks.get(req.params.code)

    if (!resolvedRoomId) {
        return new Response(null, { status: 404 })
    }

    const room = env.rooms.get(env.rooms.idFromString(resolvedRoomId))

    // We'll append the short code onto the url so that we can tell the DO what short code it belongs to
    const url = truncateUrl(req.url, 4)
    url.searchParams.set("code", req.params.code)

    // @ts-expect-error This works... and is shown in the chatroom example
    return room.fetch(url, req)
}

export default JoinRoomHandler
