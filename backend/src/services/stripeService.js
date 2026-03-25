// src/services/stripeService.js
const stripe = require('../config/stripeConfig')
const Subscription = require('../models/Subscription')
const User = require('../models/User')
const env = require('../config/environment')
const { sendSubscriptionConfirmed } = require('./emailService')

/**
 * Create a Stripe Checkout session for new subscription
 */
const createCheckoutSession = async (userId, planType, charityId, charityPercentage) => {
  if (!stripe) throw new Error('Stripe is not configured')

  const user = await User.findById(userId)
  if (!user) throw new Error('User not found')

  const priceId =
    planType === 'yearly'
      ? env.STRIPE_YEARLY_PRICE_ID
      : env.STRIPE_MONTHLY_PRICE_ID

  if (!priceId) throw new Error(`Stripe price ID not configured for plan: ${planType}`)

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: user.email,
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: {
      userId: userId.toString(),
      planType,
      charityId: charityId.toString(),
      charityPercentage: charityPercentage.toString(),
    },
    success_url: `${env.FRONTEND_URL}/dashboard?subscription=success`,
    cancel_url: `${env.FRONTEND_URL}/subscribe?cancelled=true`,
  })

  return session
}

/**
 * Create a Stripe Customer Portal session (manage/cancel subscription)
 */
const createPortalSession = async (userId) => {
  if (!stripe) throw new Error('Stripe is not configured')

  const subscription = await Subscription.findOne({ user: userId })
  if (!subscription?.stripeCustomerId) {
    throw new Error('No Stripe customer found')
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${env.FRONTEND_URL}/dashboard`,
  })

  return session
}

/**
 * Handle Stripe webhook events
 */
const handleWebhookEvent = async (rawBody, signature) => {
  if (!stripe) throw new Error('Stripe is not configured')

  let event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    throw new Error(`Webhook signature verification failed: ${err.message}`)
  }

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object)
      break

    case 'invoice.paid':
      await handleInvoicePaid(event.data.object)
      break

    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object)
      break

    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object)
      break

    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object)
      break

    default:
      console.log(`Unhandled Stripe event: ${event.type}`)
  }

  return { received: true }
}

const handleCheckoutCompleted = async (session) => {
  const { userId, planType, charityId, charityPercentage } = session.metadata

  const stripeSubscription = await stripe.subscriptions.retrieve(session.subscription)

  const startDate = new Date(stripeSubscription.current_period_start * 1000)
  const endDate = new Date(stripeSubscription.current_period_end * 1000)
  const amount = planType === 'yearly' ? env.YEARLY_PRICE : env.MONTHLY_PRICE

  // Create or update subscription record
  let sub = await Subscription.findOne({ user: userId })
  if (sub) {
    sub.planType = planType
    sub.status = 'active'
    sub.stripeCustomerId = session.customer
    sub.stripeSubscriptionId = session.subscription
    sub.startDate = startDate
    sub.endDate = endDate
    sub.nextBillingDate = endDate
    sub.amount = amount
    sub.cancelAtPeriodEnd = false
    await sub.save()
  } else {
    sub = await Subscription.create({
      user: userId,
      planType,
      amount,
      status: 'active',
      stripeCustomerId: session.customer,
      stripeSubscriptionId: session.subscription,
      startDate,
      endDate,
      nextBillingDate: endDate,
    })
  }

  // Update user record
  await User.findByIdAndUpdate(userId, {
    subscription: sub._id,
    selectedCharity: charityId,
    charityPercentage: parseInt(charityPercentage),
  })

  // Send confirmation email
  const user = await User.findById(userId)
  if (user) {
    sendSubscriptionConfirmed(user, planType, amount, endDate).catch(
      (e) => console.error('Sub confirmation email failed:', e.message)
    )
  }
}

const handleInvoicePaid = async (invoice) => {
  const stripeSubId = invoice.subscription
  const sub = await Subscription.findOne({ stripeSubscriptionId: stripeSubId })
  if (!sub) return

  const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubId)
  sub.status = 'active'
  sub.endDate = new Date(stripeSubscription.current_period_end * 1000)
  sub.nextBillingDate = sub.endDate
  await sub.save()
}

const handlePaymentFailed = async (invoice) => {
  const sub = await Subscription.findOne({ stripeSubscriptionId: invoice.subscription })
  if (!sub) return
  sub.status = 'past_due'
  await sub.save()
}

const handleSubscriptionDeleted = async (stripeSubscription) => {
  const sub = await Subscription.findOne({
    stripeSubscriptionId: stripeSubscription.id,
  })
  if (!sub) return
  sub.status = 'cancelled'
  await sub.save()
}

const handleSubscriptionUpdated = async (stripeSubscription) => {
  const sub = await Subscription.findOne({
    stripeSubscriptionId: stripeSubscription.id,
  })
  if (!sub) return
  sub.cancelAtPeriodEnd = stripeSubscription.cancel_at_period_end
  if (stripeSubscription.status === 'active') sub.status = 'active'
  await sub.save()
}

module.exports = {
  createCheckoutSession,
  createPortalSession,
  handleWebhookEvent,
}