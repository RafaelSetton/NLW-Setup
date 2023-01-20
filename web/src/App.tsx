import Header from './components/Header'
import Table from './components/Table'
import './styles/global.css'


export default function App() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-full max-w-5xl px-6 flex flex-col gap-16">
        <Header />
        <Table />
      </div>
    </div>
  )
}


