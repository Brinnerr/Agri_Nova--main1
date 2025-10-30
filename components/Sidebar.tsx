'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  User, 
  TrendingUp, 
  Building2, 
  Shield, 
  Users, 
  Bot,
  Leaf,
  LogOut
} from 'lucide-react'
import Link from 'next/link'
import type { User as UserType } from '@/types'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  user: UserType
}

const navItems = [
  {
    id: 'profile',
    label: 'Farmer Profile',
    icon: User,
    href: '/dashboard',
    description: 'Personal Information'
  },
  {
    id: 'credit-score',
    label: 'Credit Score',
    icon: TrendingUp,
    href: '/dashboard/credit-score',
    description: 'Credit Rating and History'
  },
  {
    id: 'sacco',
    label: 'Sacco',
    icon: Building2,
    href: '/dashboard/sacco',
    description: 'Savings and Credit Co-op'
  },
  {
    id: 'insurance',
    label: 'Insurance',
    icon: Shield,
    href: '/dashboard/insurance',
    description: 'Crop and Life Coverage'
  },
  {
    id: 'community-chamas',
    label: 'Community Chamas',
    icon: Users,
    href: '/dashboard/chamas',
    description: 'Local Groups and Networks'
  },
  {
    id: 'ai-insights',
    label: 'AI Insights',
    icon: Bot,
    href: '/dashboard/ai-insights',
    description: 'Smart Farming Advice'
  },
  {
    id: 'shamba-score',
    label: 'Shamba Score',
    icon: TrendingUp,
    href: '/dashboard/shamba-score',
    description: 'Climate-Adaptive Credit Score'
  }
]

export default function Sidebar({ isOpen, onClose, user }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white shadow-xl z-50
          w-64 transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          border-r border-gray-200
          flex flex-col
        `}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <h2 className="text-lg font-bold text-green-800">ShambaScore</h2>
          </div>
          <p className="text-xs text-gray-600 mt-1">Farmer Dashboard</p>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2 mt-4 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${
                    isActive
                      ? 'bg-green-100 text-green-700 shadow-md border-2 border-green-300'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-2 border-transparent'
                  }
                  group
                `}
              >
                <Icon className="h-5 w-5" />
                <div className="flex-1 text-left">
                  <div className={`font-semibold ${isActive ? 'text-green-800' : 'text-gray-800'}`}>
                    {item.label}
                  </div>
                  <div className={`text-xs mt-0.5 ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
                    {item.description}
                  </div>
                </div>
                {isActive && (
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
          <div className="p-4 text-xs text-gray-500 text-center">
            <p className="font-semibold text-gray-700 mb-1">Need Help?</p>
            <p>Contact support for assistance</p>
          </div>
        </div>
      </aside>
    </>
  )
}