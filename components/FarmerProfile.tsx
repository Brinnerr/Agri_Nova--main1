'use client'

import { useState, useEffect } from 'react'
import { User, Phone, MapPin, Tractor } from 'lucide-react'
import type { Farmer } from '@/types'

interface FarmerProfileProps {
  userId: string
}

export default function FarmerProfile({ userId }: FarmerProfileProps) {
  const [farmer, setFarmer] = useState<Farmer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock farmer data for now
    setFarmer({
      id: '1',
      userId,
      name: 'John Kamau',
      phone: '+254712345678',
      location: 'Kiambu, Kenya',
      farmType: 'Mixed Farming',
      farmData: {
        cropType: 'Maize',
        acreage: 5,
        yieldEstimate: 2.5,
        annualExpenses: 150000,
        rainfall: 'Average',
        soilHealth: 'Good'
      },
      creditProfile: {
        loanEligibility: 200000,
        repaymentAbilityScore: 85,
        riskScore: 20
      },
      insurance: {
        status: 'Active'
      }
    })
    setLoading(false)
  }, [userId])

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
  }

  if (!farmer) {
    return <div className="text-center text-gray-500">No farmer profile found</div>
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{farmer.name}</h3>
            <p className="text-gray-600">{farmer.farmType}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-gray-500" />
            <span className="text-gray-700">{farmer.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-gray-500" />
            <span className="text-gray-700">{farmer.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tractor className="h-5 w-5 text-gray-500" />
            <span className="text-gray-700">{farmer.farmData.acreage} acres</span>
          </div>
        </div>
      </div>

      {/* Farm Data */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Farm Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Crop Type</label>
            <p className="text-gray-800">{farmer.farmData.cropType}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Yield Estimate</label>
            <p className="text-gray-800">{farmer.farmData.yieldEstimate} tons/acre</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Annual Expenses</label>
            <p className="text-gray-800">KES {farmer.farmData.annualExpenses.toLocaleString()}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Soil Health</label>
            <p className="text-gray-800">{farmer.farmData.soilHealth}</p>
          </div>
        </div>
      </div>

      {/* Credit Profile */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Credit Profile</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Loan Eligibility</p>
            <p className="text-2xl font-bold text-green-600">
              KES {farmer.creditProfile.loanEligibility.toLocaleString()}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Credit Score</p>
            <p className="text-2xl font-bold text-blue-600">
              {farmer.creditProfile.repaymentAbilityScore}/100
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Risk Score</p>
            <p className="text-2xl font-bold text-yellow-600">
              {farmer.creditProfile.riskScore}%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}