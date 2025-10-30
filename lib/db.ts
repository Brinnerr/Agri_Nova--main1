import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

export const sql = neon(process.env.DATABASE_URL)

// Database schema initialization
export async function initializeDatabase() {
  try {
    // Users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'farmer',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Farmers table
    await sql`
      CREATE TABLE IF NOT EXISTS farmers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        location VARCHAR(255) NOT NULL,
        farm_type VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Farm data table
    await sql`
      CREATE TABLE IF NOT EXISTS farm_data (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
        crop_type VARCHAR(100) NOT NULL,
        acreage DECIMAL(10,2) NOT NULL,
        yield_estimate DECIMAL(10,2) NOT NULL,
        annual_expenses DECIMAL(12,2) NOT NULL,
        rainfall VARCHAR(20) NOT NULL,
        soil_health VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Credit profiles table
    await sql`
      CREATE TABLE IF NOT EXISTS credit_profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
        loan_eligibility DECIMAL(12,2) NOT NULL,
        repayment_ability_score INTEGER NOT NULL,
        risk_score INTEGER NOT NULL,
        summary TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Insurance table
    await sql`
      CREATE TABLE IF NOT EXISTS insurance (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
        status VARCHAR(20) NOT NULL,
        provider VARCHAR(255),
        coverage DECIMAL(12,2),
        premium DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    // AI insights table
    await sql`
      CREATE TABLE IF NOT EXISTS ai_insights (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
        yield_advice TEXT NOT NULL,
        risk_advice TEXT NOT NULL,
        loan_advice TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Database initialization failed:', error)
    throw error
  }
}