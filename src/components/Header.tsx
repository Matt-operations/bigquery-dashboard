import { Search, SlidersHorizontal } from 'lucide-react'
import type { DateRange } from '../types'

interface HeaderProps {
  dateRange: DateRange
  onDateRangeChange: (range: DateRange) => void
}

const ranges: { value: DateRange; label: string }[] = [
  { value: '7d',  label: '7D'  },
  { value: '30d', label: '30D' },
  { value: '90d', label: '90D' },
  { value: 'ytd', label: 'YTD' },
  { value: '12m', label: '12M' },
]

export default function Header({ dateRange, onDateRangeChange }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-border-subtle bg-bg-primary sticky top-0 z-10">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Sales & Marketing</h1>
        <p className="text-sm text-text-muted mt-0.5">Overview · Q1 2026</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-bg-card border border-border-subtle text-sm text-text-primary placeholder-text-muted rounded-xl pl-9 pr-4 py-2 w-48 focus:outline-none focus:border-accent-purple transition-colors"
          />
        </div>

        {/* Date range toggle */}
        <div className="flex items-center bg-bg-card border border-border-subtle rounded-xl p-1 gap-0.5">
          {ranges.map(r => (
            <button
              key={r.value}
              onClick={() => onDateRangeChange(r.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                dateRange === r.value
                  ? 'bg-accent-purple text-white shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <button className="flex items-center gap-2 bg-bg-card border border-border-subtle text-text-secondary text-sm rounded-xl px-3 py-2 hover:text-text-primary hover:border-accent-purple transition-all">
          <SlidersHorizontal size={14} />
          Filters
        </button>
      </div>
    </header>
  )
}
