'use client'

// Helper Component
const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-gray-600">{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
)

export default function InsurancePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Insurance Coverage</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-bold text-gray-800"> Crop Insurance</h3>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
              Active
            </span>
          </div>
          <div className="space-y-3">
            <InfoItem label="Provider" value="ACRE Africa" />
            <InfoItem label="Coverage" value="KES 50,000" />
            <InfoItem label="Premium" value="KES 2,800/season" />
            <InfoItem label="Expires" value="Dec 31, 2025" />
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs font-semibold text-blue-800 mb-1">Covers:</p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-white px-2 py-1 rounded">Drought</span>
              <span className="text-xs bg-white px-2 py-1 rounded">Floods</span>
              <span className="text-xs bg-white px-2 py-1 rounded">Pests</span>
            </div>
          </div>
          <button className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700">
            Renew Policy
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-bold text-gray-800"> Life Insurance</h3>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
              Active
            </span>
          </div>
          <div className="space-y-3">
            <InfoItem label="Provider" value="CIC Insurance" />
            <InfoItem label="Coverage" value="KES 200,000" />
            <InfoItem label="Premium" value="KES 500/month" />
            <InfoItem label="Beneficiary" value="John Mwangi (Spouse)" />
          </div>
          <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
            View Policy
          </button>
        </div>
      </div>

      <div className="bg-green-50 rounded-xl border-2 border-green-300 p-6">
        <h3 className="font-bold text-green-900 mb-4">🌦️ Weather-Based Insurance Status</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Rainfall This Season</p>
            <p className="text-2xl font-bold text-green-600">420mm ✓</p>
            <p className="text-xs text-gray-500">Above trigger (300mm)</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Risk Level</p>
            <p className="text-2xl font-bold text-green-600">LOW 🟢</p>
            <p className="text-xs text-gray-500">No payout triggered</p>
          </div>
        </div>
      </div>

      {/* Claims Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800">📋 Claims History</h3>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
            File New Claim
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Recent Claim */}
          <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-bold text-gray-800">Drought Damage - Maize Crop</h4>
                <p className="text-sm text-gray-600">Claim #INS-2024-0892</p>
                <p className="text-sm text-gray-600">Filed: Sep 15, 2024</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                Paid ✓
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Claim Amount</p>
                <p className="font-bold text-green-600">KES 15,000</p>
              </div>
              <div>
                <p className="text-gray-600">Paid Amount</p>
                <p className="font-bold text-green-600">KES 15,000</p>
              </div>
              <div>
                <p className="text-gray-600">Payment Date</p>
                <p className="font-bold">Oct 2, 2024</p>
              </div>
            </div>
          </div>

          {/* Pending Claim */}
          <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-r-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-bold text-gray-800">Pest Damage - Bean Crop</h4>
                <p className="text-sm text-gray-600">Claim #INS-2024-1203</p>
                <p className="text-sm text-gray-600">Filed: Oct 28, 2024</p>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                Under Review
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Claim Amount</p>
                <p className="font-bold text-yellow-600">KES 8,500</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <p className="font-bold">Assessment Pending</p>
              </div>
              <div>
                <p className="text-gray-600">Expected</p>
                <p className="font-bold">Nov 15, 2024</p>
              </div>
            </div>
          </div>

          {/* Old Claim */}
          <div className="border-l-4 border-gray-400 bg-gray-50 p-4 rounded-r-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-bold text-gray-800">Flood Damage - Coffee Plants</h4>
                <p className="text-sm text-gray-600">Claim #INS-2023-0445</p>
                <p className="text-sm text-gray-600">Filed: Mar 10, 2023</p>
              </div>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                Closed
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Claim Amount</p>
                <p className="font-bold text-gray-600">KES 25,000</p>
              </div>
              <div>
                <p className="text-gray-600">Paid Amount</p>
                <p className="font-bold text-gray-600">KES 20,000</p>
              </div>
              <div>
                <p className="text-gray-600">Payment Date</p>
                <p className="font-bold">Apr 5, 2023</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Total Claims Paid:</strong> KES 35,000 | <strong>Success Rate:</strong> 100% | <strong>Avg Processing Time:</strong> 18 days
          </p>
        </div>
      </div>
    </div>
  )
}