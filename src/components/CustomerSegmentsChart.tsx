import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import type { PlanMetalLevel } from '../types'

interface PlanMetalChartProps {
  data: PlanMetalLevel[]
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload as PlanMetalLevel
  return (
    <div className="bg-bg-card border border-border rounded-xl p-3 shadow-xl text-xs">
      <p className="font-semibold text-text-primary mb-1">{d.level}</p>
      <div className="flex justify-between gap-4">
        <span className="text-text-muted">Plans</span>
        <span className="text-text-primary font-semibold">{d.count}</span>
      </div>
    </div>
  )
}

export default function CustomerSegmentsChart({ data }: PlanMetalChartProps) {
  const total = data.reduce((acc, d) => acc + d.count, 0)

  return (
    <div className="glass-card p-5">
      <div className="mb-4">
        <h2 className="font-semibold text-text-primary">Plan Metal Levels</h2>
        <p className="text-xs text-text-muted mt-0.5">Selected plan distribution</p>
      </div>

      <div className="flex items-center gap-4">
        <ResponsiveContainer width={140} height={140}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={44} outerRadius={64} dataKey="count" paddingAngle={3} strokeWidth={0}>
              {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="flex-1 space-y-2">
          {data.map(item => {
            const pct = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0'
            return (
              <div key={item.level} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                <span className="text-xs text-text-secondary flex-1">{item.level}</span>
                <span className="text-xs font-semibold text-text-primary">{pct}%</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border-subtle">
        <div className="flex justify-between text-xs">
          <span className="text-text-muted">Plans Selected</span>
          <span className="font-bold text-text-primary">{total}</span>
        </div>
      </div>
    </div>
  )
}
