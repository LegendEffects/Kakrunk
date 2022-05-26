export type ClientEvent =
    | {
          type: "SUBMIT_NAME"
          name: string
      }
    | {
          type: "START_GAME"
      }
