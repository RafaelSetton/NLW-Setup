import generateDateRange from "../utils/generateDateRange";
import DayTile from "./DayTile";
import WeekDayHead from "./WeekDayHead";

export default function Table() {
    const dates = generateDateRange()

    const minimumLoadedDays = 18 * 7
    const daysToLoad = minimumLoadedDays - dates.length

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
                    dates.map(d => (
                        <DayTile
                            key={d.toString()}
                            date={d}
                            completed={Math.round(Math.random() * 10)}
                            possible={10}
                        />
                    ))
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