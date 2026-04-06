import { TrendingUp } from 'lucide-react'
import type { AgentPerformance } from '../types'

interface AgentPerformanceTableProps {
  data: AgentPerformance[]
}

export default function TopProductsTable({ data }: AgentPerformanceTableProps) {
  return (
    <div className="glass-card p-5 col-span-2">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-semibold text-text-primary">Agent Performance</h2>
          <p className="text-xs text-text-muted mt-0.5">Conversions and avg premium by agent</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              {['Agent', 'Total Leads', 'Converted', 'Conv. Rate', 'Avg Suggested Premium'].map(h => (
                <th key={h} className="text-xs font-semibold text-text-muted pb-3 pr-6 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {data.map((row, i) => (
              <tr key={row.agent} className="hover:bg-bg-hover/50 transition-colors">
                <td className="py-3 pr-6">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-gradient-to-br ${
                      ['from-purple-500 to-blue-500','from-blue-500 to-teal-500','from-teal-500 to-emerald-500','from-orange-500 to-pink-500','from-pink-500 to-purple-500'][i % 5]
                    }`}>
                      {row.agent.split(' ').map(w => w[0]).join('')}
                    </div>
                    <span className="font-medium text-text-primary">{row.agent}</span>
                  </div>
                </td>
                <td className="py-3 pr-6 text-text-secondary">{row.totalLeads}</td>
                <td className="py-3 pr-6 font-semibold text-emerald-400">{row.converted}</td>
                <td className="py-3 pr-6">
                  <div className="flex items-center gap-1.5">
                    <div className="flex-1 h-1.5 bg-bg-hover rounded-full overflow-hidden w-16">
                      <div className="h-full bg-accent-purple rounded-full" style={{ width: `${row.conversionRate}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-text-primary">{row.conversionRate}%</span>
                  </div>
                </td>
                <td className="py-3">
                  <span className="flex items-center gap-1 text-sm font-semibold text-text-primary">
                    <TrendingUp size={12} className="text-accent-purple" />
                    ${row.avgPremium.toLocaleString()}/mo
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
