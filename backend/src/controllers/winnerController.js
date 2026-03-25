// src/controllers/winnerController.js
const Winner = require('../models/Winner')
const User = require('../models/User')
const { sendPayoutProcessed } = require('../services/emailService')

// @desc    Get all winners (admin)
// @route   GET /api/winners
// @access  Private/Admin
const getAllWinners = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query

    const filter = {}
    if (status) filter.payoutStatus = status

    const winners = await Winner.find(filter)
      .populate('user', 'name email')
      .populate('draw', 'month year winningNumbers')
      .populate('verifiedBy', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))

    const total = await Winner.countDocuments(filter)

    res.json({
      winners,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get current user's winnings
// @route   GET /api/winners/me
// @access  Private
const getMyWinnings = async (req, res, next) => {
  try {
    const winnings = await Winner.find({ user: req.user.id })
      .populate('draw', 'month year winningNumbers')
      .sort({ createdAt: -1 })

    const totalWon = winnings
      .filter((w) => w.payoutStatus === 'paid')
      .reduce((sum, w) => sum + w.prizeAmount, 0)

    res.json({
      winnings,
      totalWon,
      totalWonFormatted: `£${totalWon.toFixed(2)}`,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Submit proof of scores for a win
// @route   POST /api/winners/:id/proof
// @access  Private
const submitProof = async (req, res, next) => {
  try {
    const winner = await Winner.findById(req.params.id)

    if (!winner) return res.status(404).json({ message: 'Winner record not found' })
    if (winner.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }
    if (winner.proofSubmitted) {
      return res.status(400).json({ message: 'Proof already submitted' })
    }

    const { proofImageUrl } = req.body
    if (!proofImageUrl) {
      return res.status(400).json({ message: 'Proof image URL is required' })
    }

    winner.proofSubmitted = true
    winner.proofImage = proofImageUrl
    await winner.save()

    res.json({ message: 'Proof submitted successfully. An admin will review shortly.', winner })
  } catch (error) {
    next(error)
  }
}

// @desc    Verify a winner and approve payout (admin)
// @route   PUT /api/winners/:id/verify
// @access  Private/Admin
const verifyWinner = async (req, res, next) => {
  try {
    const { action, notes } = req.body // action: 'approve' | 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Action must be approve or reject' })
    }

    const winner = await Winner.findById(req.params.id).populate('user', 'name email')
    if (!winner) return res.status(404).json({ message: 'Winner record not found' })

    if (action === 'approve') {
      winner.payoutStatus = 'paid'
      winner.verifiedBy = req.user.id
      winner.verificationNotes = notes || 'Approved'
      await winner.save()

      // Send payout email
      sendPayoutProcessed(winner.user, winner.prizeAmount).catch(
        (e) => console.error('Payout email failed:', e.message)
      )

      return res.json({ message: 'Winner approved and payout marked as processed', winner })
    }

    // Reject — reset proof so they can resubmit or admin can investigate
    winner.payoutStatus = 'pending'
    winner.proofSubmitted = false
    winner.proofImage = null
    winner.verificationNotes = notes || 'Rejected — please resubmit proof'
    await winner.save()

    res.json({ message: 'Winner verification rejected', winner })
  } catch (error) {
    next(error)
  }
}

module.exports = { getAllWinners, getMyWinnings, submitProof, verifyWinner }