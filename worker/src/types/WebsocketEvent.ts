export type WebsocketEvent = UserJoinEvent | UserLeaveEvent

type UserJoinEvent = {
    event: "USER_JOIN"
    name: string
}

type UserLeaveEvent = {
    event: "USER_LEAVE"
    name: string
}
