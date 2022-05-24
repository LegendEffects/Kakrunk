import { IRouteHandler } from "../../types"

const GetRoomHandler: IRouteHandler = async (req, env, ctx) => {
    if (!req.params || !req.params.code) {
        return new Response(null, { status: 400 })
    }

    const room = env.rooms.get(env.rooms.idFromString(req.params.code))

    const newUrl = new URL(req.url)
    newUrl.pathname = "/" + newUrl.pathname.split("/").slice(4).join("/")

    // @ts-expect-error This works... and is shown in the chatroom example
    return room.fetch(newUrl, req)
}

export default GetRoomHandler
