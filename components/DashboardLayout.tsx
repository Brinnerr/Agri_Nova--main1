'use client'

import { useState } from 'react'
import { User, Menu, X, Leaf } from 'lucide-react'
import Sidebar from './Sidebar'
import FloatingChatbot from './FloatingChatbot'
import type { User as UserType } from '@/types'

interface DashboardLayoutProps {
  children: React.ReactNode
  user: UserType
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top Bar (Mobile) */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-green-600" />
              <h2 className="text-lg font-bold text-gray-800">ShambaScore</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-gray-600" />
            <span className="text-sm text-gray-600">{user.name}</span>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
      
      {/* Floating Chatbot */}
      <FloatingChatbot />
    </div>
  )
}