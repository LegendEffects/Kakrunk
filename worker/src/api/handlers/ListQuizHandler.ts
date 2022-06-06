import { IRouteHandler } from "../../types"
import { json } from "../../utils"
import { hardCodedQuestionSets } from "../../__DATA__"

const ListQuizHandler: IRouteHandler = (req, res, ctx) => {
    return json({
        data: hardCodedQuestionSets,
    })
}

export default ListQuizHandler
