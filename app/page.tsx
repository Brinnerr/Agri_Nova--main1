'use client'

import { useState } from 'react'
import { Leaf, Users, TrendingUp, Shield } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-lime-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-green-800">ShambaScore</h1>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/login" className="px-4 py-2 text-green-700 hover:text-green-800">
              Sign In
            </Link>
            <Link href="/auth/register" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-extrabold text-green-900 mb-4">
            Welcome to ShambaScore
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Empowering Kenyan farmers with AI-powered insights, financial access, and smart farming solutions
          </p>
          <Link href="/auth/register" className="inline-block px-8 py-4 text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg">
            Start Your Journey
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <TrendingUp className="h-12 w-12 text-green-600 mb-4 mx-auto" />
            <h3 className="text-xl font-bold text-green-800 mb-3 text-center">AI-Powered Insights</h3>
            <p className="text-gray-600 text-center">
              Get personalized farming advice based on your crop type, soil health, and weather patterns
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <Shield className="h-12 w-12 text-green-600 mb-4 mx-auto" />
            <h3 className="text-xl font-bold text-green-800 mb-3 text-center">Credit Access</h3>
            <p className="text-gray-600 text-center">
              Upload your M-Pesa statements for instant credit scoring and loan eligibility assessment
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <Users className="h-12 w-12 text-green-600 mb-4 mx-auto" />
            <h3 className="text-xl font-bold text-green-800 mb-3 text-center">Community Network</h3>
            <p className="text-gray-600 text-center">
              Connect with local chamas, saccos, and farming communities for support and growth
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}