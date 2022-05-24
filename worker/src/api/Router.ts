import { Router } from "itty-router"
import { IRequest, IMethods } from "../types"
import CreateRoomHandler from "./handlers/CreateRoomHandler"

const router = Router<IRequest, IMethods>().post("rooms", CreateRoomHandler)

export default router
