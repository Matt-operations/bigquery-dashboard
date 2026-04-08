/**
 * Data Service
 *
 * Fetches Contact[] from the Cloud Run API (which queries BigQuery).
 * Set VITE_API_BASE_URL in .env.local to your Cloud Run service URL.
 *
 * Falls back to synthesized data if VITE_API_BASE_URL is not set.
 */

import type {
  Contact,
  DashboardData,
  KPIMetric,
  MonthlyTrend,
  LeadsBySource,
  PlanMetalLevel,
  AgentPerformance,
  StateBreakdown,
  DateRange,
} from '../types'
import { contacts as syntheticContacts } from '../data/synthesized'

const API_BASE = import.meta.env.VITE_API_BASE_URL as string | undefined
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

// ─── Fetch contacts from API (or fall back to synthesized) ───────────────────

async function fetchContacts(dateRange: DateRange): Promise<Contact[]> {
  if (!API_BASE) {
    // No API URL set — use synthesized data
    return syntheticContacts
  }
  const res = await fetch(`${API_BASE}/contacts?range=${dateRange}`)
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`)
  const { contacts } = await res.json()
  return contacts as Contact[]
}

// ─── Aggregations ────────────────────────────────────────────────────────────

function buildKPIs(contacts: Contact[]): KPIMetric[] {
  const shortForms = contacts.filter(c => !c.selectedPlanName).length
  const fullForms = contacts.filter(c => !!c.selectedPlanName).length
  const converted = contacts.filter(c => c.converted === 'Yes').length
  const sfConversions = contacts.filter(c =>
    !!c.selectedPlanName && !!c.shortFormAttribution
  ).length
  const convRate = fullForms > 0 ? (converted / fullForms) * 100 : 0

  return [
    { label: 'Short Forms',      value: shortForms.toLocaleString(),      change: 0, changeLabel: 'vs last period' },
    { label: 'Full Forms',       value: fullForms.toLocaleString(),        change: 0, changeLabel: 'vs last period' },
    { label: 'SF → Full Form',   value: sfConversions.toLocaleString(),    change: 0, changeLabel: 'short forms converted' },
    { label: 'Conversions',      value: converted.toLocaleString(),        change: 0, changeLabel: 'vs last period' },
    { label: 'Conversion Rate',  value: `${convRate.toFixed(1)}%`,         change: 0, changeLabel: 'of full forms', suffix: '%' },
  ]
}

function buildMonthlyTrend(contacts: Contact[]): MonthlyTrend[] {
  const byMonth: Record<string, MonthlyTrend> = {}
  contacts.forEach(c => {
    const date = c.submissionDate || c.created
    if (!date) return
    const d = new Date(date)
    if (isNaN(d.getTime())) return
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (!byMonth[key]) byMonth[key] = { month: MONTHS[d.getMonth()], shortForms: 0, fullForms: 0, conversions: 0, sfConversions: 0, premiumVolume: 0 }
    const isFullForm = !!c.selectedPlanName
    if (isFullForm) {
      byMonth[key].fullForms++
      if (c.shortFormAttribution) byMonth[key].sfConversions++
    } else {
      byMonth[key].shortForms++
    }
    if (c.converted === 'Yes') byMonth[key].conversions++
    byMonth[key].premiumVolume += c.selectedPlanPremium ?? 0
  })
  return Object.entries(byMonth).sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v)
}

function buildLeadsBySource(contacts: Contact[]): LeadsBySource[] {
  const bySource: Record<string, { leads: number; converted: number }> = {}
  contacts.forEach(c => {
    const source = c.utmSource || 'direct'
    if (!bySource[source]) bySource[source] = { leads: 0, converted: 0 }
    bySource[source].leads++
    if (c.converted === 'Yes') bySource[source].converted++
  })
  return Object.entries(bySource)
    .map(([source, { leads, converted }]) => ({
      source: source.charAt(0).toUpperCase() + source.slice(1),
      leads,
      converted,
      conversionRate: leads > 0 ? Math.round((converted / leads) * 100) : 0,
    }))
    .sort((a, b) => b.leads - a.leads)
}

function buildMetalLevels(contacts: Contact[]): PlanMetalLevel[] {
  const colors: Record<string, string> = { Bronze: '#FB923C', Silver: '#94A3B8', Gold: '#EAB308', Platinum: '#7C5CFC' }
  const counts: Record<string, number> = {}
  contacts.forEach(c => {
    if (c.converted !== 'Yes') return
    if (!c.selectedPlanMetalLevel) return
    counts[c.selectedPlanMetalLevel] = (counts[c.selectedPlanMetalLevel] ?? 0) + 1
  })
  return Object.entries(counts).map(([level, count]) => ({ level, count, color: colors[level] ?? '#4DA3FF' }))
}

function buildAgentPerformance(contacts: Contact[]): AgentPerformance[] {
  const byAgent: Record<string, { total: number; converted: number; premiums: number[] }> = {}
  contacts.forEach(c => {
    const agent = c.originalAssignedAgent || 'Unassigned'
    if (!byAgent[agent]) byAgent[agent] = { total: 0, converted: 0, premiums: [] }
    byAgent[agent].total++
    if (c.converted === 'Yes') byAgent[agent].converted++
    if (c.suggestedPlanPremium) byAgent[agent].premiums.push(c.suggestedPlanPremium)
  })
  return Object.entries(byAgent)
    .map(([agent, { total, converted, premiums }]) => ({
      agent,
      totalLeads: total,
      converted,
      conversionRate: total > 0 ? Math.round((converted / total) * 100) : 0,
      avgPremium: premiums.length > 0 ? Math.round(premiums.reduce((a, b) => a + b, 0) / premiums.length) : 0,
    }))
    .sort((a, b) => b.converted - a.converted)
}

function buildStateBreakdown(contacts: Contact[]): StateBreakdown[] {
  const byState: Record<string, { leads: number; converted: number }> = {}
  contacts.forEach(c => {
    if (!c.state) return
    if (!byState[c.state]) byState[c.state] = { leads: 0, converted: 0 }
    byState[c.state].leads++
    if (c.converted === 'Yes') byState[c.state].converted++
  })
  return Object.entries(byState)
    .map(([state, { leads, converted }]) => ({ state, leads, converted }))
    .sort((a, b) => b.leads - a.leads)
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function buildDashboardFromContacts(contacts: Contact[]): DashboardData {
  return {
    contacts,
    kpis: buildKPIs(contacts),
    monthlyTrend: buildMonthlyTrend(contacts),
    leadsBySource: buildLeadsBySource(contacts),
    metalLevels: buildMetalLevels(contacts),
    agentPerformance: buildAgentPerformance(contacts),
    stateBreakdown: buildStateBreakdown(contacts),
  }
}

export async function getDashboardData(dateRange: DateRange): Promise<DashboardData> {
  const contacts = await fetchContacts(dateRange)
  return buildDashboardFromContacts(contacts)
}
