// src/config/environment.js
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'FRONTEND_URL',
]

const validateEnv = () => {
  const missing = requiredEnvVars.filter((key) => !process.env[key])
  if (missing.length > 0) {
    console.warn(`⚠️  Missing env vars: ${missing.join(', ')} — some features may not work`)
  }
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT) || 5000,

  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/golfcharity',

  // Auth
  JWT_SECRET: process.env.JWT_SECRET || 'dev_jwt_secret_change_in_production',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',

  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
  STRIPE_MONTHLY_PRICE_ID: process.env.STRIPE_MONTHLY_PRICE_ID || '',
  STRIPE_YEARLY_PRICE_ID: process.env.STRIPE_YEARLY_PRICE_ID || '',

  // Frontend
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Email (Nodemailer / SMTP)
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT) || 587,
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASS: process.env.EMAIL_PASS || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@parandpurpose.com',
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || 'Par & Purpose',

  // Subscription pricing (in pence/cents)
  MONTHLY_PRICE: parseInt(process.env.MONTHLY_PRICE) || 999,   // £9.99
  YEARLY_PRICE: parseInt(process.env.YEARLY_PRICE) || 8999,    // £89.99

  // Prize pool percentages
  PRIZE_POOL_PERCENTAGE: parseFloat(process.env.PRIZE_POOL_PERCENTAGE) || 0.60,
  CHARITY_MIN_PERCENTAGE: parseFloat(process.env.CHARITY_MIN_PERCENTAGE) || 0.10,

  // Draw distribution
  JACKPOT_SHARE: parseFloat(process.env.JACKPOT_SHARE) || 0.40,
  FOUR_MATCH_SHARE: parseFloat(process.env.FOUR_MATCH_SHARE) || 0.35,
  THREE_MATCH_SHARE: parseFloat(process.env.THREE_MATCH_SHARE) || 0.25,

  validateEnv,
}