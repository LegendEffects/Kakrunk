import React from "react"
import clsx from "clsx"

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export const PrimaryButton: React.FC<ButtonProps> = ({ className, children, ...props }) => {
    return (
        <button className={clsx("px-6 py-2.5 rounded-md font-bold bg-black text-white", className)} {...props}>
            {children}
        </button>
    )
}

export const SecondaryButton: React.FC<ButtonProps> = ({ className, children, ...props }) => {
    return (
        <button className={clsx("px-6 py-2.5 rounded-md font-bold bg-white text-black", className)} {...props}>
            {children}
        </button>
    )
}
