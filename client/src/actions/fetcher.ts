// @ts-expect-error Just a passthrough function, cleanup later
export const fetcher = (...args) => fetch(...args).then((res) => res.json())
