import generateRandomRoomCode from "../../functions/generateRandomRoomCode"
import { IRouteHandler } from "../../types"
import { json } from "../../utils"
import { defaultQuestionSetMeta } from "../../__DATA__"

const CreateRoomHandler: IRouteHandler = (req, env, ctx) => {
    const id = env.rooms.newUniqueId()

    // Generate a random shortened code since the IDs that cloudflare generates are far too long
    // for our use case.
    //
    // Your retort: Why not just use idFromName? Because it will always create the object if it doesn't exist.
    const shortCode = generateRandomRoomCode()

    env.shortenedLinks.put(shortCode, id.toString())

    // TODO: Pass question set through to DO

    return json({
        room_code: shortCode,
        room_id: id.toString(),
        set_meta: defaultQuestionSetMeta,
    })
}

export default CreateRoomHandler
