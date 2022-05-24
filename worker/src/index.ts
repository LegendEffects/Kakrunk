/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Router } from "itty-router"
import { Environment, IMethods, IRequest } from "./types"
import GameRoom from "./objects/GameRoom"
import CreateRoomHandler from "./api/handlers/CreateRoomHandler"
import GetRoomHandler from "./api/handlers/GetRoomHandler"

const withCors = (req: Request) => {
    if (req.headers.get("Origin") !== null && req.headers.get("Access-Control-Request-Method") !== null) {
        return new Response(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "http://localhost:3000",
                "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE",
                "Access-Control-Allow-Headers": "referer, origin, content-type",
            },
        })
    }
}

const router = Router<IRequest, IMethods>()
    .all("*", withCors)
    .get("/api/rooms/:code/*", GetRoomHandler)
    .post("/api/rooms", CreateRoomHandler)

const fetchHandler: ExportedHandlerFetchHandler<Environment> = (...args) => {
    return (
        router
            // @ts-expect-error We purposely transform the request's type
            .handle(...args)
            .catch((err) => {
                console.error(err)
                // and do something with the errors here, like logging, error status, etc
            })
            .then((response: Response) => {
                // can modify response here before final return, e.g. CORS headers

                if (!response) {
                    return new Response("", {
                        headers: {
                            "Access-Control-Allow-Origin": "*",
                        },
                    })
                }

                response.headers.set("Access-Control-Allow-Origin", "*")
                response.headers.set("Allow", "GET, POST, PATCH, DELETE, HEAD, OPTIONS")

                return response
            })
    )
}

export default {
    fetch: fetchHandler,
}

export { GameRoom }