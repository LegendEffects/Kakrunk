import React from "react"
import useCountdown from "../../../../hooks/useCountdown"

const CountdownStateScreen: React.FC = () => {
    const [count] = useCountdown(3)

    return (
        <div className="flex flex-col flex-1 justify-center items-center rgb-animation">
            <div className="p-8 px-12 text-white text-center bg-black bg-opacity-60 rounded-lg">
                <h1 className="text-8xl font-black">{Math.max(0, count)}</h1>
            </div>
        </div>
    )
}

export default CountdownStateScreen
