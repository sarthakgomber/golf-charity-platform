// src/services/drawEngineService.js
const Draw = require('../models/Draw')
const Winner = require('../models/Winner')
const PrizePool = require('../models/PrizePool')
const Score = require('../models/Score')
const User = require('../models/User')
const Subscription = require('../models/Subscription')
const { randomDraw, algorithmicDraw, checkMatches, getMatchTier } = require('../utils/drawAlgorithms')
const { calculateMonthlyPrizePool, buildPrizeBreakdown } = require('./prizeCalculationService')
const { sendDrawResults, sendWinnerNotification } = require('./emailService')

/**
 * Get all active subscribers with their scores
 */
const getActiveParticipants = async () => {
  // Find all users with active subscriptions
  const activeSubs = await Subscription.find({ status: 'active' }).select('user')
  const activeUserIds = activeSubs.map((s) => s.user)

  // Get their scores
  const scoresDocs = await Score.find({ user: { $in: activeUserIds } })

  return scoresDocs.map((doc) => ({
    userId: doc.user,
    scores: doc.scores.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5),
    scoreValues: doc.scores.slice(0, 5).map((s) => s.value),
  }))
}

/**
 * Simulate a draw (preview only — not saved to DB)
 * @param {'random'|'algorithmic'} mode
 */
const simulateDraw = async (mode = 'random') => {
  const participants = await getActiveParticipants()

  // Collect all score values for algorithmic weighting
  const allScoreValues = participants.flatMap((p) => p.scoreValues)

  // Generate winning numbers
  const winningNumbers =
    mode === 'algorithmic' ? algorithmicDraw(allScoreValues) : randomDraw()

  // Find matches
  const matchResults = participants
    .map((p) => {
      const matchCount = checkMatches(p.scoreValues, winningNumbers)
      const tier = getMatchTier(matchCount)
      return tier ? { userId: p.userId, matchCount, tier } : null
    })
    .filter(Boolean)

  const matchCounts = {
    jackpot: matchResults.filter((m) => m.tier === '5-number-match').length,
    fourMatch: matchResults.filter((m) => m.tier === '4-number-match').length,
    threeMatch: matchResults.filter((m) => m.tier === '3-number-match').length,
  }

  // Calculate prize pool
  const activeCount = participants.length
  const prizePool = calculateMonthlyPrizePool(activeCount)
  const breakdown = buildPrizeBreakdown(prizePool, matchCounts)

  return {
    winningNumbers,
    totalParticipants: participants.length,
    matchResults,
    matchCounts,
    prizePool: prizePool.totalPool,
    breakdown,
    mode,
  }
}

/**
 * Execute and publish the official monthly draw
 * @param {'random'|'algorithmic'} mode
 * @param {number} month 1-12
 * @param {number} year
 * @param {number} rolloverAmount - jackpot from previous month (pence)
 */
const executeDraw = async (mode = 'random', month, year, rolloverAmount = 0) => {
  // Check draw doesn't already exist for this month/year
  const existing = await Draw.findOne({ month, year, isPublished: true })
  if (existing) {
    throw new Error(`A published draw already exists for ${month}/${year}`)
  }

  const participants = await getActiveParticipants()
  const allScoreValues = participants.flatMap((p) => p.scoreValues)

  const winningNumbers =
    mode === 'algorithmic' ? algorithmicDraw(allScoreValues) : randomDraw()

  const activeCount = participants.length
  const prizePool = calculateMonthlyPrizePool(activeCount, rolloverAmount)
  const matchResults = participants
    .map((p) => {
      const matchCount = checkMatches(p.scoreValues, winningNumbers)
      const tier = getMatchTier(matchCount)
      return tier ? { userId: p.userId, matchCount, tier } : null
    })
    .filter(Boolean)

  const matchCounts = {
    jackpot: matchResults.filter((m) => m.tier === '5-number-match').length,
    fourMatch: matchResults.filter((m) => m.tier === '4-number-match').length,
    threeMatch: matchResults.filter((m) => m.tier === '3-number-match').length,
  }

  const breakdown = buildPrizeBreakdown(prizePool, matchCounts)

  // Create draw document
  const draw = await Draw.create({
    month,
    year,
    drawType: '5-number-match',
    winningNumbers,
    participants: participants.map((p) => ({
      user: p.userId,
      numbers: p.scoreValues,
      entryDate: new Date(),
    })),
    prizePool: prizePool.totalPool,
    rolloverAmount: breakdown.jackpot.rollsOver ? breakdown.jackpot.total : 0,
    isPublished: true,
  })

  // Create PrizePool document
  await PrizePool.create({
    month,
    year,
    totalPoolAmount: prizePool.totalPool,
    numberOfSubscribers: activeCount,
    distribution: [
      { matchType: '5-number-match', percentage: 40, amount: breakdown.jackpot.total, rollover: breakdown.jackpot.rollsOver },
      { matchType: '4-number-match', percentage: 35, amount: breakdown.fourMatch.total, rollover: false },
      { matchType: '3-number-match', percentage: 25, amount: breakdown.threeMatch.total, rollover: false },
    ],
  })

  // Create Winner documents and send notifications
  const winnerDocs = []
  for (const match of matchResults) {
    let prizeAmount = 0
    if (match.tier === '5-number-match') prizeAmount = breakdown.jackpot.perWinner
    if (match.tier === '4-number-match') prizeAmount = breakdown.fourMatch.perWinner
    if (match.tier === '3-number-match') prizeAmount = breakdown.threeMatch.perWinner

    if (prizeAmount > 0) {
      const winner = await Winner.create({
        draw: draw._id,
        user: match.userId,
        matchType: match.tier,
        prizeAmount: prizeAmount / 100, // store in £
        payoutStatus: 'pending',
      })
      winnerDocs.push(winner)

      // Send winner email
      const user = await User.findById(match.userId)
      if (user) {
        const monthName = new Date(year, month - 1).toLocaleString('en-GB', { month: 'long' })
        sendWinnerNotification(user, match.tier, prizeAmount / 100, `${monthName} ${year}`).catch(
          (e) => console.error('Winner email failed:', e.message)
        )
      }
    }
  }

  // Send draw results to all active users
  const activeUsers = await User.find({
    _id: { $in: participants.map((p) => p.userId) },
  })
  const monthName = new Date(year, month - 1).toLocaleString('en-GB', { month: 'long' })
  for (const user of activeUsers) {
    sendDrawResults(user, winningNumbers, monthName, year).catch(
      (e) => console.error('Draw results email failed:', e.message)
    )
  }

  return {
    draw,
    winningNumbers,
    totalParticipants: participants.length,
    winners: winnerDocs.length,
    matchCounts,
    breakdown,
    rolloverNextMonth: breakdown.jackpot.rollsOver ? breakdown.jackpot.total : 0,
  }
}

module.exports = { simulateDraw, executeDraw, getActiveParticipants }