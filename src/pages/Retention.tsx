import { useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { Contact, RetentionIssue, RetentionContact } from '../types'

interface Props {
  contacts: Contact[]
}

const ISSUE_CONFIGS = [
  {
    key: 'documentCollection',
    label: 'Document Collection',
    resolved: (c: Contact) => c.documentCollectionResolved === 'true' || c.documentCollectionResolved === 'Yes',
    active:   (c: Contact) => c.documentCollectionOutreachSentCount > 0 || c.documentCollectionFormReceived !== '',
    outreach: (c: Contact) => c.documentCollectionOutreachSentCount,
    form:     (c: Contact) => c.documentCollectionFormReceived !== '' ? 1 : 0,
    inbound:  (c: Contact) => c.documentCollectionInboundCall === 'true' || c.documentCollectionInboundCall === 'Yes' ? 1 : 0,
  },
  {
    key: 'sfRemarketing',
    label: 'SF Remarketing',
    resolved: (c: Contact) => c.sfRemarketingResolved === 'true' || c.sfRemarketingResolved === 'Yes',
    active:   (c: Contact) => c.sfRemarketingOutreachSentCount > 0 || c.sfRemarketingFormReceived !== '',
    outreach: (c: Contact) => c.sfRemarketingOutreachSentCount,
    form:     (c: Contact) => c.sfRemarketingFormReceived !== '' ? 1 : 0,
    inbound:  (c: Contact) => c.sfRemarketingInboundCall === 'true' || c.sfRemarketingInboundCall === 'Yes' ? 1 : 0,
  },
  {
    key: 'landline',
    label: 'Landline',
    resolved: (c: Contact) => c.landlineResolved === 'true' || c.landlineResolved === 'Yes',
    active:   (c: Contact) => c.landlineOutreachSentCount > 0,
    outreach: (c: Contact) => c.landlineOutreachSentCount,
    form:     (c: Contact) => c.landlineFormReceived !== '' ? 1 : 0,
    inbound:  (c: Contact) => c.landlineInboundCall === 'true' || c.landlineInboundCall === 'Yes' ? 1 : 0,
  },
  {
    key: 'landerMismatch',
    label: 'Lander Mismatch',
    resolved: (c: Contact) => c.landerMismatchResolved === 'true' || c.landerMismatchResolved === 'Yes',
    active:   (c: Contact) => c.landerMismatchOutreachSentCount > 0,
    outreach: (c: Contact) => c.landerMismatchOutreachSentCount,
    form:     (_c: Contact) => 0,
    inbound:  (c: Contact) => c.landerMismatchInboundCall === 'true' || c.landerMismatchInboundCall === 'Yes' ? 1 : 0,
  },
  {
    key: 'cancelledClient',
    label: 'Cancelled Client',
    resolved: (c: Contact) => c.cancelledClientResolved === 'true' || c.cancelledClientResolved === 'Yes',
    active:   (c: Contact) => c.cancelledClientOutreachSentCount > 0,
    outreach: (c: Contact) => c.cancelledClientOutreachSentCount,
    form:     (c: Contact) => c.cancelledClientFormReceived !== '' ? 1 : 0,
    inbound:  (c: Contact) => c.cancelledClientInboundCall === 'true' || c.cancelledClientInboundCall === 'Yes' ? 1 : 0,
  },
  {
    key: 'qualification',
    label: 'Qualification',
    resolved: (c: Contact) => c.qualificationResolved === 'true' || c.qualificationResolved === 'Yes',
    active:   (c: Contact) => c.qualificationOutreachSentCount > 0,
    outreach: (c: Contact) => c.qualificationOutreachSentCount,
    form:     (c: Contact) => c.qualificationFormReceived !== '' ? 1 : 0,
    inbound:  (c: Contact) => c.qualificationInboundCall === 'true' || c.qualificationInboundCall === 'Yes' ? 1 : 0,
  },
  {
    key: 'dmi',
    label: 'DMI',
    resolved: (_c: Contact) => false,
    active:   (c: Contact) => c.dmiPostSaleOutreachSentCount > 0 || c.dmiPreSaleOutreachSentCount > 0,
    outreach: (c: Contact) => c.dmiPostSaleOutreachSentCount + c.dmiPreSaleOutreachSentCount,
    form:     (_c: Contact) => 0,
    inbound:  (_c: Contact) => 0,
  },
  {
    key: 'aorRecovery',
    label: 'AOR Recovery',
    resolved: (_c: Contact) => false,
    active:   (c: Contact) => c.aorRecoveryOutreachSentCount > 0,
    outreach: (c: Contact) => c.aorRecoveryOutreachSentCount,
    form:     (_c: Contact) => 0,
    inbound:  (_c: Contact) => 0,
  },
]

const STATUS_COLORS: Record<string, string> = {
  Active: '#22c55e',
  Enrolled: '#4DA3FF',
  Pending: '#eab308',
  Terminated: '#ef4444',
  Lapsed: '#f97316',
  Cancelled: '#ef4444',
  'Not Enrolled': '#94a3b8',
  'Grace Period': '#f97316',
}

export default function Retention({ contacts }: Props) {
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  const issues = useMemo<RetentionIssue[]>(() => {
    return ISSUE_CONFIGS.map(cfg => {
      const active = contacts.filter(cfg.active)
      const resolved = active.filter(cfg.resolved)
      return {
        category: cfg.label,
        total: active.length,
        resolved: resolved.length,
        outreachSent: active.reduce((s, c) => s + cfg.outreach(c), 0),
        formReceived: active.reduce((s, c) => s + cfg.form(c), 0),
        inboundCall: active.reduce((s, c) => s + cfg.inbound(c), 0),
        resolutionRate: active.length > 0 ? Math.round((resolved.length / active.length) * 100) : 0,
      }
    })
  }, [contacts])

  const retentionContacts = useMemo<RetentionContact[]>(() => {
    return contacts
      .map(c => {
        const issueLabels = ISSUE_CONFIGS
          .filter(cfg => cfg.active(c))
          .map(cfg => cfg.label)
        return {
          contactId: c.contactId,
          firstName: c.firstName,
          lastName: c.lastName,
          status: c.status,
          retentionAgent: c.retentionAgent || c.originalRetentionAgent || '—',
          issues: issueLabels,
          outreachSentCount: c.outreachSentCount,
          resubmissionCount: c.resubmissionCount,
        }
      })
      .filter(c => c.issues.length > 0)
  }, [contacts])

  const filtered = useMemo(() => {
    return retentionContacts.filter(c => {
      const matchesFilter = activeFilter === 'all' || c.issues.includes(activeFilter)
      const matchesSearch = search === '' ||
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        c.retentionAgent.toLowerCase().includes(search.toLowerCase())
      return matchesFilter && matchesSearch
    })
  }, [retentionContacts, activeFilter, search])

  const totalWithIssues = retentionContacts.length
  const totalResolved = issues.reduce((s, i) => s + i.resolved, 0)
  const totalIssues = issues.reduce((s, i) => s + i.total, 0)

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Retention</h1>
        <p className="text-text-secondary text-sm mt-0.5">Issue tracking and resolution across all retention categories</p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Contacts with Issues', value: totalWithIssues.toLocaleString() },
          { label: 'Total Issue Instances', value: totalIssues.toLocaleString() },
          { label: 'Overall Resolution Rate', value: totalIssues > 0 ? `${Math.round((totalResolved / totalIssues) * 100)}%` : '—' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-bg-secondary border border-border-subtle rounded-2xl p-5">
            <p className="text-text-secondary text-sm">{kpi.label}</p>
            <p className="text-3xl font-bold text-text-primary mt-1">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Issue Summary Chart + Table */}
      <div className="grid grid-cols-2 gap-4">
        {/* Bar chart */}
        <div className="bg-bg-secondary border border-border-subtle rounded-2xl p-5">
          <h2 className="text-text-primary font-semibold mb-4">Issues by Category</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={issues} layout="vertical" margin={{ left: 10, right: 20 }}>
              <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis type="category" dataKey="category" tick={{ fill: '#94a3b8', fontSize: 11 }} width={120} />
              <Tooltip
                contentStyle={{ background: '#1e2433', border: '1px solid #2a3347', borderRadius: 8 }}
                labelStyle={{ color: '#f1f5f9' }}
                itemStyle={{ color: '#94a3b8' }}
              />
              <Bar dataKey="total" name="Total" radius={[0, 4, 4, 0]}>
                {issues.map((_, i) => <Cell key={i} fill="#4DA3FF" />)}
              </Bar>
              <Bar dataKey="resolved" name="Resolved" radius={[0, 4, 4, 0]}>
                {issues.map((_, i) => <Cell key={i} fill="#22c55e" />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Resolution rate table */}
        <div className="bg-bg-secondary border border-border-subtle rounded-2xl p-5">
          <h2 className="text-text-primary font-semibold mb-4">Resolution Rates</h2>
          <div className="space-y-3">
            {issues.map(issue => (
              <div key={issue.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-secondary">{issue.category}</span>
                  <span className="text-text-primary font-medium">{issue.resolutionRate}%</span>
                </div>
                <div className="h-1.5 bg-bg-hover rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent-purple"
                    style={{ width: `${issue.resolutionRate}%` }}
                  />
                </div>
                <div className="flex gap-4 text-xs text-text-muted mt-0.5">
                  <span>{issue.total} total</span>
                  <span>{issue.outreachSent} outreach</span>
                  <span>{issue.formReceived} forms</span>
                  <span>{issue.inboundCall} calls</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-bg-secondary border border-border-subtle rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4 gap-4">
          <h2 className="text-text-primary font-semibold">Contacts with Open Issues</h2>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search name or agent..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-bg-hover border border-border-subtle rounded-lg px-3 py-1.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-purple w-52"
            />
            <select
              value={activeFilter}
              onChange={e => setActiveFilter(e.target.value)}
              className="bg-bg-hover border border-border-subtle rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:border-accent-purple"
            >
              <option value="all">All Issues</option>
              {ISSUE_CONFIGS.map(cfg => (
                <option key={cfg.key} value={cfg.label}>{cfg.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle">
                {['Name', 'Status', 'Retention Agent', 'Issues', 'Outreach', 'Resubmissions'].map(h => (
                  <th key={h} className="text-left text-text-muted font-medium pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 100).map(c => (
                <tr key={c.contactId} className="border-b border-border-subtle/50 hover:bg-bg-hover transition-colors">
                  <td className="py-3 pr-4 text-text-primary font-medium">{c.firstName} {c.lastName}</td>
                  <td className="py-3 pr-4">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        color: STATUS_COLORS[c.status] ?? '#94a3b8',
                        background: (STATUS_COLORS[c.status] ?? '#94a3b8') + '22',
                      }}
                    >
                      {c.status || '—'}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-text-secondary">{c.retentionAgent}</td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap gap-1">
                      {c.issues.map(issue => (
                        <span key={issue} className="px-2 py-0.5 rounded-full text-xs bg-accent-purple/20 text-accent-purple-light">
                          {issue}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-text-secondary">{c.outreachSentCount}</td>
                  <td className="py-3 pr-4 text-text-secondary">{c.resubmissionCount}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-text-muted">No contacts found</td>
                </tr>
              )}
            </tbody>
          </table>
          {filtered.length > 100 && (
            <p className="text-text-muted text-xs mt-3">Showing 100 of {filtered.length} contacts</p>
          )}
        </div>
      </div>
    </div>
  )
}
