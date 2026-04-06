import type { StateBreakdown } from '../types'

interface StateBreakdownChartProps {
  data: StateBreakdown[]
}

export default function FunnelChart({ data }: StateBreakdownChartProps) {
  const maxLeads = data[0]?.leads ?? 1

  return (
    <div className="glass-card p-5">
      <div className="mb-4">
        <h2 className="font-semibold text-text-primary">Leads by State</h2>
        <p className="text-xs text-text-muted mt-0.5">Volume and conversions per state</p>
      </div>

      <div className="space-y-3">
        {data.map((row, i) => {
          const barWidth = (row.leads / maxLeads) * 100
          const convRate = row.leads > 0 ? Math.round((row.converted / row.leads) * 100) : 0
          const colors = ['#7C5CFC','#4DA3FF','#2DD4BF','#FB923C','#F472B6','#EAB308']
          const color = colors[i % colors.length]
          return (
            <div key={row.state}>
              <div className="flex items-center justify-between mb-1 text-xs">
                <span className="font-semibold text-text-secondary w-8">{row.state}</span>
                <div className="flex items-center gap-3 text-text-muted">
                  <span>{row.leads} leads</span>
                  <span className="text-emerald-400 font-semibold">{convRate}% conv.</span>
                </div>
              </div>
              <div className="h-4 bg-bg-hover rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md transition-all duration-500"
                  style={{ width: `${barWidth}%`, background: `linear-gradient(90deg, ${color}, ${color}99)` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
