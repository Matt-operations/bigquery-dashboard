import { useEffect, useState } from 'react'
import type { DashboardData, DateRange } from '../types'
import { getDashboardData } from '../services/dataService'
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

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<DateRange>('12m')

  useEffect(() => {
    setLoading(true)
    getDashboardData(dateRange)
      .then(setData)
      .finally(() => setLoading(false))
  }, [dateRange])

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header dateRange={dateRange} onDateRangeChange={setDateRange} />

      <main className="flex-1 overflow-y-auto px-8 py-6">
        {/* KPI Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : data?.kpis.map((metric, i) => (
                <KPICard key={metric.label} metric={metric} accentColor={kpiColors[i]} />
              ))}
        </div>

        {/* Charts Row 1: Submissions (2/3) + Sources (1/3) */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {loading ? (
            <>
              <SkeletonCard className="col-span-2 h-80" />
              <SkeletonCard className="h-80" />
            </>
          ) : (
            <>
              <RevenueChart data={data!.monthlyTrend} />
              <SalesByChannelChart data={data!.leadsBySource} />
            </>
          )}
        </div>

        {/* Charts Row 2: Metal Levels + State Breakdown + Recent Leads */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {loading ? (
            <>
              <SkeletonCard className="h-72" />
              <SkeletonCard className="h-72" />
              <SkeletonCard className="h-72" />
            </>
          ) : (
            <>
              <CustomerSegmentsChart data={data!.metalLevels} />
              <FunnelChart data={data!.stateBreakdown} />
              <RecentDealsTable data={data!.contacts.slice(0, 5)} />
            </>
          )}
        </div>

        {/* Full width: Agent Performance */}
        <div className="grid grid-cols-3 gap-4 pb-4">
          {loading ? (
            <SkeletonCard className="col-span-3 h-64" />
          ) : (
            <TopProductsTable data={data!.agentPerformance} />
          )}
        </div>
      </main>
    </div>
  )
}
