import { useEffect, useState } from "react"

export default function useCountdown(length: number) {
    const [count, setCount] = useState(length)

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((c) => {
                if (c === 0) {
                    clearInterval(interval)
                    return c
                }

                return c - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return [count] as const
}
