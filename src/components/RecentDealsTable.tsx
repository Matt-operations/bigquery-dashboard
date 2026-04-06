import type { Contact } from '../types'

interface RecentLeadsTableProps {
  data: Contact[]
}

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  'Active':       { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  'DMI Pending':  { bg: 'bg-amber-500/10',   text: 'text-amber-400',   dot: 'bg-amber-400'   },
  'Pending DMI':  { bg: 'bg-amber-500/10',   text: 'text-amber-400',   dot: 'bg-amber-400'   },
  'Not Submitted':{ bg: 'bg-red-500/10',     text: 'text-red-400',     dot: 'bg-red-400'     },
}

const avatarColors = [
  'from-purple-500 to-blue-500','from-blue-500 to-teal-500',
  'from-teal-500 to-emerald-500','from-orange-500 to-pink-500','from-pink-500 to-purple-500',
]

export default function RecentDealsTable({ data }: RecentLeadsTableProps) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-semibold text-text-primary">Recent Leads</h2>
          <p className="text-xs text-text-muted mt-0.5">Latest contact activity</p>
        </div>
        <button className="text-xs text-accent-purple hover:text-accent-purple-light transition-colors font-medium">View all →</button>
      </div>

      <div className="space-y-1">
        {data.map((contact, i) => {
          const stage = statusStyles[contact.status] ?? { bg: 'bg-bg-hover', text: 'text-text-muted', dot: 'bg-text-muted' }
          const initials = `${contact.firstName[0]}${contact.lastName[0]}`
          const premium = contact.suggestedPlanPremium !== null ? `$${contact.suggestedPlanPremium}/mo` : '—'
          return (
            <div key={contact.contactId} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-bg-hover transition-colors">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0`}>
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{contact.firstName} {contact.lastName}</p>
                <p className="text-xs text-text-muted truncate">{contact.state} · {contact.segment || 'OE'}</p>
              </div>
              <span className={`hidden sm:flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1 rounded-md ${stage.bg} ${stage.text} whitespace-nowrap`}>
                <span className={`w-1.5 h-1.5 rounded-full ${stage.dot}`} />
                {contact.status}
              </span>
              <span className="text-sm font-bold text-text-primary whitespace-nowrap">{premium}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
