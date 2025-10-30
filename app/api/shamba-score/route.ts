import { NextRequest, NextResponse } from 'next/server'

interface FarmerFeatures {
  mean_ndvi: number
  ndvi_trend: number
  growing_season_match: number
  transaction_velocity: number
  savings_rate: number
  loan_repayment_history: number
  cooperative_endorsement: number
  chama_participation: number
  neighbor_vouches: number
  fertilizer_purchase_timing: number
  seed_quality_tier: number
  advisory_usage: number
  drought_exposure_index: number
  rainfall_deviation: number
  temperature_anomaly: number
}

interface CreditScoreResponse {
  credit_score: number
  risk_category: string
  recommended_loan_amount: number
  interest_rate: number
  approval_probability: number
  top_contributing_factors: Array<{
    factor: string
    contribution: number
  }>
  improvement_suggestions: string[]
}

export async function POST(request: NextRequest) {
  try {
    const farmerData = await request.json()
    
    // Map farmer data to ML model features
    const features: FarmerFeatures = {
      mean_ndvi: farmerData.mean_ndvi || 0.65,
      ndvi_trend: farmerData.ndvi_trend || 0.01,
      growing_season_match: farmerData.growing_season_match || 0.75,
      transaction_velocity: farmerData.transaction_velocity || 35,
      savings_rate: farmerData.savings_rate || 0.25,
      loan_repayment_history: farmerData.loan_repayment_history || 0.5,
      cooperative_endorsement: farmerData.cooperative_endorsement || 3,
      chama_participation: farmerData.chama_participation || 0,
      neighbor_vouches: farmerData.neighbor_vouches || 2,
      fertilizer_purchase_timing: farmerData.fertilizer_purchase_timing || 0.65,
      seed_quality_tier: farmerData.seed_quality_tier || 2,
      advisory_usage: farmerData.advisory_usage || 0,
      drought_exposure_index: farmerData.drought_exposure_index || 0.25,
      rainfall_deviation: farmerData.rainfall_deviation || -5.0,
      temperature_anomaly: farmerData.temperature_anomaly || 2.0
    }

    // Call ML API (assuming it's running on localhost:8000)
    const mlApiUrl = process.env.ML_API_URL || 'http://localhost:8000'
    
    const response = await fetch(`${mlApiUrl}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(features)
    })

    if (!response.ok) {
      throw new Error(`ML API error: ${response.statusText}`)
    }

    const result: CreditScoreResponse = await response.json()
    
    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('Shamba Score API error:', error)
    
    // Return mock data if ML API is not available
    const mockResult: CreditScoreResponse = {
      credit_score: 72.5,
      risk_category: "Good",
      recommended_loan_amount: 75000,
      interest_rate: 14.0,
      approval_probability: 0.85,
      top_contributing_factors: [
        { factor: "Crop Health", contribution: 18.2 },
        { factor: "Repayment History", contribution: 15.0 },
        { factor: "Community Trust", contribution: 12.5 }
      ],
      improvement_suggestions: [
        "Join a savings group (chama) to gain +10 points",
        "Increase savings rate to 30%+ for +5 points"
      ]
    }

    return NextResponse.json({
      success: true,
      data: mockResult,
      mock: true
    })
  }
}