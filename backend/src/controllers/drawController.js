// src/controllers/drawController.js
const Draw = require('../models/Draw')
const { simulateDraw, executeDraw } = require('../services/drawEngineService')

// @desc    Simulate a draw (preview — admin only)
// @route   POST /api/draws/simulate
// @access  Private/Admin
const simulate = async (req, res, next) => {
  try {
    const { mode = 'random' } = req.body

    if (!['random', 'algorithmic'].includes(mode)) {
      return res.status(400).json({ message: 'Mode must be random or algorithmic' })
    }

    const result = await simulateDraw(mode)
    res.json({ simulation: result })
  } catch (error) {
    next(error)
  }
}

// @desc    Execute and publish official monthly draw
// @route   POST /api/draws/execute
// @access  Private/Admin
const execute = async (req, res, next) => {
  try {
    const { mode = 'random', month, year, rolloverAmount = 0 } = req.body

    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' })
    }
    if (month < 1 || month > 12) {
      return res.status(400).json({ message: 'Month must be between 1 and 12' })
    }

    const result = await executeDraw(mode, parseInt(month), parseInt(year), parseInt(rolloverAmount))

    res.status(201).json({
      message: 'Draw executed and published successfully',
      ...result,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all published draws
// @route   GET /api/draws
// @access  Public
const getAllDraws = async (req, res, next) => {
  try {
    const draws = await Draw.find({ isPublished: true })
      .select('month year winningNumbers prizePool rolloverAmount createdAt')
      .sort({ year: -1, month: -1 })
      .limit(12)

    res.json({ draws })
  } catch (error) {
    next(error)
  }
}

// @desc    Get draw by month/year
// @route   GET /api/draws/:year/:month
// @access  Public
const getDrawByMonth = async (req, res, next) => {
  try {
    const { year, month } = req.params

    const draw = await Draw.findOne({
      year: parseInt(year),
      month: parseInt(month),
      isPublished: true,
    }).populate('winners.user', 'name')

    if (!draw) {
      return res.status(404).json({ message: 'No draw found for this period' })
    }

    res.json({ draw })
  } catch (error) {
    next(error)
  }
}

// @desc    Get current user's draw participation history
// @route   GET /api/draws/my-history
// @access  Private
const getMyDrawHistory = async (req, res, next) => {
  try {
    const draws = await Draw.find({
      isPublished: true,
      'participants.user': req.user.id,
    })
      .select('month year winningNumbers prizePool participants.$')
      .sort({ year: -1, month: -1 })

    res.json({ draws })
  } catch (error) {
    next(error)
  }
}

module.exports = { simulate, execute, getAllDraws, getDrawByMonth, getMyDrawHistory }