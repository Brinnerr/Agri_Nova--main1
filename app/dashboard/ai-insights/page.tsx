'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2 } from 'lucide-react'

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
}

export default function AIInsightsPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '🌾 Hello! I\'m your Shamba Score Assistant. I can help you understand your credit score, get loan recommendations, and provide improvement tips. Try asking "What is my score?" with your Farmer ID!',
      isBot: true,
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [farmerId, setFarmerId] = useState('FM0001')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          farmerId: farmerId
        })
      })

      const data = await response.json()

      if (data.success) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          isBot: true,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, botMessage])
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        isBot: true,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const quickQuestions = [
    "What is my score?",
    "How can I improve my score?",
    "What are my loan terms?",
    "Why is my score this way?"
  ]

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">🤖 Shamba Score Assistant</h1>
              <p className="text-sm text-gray-600">AI-powered farming and credit guidance</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Farmer ID:</label>
            <select 
              value={farmerId} 
              onChange={(e) => setFarmerId(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="FM0001">FM0001 (John Mwangi)</option>
              <option value="FM0002">FM0002 (James Kamau)</option>
              <option value="FM0008">FM0008 (Grace Wanjiku)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`flex items-start gap-2 max-w-3xl ${message.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.isBot ? 'bg-green-100' : 'bg-blue-100'
              }`}>
                {message.isBot ? (
                  <Bot className="w-5 h-5 text-green-600" />
                ) : (
                  <User className="w-5 h-5 text-blue-600" />
                )}
              </div>
              
              <div className={`px-4 py-2 rounded-lg ${
                message.isBot 
                  ? 'bg-white border border-gray-200 text-gray-800' 
                  : 'bg-blue-600 text-white'
              }`}>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.text}
                </div>
                <div className={`text-xs mt-1 ${
                  message.isBot ? 'text-gray-500' : 'text-blue-100'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-green-600" />
              </div>
              <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                  <span className="text-sm text-gray-600">Thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="mb-3">
          <p className="text-sm text-gray-600 mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(question)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about your Shamba Score..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      </div>
    </div>
  )
}