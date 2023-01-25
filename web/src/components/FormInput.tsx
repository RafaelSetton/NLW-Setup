import { ChangeEvent } from 'react'

interface FormInputProps {
    value: string
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
    htmlFor: string
    placeholder: string
    type?: string
    title: string
}

export default function FormInput({ htmlFor, onChange, placeholder, title, value, type = "text" }: FormInputProps) {
    return (
        <>
            <label htmlFor={htmlFor} className="font-semibold mt-5">
                {title}
            </label>
            <input
                type={type}
                placeholder={placeholder}
                className="w-full p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400
                focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-zinc-900"
                autoFocus
                value={value}
                onChange={onChange}
            />
        </>
    )
}