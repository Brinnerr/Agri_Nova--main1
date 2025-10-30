import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Mock user creation (no database)
    const mockUser = {
      id: 'user-' + Date.now(),
      name,
      email,
      phone: phone || null,
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
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}