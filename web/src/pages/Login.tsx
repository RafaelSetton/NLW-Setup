import { useNavigate, Link } from 'react-router-dom'
import { FormEvent, useState, useEffect } from 'react'
import { SignIn } from 'phosphor-react'
import FormInput from '../components/FormInput'
import logoImage from '../assets/logo.svg'
import api from '../lib/axios'

interface LoginProps {
    onSuccess?: (token: string) => void
}

export default function Login({ onSuccess }: LoginProps) {
    const navigate = useNavigate()
    if (!onSuccess) onSuccess = () => navigate("/home")
    let token = localStorage.getItem("habitsSessionToken")

    useEffect(() => {
        if (token) onSuccess!(token)
    }, [])


    function tryLogin(event: FormEvent) {
        event.preventDefault()

        api.post("/login", {
            email,
            password,
        }).then(response => {
            console.log(response)
            if (response.status == 200) {
                localStorage.setItem("habitsSessionToken", response.data.token)
                onSuccess!(response.data.token)
            } else {
                console.warn(response.data)
            }
        }).catch(err => {
            console.log(err)
            if (err.response.status == 400) alert("Este e-mail não está cadastrado")
            else if (err.response.status == 401) alert("Senha Incorreta")
            else console.warn(err)
        })

    }

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    return (
        <div className='flex flex-col items-center justify-center gap-10'>
            <img src={logoImage} alt="Habits" />
            <form onSubmit={tryLogin} className="w-full flex flex-col mt-6 justify-center items-center" >
                <FormInput
                    value={email}
                    onChange={ev => setEmail(ev.target.value)}
                    htmlFor="email"
                    placeholder="nome@email.com"
                    title="E-mail"
                />

                <FormInput
                    value={password}
                    onChange={ev => setPassword(ev.target.value)}
                    htmlFor="password"
                    placeholder="********"
                    title="Senha"
                    type='password'
                />

                <button
                    type="submit"
                    className="w-60 mx-10 mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-green-600 hover:bg-green-500 transition-colors
                focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 focus:ring-offset-zinc-900"
                >
                    <SignIn size={20} weight="bold" />
                    Log-in
                </button>
            </form>
            <div>
                Não possui cadastro?{" "}
                <Link to="/register" className='text-violet-500 underline underline-offset-1'>
                    Clique Aqui!
                </Link>
            </div>
        </div>
    )
}
