// src/App.tsx
import { HashRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Send from './pages/Send'
import Header from './components/header'

export default function App() {
  return (
    <HashRouter>
        <div className="min-h-screen bg-[var(--body)] flex flex-col">
          <Header />
          <main className="flex-grow p-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/send" element={<Send />} />
            </Routes>
          </main>
        </div>
    </HashRouter>
  )
}