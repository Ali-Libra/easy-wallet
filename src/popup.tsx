import './globals.css'
import './chrome.css'

import ReactDOM from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App.tsx'

import { AuthProvider } from './context/auth.tsx'
import { setRootRem } from './lib/util.ts'

setRootRem()
ReactDOM.createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </StrictMode>
)
