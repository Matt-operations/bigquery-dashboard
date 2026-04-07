import {
  LayoutDashboard,
  RefreshCw,
  Bell,
  Zap,
  LogOut,
} from 'lucide-react'

interface NavItem {
  icon: React.ReactNode
  label: string
}

const navItems: NavItem[] = [
  { icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { icon: <RefreshCw size={18} />,       label: 'Retention' },
]

export default function Sidebar({ activePage, onNavigate, onLogout }: {
  activePage?: string
  onNavigate?: (page: string) => void
  onLogout?: () => void
}) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-60 flex flex-col bg-bg-secondary border-r border-border-subtle z-20">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border-subtle">
        <div className="w-8 h-8 rounded-lg bg-accent-purple flex items-center justify-center glow-purple">
          <Zap size={16} className="text-white" />
        </div>
        <span className="font-semibold text-text-primary text-[15px] tracking-tight">
          SalesPulse
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
          Main
        </p>
        {navItems.map(item => {
          const isActive = activePage === item.label
          return (
            <button
              key={item.label}
              onClick={() => onNavigate?.(item.label)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-accent-purple-dim text-accent-purple-light'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
              }`}
            >
              <span className={isActive ? 'text-accent-purple' : 'text-text-muted group-hover:text-text-secondary'}>
                {item.icon}
              </span>
              <span className="flex-1 text-left">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-border-subtle">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-bg-hover cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center text-xs font-bold text-white">
            MH
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">Matt Hatcher</p>
            <p className="text-xs text-text-muted truncate">Admin</p>
          </div>
          <Bell size={15} className="text-text-muted flex-shrink-0" />
        </div>
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 mt-1 rounded-xl text-sm text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
          >
            <LogOut size={15} />
            <span>Sign out</span>
          </button>
        )}
      </div>
    </aside>
  )
}
