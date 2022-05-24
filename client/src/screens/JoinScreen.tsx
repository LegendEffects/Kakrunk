import React, { FormEvent, useCallback } from "react"
import { Link } from "react-router-dom"
import { PrimaryButton, SecondaryButton } from "../components/Button"
import { Input } from "../components/Input"

export type JoinScreenProps = {}

export const JoinScreen: React.FC<JoinScreenProps> = () => {
    const onSubmit = useCallback((e: FormEvent) => {
        e.preventDefault()

        const formData = new FormData(e.target as HTMLFormElement)

        console.log(formData)
    }, [])

    return (
        <div className="flex flex-col flex-1 rgb-animation">
            <div className="flex justify-end px-8 py-4">
                <Link to="host">
                    <SecondaryButton>Host a game</SecondaryButton>
                </Link>
            </div>

            <div className="flex flex-1 justify-center items-center">
                <form onSubmit={onSubmit} action="#" className="p-4 bg-white rounded-md min-w-[320px]">
                    <div>
                        <Input className="w-full" placeholder="Room Code" minLength={6} />
                    </div>

                    <div>
                        <PrimaryButton className="w-full mt-4">Join Game</PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    )
}
