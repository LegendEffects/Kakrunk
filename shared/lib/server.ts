import { Question } from "./question"
import { Player } from "./shared/player"

export type ServerEvent =
    | {
          type: "USER_DISCONNECTED"
          id: string
      }
    | {
          type: "USER_CONNECTED"
          player: Player
      }
    | {
          type: "HOST_DISCONNECTED"
      }
    | {
          type: "NEW_QUESTION"
          question: Question
      }
