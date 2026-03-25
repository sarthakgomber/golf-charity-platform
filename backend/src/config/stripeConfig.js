// src/config/stripeConfig.js
const Stripe = require('stripe')
const env = require('./environment')

if (!env.STRIPE_SECRET_KEY) {
  console.warn('⚠️  STRIPE_SECRET_KEY not set — payment features disabled')
}

const stripe = env.STRIPE_SECRET_KEY
  ? Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
  : null

module.exports = stripe