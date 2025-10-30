import { NextRequest, NextResponse } from 'next/server'

interface ChatMessage {
  message: string
  farmerId?: string
}

// Mock farmer data for demo
const mockFarmers = {
  'FM0001': { credit_score: 85.3, name: 'John Mwangi', chama_participation: 1, savings_rate: 0.35, loan_repayment_history: 1.0, cooperative_endorsement: 4, advisory_usage: 1, mean_ndvi: 0.75, drought_exposure_index: 0.25 },
  'FM0002': { credit_score: 60.3, name: 'James Kamau', chama_participation: 0, savings_rate: 0.136, loan_repayment_history: 0.5, cooperative_endorsement: 2, advisory_usage: 0, mean_ndvi: 0.404, drought_exposure_index: 0.03 },
  'FM0008': { credit_score: 100.0, name: 'Grace Wanjiku', chama_participation: 1, savings_rate: 0.237, loan_repayment_history: 1.0, cooperative_endorsement: 5, advisory_usage: 1, mean_ndvi: 0.655, drought_exposure_index: 0.021 }
}

function getScoreStatus(score: number) {
  if (score >= 90) return "Excellent Risk Profile"
  if (score >= 75) return "Very Good Risk Profile"
  if (score >= 60) return "Good Risk Profile"
  if (score >= 45) return "Moderate Risk Profile"
  return "High Risk Profile"
}

function getLoanTerms(score: number) {
  if (score >= 90) return { amount: 150000, rate: 10.5, probability: 98 }
  if (score >= 75) return { amount: 100000, rate: 12.0, probability: 95 }
  if (score >= 60) return { amount: 75000, rate: 14.0, probability: 88 }
  if (score >= 45) return { amount: 50000, rate: 16.5, probability: 75 }
  return { amount: 25000, rate: 20.0, probability: 45 }
}

function getImprovementSuggestions(farmer: any) {
  const suggestions = []
  
  if (farmer.chama_participation === 0) {
    suggestions.push("Join a savings group (chama) to improve community trust (+8-12 points)")
  }
  
  if (farmer.savings_rate < 0.3) {
    suggestions.push("Increase your savings rate to at least 30% of income (+5-8 points)")
  }
  
  if (farmer.advisory_usage === 0) {
    suggestions.push("Use agricultural extension services for better farming practices (+3-5 points)")
  }
  
  if (farmer.cooperative_endorsement < 4) {
    suggestions.push("Improve participation in farmer cooperatives (+4-7 points)")
  }
  
  if (farmer.loan_repayment_history < 0.8) {
    suggestions.push("Maintain consistent loan repayments to build credit history (+10-15 points)")
  }
  
  return suggestions
}

function processMessage(message: string, farmerId?: string): string {
  const lowerMessage = message.toLowerCase()
  
  // Greeting
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('help')) {
    return ` Hello! I'm your Shamba Score Assistant. I can help you with:

• Check your credit score
• Explain your score factors  
• Get loan recommendations
• Understand improvement tips

Try asking: "What is my score?" or "How can I improve my score?"`
  }
  
  // Score inquiry
  if (lowerMessage.includes('score') || lowerMessage.includes('rating')) {
    if (!farmerId || !mockFarmers[farmerId as keyof typeof mockFarmers]) {
      return "Please provide a valid Farmer ID (FM0001, FM0002, or FM0008) to check your score."
    }
    
    const farmer = mockFarmers[farmerId as keyof typeof mockFarmers]
    const score = farmer.credit_score
    const status = getScoreStatus(score)
    const terms = getLoanTerms(score)
    
    return `🧑🌾 Hello ${farmer.name}! Your current Shamba Score is **${score.toFixed(1)}**

📊 Status: **${status}**

💰 Loan Eligibility:
• Maximum Amount: KES ${terms.amount.toLocaleString()}
• Interest Rate: ${terms.rate}%
• Approval Probability: ${terms.probability}%

This score is based on your crop health, financial behavior, community standing, and farming practices.`
  }
  
  // Explanation inquiry
  if (lowerMessage.includes('why') || lowerMessage.includes('explain') || lowerMessage.includes('factors')) {
    if (!farmerId || !mockFarmers[farmerId as keyof typeof mockFarmers]) {
      return "Please provide a valid Farmer ID to get a detailed explanation of your score."
    }
    
    const farmer = mockFarmers[farmerId as keyof typeof mockFarmers]
    const score = farmer.credit_score
    
    let positiveFactors = []
    let negativeFactors = []
    
    if (farmer.mean_ndvi > 0.7) positiveFactors.push("Excellent crop health (NDVI)")
    else if (farmer.mean_ndvi < 0.4) negativeFactors.push("Poor crop health (NDVI)")
    
    if (farmer.savings_rate > 0.4) positiveFactors.push("High savings rate")
    else if (farmer.savings_rate < 0.2) negativeFactors.push("Low savings rate")
    
    if (farmer.loan_repayment_history >= 1.0) positiveFactors.push("Perfect repayment history")
    else if (farmer.loan_repayment_history < 0.5) negativeFactors.push("Poor repayment history")
    
    if (farmer.cooperative_endorsement >= 4) positiveFactors.push("Strong cooperative participation")
    else if (farmer.cooperative_endorsement <= 2) negativeFactors.push("Weak cooperative participation")
    
    return `🧑🌾 Your score of ${score.toFixed(1)} is influenced by:

✅ **Positive Factors:**
${positiveFactors.map(f => `• ${f}`).join('\n') || '• Basic farming practices'}

❌ **Areas for Improvement:**
${negativeFactors.map(f => `• ${f}`).join('\n') || '• Minor optimization opportunities'}

Focus on improving the negative factors to boost your score!`
  }
  
  // Improvement inquiry
  if (lowerMessage.includes('improve') || lowerMessage.includes('better') || lowerMessage.includes('increase')) {
    if (!farmerId || !mockFarmers[farmerId as keyof typeof mockFarmers]) {
      return "Please provide a valid Farmer ID to get personalized improvement suggestions."
    }
    
    const farmer = mockFarmers[farmerId as keyof typeof mockFarmers]
    const suggestions = getImprovementSuggestions(farmer)
    const currentScore = farmer.credit_score
    const potentialScore = Math.min(currentScore + 15, 100)
    
    return `💡 **How to Improve Your Score:**

${suggestions.map(s => `• ${s}`).join('\n')}

📈 **Potential Impact:**
Current Score: ${currentScore.toFixed(1)}
Potential Score: ${potentialScore.toFixed(1)} (${(potentialScore - currentScore).toFixed(1)} point increase)

Focus on 2-3 improvements for the best results!`
  }
  
  // Loan inquiry
  if (lowerMessage.includes('loan') || lowerMessage.includes('borrow') || lowerMessage.includes('credit')) {
    if (!farmerId || !mockFarmers[farmerId as keyof typeof mockFarmers]) {
      return "Please provide a valid Farmer ID to check your loan eligibility."
    }
    
    const farmer = mockFarmers[farmerId as keyof typeof mockFarmers]
    const score = farmer.credit_score
    const terms = getLoanTerms(score)
    const climate = farmer.drought_exposure_index
    
    let response = `💰 **Your Loan Terms:**

• Maximum Amount: KES ${terms.amount.toLocaleString()}
• Interest Rate: ${terms.rate}%
• Approval Probability: ${terms.probability}%`

    if (climate > 0.4) {
      response += `\n\n⚠️ **Climate Safeguard:** Due to high drought risk in your area, you may qualify for a 60-day grace period after harvest.`
    }
    
    return response
  }
  
  // Default response
  return `I can help you with your Shamba Score! Try asking:

• "What is my score?" (use Farmer ID: FM0001, FM0002, or FM0008)
• "Why is my score this way?"
• "How can I improve my score?"
• "What are my loan terms?"

What would you like to know?`
}

export async function POST(request: NextRequest) {
  try {
    const { message, farmerId }: ChatMessage = await request.json()
    
    const response = processMessage(message, farmerId)
    
    return NextResponse.json({
      success: true,
      response,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Chatbot API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process message'
    }, { status: 500 })
  }
}