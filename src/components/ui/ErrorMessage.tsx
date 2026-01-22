
type Props = {
    message: string
}

export const ErrorMessage = ({ message }: Props) => {
    return (
        <p className="text-red-500 text-xs h-4">{message}</p>
    )
}
