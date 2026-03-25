// src/middleware/subscriptionMiddleware.js
const User = require('../models/User')
const Subscription = require('../models/Subscription')

// Require an active subscription to access a route
const requireSubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('subscription')

    if (!user.subscription) {
      return res.status(403).json({
        message: 'Active subscription required',
        code: 'NO_SUBSCRIPTION',
      })
    }

    const sub = await Subscription.findById(user.subscription._id)

    if (!sub || sub.status !== 'active') {
      return res.status(403).json({
        message: 'Your subscription is inactive. Please renew to continue.',
        code: 'SUBSCRIPTION_INACTIVE',
        status: sub ? sub.status : 'none',
      })
    }

    // Attach subscription to request
    req.subscription = sub
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = { requireSubscription }