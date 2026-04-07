import { useMemo } from 'react'
import type { Contact, DateRange } from '../types'
import { buildDashboardFromContacts } from '../services/dataService'
import Header from '../components/Header'
import KPICard from '../components/KPICard'
import RevenueChart from '../components/RevenueChart'
import SalesByChannelChart from '../components/SalesByChannelChart'
import CustomerSegmentsChart from '../components/CustomerSegmentsChart'
import TopProductsTable from '../components/TopProductsTable'
import RecentDealsTable from '../components/RecentDealsTable'
import FunnelChart from '../components/FunnelChart'

const kpiColors = ['#7C5CFC', '#2DD4BF', '#4DA3FF', '#FB923C']

function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`glass-card p-5 animate-pulse ${className}`}>
      <div className="h-4 bg-bg-hover rounded-lg w-24 mb-4" />
      <div className="h-8 bg-bg-hover rounded-lg w-32 mb-2" />
      <div className="h-3 bg-bg-hover rounded-lg w-20" />
    </div>
  )
}

interface Props {
  contacts: Contact[]
  dateRange: DateRange
  onDateRangeChange: (range: DateRange) => void
}

export default function Dashboard({ contacts, dateRange, onDateRangeChange }: Props) {
  const loading = contacts.length === 0
  const data = useMemo(() => buildDashboardFromContacts(contacts), [contacts])

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header dateRange={dateRange} onDateRangeChange={onDateRangeChange} />

      <main className="flex-1 overflow-y-auto px-8 py-6">
        {/* KPI Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : data.kpis.map((metric, i) => (
                <KPICard key={metric.label} metric={metric} accentColor={kpiColors[i]} />
              ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {loading ? (
            <>
              <SkeletonCard className="col-span-2 h-80" />
              <SkeletonCard className="h-80" />
            </>
          ) : (
            <>
              <RevenueChart data={data.monthlyTrend} />
              <SalesByChannelChart data={data.leadsBySource} />
            </>
          )}
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {loading ? (
            <>
              <SkeletonCard className="h-72" />
              <SkeletonCard className="h-72" />
              <SkeletonCard className="h-72" />
            </>
          ) : (
            <>
              <CustomerSegmentsChart data={data.metalLevels} />
              <FunnelChart data={data.stateBreakdown} />
              <RecentDealsTable data={data.contacts.slice(0, 5)} />
            </>
          )}
        </div>

        {/* Agent Performance */}
        <div className="grid grid-cols-3 gap-4 pb-4">
          {loading ? (
            <SkeletonCard className="col-span-3 h-64" />
          ) : (
            <TopProductsTable data={data.agentPerformance} />
          )}
        </div>
      </main>
    </div>
  )
}
