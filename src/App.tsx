import { useState } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import LoginPage from './components/LoginPage'

const CLIENT_ID = '709838837898-l12nutdvm8h2hlffkq1qpisjpst0f4l5.apps.googleusercontent.com'

export default function App() {
  const [token, setToken] = useState<string | null>(
    sessionStorage.getItem('google_token')
  )

  function handleLogin(credential: string) {
    // Decode the JWT to check the email domain
    const payload = JSON.parse(atob(credential.split('.')[1]))
    console.log('Login email:', payload.email)
    if (!payload.email?.endsWith('@boosthealthinsurance.com')) {
      alert(`Access denied. Your email (${payload.email}) is not a @boosthealthinsurance.com account.`)
      return
    }
    sessionStorage.setItem('google_token', credential)
    setToken(credential)
  }

  function handleLogout() {
    sessionStorage.removeItem('google_token')
    setToken(null)
  }

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      {!token ? (
        <LoginPage onSuccess={handleLogin} />
      ) : (
        <div className="flex h-screen bg-bg-primary overflow-hidden">
          <Sidebar onLogout={handleLogout} />
          <div className="flex-1 flex flex-col ml-60 min-w-0">
            <Dashboard />
          </div>
        </div>
      )}
    </GoogleOAuthProvider>
  )
}
