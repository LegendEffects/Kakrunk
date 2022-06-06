import clsx from "clsx"
import React from "react"
import { Link, NavLink } from "react-router-dom"
import { PropsWithClassName } from "../../types"

import { Container } from "./Container"

export const Navbar: React.FC<PropsWithClassName<{}>> = ({ className }) => {
    return (
        <nav className={clsx("py-4 bg-white border-b-2 border-gray-300 text-lg", className)}>
            <Container className="flex items-center">
                <div className="text-xl font-bold mr-8 ">
                    <Link to="/">Kakrunk!</Link>
                </div>

                <div className="flex flex-1 justify-between items-center">
                    <div>
                        <NavLink className={({ isActive }) => (isActive ? "text-black" : "text-gray-600")} to="/quiz">
                            Quizzes
                        </NavLink>
                    </div>
                </div>
            </Container>
        </nav>
    )
}
