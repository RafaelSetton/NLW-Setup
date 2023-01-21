import { ReactNode } from "react"
import * as Popover from '@radix-ui/react-popover'
import ProgressBar from "./ProgressBar"
import dayjs from "dayjs"
import clsx from 'clsx'

interface DayTileProps {
    date: Date
    possible: number
    completed: number
}

export default function DayTile(props: DayTileProps) {
    const weekDays = [
        "domingo",
        "segunda-feira",
        "terça-feira",
        "quarta-feira",
        "quinta-feira",
        "sexta-feira",
        "sábado"
    ]

    const completedPercentage = 100 * props.completed / props.possible

    return (
        <Popover.Root>
            <Popover.Trigger
                className={clsx("w-10 h-10 border-2 rounded-lg", {
                    'bg-violet-500 border-violet-400': completedPercentage === 100,
                    'bg-violet-500 border-violet-400 bg-opacity-75': completedPercentage > 80 && completedPercentage < 100,
                    'bg-violet-600 border-violet-500 bg-opacity-85': completedPercentage > 60 && completedPercentage <= 80,
                    'bg-violet-700 border-violet-500 bg-opacity-80': completedPercentage > 40 && completedPercentage <= 60,
                    'bg-violet-800 border-violet-600 bg-opacity-70': completedPercentage > 20 && completedPercentage <= 40,
                    'bg-violet-900 border-violet-700 bg-opacity-50': completedPercentage > 0 && completedPercentage <= 20,
                    'bg-zinc-900 border-zinc-800': completedPercentage === 0
                })}

            />

            <Popover.Portal>
                <Popover.Content className="min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col" >
                    <span className="font-semibold text-zinc-400" >{weekDays[props.date.getDay()]}</span>
                    <span className="mt-1 font-extrabold leading-tight text-3xl" >{dayjs(props.date).format("DD/MM")}</span>

                    <ProgressBar progress={completedPercentage} />

                    <Popover.Arrow className="fill-zinc-900 w-4 h-2" />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    )
}