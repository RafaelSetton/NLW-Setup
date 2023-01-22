import * as RadixCheckBox from '@radix-ui/react-checkbox'
import { Check } from "phosphor-react"

export default function CheckBox() {
    return (
        <RadixCheckBox.Root className="flex items-center gap-3 group" >

            <div className="w-8 h-8 rounded-lg flex items-center justify-center border-2 border-zinc-800 bg-zinc-900 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-400">
                <RadixCheckBox.Indicator className="flex items-center justify-center">
                    <Check size={20} weight="bold" className="text-white" />
                </RadixCheckBox.Indicator>
            </div>

            <span className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
                Beber 2L de água
            </span>
        </RadixCheckBox.Root>
    )
}