import { truncateUrl } from "../../functions/truncateUrl"
import { IRouteHandler } from "../../types"

// @ts-expect-error This has a weird return from the durable object, should be looked at later but
// works for now.
const GetRoomHandler: IRouteHandler = async (req, env, ctx) => {
    if (!req.params || !req.params.code) {
        return new Response(null, { status: 400 })
    }

    const room = env.rooms.get(env.rooms.idFromString(req.params.code))

    // @ts-expect-error This works... and is shown in the chatroom example
    return room.fetch(truncateUrl(req.url, 4), req)
}

export default GetRoomHandler
