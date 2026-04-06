import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import type { LeadsBySource } from '../types'

interface LeadsBySourceChartProps {
  data: LeadsBySource[]
}

const barColors = ['#7C5CFC', '#4DA3FF', '#2DD4BF', '#FB923C', '#F472B6']

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload as LeadsBySource
  return (
    <div className="bg-bg-card border border-border rounded-xl p-3 shadow-xl text-xs min-w-[150px]">
      <p className="text-text-primary font-semibold mb-2">{label}</p>
      <div className="space-y-1">
        <div className="flex justify-between gap-4"><span className="text-text-muted">Leads</span><span className="font-semibold text-text-primary">{d.leads}</span></div>
        <div className="flex justify-between gap-4"><span className="text-text-muted">Converted</span><span className="font-semibold text-emerald-400">{d.converted}</span></div>
        <div className="flex justify-between gap-4"><span className="text-text-muted">Conv. Rate</span><span className="font-semibold text-accent-purple-light">{d.conversionRate}%</span></div>
      </div>
    </div>
  )
}

export default function SalesByChannelChart({ data }: LeadsBySourceChartProps) {
  return (
    <div className="glass-card p-5">
      <div className="mb-5">
        <h2 className="font-semibold text-text-primary">Leads by Source</h2>
        <p className="text-xs text-text-muted mt-0.5">Acquisition channel breakdown</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }} barSize={28}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E2235" vertical={false} />
          <XAxis dataKey="source" tick={{ fill: '#8B8FA8', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#8B8FA8', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1E2235' }} />
          <Bar dataKey="leads" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => <Cell key={i} fill={barColors[i % barColors.length]} fillOpacity={0.85} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
