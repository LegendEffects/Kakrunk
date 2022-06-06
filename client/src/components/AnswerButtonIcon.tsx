export const AnswerButtonIcon: React.FC<{ index: number }> = ({ index }) => {
    switch (index) {
        case 1:
            return (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 44L24 4L44 44H4Z" fill="white" />
                </svg>
            )
        case 2:
            return (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 24L24 4L44 24L24 44L4 24Z" fill="white" />
                </svg>
            )
        case 3:
            return (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="20" fill="white" />
                </svg>
            )
        case 4:
            return (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="4" width="40" height="40" fill="white" />
                </svg>
            )
    }

    return null
}
