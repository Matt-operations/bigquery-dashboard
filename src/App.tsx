import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-60 min-w-0">
        <Dashboard />
      </div>
    </div>
  )
}
