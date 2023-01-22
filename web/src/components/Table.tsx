import dayjs from "dayjs";
import { useEffect, useState } from "react";
import api from "../lib/axios";
import generateDateRange from "../utils/generateDateRange";
import DayTile from "./DayTile";
import WeekDayHead from "./WeekDayHead";

const dates = generateDateRange()

const minimumLoadedDays = 18 * 7
const daysToLoad = minimumLoadedDays - dates.length

type Summary = Array<{
    id: string;
    date: string;
    possible: number;
    completed: number;
}>

export default function Table() {
    const [summary, setSummary] = useState<Summary>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        api.get("/summary").then(res => setSummary(res.data)).then(() => setLoading(false))

    }, [])

    return (
        <div className="w-full flex">
            <div className="grid grid-rows-7 grid-flow-row gap-3">
                {
                    "DSTQQSS".split("").map((day, index) =>
                        (<WeekDayHead key={`${day}-${index}`} day={day} />))
                }

            </div>
            <div className="grid grid-rows-7 grid-flow-col gap-3">
                {
                    !loading && dates.map(date => {
                        const dayInSummary = summary.find(d => dayjs(date).isSame(d.date, 'day'))
                        return (
                            <DayTile
                                key={date.toString()}
                                date={date}
                                defaultCompleted={dayInSummary?.completed}
                                possible={dayInSummary?.possible}
                            />
                        )
                    })
                }
                {
                    daysToLoad > 0 && Array.from({ length: daysToLoad }).map((_, i) => (
                        <div
                            key={i}
                            className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"
                        />
                    ))
                }
            </div>
        </div>
    )
}