import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { Contact, RetentionIssue } from '../types'

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


export default function Retention({ contacts }: Props) {
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

  const totalWithIssues = useMemo(
    () => contacts.filter(c => ISSUE_CONFIGS.some(cfg => cfg.active(c))).length,
    [contacts]
  )
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

    </div>
  )
}
