import { useState } from 'react'
import reactLogo from './assets/img/react.svg'
import viteLogo from '/vite.svg'
import './assets/style/App.css'
import Navbar from './components/Navbar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navbar/>
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <h1 className="text-4xl font-bold text-indigo-600">Welcome to My App</h1>
        <p className="mt-2 text-gray-600">
          This is a React app built with Vite and Tailwind CSS.
        </p>
      </main>
    </>
  )
}

export default App
