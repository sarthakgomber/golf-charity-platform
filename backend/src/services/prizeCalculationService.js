// src/services/prizeCalculationService.js
const env = require('../config/environment')

/**
 * Calculate how much of a subscription goes to prize pool vs charity
 * @param {number} subscriptionAmountPence - e.g. 999 for £9.99
 * @param {number} charityPercentage - 10-100
 */
const calculateContributions = (subscriptionAmountPence, charityPercentage = 10) => {
  const total = subscriptionAmountPence
  const charityAmount = Math.floor(total * (charityPercentage / 100))
  const prizePoolAmount = Math.floor(total * env.PRIZE_POOL_PERCENTAGE)
  const platformAmount = total - charityAmount - prizePoolAmount

  return {
    total,
    charityAmount,
    prizePoolAmount,
    platformAmount,
  }
}

/**
 * Calculate total prize pool for a given month
 * @param {number} activeSubscriberCount
 * @param {number} rolloverAmount - jackpot carried from previous month (pence)
 */
const calculateMonthlyPrizePool = (activeSubscriberCount, rolloverAmount = 0) => {
  const monthlyRevenue = activeSubscriberCount * env.MONTHLY_PRICE
  const poolFromSubs = Math.floor(monthlyRevenue * env.PRIZE_POOL_PERCENTAGE)
  const totalPool = poolFromSubs + rolloverAmount

  return {
    totalPool,
    poolFromSubs,
    rolloverAmount,
    distribution: {
      jackpot: Math.floor(totalPool * env.JACKPOT_SHARE),
      fourMatch: Math.floor(totalPool * env.FOUR_MATCH_SHARE),
      threeMatch: Math.floor(totalPool * env.THREE_MATCH_SHARE),
    },
  }
}

/**
 * Split a prize tier equally among multiple winners
 * @param {number} tierAmount - total pence for this tier
 * @param {number} winnerCount
 */
const splitPrize = (tierAmount, winnerCount) => {
  if (winnerCount === 0) return 0
  return Math.floor(tierAmount / winnerCount)
}

/**
 * Build full prize breakdown for a draw result
 * @param {object} pool - from calculateMonthlyPrizePool
 * @param {object} matchCounts - { jackpot: n, fourMatch: n, threeMatch: n }
 * @returns prize per winner per tier, and whether jackpot rolls over
 */
const buildPrizeBreakdown = (pool, matchCounts) => {
  const { distribution } = pool

  const jackpotWinners = matchCounts.jackpot || 0
  const fourMatchWinners = matchCounts.fourMatch || 0
  const threeMatchWinners = matchCounts.threeMatch || 0

  const jackpotRollsOver = jackpotWinners === 0
  const jackpotPerWinner = jackpotRollsOver ? 0 : splitPrize(distribution.jackpot, jackpotWinners)
  const fourMatchPerWinner = splitPrize(distribution.fourMatch, fourMatchWinners)
  const threeMatchPerWinner = splitPrize(distribution.threeMatch, threeMatchWinners)

  return {
    jackpot: {
      total: distribution.jackpot,
      winners: jackpotWinners,
      perWinner: jackpotPerWinner,
      rollsOver: jackpotRollsOver,
    },
    fourMatch: {
      total: distribution.fourMatch,
      winners: fourMatchWinners,
      perWinner: fourMatchPerWinner,
    },
    threeMatch: {
      total: distribution.threeMatch,
      winners: threeMatchWinners,
      perWinner: threeMatchPerWinner,
    },
  }
}

/**
 * Format pence to GBP string
 */
const formatGBP = (pence) => `£${(pence / 100).toFixed(2)}`

module.exports = {
  calculateContributions,
  calculateMonthlyPrizePool,
  splitPrize,
  buildPrizeBreakdown,
  formatGBP,
}