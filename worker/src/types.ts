import { Router, Request } from "itty-router"

type MethodType = "GET" | "POST"

export interface Environment {
    rooms: DurableObjectNamespace
    shortenedLinks: KVNamespace
}

export interface IRouteHandler {
    (request: IRequest, env: Environment, context: ExecutionContext): Response | Promise<Response>
}

export interface Route {
    <TRequest>(path: string, ...handlers: IRouteHandler[]): Router<TRequest>
}

export interface IRequest extends Request {
    method: MethodType
    url: string
}

export interface IMethods {
    get: Route
    post: Route
}
