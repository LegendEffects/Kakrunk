import generateRandomRoomCode from "../../functions/generateRandomRoomCode"
import { IRouteHandler } from "../../types"
import { json } from "../../utils"
import { hardCodedQuestionSets } from "../../__DATA__"

const CreateRoomHandler: IRouteHandler = (req, env, ctx) => {
    const id = env.rooms.newUniqueId()

    if (!req.query?.quiz) {
        return new Response(null, { status: 400 })
    }

    const foundQuiz = hardCodedQuestionSets.find((set) => set.id === req.query?.quiz)

    if (!foundQuiz) {
        return new Response(null, { status: 404 })
    }

    // Generate a random shortened code since the IDs that cloudflare generates are far too long
    // for our use case.
    //
    // Your retort: Why not just use idFromName? Because it will always create the object if it doesn't exist.
    const shortCode = generateRandomRoomCode()

    env.shortenedLinks.put(shortCode, JSON.stringify({ doid: id.toString(), shortCode, quizId: req.query.quiz }))

    // TODO: Pass question set through to DO

    return json({
        room_code: shortCode,
        room_id: id.toString(),
        set_meta: {
            title: foundQuiz.title,
            length: foundQuiz.questions.length,
        },
    })
}

export default CreateRoomHandler
