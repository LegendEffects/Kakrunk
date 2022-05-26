export function truncateUrl(sourceUrl: string, sliceAmount: number) {
    const url = new URL(sourceUrl)

    url.pathname = "/" + url.pathname.split("/").slice(sliceAmount).join("/")

    return url
}
