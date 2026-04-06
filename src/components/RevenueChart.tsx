import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { MonthlyTrend } from '../types'

interface SubmissionTrendChartProps {
  data: MonthlyTrend[]
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-bg-card border border-border rounded-xl p-3 shadow-xl text-xs">
      <p className="text-text-muted font-medium mb-2">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2 py-0.5">
          <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-text-secondary capitalize">{entry.name}:</span>
          <span className="font-semibold text-text-primary">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function RevenueChart({ data }: SubmissionTrendChartProps) {
  return (
    <div className="glass-card p-5 col-span-2">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-semibold text-text-primary">Submission Trends</h2>
          <p className="text-xs text-text-muted mt-0.5">Monthly applications submitted vs converted</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-text-secondary">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded bg-[#7C5CFC] inline-block" /> Submissions
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded bg-[#2DD4BF] inline-block" /> Conversions
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#7C5CFC" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#7C5CFC" stopOpacity={0}    />
            </linearGradient>
            <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#2DD4BF" stopOpacity={0.20} />
              <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0}    />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E2235" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: '#8B8FA8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#8B8FA8', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#252840', strokeWidth: 1 }} />
          <Area type="monotone" dataKey="conversions" name="Conversions" stroke="#2DD4BF" strokeWidth={2} fill="url(#colorConv)" dot={false} activeDot={{ r: 4, fill: '#2DD4BF', stroke: '#161929', strokeWidth: 2 }} />
          <Area type="monotone" dataKey="submissions" name="Submissions" stroke="#7C5CFC" strokeWidth={2.5} fill="url(#colorSubs)" dot={false} activeDot={{ r: 4, fill: '#7C5CFC', stroke: '#161929', strokeWidth: 2 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
