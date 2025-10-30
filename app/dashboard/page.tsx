import FarmerProfile from '@/components/FarmerProfile'
import ShambaScoreCard from '@/components/ShambaScoreCard'

export default function DashboardPage() {
  // Mock farmer data for Shamba Score
  const farmerData = {
    farmer_id: "FM0001",
    name: "Demo Farmer",
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

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Welcome, Demo Farmer!</h2>
        <p className="text-gray-600">Your personalized farm assistant dashboard</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile */}
        <div className="lg:col-span-2">
          <FarmerProfile userId="user-mock" />
        </div>
        
        {/* Shamba Score Card */}
        <div className="lg:col-span-1">
          <ShambaScoreCard farmerData={farmerData} className="sticky top-6" />
        </div>
      </div>
    </div>
  )
}