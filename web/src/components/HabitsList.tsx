import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import api from "../lib/axios";
import * as RadixCheckBox from '@radix-ui/react-checkbox'
import { Check } from "phosphor-react"

interface HabitsListProps {
    date: Dayjs
    onCompletedChanged: (completed: number) => void
}

interface HabitsInfo {
    possibleHabits: Array<{
        id: string
        title: string
        createdAt: string
    }>
    completedHabits: String[]
}

export default function HabitsList({ date, onCompletedChanged }: HabitsListProps) {
    const parsedDate = date.add(dayjs().utcOffset(), 'minutes')
    const [data, setData] = useState<HabitsInfo>({ possibleHabits: [], completedHabits: [] })
    const isPast = parsedDate.isBefore(dayjs().subtract(1, 'day'))


    useEffect(() => {
        api.get("/day", {
            params: {
                date: parsedDate.toString()
            }
        }).then(res => setData(res.data))

    }, [])

    function handleToggleHabit(habitId: string) {
        api.patch(`/habits/${habitId}/toggle`)

        var newCompleted = data.completedHabits
        if (newCompleted.includes(habitId))
            newCompleted = newCompleted.filter(id => id != habitId)
        else
            newCompleted.push(habitId)
        setData({
            possibleHabits: data.possibleHabits,
            completedHabits: newCompleted,
        })

        onCompletedChanged(newCompleted.length)
    }

    return (
        <div className="mt-6 flex flex-col gap-3">
            {
                data.possibleHabits.map(habit => (
                    <RadixCheckBox.Root
                        key={habit.id}
                        onCheckedChange={() => handleToggleHabit(habit.id)}
                        checked={data.completedHabits.includes(habit.id)}
                        disabled={isPast}
                        className="flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed"
                    >

                        <div className="w-8 h-8 rounded-lg flex items-center justify-center border-2 border-zinc-800 bg-zinc-900
                         group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-400 transition-colors
                         group-focus:ring-2 group-focus:ring-violet-700 group-focus:ring-offset-2 group-focus:ring-offset-background">
                            <RadixCheckBox.Indicator className="flex items-center justify-center">
                                <Check size={20} weight="bold" className="text-white" />
                            </RadixCheckBox.Indicator>
                        </div>

                        <span className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
                            {habit.title}
                        </span>
                    </RadixCheckBox.Root>
                ))
            }

        </div>
    )
}