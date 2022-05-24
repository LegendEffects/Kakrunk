const CHARACTER_SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
const CODE_LENGTH = 6

export default function generateRandomRoomCode() {
    let result = ""

    for (var i = 0; i < CODE_LENGTH; i++) {
        result += CHARACTER_SET.charAt(Math.floor(Math.random() * CHARACTER_SET.length))
    }

    return result
}
