import { useNavigate, Link } from 'react-router-dom'
import { FormEvent, useState } from 'react'
import { UserPlus } from 'phosphor-react'
import FormInput from '../components/FormInput'
import logoImage from '../assets/logo.svg'
import api from '../lib/axios'


export default function Register() {
    const navigate = useNavigate()

    function tryRegister(event: FormEvent) {
        event.preventDefault()


        if (name.length * email.length * password.length == 0) return alert("Você deve preencher todos os campos")

        api.post("/register", {
            name,
            email,
            password,
        }).then(response => {
            if (response.status == 200) {
                console.log(response)
                localStorage.setItem("habitsSessionToken", "")
                navigate("/")
            } else {
                console.warn(response.data)
            }
        }).catch(err => {
            console.log(err)
            if (err.response.status == 400) alert("Este e-mail já está cadastrado")
            else console.warn(err)
        })

    }

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    return (
        <div className='flex flex-col items-center justify-center gap-10'>
            <img src={logoImage} alt="Habits" />
            <h1 className='-mb-8 font-bold text-2xl text-white'>
                Faça seu cadastro
            </h1>
            <form onSubmit={tryRegister} className="w-full flex flex-col mt-6 justify-center items-center" >
                <FormInput
                    value={name}
                    onChange={ev => setName(ev.target.value)}
                    htmlFor="name"
                    placeholder="Rafael Carvalho"
                    title="Nome"
                />

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
                    <UserPlus size={20} weight="bold" />
                    Registrar
                </button>
            </form>
            <div>
                Já possui cadastro?{" "}
                <Link to="/" className='text-violet-500 underline underline-offset-1'>
                    Faça Login
                </Link>
            </div>
        </div>
    )
}
