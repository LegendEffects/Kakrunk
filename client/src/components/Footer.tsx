import clsx from "clsx"
import React, { PropsWithChildren } from "react"
import { PropsWithClassName } from "../types"

export const Footer: React.FC<PropsWithChildren<PropsWithClassName<{}>>> = ({ className, children }) => {
    return (
        <div className={clsx("px-8 py-4 bg-white border-t-2 border-gray-300 text-lg flex items-center", className)}>
            {children}
        </div>
    )
}
