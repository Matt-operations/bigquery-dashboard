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
  outreachSentCount: number
  opportunityDistribution: string

  // ─── Retention issue fields ───────────────────────────────────────────────
  // Document Collection
  documentCollectionResolved: string
  documentCollectionFormReceived: string
  documentCollectionResponseReceived: string
  documentCollectionTriggerLinkClicked: string
  documentCollectionInboundCall: string
  documentCollectionOutreachSentCount: number
  documentCollectionOutreachSentDate: string
  documentCollectionSplit: string

  // OE Premium Increase (excluded from Retention UI but kept for data completeness)
  oePremiumIncrease25kResolved: string

  // SF Remarketing
  sfRemarketingResolved: string
  sfRemarketingFormReceived: string
  sfRemarketingResponseReceived: string
  sfRemarketingTriggerLinkClicked: string
  sfRemarketingInboundCall: string
  sfRemarketingOutreachSentCount: number
  sfRemarketingOutreachSentDate: string
  sfRemarketingSplit: string
  sfOutreachSentCount: number
  sfOutreachSentDate: string
  sfSplit: string

  // Landline
  landlineResolved: string
  landlineFormReceived: string
  landlineResponseReceived: string
  landlineTriggerLinkClicked: string
  landlineInboundCall: string
  landlineOutreachSentCount: number
  landlineOutreachSentDate: string
  landlineSplit: string

  // Lander Mismatch
  landerMismatchResolved: string
  landerMismatchResponseReceived: string
  landerMismatchTriggerLinkClicked: string
  landerMismatchInboundCall: string
  landerMismatchOutreachSentCount: number
  landerMismatchOutreachSentDate: string
  landerMismatchSplit: string

  // Cancelled Client
  cancelledClientResolved: string
  cancelledClientFormReceived: string
  cancelledClientResponseReceived: string
  cancelledClientTriggerLinkClicked: string
  cancelledClientInboundCall: string
  cancelledClientOutreachSentCount: number
  cancelledClientOutreachSentDate: string
  cancelledClientOutreachSentDate2: string
  cancelledClientSplit: string

  // Qualification
  qualificationResolved: string
  qualificationFormReceived: string
  qualificationResponseReceived: string
  qualificationTriggerLinkClicked: string
  qualificationInboundCall: string
  qualificationOutreachSentCount: number
  qualificationOutreachSentDate: string
  qualificationSplit: string

  // DMI
  dmiPostSaleOutreachSentCount: number
  dmiPreSaleOutreachSentCount: number

  // AOR Recovery
  aorRecoveryOutreachSentCount: number

  // Misc retention
  medicaidRemarketing: string
  medicaidRemarketingOutreachSentCount: number
  premiumCollectionFormReceived: string
  premiumCollectionOutreachSentCount: number
  premiumCollectionOutreachSentDate: string
  premiumCollectionSplit: string
  assistedLinkOutreachSentCount: number
  updateSpouseDependentSsn: string
  oeUnpaidBinderOutreachSentCount: number
  otherPartyOutreachSentCount: number
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
  shortForms: number
  fullForms: number
  conversions: number
  sfConversions: number
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

export interface RetentionIssue {
  category: string
  total: number
  resolved: number
  outreachSent: number
  formReceived: number
  inboundCall: number
  resolutionRate: number
}

export interface RetentionContact {
  contactId: string
  firstName: string
  lastName: string
  status: string
  retentionAgent: string
  issues: string[]
  outreachSentCount: number
  resubmissionCount: number
}

export type DateRange = '7d' | '30d' | '90d' | '12m' | 'ytd'
