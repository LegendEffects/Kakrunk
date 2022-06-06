import clsx from "clsx"
import React from "react"
import { Answer } from "shared"
import { PropsWithClassName } from "../types"
import { AnswerButtonIcon } from "./AnswerButtonIcon"

export type AnswerButtonProps = PropsWithClassName<{
    index: number
    answer: Answer
    disabled?: boolean
}>

export const AnswerButton: React.FC<AnswerButtonProps> = ({ className, answer, index, disabled }) => {
    return (
        <div
            className={clsx(
                "text-white flex items-center gap-4 p-6 font-bold text-2xl rounded-lg",
                `bg-accent-${index}`,
                disabled ? "bg-opacity-60" : undefined,
                className,
            )}
        >
            <AnswerButtonIcon index={index} />
            {answer.text}
        </div>
    )
}
