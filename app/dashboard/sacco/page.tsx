'use client'

import { Star } from 'lucide-react'

export default function SaccoPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">SACCO Membership</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Kiambu Farmers SACCO</h2>
            <p className="text-gray-600">Member since March 2023</p>
            <p className="text-sm text-gray-500">Member No: KFS-2023-0234</p>
          </div>
          <div className="flex gap-1">
            {[1,2,3,4].map(i => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
            <Star className="w-5 h-5 text-gray-300" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Total Deposits</p>
            <p className="text-2xl font-bold text-blue-600">KES 85,400</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Current Balance</p>
            <p className="text-2xl font-bold text-green-600">KES 42,800</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Shares Owned</p>
            <p className="text-2xl font-bold text-purple-600">150 shares</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Savings Goal Progress</span>
            <span className="text-sm font-bold">KES 57,800 / KES 100,000</span>
          </div>
          <div className="bg-gray-200 rounded-full h-4">
            <div className="bg-green-500 h-4 rounded-full" style={{ width: '57.8%' }} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-gray-800 mb-4">📋 Active Loan</h3>
        <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="font-bold text-gray-800">Fertilizer Loan</h4>
              <p className="text-sm text-gray-600">Disbursed: Aug 15, 2025</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
              Up to Date ✓
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Original Amount</p>
              <p className="font-bold">KES 30,000</p>
            </div>
            <div>
              <p className="text-gray-600">Balance</p>
              <p className="font-bold">KES 18,200</p>
            </div>
            <div>
              <p className="text-gray-600">Next Payment</p>
              <p className="font-bold">Nov 15, 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}