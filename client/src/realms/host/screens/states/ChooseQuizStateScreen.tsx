import React from "react"
import { PrimaryButton } from "../../../../components/Button"
import { HostStateScreenProps } from "../HostScreen"

export type ChooseQuizStateScreenProps = HostStateScreenProps

export const ChooseQuizStateScreen: React.FC<ChooseQuizStateScreenProps> = ({ send }) => {
    return (
        <div className="flex flex-col flex-1 justify-center items-center">
            <div className="p-4 bg-white rounded-md min-w-[320px] shadow-md">
                <h3 className="mb-4 text-center text-lg">For now we'll give you a default set of questions.</h3>
                <PrimaryButton
                    className="w-full"
                    onClick={() => {
                        send("NEXT")
                    }}
                >
                    Start game
                </PrimaryButton>
            </div>
        </div>
    )
}
