import { useState } from 'react'
import React from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import HomePage from './pages/HomePage'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <HomePage/>
  )
}

export default App
