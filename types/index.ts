export interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: 'farmer' | 'partner'
  createdAt: Date
}

export interface Farmer {
  id: string
  userId: string
  name: string
  phone: string
  location: string
  farmType: string
  farmData: FarmData
  creditProfile: CreditProfile
  insurance: Insurance
  mpesaStatement?: MpesaStatement
  insights?: AIInsights
}

export interface FarmData {
  cropType: string
  acreage: number
  yieldEstimate: number
  annualExpenses: number
  rainfall: 'Low' | 'Average' | 'High'
  soilHealth: 'Poor' | 'Average' | 'Good'
}

export interface CreditProfile {
  loanEligibility: number
  repaymentAbilityScore: number
  riskScore: number
  summary?: string
}

export interface Insurance {
  status: 'Active' | 'Inactive'
  provider?: string
  coverage?: number
  premium?: number
}

export interface MpesaStatement {
  fileName: string
  uploadDate: string
  analysisResult?: CreditProfile
}

export interface AIInsights {
  yieldAdvice: string
  riskAdvice: string
  loanAdvice: string
  generatedAt: Date
}

export interface Chama {
  id: string
  name: string
  description: string
  memberCount: number
  monthlyContribution: number
  nextMeeting: Date
  category: string
}

export interface Sacco {
  id: string
  name: string
  savingsBalance: number
  loanLimit: number
  memberSince: Date
  interestRate: number
}