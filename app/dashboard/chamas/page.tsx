'use client'

// Helper Component
const EndorsementCard = ({ name, relation, rating, comment }: { 
  name: string; 
  relation: string; 
  rating: number; 
  comment: string 
}) => (
  <div className="p-3 bg-gray-50 rounded-lg">
    <div className="flex items-center justify-between mb-2">
      <div>
        <p className="font-semibold text-gray-800">{name}</p>
        <p className="text-xs text-gray-600">{relation}</p>
      </div>
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
            ⭐
          </span>
        ))}
      </div>
    </div>
    <p className="text-sm text-gray-700 italic">"{comment}"</p>
  </div>
)

export default function ChamasPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Community Chamas</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-800 text-xl">Karai Women's Group</h3>
            <p className="text-sm text-gray-600">Active Member since Jan 2024</p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
            Excellent ⭐
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Monthly Contribution</p>
            <p className="text-xl font-bold text-blue-600">KES 1,500</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Total Saved</p>
            <p className="text-xl font-bold text-green-600">KES 22,500</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Next Payout</p>
            <p className="text-xl font-bold text-purple-600">Dec 2025</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Attendance Rate</span>
            <span className="font-bold">95%</span>
          </div>
          <div className="bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }} />
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700">
            View Activity
          </button>
          <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
            Message Group
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-gray-800 mb-4">🤝 Community Endorsements</h3>
        <div className="space-y-3">
          <EndorsementCard 
            name="Mary Njeri" 
            relation="Neighbor" 
            rating={5} 
            comment="Grace is reliable and hardworking" 
          />
          <EndorsementCard 
            name="Peter Kamau" 
            relation="Chama Member" 
            rating={5} 
            comment="Always pays on time, trustworthy" 
          />
          <EndorsementCard 
            name="Jane Wambui" 
            relation="Cooperative Chair" 
            rating={4} 
            comment="Good leader, helps other farmers" 
          />
        </div>
        <button className="w-full mt-4 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50">
          Request More Vouches
        </button>
      </div>
    </div>
  )
}