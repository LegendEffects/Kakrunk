import clsx from "clsx"
import React, { PropsWithChildren } from "react"
import { PropsWithClassName } from "../../types"

export const Container: React.FC<PropsWithClassName<PropsWithChildren<{}>>> = ({ children, className }) => (
    <div className={clsx("container mx-auto px-8", className)}>{children}</div>
)
