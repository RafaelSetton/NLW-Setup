import './styles/global.css'
import './lib/dayjs'

import { HashRouter, Route, Routes } from 'react-router-dom'

import Login from './pages/Login'
import Home from './pages/Home'
import Register from './pages/Register'

export default function App() {
  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col">
      <HashRouter>
        <Routes>
          <Route element={<Login />} path="/" />
          <Route element={<Home />} path="/home" />
          <Route element={<Register />} path="/register" />
        </Routes>
      </HashRouter>
      <footer className='text-center text-zinc-400 fixed bottom-10 right-10 w-3/12' >
        Este projeto foi desenvolvido durante a <br />
        NLW Setup e é mantido por Rafael Setton
      </footer>
    </div>
  )
}


