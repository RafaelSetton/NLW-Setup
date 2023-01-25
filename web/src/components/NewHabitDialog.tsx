import { Check } from "phosphor-react";
import * as CheckBox from "@radix-ui/react-checkbox"
import { FormEvent, useState } from "react";
import api from "../lib/axios";

const weekDays = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado"
]

export default function NewHabitDialog() {
    const [title, setTitle] = useState('')
    const [selectedWeekDays, setSelectedWeekDays] = useState(Array(7).fill(false))

    function handleToggleWeekDay(index: number) {
        var copy = selectedWeekDays.slice()
        copy[index] = !copy[index]
        setSelectedWeekDays(copy)
    }

    async function createNewHabit(event: FormEvent) {
        event.preventDefault()

        const parsedWeekDays = selectedWeekDays.map((wd, i) => wd ? i : null).filter(el => el !== null)

        if (!title.trim() || parsedWeekDays.length == 0) return;

        await api.post("/habits", {
            title,
            weekDays: parsedWeekDays,
        }, {
            headers: { token: localStorage.getItem("habitsSessionToken") }
        })

        setTitle('')
        setSelectedWeekDays(Array(7).fill(false))

        alert("Hábito criado com sucesso")
        window.location.reload()
    }


    return (
        <form onSubmit={createNewHabit} className="w-full flex flex-col mt-6" >
            <label htmlFor="title" className="font-semibold leading-tight">
                Qual seu comprometimento?
            </label>
            <input
                type="text"
                id="title"
                placeholder="ex. Academia, Beber água, etc..."
                className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400
                focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-zinc-900"
                autoFocus
                value={title}
                onChange={ev => setTitle(ev.target.value)}
            />

            <label htmlFor="" className="font-semibold leading-tight mt-4">
                Qual a recorrência?
            </label>

            <div className="flex flex-col gap-2 mt-3">
                {
                    weekDays.map((weekDay, i) => (
                        <CheckBox.Root className="flex items-center gap-3 group focus:outline-none" key={weekDay} onCheckedChange={() => handleToggleWeekDay(i)} checked={selectedWeekDays[i]} >

                            <div className="w-8 h-8 rounded-lg flex items-center justify-center border-2 border-zinc-800 bg-zinc-900
                             group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-400 transition-colors
                             group-focus:ring-2 group-focus:ring-violet-700 group-focus:ring-offset-2 group-focus:ring-offset-zinc-900">
                                <CheckBox.Indicator className="flex items-center justify-center">
                                    <Check size={20} weight="bold" className="text-white" />
                                </CheckBox.Indicator>
                            </div>

                            <span className=" text-white leading-tight">
                                {weekDay}
                            </span>
                        </CheckBox.Root>
                    ))
                }
            </div>

            <button
                type="submit"
                className="mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-green-600 hover:bg-green-500 transition-colors
                focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
                <Check size={20} weight="bold" />
                Confirmar
            </button>

        </form>
    )
}