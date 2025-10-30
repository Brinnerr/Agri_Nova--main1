import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { phone, message, farmerId } = await request.json()
    
    // Mock WhatsApp for demo - replace with Twilio WhatsApp API in production
    console.log(`WhatsApp to ${phone}: ${message}`)
    
    return NextResponse.json({
      success: true,
      message: 'WhatsApp message sent successfully',
      phone,
      farmerId
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to send WhatsApp message'
    }, { status: 500 })
  }
}