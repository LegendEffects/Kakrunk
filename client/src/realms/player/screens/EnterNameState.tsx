import React, { useState } from "react"
import { PrimaryButton } from "../../../components/Button"
import { Input } from "../../../components/Input"

export type EnterNameStateProps = {
    onSubmit: (name: string) => void
}

const EnterNameState: React.FC<EnterNameStateProps> = ({ onSubmit }) => {
    const [name, setName] = useState<string>("")

    return (
        <div className="flex flex-col flex-1 justify-center items-center rgb-animation">
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    onSubmit(name)
                }}
                action="#"
                className="p-4 bg-white rounded-md min-w-[320px]"
            >
                <div>
                    <Input
                        className="w-full"
                        placeholder="Nickname"
                        minLength={4}
                        maxLength={32}
                        value={name}
                        onChange={(v) => setName(v.target.value)}
                    />
                </div>

                <div>
                    <PrimaryButton className="w-full mt-4">Go</PrimaryButton>
                </div>
            </form>
        </div>
    )
}

export default EnterNameState
