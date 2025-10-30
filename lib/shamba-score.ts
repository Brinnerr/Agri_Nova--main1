// Shamba Score AI Engine with Dummy Data
export interface FarmerData {
  farmer_id: string
  name: string
  location: string
  crop_type: string
  farm_size: number
  monthly_income: number
  mpesa_transactions: number
  savings_rate: number
  community_score: number
  climate_risk: number
}

export interface ShambaScoreResult {
  credit_score: number
  score_category: string
  climate_risk_score: number
  farmer_performance_score: number
  strengths: string[]
  improvements: string[]
  recommendations: {
    immediate: string[]
    financial_products: string[]
    climate_adaptation: string[]
  }
}

// Dummy farmers data
export const DUMMY_FARMERS: FarmerData[] = [
  {
    farmer_id: 'KE_001',
    name: 'John Kamau',
    location: 'Kiambu',
    crop_type: 'Maize',
    farm_size: 5,
    monthly_income: 25000,
    mpesa_transactions: 45,
    savings_rate: 0.15,
    community_score: 85,
    climate_risk: 30
  },
  {
    farmer_id: 'KE_002', 
    name: 'Mary Wanjiku',
    location: 'Nakuru',
    crop_type: 'Coffee',
    farm_size: 3,
    monthly_income: 18000,
    mpesa_transactions: 32,
    savings_rate: 0.22,
    community_score: 78,
    climate_risk: 45
  },
  {
    farmer_id: 'KE_003',
    name: 'Peter Ochieng',
    location: 'Kisumu', 
    crop_type: 'Sugarcane',
    farm_size: 8,
    monthly_income: 35000,
    mpesa_transactions: 52,
    savings_rate: 0.18,
    community_score: 92,
    climate_risk: 25
  }
]

export class ShambaScoreEngine {
  
  calculateCreditScore(farmer: FarmerData): ShambaScoreResult {
    // Base score calculation
    let baseScore = 400
    
    // Income factor (0-150 points)
    const incomeScore = Math.min(farmer.monthly_income / 500, 150)
    
    // M-Pesa activity (0-100 points)  
    const mpesaScore = Math.min(farmer.mpesa_transactions * 2, 100)
    
    // Savings behavior (0-100 points)
    const savingsScore = farmer.savings_rate * 500
    
    // Community trust (0-100 points)
    const communityScore = farmer.community_score
    
    // Farm productivity (0-50 points)
    const farmScore = farmer.farm_size * 8
    
    // Calculate farmer performance (independent of climate)
    const farmerPerformance = (incomeScore + mpesaScore + savingsScore + communityScore + farmScore) / 5
    
    // Climate risk adjustment
    const climateAdjustment = farmer.climate_risk * 0.8
    
    // Final credit score
    const creditScore = Math.max(300, Math.min(850, baseScore + farmerPerformance - climateAdjustment))
    
    return {
      credit_score: Math.round(creditScore),
      score_category: this.getScoreCategory(creditScore),
      climate_risk_score: farmer.climate_risk,
      farmer_performance_score: Math.round(farmerPerformance),
      strengths: this.identifyStrengths(farmer),
      improvements: this.identifyImprovements(farmer),
      recommendations: this.generateRecommendations(farmer, creditScore)
    }
  }
  
  private getScoreCategory(score: number): string {
    if (score >= 750) return 'Excellent'
    if (score >= 650) return 'Good' 
    if (score >= 550) return 'Fair'
    return 'Poor'
  }
  
  private identifyStrengths(farmer: FarmerData): string[] {
    const strengths = []
    
    if (farmer.community_score > 80) strengths.push('Strong community reputation')
    if (farmer.savings_rate > 0.2) strengths.push('Good savings discipline')
    if (farmer.mpesa_transactions > 40) strengths.push('Active financial transactions')
    if (farmer.farm_size > 5) strengths.push('Substantial farm size')
    
    return strengths.slice(0, 3)
  }
  
  private identifyImprovements(farmer: FarmerData): string[] {
    const improvements = []
    
    if (farmer.savings_rate < 0.15) improvements.push('Increase savings rate')
    if (farmer.mpesa_transactions < 30) improvements.push('More regular transactions')
    if (farmer.community_score < 70) improvements.push('Build community trust')
    if (farmer.climate_risk > 40) improvements.push('Climate risk mitigation')
    
    return improvements.slice(0, 3)
  }
  
  private generateRecommendations(farmer: FarmerData, score: number) {
    return {
      immediate: [
        farmer.savings_rate < 0.2 ? 'Set up automatic savings plan' : 'Maintain current savings',
        'Join local farmer cooperative',
        'Keep detailed farm records'
      ],
      financial_products: score >= 650 ? [
        'Premium agricultural loans (6-8% interest)',
        'Equipment financing available',
        'Crop insurance with favorable rates'
      ] : [
        'Standard agricultural loans (9-12% interest)', 
        'Basic savings account',
        'Micro-credit options'
      ],
      climate_adaptation: farmer.climate_risk > 35 ? [
        'Drought-resistant crop varieties',
        'Water conservation systems',
        'Climate-smart agriculture training'
      ] : [
        'Maintain current practices',
        'Monitor weather patterns',
        'Consider crop diversification'
      ]
    }
  }
}