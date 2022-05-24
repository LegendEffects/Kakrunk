import generateRandomRoomCode from "../../functions/generateRandomRoomCode"
import { IRouteHandler } from "../../types"
import { json } from "../../utils"

const CreateRoomHandler: IRouteHandler = (req, env, ctx) => {
    const id = env.rooms.newUniqueId()

    // Generate a random shortened code since the IDs that cloudflare generates are far too long
    // for our use case.
    const shortCode = generateRandomRoomCode()

    env.shortenedLinks.put(shortCode, id.toString())

    return json({
        room_code: shortCode,
        room_id: id.toString(),
    })
}

export default CreateRoomHandler
