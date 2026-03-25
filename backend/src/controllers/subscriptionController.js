// src/controllers/subscriptionController.js
const Subscription = require('../models/Subscription')
const User = require('../models/User')
const {
  createCheckoutSession,
  createPortalSession,
  handleWebhookEvent,
} = require('../services/stripeService')
const env = require('../config/environment')

// @desc    Create Stripe checkout session
// @route   POST /api/subscriptions/checkout
// @access  Private
const createCheckout = async (req, res, next) => {
  try {
    const { planType, charityId, charityPercentage } = req.body

    if (!planType || !['monthly', 'yearly'].includes(planType)) {
      return res.status(400).json({ message: 'Plan type must be monthly or yearly' })
    }
    if (!charityId) {
      return res.status(400).json({ message: 'Please select a charity' })
    }
    const pct = parseInt(charityPercentage)
    if (!pct || pct < 10 || pct > 100) {
      return res.status(400).json({ message: 'Charity percentage must be between 10 and 100' })
    }

    const session = await createCheckoutSession(req.user.id, planType, charityId, pct)

    res.json({ url: session.url, sessionId: session.id })
  } catch (error) {
    next(error)
  }
}

// @desc    Get current user subscription
// @route   GET /api/subscriptions/me
// @access  Private
const getMySubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('subscription')

    if (!user.subscription) {
      return res.json({ subscription: null })
    }

    res.json({ subscription: user.subscription })
  } catch (error) {
    next(error)
  }
}

// @desc    Open Stripe customer portal (manage/cancel)
// @route   POST /api/subscriptions/portal
// @access  Private
const openPortal = async (req, res, next) => {
  try {
    const session = await createPortalSession(req.user.id)
    res.json({ url: session.url })
  } catch (error) {
    next(error)
  }
}

// @desc    Stripe webhook handler
// @route   POST /api/subscriptions/webhook
// @access  Public (Stripe only)
const stripeWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['stripe-signature']
    if (!signature) {
      return res.status(400).json({ message: 'Missing stripe-signature header' })
    }

    const result = await handleWebhookEvent(req.body, signature)
    res.json(result)
  } catch (error) {
    console.error('Webhook error:', error.message)
    res.status(400).json({ message: error.message })
  }
}

// @desc    Cancel subscription at period end
// @route   POST /api/subscriptions/cancel
// @access  Private
const cancelSubscription = async (req, res, next) => {
  try {
    const session = await createPortalSession(req.user.id)
    // Redirect to Stripe portal for cancellation
    res.json({
      message: 'Redirecting to subscription management',
      url: session.url,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get subscription plans info
// @route   GET /api/subscriptions/plans
// @access  Public
const getPlans = async (req, res) => {
  res.json({
    plans: [
      {
        id: 'monthly',
        name: 'Monthly',
        price: env.MONTHLY_PRICE,
        priceFormatted: `£${(env.MONTHLY_PRICE / 100).toFixed(2)}`,
        period: 'month',
        stripePriceId: env.STRIPE_MONTHLY_PRICE_ID,
      },
      {
        id: 'yearly',
        name: 'Yearly',
        price: env.YEARLY_PRICE,
        priceFormatted: `£${(env.YEARLY_PRICE / 100).toFixed(2)}`,
        period: 'year',
        savingsPercent: Math.round(
          (1 - env.YEARLY_PRICE / (env.MONTHLY_PRICE * 12)) * 100
        ),
        stripePriceId: env.STRIPE_YEARLY_PRICE_ID,
      },
    ],
  })
}

module.exports = {
  createCheckout,
  getMySubscription,
  openPortal,
  stripeWebhook,
  cancelSubscription,
  getPlans,
}