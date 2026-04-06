// ─── Raw Contact Record ───────────────────────────────────────────────────────
// Mirrors your BigQuery/CRM schema exactly.
// All fields match your column headers (snake_cased for TypeScript).

export interface Contact {
  contactId: string
  firstName: string
  lastName: string
  phone: string
  email: string
  created: string               // ISO date
  lastActivity: string          // ISO date
  state: string
  householdSize: number | null
  existingPlanCarrier: string
  existingPlanPremium: number | null
  suggestedCarrier: string
  suggestedPlanName: string
  suggestedPlanEffectiveDate: string
  suggestedPlanPremium: number | null
  suggestedPlanGrossPremium: number | null
  digiBACAConvertedIdentifier: string
  salesTagsDropDown: string
  actionNeededItem: string
  primaryDMINonCoverage: string
  primaryDMICoverage: string
  sepOEUsedOnApplication: string
  customerApplicationId: string
  effectiveDate: string
  annualIncomeUsedOnApp: number | null
  householdSizeUsedOnApp: number | null
  selectedPlanIssuerName: string
  selectedPlanName: string
  selectedPlanPremiumWithCredit: number | null
  selectedPlanPremium: number | null
  submissionDate: string
  householdIncomeEst2026: number | null
  primaryDob: string
  primaryPostalCode: string
  primaryCounty: string
  deviceType: string
  primaryGender: string
  primaryUsCitizen: boolean | null
  currentInsurance: string
  spouseDateOfBirth: string
  householdSize2026: number | null
  medicaidOutreachCount: number
  status: string
  updated: string
  converted: 'Yes' | 'No' | ''
  resubmissionCount: number
  retentionAgent: string
  originalAssignedAgent: string
  originalRetentionAgent: string
  temporaryRetentionAgent: string
  pendingConversionDate: string
  dmiProofUploadedDate: string
  customerServiceAgent: string
  selectedPlanMetalLevel: string
  selectedPlanType: string
  primaryDobAge: number | null
  segment: string
  utmSource: string
  utmCampaign: string
  utmKeyword: string
  utmMatchtype: string
  utmMedium: string
  utmDevice: string
  utmLocation: string
  fbclid: string
  clickId: string
  gclickid: string
  campaignId: string
  adGroupId: string
  adId: string
  vendorSource: string
  dataVariant: string
  affsub: string
  affsub1: string
  affsub2: string
  affsub3: string
  subId: string
  utmGhl: string
  shortFormAttribution: string
  additionalServices: string
  companyName: string
  opportunities: string
  tldStatus: string
  postalCode: string
  sfFormReceived: string
  documentCollectionResolved: string
  outreachSentCount: number
  sfRemarketingResolved: string
  oePremiumIncrease25kResolved: string
  sfRemarketingInboundCall: string
  sfRemarketingTriggerLinkClicked: string
  documentCollectionFormReceived: string
  opportunityDistribution: string
}

// ─── Derived / Aggregated Types for Dashboard ────────────────────────────────

export interface KPIMetric {
  label: string
  value: string
  change: number
  changeLabel: string
  prefix?: string
  suffix?: string
}

export interface MonthlyTrend {
  month: string
  submissions: number
  conversions: number
  premiumVolume: number
}

export interface LeadsBySource {
  source: string
  leads: number
  converted: number
  conversionRate: number
}

export interface PlanMetalLevel {
  level: string
  count: number
  color: string
}

export interface AgentPerformance {
  agent: string
  totalLeads: number
  converted: number
  conversionRate: number
  avgPremium: number
}

export interface StateBreakdown {
  state: string
  leads: number
  converted: number
}

export interface DashboardData {
  contacts: Contact[]
  kpis: KPIMetric[]
  monthlyTrend: MonthlyTrend[]
  leadsBySource: LeadsBySource[]
  metalLevels: PlanMetalLevel[]
  agentPerformance: AgentPerformance[]
  stateBreakdown: StateBreakdown[]
}

export type DateRange = '7d' | '30d' | '90d' | '12m' | 'ytd'
