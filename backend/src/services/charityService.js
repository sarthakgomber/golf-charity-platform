// src/services/charityService.js
const Charity = require('../models/Charity')
const User = require('../models/User')
const Subscription = require('../models/Subscription')
const { calculateContributions } = require('./prizeCalculationService')

/**
 * Record a charity contribution when a subscription payment succeeds
 */
const recordContribution = async (userId, subscriptionAmountPence) => {
  const user = await User.findById(userId).populate('selectedCharity')
  if (!user?.selectedCharity) return null

  const { charityAmount } = calculateContributions(
    subscriptionAmountPence,
    user.charityPercentage || 10
  )

  await Charity.findByIdAndUpdate(user.selectedCharity._id, {
    $inc: { totalContributions: charityAmount / 100 }, // store as £
  })

  return charityAmount
}

/**
 * Get total contributions breakdown by charity
 */
const getContributionStats = async () => {
  const charities = await Charity.find({ isActive: true })
    .select('name totalContributions')
    .sort({ totalContributions: -1 })

  return charities.map((c) => ({
    id: c._id,
    name: c.name,
    totalContributions: c.totalContributions,
    formatted: `£${c.totalContributions.toFixed(2)}`,
  }))
}

module.exports = { recordContribution, getContributionStats }