import { useState, useEffect } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Retention from './pages/Retention'
import LoginPage from './components/LoginPage'
import type { Contact, DateRange } from './types'
import { getDashboardData } from './services/dataService'

const CLIENT_ID = '709838837898-l12nutdvm8h2hlffkq1qpisjpst0f4l5.apps.googleusercontent.com'

export default function App() {
  const [token, setToken] = useState<string | null>(
    sessionStorage.getItem('google_token')
  )
  const [activePage, setActivePage] = useState<string>('Dashboard')
  const [contacts, setContacts] = useState<Contact[]>([])
  const [dateRange, setDateRange] = useState<DateRange>('12m')

  useEffect(() => {
    if (!token) return
    getDashboardData(dateRange).then(data => setContacts(data.contacts))
  }, [token, dateRange])

  function handleLogin(credential: string) {
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
          <Sidebar activePage={activePage} onNavigate={setActivePage} onLogout={handleLogout} />
          <div className="flex-1 flex flex-col ml-60 min-w-0 overflow-hidden">
            {activePage === 'Dashboard' && (
              <Dashboard contacts={contacts} dateRange={dateRange} onDateRangeChange={setDateRange} />
            )}
            {activePage === 'Retention' && (
              <Retention contacts={contacts} />
            )}
          </div>
        </div>
      )}
    </GoogleOAuthProvider>
  )
}
