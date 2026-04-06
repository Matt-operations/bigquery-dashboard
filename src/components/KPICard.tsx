import { TrendingUp, TrendingDown } from 'lucide-react'
import type { KPIMetric } from '../types'

interface KPICardProps {
  metric: KPIMetric
  accentColor?: string
}

export default function KPICard({ metric, accentColor = '#7C5CFC' }: KPICardProps) {
  const isPositive = metric.change >= 0

  return (
    <div className="glass-card p-5 hover:border-border transition-all group cursor-default">
      <div className="flex items-start justify-between mb-4">
        <span className="text-sm text-text-secondary font-medium">{metric.label}</span>
        <span
          className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
            isPositive
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-red-500/10 text-red-400'
          }`}
        >
          {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {isPositive ? '+' : ''}{metric.change}%
        </span>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-text-primary tracking-tight">{metric.value}</p>
          <p className="text-xs text-text-muted mt-1">{metric.changeLabel}</p>
        </div>

        {/* Sparkline placeholder */}
        <div className="w-16 h-8 opacity-60">
          <svg viewBox="0 0 64 32" className="w-full h-full">
            <polyline
              points={
                isPositive
                  ? '0,28 12,22 24,20 36,14 48,10 64,4'
                  : '0,6 12,10 24,14 36,18 48,22 64,28'
              }
              fill="none"
              stroke={accentColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div
        className="mt-4 h-0.5 rounded-full opacity-40"
        style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
      />
    </div>
  )
}
