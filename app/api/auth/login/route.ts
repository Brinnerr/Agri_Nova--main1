import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Mock login (accept any email/password)
    const mockUser = {
      id: 'user-mock',
      email,
      name: 'Demo Farmer',
      phone: '+254712345678',
      role: 'farmer'
    }

    // Set mock auth cookie
    const cookieStore = await cookies()
    cookieStore.set('auth-token', 'mock-token-' + mockUser.id, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({
      success: true,
      user: mockUser
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}