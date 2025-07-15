import ReactDOM from 'react-dom/client'
import { StrictMode } from 'react'
import { AuthProvider } from './context/auth.tsx'
import App from './App.tsx'

// import './globals.css'
import './chrome.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </StrictMode>
)
