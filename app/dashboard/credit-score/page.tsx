'use client'

import { useState } from 'react'
import { 
  TrendingUp, 
  RefreshCw
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
        <div className="flex-1 bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full ${colorClasses[color as keyof typeof colorClasses] || 'bg-gray-500'}`}
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
  <div className="flex items-center justify-between p-3 bg-white rounded border">
    <span className="text-sm text-gray-700">{action}</span>
    <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
      +{points} pts
    </span>
  </div>
)

export default function CreditScorePage() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Your Credit Score</h1>
              <p className="text-gray-600 mt-2">AI-powered credit scoring</p>
            </div>
            <button 
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Score
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Main Score Display */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border-2 border-green-300 p-8 text-center">
            <p className="text-sm text-gray-600 mb-2">YOUR SHAMBA SCORE</p>
            <div className="text-7xl font-bold text-green-600 mb-2">72</div>
            <div className="text-2xl text-gray-500 mb-4">/100</div>
            <div className="inline-block px-6 py-2 bg-green-600 text-white rounded-full font-bold text-lg mb-4">
              GOOD ⭐⭐⭐⭐☆
            </div>
            <p className="text-gray-700">You qualify for loans up to <strong className="text-green-600">KES 50,000</strong></p>
            <p className="text-sm text-gray-500 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Score Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-800 mb-4">📈 Score Breakdown</h3>
            <div className="space-y-4">
              <ScoreBar label="🌱 Crop Health" value={74} color="green" />
              <ScoreBar label="💰 Financial Behavior" value={82} color="blue" />
              <ScoreBar label="👥 Community Trust" value={70} color="purple" />
              <ScoreBar label="🌾 Farming Practices" value={60} color="orange" />
              <ScoreBar label="🌦️ Climate Resilience" value={42} color="red" />
            </div>
          </div>

          {/* Improvement Tips */}
          <div className="bg-yellow-50 rounded-xl border-2 border-yellow-300 p-6">
            <h3 className="font-bold text-yellow-900 mb-4">💡 How to Improve Your Score</h3>
            <div className="space-y-3">
              <ImprovementTip action="Join a Chama/Savings Group" points={10} />
              <ImprovementTip action="Use Agricultural Extension Services" points={5} />
              <ImprovementTip action="Increase Savings Rate to 40%" points={5} />
              <ImprovementTip action="Improve Crop Health" points={8} />
            </div>
            <div className="mt-4 p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Potential Score:</strong> <span className="text-2xl font-bold text-green-600">90.5/100</span> (Excellent!)
              </p>
            </div>
          </div>

          {/* Loan Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-800 mb-4">💰 Loan Eligibility</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Maximum Amount</span>
                  <span className="font-bold text-green-600">KES 50,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Interest Rate</span>
                  <span className="font-bold text-blue-600">14%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Approval Probability</span>
                  <span className="font-bold text-green-600">85%</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-medium">
                Apply for Loan
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-800 mb-4">📊 Score History</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">This Month</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">72</span>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Month</span>
                  <span className="font-bold">68</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">3 Months Ago</span>
                  <span className="font-bold">65</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-green-50 rounded">
                <p className="text-sm text-green-800">
                  📈 Your score has improved by <strong>7 points</strong> in the last 3 months!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}