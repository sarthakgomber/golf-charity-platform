// src/routes/subscriptionRoutes.js
const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const {
  createCheckout,
  getMySubscription,
  openPortal,
  stripeWebhook,
  cancelSubscription,
  getPlans,
} = require('../controllers/subscriptionController')

// Public
router.get('/plans', getPlans)

// Stripe webhook — raw body, no auth (Stripe signs it)
router.post('/webhook', stripeWebhook)

// Private
router.post('/checkout', protect, createCheckout)
router.get('/me',        protect, getMySubscription)
router.post('/portal',   protect, openPortal)
router.post('/cancel',   protect, cancelSubscription)

module.exports = router