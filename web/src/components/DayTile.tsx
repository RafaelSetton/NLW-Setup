import { ReactNode } from "react"

interface DayTileProps {
    date: Date
    children: ReactNode
}

export default function DayTile(props: DayTileProps) {
    return (
        <div className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg">
            {props.date.getUTCDate()}/{props.date.getUTCMonth() + 1}
        </div>
    )
}