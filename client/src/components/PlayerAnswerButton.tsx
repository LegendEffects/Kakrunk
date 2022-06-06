import clsx from "clsx"
import React from "react"
import { Answer } from "shared"
import { PropsWithClassName } from "../types"
import { AnswerButtonIcon } from "./AnswerButtonIcon"

export type PlayerAnswerButtonProps = PropsWithClassName<{
    index: number
    answer: Answer
    text?: boolean
    onClick?: () => void
}>

export const PlayerAnswerButton: React.FC<PlayerAnswerButtonProps> = ({ className, index, answer, text, onClick }) => {
    if (text) {
        return (
            <button
                className={clsx(
                    "text-white flex items-center gap-4 p-6 font-bold text-2xl rounded-lg",
                    `bg-accent-${index}`,
                    className,
                )}
                onClick={onClick}
            >
                <AnswerButtonIcon index={index} />
                {answer.text}
            </button>
        )
    }

    return (
        <button
            className={clsx("flex justify-center items-center p-6 rounded-lg", `bg-accent-${index}`, className)}
            onClick={onClick}
        >
            <AnswerButtonIcon index={index} />
        </button>
    )
}
