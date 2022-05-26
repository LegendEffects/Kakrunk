export type WebsocketEvent = UserConnectEvent | UserLeaveEvent | HostDisconnectEvent

type UserConnectEvent = {
    type: "USER_CONNECT"
    name: string
}

type UserLeaveEvent = {
    type: "USER_LEAVE"
    name: string
}

type HostDisconnectEvent = {
    type: "HOST_DISCONNECT"
}

export type ClientWebsocketEvent = ClientSubmitNameEvent

type ClientSubmitNameEvent = {
    type: "SUBMIT_NAME"
    name: string
}
