'use client'

import { useState } from 'react'
import { MessageSquare, Phone } from 'lucide-react'

interface MessageSenderProps {
  farmerId: string
  farmerName: string
  phone: string
}

export default function MessageSender({ farmerId, farmerName, phone }: MessageSenderProps) {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const sendSMS = async () => {
    setSending(true)
    try {
      await fetch('/api/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, message, farmerId })
      })
      alert('SMS sent successfully!')
      setMessage('')
    } catch (error) {
      alert('Failed to send SMS')
    } finally {
      setSending(false)
    }
  }

  const sendWhatsApp = async () => {
    setSending(true)
    try {
      await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, message, farmerId })
      })
      alert('WhatsApp message sent!')
      setMessage('')
    } catch (error) {
      alert('Failed to send WhatsApp')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="font-semibold mb-3">Send Message to {farmerName}</h3>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="w-full p-3 border rounded-lg mb-3 h-24 resize-none"
      />
      <div className="flex gap-2">
        <button
          onClick={sendSMS}
          disabled={!message.trim() || sending}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg"
        >
          <Phone className="w-4 h-4" />
          SMS
        </button>
        <button
          onClick={sendWhatsApp}
          disabled={!message.trim() || sending}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg"
        >
          <MessageSquare className="w-4 h-4" />
          WhatsApp
        </button>
      </div>
    </div>
  )
}