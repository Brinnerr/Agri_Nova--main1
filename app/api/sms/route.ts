import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { phone, message, farmerId } = await request.json()
    
    // Mock SMS for demo - replace with Twilio in production
    console.log(`SMS to ${phone}: ${message}`)
    
    return NextResponse.json({
      success: true,
      message: 'SMS sent successfully',
      phone,
      farmerId
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to send SMS'
    }, { status: 500 })
  }
}