import React from "react"
import clsx from "clsx"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
    return (
        <input
            className={clsx(
                "px-3 py-2.5 rounded-md text-center font-bold border-2 focus:border-black focus:outline-none",
                className,
            )}
            {...props}
        />
    )
}
