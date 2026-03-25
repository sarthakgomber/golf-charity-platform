// src/controllers/scoreController.js
const Score = require('../models/Score')
const { validateScoreEntry, applyRollingScores } = require('../utils/scoreValidator')

// @desc    Get user's current scores
// @route   GET /api/scores
// @access  Private
const getUserScores = async (req, res, next) => {
  try {
    const scoreDoc = await Score.findOne({ user: req.user.id })

    if (!scoreDoc || scoreDoc.scores.length === 0) {
      return res.json({ scores: [], count: 0 })
    }

    // Sort by date descending (most recent first)
    const sorted = [...scoreDoc.scores].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )

    res.json({ scores: sorted, count: sorted.length })
  } catch (error) {
    next(error)
  }
}

// @desc    Add a new score (rolling 5-score logic)
// @route   POST /api/scores
// @access  Private (requires subscription)
const addScore = async (req, res, next) => {
  try {
    const { value, date } = req.body

    // Validate the new score entry
    const { valid, error } = validateScoreEntry({ value, date })
    if (!valid) {
      return res.status(400).json({ message: error })
    }

    const newEntry = { value: parseInt(value), date: new Date(date) }

    let scoreDoc = await Score.findOne({ user: req.user.id })

    if (!scoreDoc) {
      scoreDoc = new Score({ user: req.user.id, scores: [] })
    }

    // Apply rolling 5-score logic
    scoreDoc.scores = applyRollingScores(scoreDoc.scores, [newEntry])
    scoreDoc.lastUpdated = new Date()

    const saved = await scoreDoc.save()

    const sorted = [...saved.scores].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )

    res.status(201).json({
      message: 'Score added successfully',
      scores: sorted,
      count: sorted.length,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Admin: update a user's specific score entry
// @route   PUT /api/scores/:userId/:scoreId
// @access  Private/Admin
const adminUpdateScore = async (req, res, next) => {
  try {
    const { userId, scoreId } = req.params
    const { value, date } = req.body

    const { valid, error } = validateScoreEntry({ value, date })
    if (!valid) return res.status(400).json({ message: error })

    const scoreDoc = await Score.findOne({ user: userId })
    if (!scoreDoc) return res.status(404).json({ message: 'No scores found for this user' })

    const scoreEntry = scoreDoc.scores.id(scoreId)
    if (!scoreEntry) return res.status(404).json({ message: 'Score entry not found' })

    scoreEntry.value = parseInt(value)
    scoreEntry.date = new Date(date)
    await scoreDoc.save()

    res.json({ message: 'Score updated', scores: scoreDoc.scores })
  } catch (error) {
    next(error)
  }
}

// @desc    Admin: add score for a user
// @route   POST /api/scores/admin/:userId
// @access  Private/Admin
const adminAddScore = async (req, res, next) => {
  try {
    const { userId } = req.params
    const { value, date } = req.body

    const { valid, error } = validateScoreEntry({ value, date })
    if (!valid) return res.status(400).json({ message: error })

    const newEntry = { value: parseInt(value), date: new Date(date) }

    let scoreDoc = await Score.findOne({ user: userId })
    if (!scoreDoc) scoreDoc = new Score({ user: userId, scores: [] })

    scoreDoc.scores = applyRollingScores(scoreDoc.scores, [newEntry])
    scoreDoc.lastUpdated = new Date()
    await scoreDoc.save()

    res.status(201).json({ message: 'Score added', scores: scoreDoc.scores })
  } catch (error) {
    next(error)
  }
}

module.exports = { getUserScores, addScore, adminUpdateScore, adminAddScore }