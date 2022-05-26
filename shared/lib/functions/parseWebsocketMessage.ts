export function parseWebsocketMessage<T>(data: string): undefined | T {
    try {
        const json = JSON.parse(data)

        if (!json.type) {
            return undefined
        }

        return json as T
    } catch (e) {
        console.error(e)
        return undefined
    }
}
