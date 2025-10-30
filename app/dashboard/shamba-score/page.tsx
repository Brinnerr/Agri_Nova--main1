'use client'

import { useState, useEffect } from 'react'
import ShambaScoreCard from '@/components/ShambaScoreCard'
import { 
  TrendingUp, 
  Leaf, 
  Users, 
  DollarSign, 
  CloudRain,
  BarChart3,
  Info,
  RefreshCw
} from 'lucide-react'

// Mock farmer data - in real app, this would come from your database
const mockFarmerData = {
  farmer_id: "FM0001",
  name: "John Mwangi",
  county: "Kiambu",
  farm_size_acres: 4.5,
  
  // ML Model Features
  mean_ndvi: 0.75,
  ndvi_trend: 0.02,
  growing_season_match: 0.85,
  transaction_velocity: 45,
  savings_rate: 0.35,
  loan_repayment_history: 1.0,
  cooperative_endorsement: 4,
  chama_participation: 1,
  neighbor_vouches: 3,
  fertilizer_purchase_timing: 0.78,
  seed_quality_tier: 2,
  advisory_usage: 1,
  drought_exposure_index: 0.25,
  rainfall_deviation: -5.2,
  temperature_anomaly: 1.8
}

const featureCategories = [
  {
    title: "🛰️ Satellite Data",
    features: [
      { name: "Crop Health (NDVI)", value: mockFarmerData.mean_ndvi, format: (v: number) => (v * 100).toFixed(1) + '%' },
      { name: "Growth Trend", value: mockFarmerData.ndvi_trend, format: (v: number) => v > 0 ? `+${(v * 100).toFixed(1)}%` : `${(v * 100).toFixed(1)}%` },
      { name: "Season Alignment", value: mockFarmerData.growing_season_match, format: (v: number) => (v * 100).toFixed(1) + '%' }
    ]
  },
  {
    title: "💰 Financial Behavior",
    features: [
      { name: "Monthly Transactions", value: mockFarmerData.transaction_velocity, format: (v: number) => v.toString() },
      { name: "Savings Rate", value: mockFarmerData.savings_rate, format: (v: number) => (v * 100).toFixed(1) + '%' },
      { name: "Repayment History", value: mockFarmerData.loan_repayment_history, format: (v: number) => v === 1 ? 'Excellent' : v === 0.5 ? 'Good' : 'Poor' }
    ]
  },
  {
    title: "👥 Community Standing",
    features: [
      { name: "Cooperative Rating", value: mockFarmerData.cooperative_endorsement, format: (v: number) => `${v}/5 stars` },
      { name: "Chama Member", value: mockFarmerData.chama_participation, format: (v: number) => v ? 'Yes' : 'No' },
      { name: "Peer Vouches", value: mockFarmerData.neighbor_vouches, format: (v: number) => v.toString() }
    ]
  },
  {
    title: "🌱 Farm Management",
    features: [
      { name: "Input Timing", value: mockFarmerData.fertilizer_purchase_timing, format: (v: number) => (v * 100).toFixed(1) + '%' },
      { name: "Seed Quality", value: mockFarmerData.seed_quality_tier, format: (v: number) => `Tier ${v}` },
      { name: "Extension Services", value: mockFarmerData.advisory_usage, format: (v: number) => v ? 'Active' : 'None' }
    ]
  },
  {
    title: "🌦️ Climate Risk",
    features: [
      { name: "Drought Exposure", value: mockFarmerData.drought_exposure_index, format: (v: number) => (v * 100).toFixed(1) + '%' },
      { name: "Rainfall Deviation", value: mockFarmerData.rainfall_deviation, format: (v: number) => `${v.toFixed(1)}%` },
      { name: "Temperature Anomaly", value: mockFarmerData.temperature_anomaly, format: (v: number) => `+${v.toFixed(1)}°C` }
    ]
  }
]

export default function ShambaScorePage() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                🌾 Shamba Score Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                AI-powered credit scoring for {mockFarmerData.name}
              </p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Credit Score Card */}
          <div className="lg:col-span-1">
            <ShambaScoreCard 
              key={refreshKey}
              farmerData={mockFarmerData} 
              className="sticky top-6"
            />
          </div>

          {/* Feature Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            {/* Farmer Info */}
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Farmer Information
                </h3>
              </div>
              <div className="p-6 pt-0">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600">Name</div>
                    <div className="font-semibold">{mockFarmerData.name}</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-gray-600">County</div>
                    <div className="font-semibold">{mockFarmerData.county}</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-sm text-gray-600">Farm Size</div>
                    <div className="font-semibold">{mockFarmerData.farm_size_acres} acres</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-sm text-gray-600">ID</div>
                    <div className="font-semibold text-xs">{mockFarmerData.farmer_id}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Categories */}
            {featureCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-lg border shadow-sm">
                <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="text-lg font-semibold leading-none tracking-tight">{category.title}</h3>
                </div>
                <div className="p-6 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {category.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">{feature.name}</div>
                        <div className="font-semibold text-gray-900">
                          {feature.format(feature.value)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* How It Works */}
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  How Shamba Score Works
                </h3>
              </div>
              <div className="p-6 pt-0 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                    <h4 className="font-semibold text-blue-800 mb-2">🤖 AI-Powered Analysis</h4>
                    <p className="text-sm text-blue-700">
                      Our XGBoost model analyzes 15 key features to predict your creditworthiness
                      with 95.7% accuracy.
                    </p>
                  </div>
                  <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                    <h4 className="font-semibold text-green-800 mb-2">🌦️ Climate-Adaptive</h4>
                    <p className="text-sm text-green-700">
                      We separate climate risks from your farming performance to ensure fair scoring
                      regardless of weather conditions.
                    </p>
                  </div>
                  <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
                    <h4 className="font-semibold text-purple-800 mb-2">📊 Transparent Scoring</h4>
                    <p className="text-sm text-purple-700">
                      See exactly which factors contribute to your score and get personalized
                      recommendations for improvement.
                    </p>
                  </div>
                  <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                    <h4 className="font-semibold text-orange-800 mb-2">🚀 Real-Time Updates</h4>
                    <p className="text-sm text-orange-700">
                      Your score updates automatically as your farming practices, financial behavior,
                      and community standing improve.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}