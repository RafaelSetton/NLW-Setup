import { useState } from 'react'

import Header from '../components/Header'
import Table from '../components/Table'
import Login from './Login'

export default function Home() {
    const [token, setToken] = useState<string | null | undefined>(localStorage.getItem("habitsSessionToken"))

    if (!token?.length) return <Login onSuccess={setToken} />

    return (
        <div className="w-full max-w-5xl px-6 flex flex-col gap-16">
            <Header />
            <Table />
        </div>
    )
}