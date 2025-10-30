import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'

export default async function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const authToken = cookieStore.get('auth-token')
  
  if (!authToken) {
    redirect('/auth/login')
  }

  // Mock user for demo
  const user = {
    id: 'user-mock',
    email: 'demo@shambascore.com',
    name: 'Demo Farmer',
    phone: '+254712345678',
    role: 'farmer' as const,
    createdAt: new Date()
  }

  return (
    <DashboardLayout user={user}>
      {children}
    </DashboardLayout>
  )
}