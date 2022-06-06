import { useActor } from "@xstate/react"
import clsx from "clsx"
import React, { useEffect, useMemo } from "react"
import { Question } from "shared"
import { AnswerButton } from "../../../../../components/AnswerButton"
import { AnswerButtonIcon } from "../../../../../components/AnswerButtonIcon"
import { PrimaryButton } from "../../../../../components/Button"
import { Footer } from "../../../../../components/Footer"
import useCountdown from "../../../../../hooks/useCountdown"
import { HostStateScreenProps } from "../../HostScreen"

export const ViewQuestionStateScreen: React.FC<HostStateScreenProps> = ({ state }) => {
    if (!state.context.question || !state.context.room) {
        throw new Error("Unreachable state")
    }

    const [room] = useActor(state.context.room)
    const [questionState, sendQuestion] = useActor(state.context.question)

    const question: Question = questionState.context.question

    const [count] = useCountdown(question.timeLimit)

    useEffect(() => {
        if (count === 0) {
            // sendQuestion({
            //     type: "NEXT",
            // })
        }
    }, [count, sendQuestion])

    return (
        <div className="flex flex-col flex-1 bg-gray-100">
            <div className="bg-white py-12 text-center text-7xl font-black border-b-2 border-gray-200">
                {question.text}
            </div>

            {questionState.matches("revealAnswers") ? (
                <>
                    <div className="flex justify-end py-4 px-8">
                        <PrimaryButton onClick={() => sendQuestion({ type: "NEXT" })}>Next</PrimaryButton>
                    </div>
                    <div className="flex flex-1 flex-col items-center px-24">
                        {questionState.context.summary && (
                            <QuestionSummary question={question} summary={questionState.context.summary} />
                        )}
                    </div>
                </>
            ) : (
                <div className="flex flex-1 justify-between items-center px-24">
                    <div className="flex-1 justify-start items-center">
                        <div className="bg-blue-500 text-white rounded-full text-5xl font-black ordinal w-32 h-32 flex justify-center items-center">
                            {count}
                        </div>
                    </div>
                    <div className="flex flex-1 justify-center"></div>
                    <div className="flex flex-1 justify-end items-center">
                        <div className="text-center">
                            <div className="text-5xl font-black">{questionState.context.answers}</div>
                            <div className="text-3xl font-bold mt-3">Answers</div>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                    {question.answers.map((answer, i) => (
                        <AnswerButton
                            key={i}
                            answer={answer}
                            index={i + 1}
                            disabled={questionState.matches("revealAnswers") && !answer.correct}
                        />
                    ))}
                </div>

                <Footer>
                    Room Code: <span className="font-bold ml-1">{room.context.roomCode}</span>
                </Footer>
            </div>
        </div>
    )
}

const QuestionSummary: React.FC<{ question: Question; summary: number[] }> = ({ question, summary }) => {
    const totalAnswers = useMemo(() => summary.reduce((acc, val) => acc + val, 0), [summary])

    return (
        <div className="flex flex-1 max-w-2xl justify-between gap-6">
            {summary.map((answers, i) => (
                <div key={i} className="flex flex-col justify-between flex-1 gap-4">
                    <div className={clsx("text-center text-3xl font-bold", `text-accent-${i + 1}`)}>
                        {answers}

                        <div className="h-12 flex justify-center">
                            {question.answers[i]?.correct && (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-12 w-12"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={4}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 flex items-end">
                        <div
                            className={clsx("flex-1", `bg-accent-${i + 1}`)}
                            style={{ height: `${(answers / totalAnswers) * 100}%` }}
                        />
                    </div>

                    <div className={clsx("flex justify-center py-2 px-12", `bg-accent-${i + 1}`)}>
                        <AnswerButtonIcon index={i + 1} />
                    </div>
                </div>
            ))}
        </div>
    )
}
