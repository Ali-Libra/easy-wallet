import ReactDOM from 'react-dom/client'
import { StrictMode } from 'react'
import { AuthProvider } from './context/auth.tsx'

const App = () => <div>Hello Chrome Extension!</div>

ReactDOM.createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </StrictMode>
)
