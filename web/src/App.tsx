import './styles/global.css'
import './lib/dayjs'

import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Login from './pages/Login'
import Home from './pages/Home'
import Register from './pages/Register'

export default function App() {
  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col">
      <BrowserRouter>
        <Routes>
          <Route element={<Login />} path="/" />
          <Route element={<Home />} path="/home" />
          <Route element={<Register />} path="/register" />
        </Routes>
      </BrowserRouter>
      <footer className='text-center text-zinc-400 absolute bottom-10 right-10' >
        Este projeto foi desenvolvido durante a <br />
        NLW Setup e é mantido por Rafael Setton
      </footer>
    </div>
  )
}


