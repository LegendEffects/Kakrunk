import React, { useEffect, useState } from "react"

const CountdownStateScreen: React.FC = () => {
    const [count, setCount] = useState(3)

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((count) => count - 1)
        }, 1000)

        return () => {
            clearInterval(interval)
        }
    }, [])

    return (
        <div className="flex flex-col flex-1 justify-center items-center rgb-animation">
            <div className="p-8 px-12 text-white text-center bg-black bg-opacity-60 rounded-lg">
                <h1 className="text-8xl font-black">{Math.max(0, count)}</h1>
            </div>
        </div>
    )
}

export default CountdownStateScreen
