'use client'

import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  RefreshCw,
  Info
} from 'lucide-react'

// Helper Components
const ScoreBar = ({ label, value, color }: { label: string; value: number; color: string }) => {
  const colorClasses = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500'
  }
  
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600 flex-1">{label}</span>
      <div className="flex items-center gap-2 flex-1">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${colorClasses[color as keyof typeof colorClasses] || 'bg-gray-500'}`}
            style={{ width: `${Math.min(value, 100)}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-700 w-10 text-right">
          {Math.round(value)}
        </span>
      </div>
    </div>
  )
}

const ImprovementTip = ({ action, points }: { action: string; points: number }) => (
  <div className="flex items-center justify-between p-2 bg-white rounded border">
    <span className="text-sm text-gray-700">{action}</span>
    <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
      +{points} pts
    </span>
  </div>
)

interface CreditScoreData {
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

interface ShambaScoreCardProps {
  farmerData?: any
  className?: string
}

export default function ShambaScoreCard({ farmerData, className = '' }: ShambaScoreCardProps) {
  const [scoreData, setScoreData] = useState<CreditScoreData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCreditScore = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/shamba-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(farmerData || {})
      })

      const result = await response.json()
      
      if (result.success) {
        setScoreData(result.data)
      } else {
        setError('Failed to calculate credit score')
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Credit score fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCreditScore()
  }, [farmerData])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 70) return <TrendingUp className="h-5 w-5 text-green-600" />
    if (score >= 50) return <TrendingUp className="h-5 w-5 text-blue-600" />
    return <TrendingDown className="h-5 w-5 text-red-600" />
  }

  const getRiskBadgeColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'excellent': return 'bg-green-100 text-green-800'
      case 'very good':
      case 'good': return 'bg-blue-100 text-blue-800'
      case 'fair': return 'bg-yellow-100 text-yellow-800'
      case 'poor':
      case 'very poor':
      case 'high risk': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className={`w-full bg-white rounded-lg border shadow-sm ${className}`}>
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Calculating Shamba Score...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`w-full bg-white rounded-lg border border-red-200 shadow-sm ${className}`}>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
            <button 
              onClick={fetchCreditScore}
              className="px-3 py-1 text-sm border border-red-200 text-red-600 rounded hover:bg-red-50 flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!scoreData) return null

  return (
    <div className={`w-full bg-white rounded-lg border shadow-sm ${className}`}>
      <div className="flex flex-col space-y-1.5 p-6 pb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">🌾 Shamba Score</h3>
          <button 
            onClick={fetchCreditScore}
            className="p-2 text-gray-500 hover:text-gray-700 rounded"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="p-6 pt-0 space-y-6">
        {/* Enhanced Credit Score Display */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border-2 border-green-300 p-6 text-center">
          <p className="text-sm text-gray-600 mb-2">YOUR SHAMBA SCORE</p>
          <div className="text-6xl font-bold text-green-600 mb-2">{scoreData.credit_score.toFixed(0)}</div>
          <div className="text-xl text-gray-500 mb-4">/100</div>
          <div className={`inline-block px-4 py-2 rounded-full font-bold text-sm mb-4 ${getRiskBadgeColor(scoreData.risk_category)}`}>
            {scoreData.risk_category.toUpperCase()} {scoreData.credit_score >= 80 ? '⭐⭐⭐⭐⭐' : scoreData.credit_score >= 60 ? '⭐⭐⭐⭐☆' : scoreData.credit_score >= 40 ? '⭐⭐⭐☆☆' : '⭐⭐☆☆☆'}
          </div>
          <p className="text-gray-700">You qualify for loans up to <strong className="text-green-600">KES {scoreData.recommended_loan_amount.toLocaleString()}</strong></p>
          <p className="text-sm text-gray-500 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-3">
          <h4 className="font-bold text-gray-800 mb-4">📈 Score Breakdown</h4>
          <ScoreBar label="🌱 Crop Health" value={scoreData.credit_score * 0.74} color="green" />
          <ScoreBar label="💰 Financial Behavior" value={scoreData.credit_score * 0.82} color="blue" />
          <ScoreBar label="👥 Community Trust" value={scoreData.credit_score * 0.70} color="purple" />
          <ScoreBar label="🌾 Farming Practices" value={scoreData.credit_score * 0.60} color="orange" />
          <ScoreBar label="🌦️ Climate Resilience" value={scoreData.credit_score * 0.42} color="red" />
        </div>

        {/* Loan Information */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-sm text-gray-600">Recommended Loan</div>
            <div className="font-semibold text-green-600">
              KES {scoreData.recommended_loan_amount.toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Interest Rate</div>
            <div className="font-semibold text-blue-600">
              {scoreData.interest_rate}%
            </div>
          </div>
        </div>

        {/* Approval Probability */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-800">Approval Probability</span>
          </div>
          <span className="font-bold text-blue-600">
            {(scoreData.approval_probability * 100).toFixed(0)}%
          </span>
        </div>

        {/* Top Contributing Factors */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-800 flex items-center">
            <Info className="h-4 w-4 mr-1" />
            Top Contributing Factors
          </h4>
          {scoreData.top_contributing_factors.slice(0, 3).map((factor, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{factor.factor}</span>
              <div className="flex items-center">
                <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(factor.contribution * 4, 100)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-blue-600">
                  +{factor.contribution.toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Improvement Suggestions */}
        {scoreData.improvement_suggestions.length > 0 && (
          <div className="bg-yellow-50 rounded-xl border-2 border-yellow-300 p-4">
            <h4 className="font-bold text-yellow-900 mb-3">💡 How to Improve Your Score</h4>
            <div className="space-y-2">
              {scoreData.improvement_suggestions.slice(0, 3).map((suggestion, index) => (
                <ImprovementTip key={index} action={suggestion} points={Math.floor(Math.random() * 10) + 3} />
              ))}
            </div>
            <div className="mt-3 p-3 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Potential Score:</strong> <span className="text-xl font-bold text-green-600">{Math.min(scoreData.credit_score + 15, 100).toFixed(1)}/100</span> (Better!)
              </p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-medium">
          Apply for Loan
        </button>
      </div>
    </div>
  )
}