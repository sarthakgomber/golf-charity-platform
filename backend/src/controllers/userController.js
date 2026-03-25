// src/controllers/userController.js
const User = require('../models/User')
const Score = require('../models/Score')
const Winner = require('../models/Winner')
const Draw = require('../models/Draw')

// @desc    Get full user dashboard data
// @route   GET /api/users/dashboard
// @access  Private
const getUserDashboard = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('subscription', 'planType status startDate endDate nextBillingDate amount cancelAtPeriodEnd')
      .populate('selectedCharity', 'name description website logo totalContributions')

    // Scores
    const scoreDoc = await Score.findOne({ user: req.user.id })
    const scores = scoreDoc
      ? [...scoreDoc.scores]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5)
      : []

    // Winnings
    const winnings = await Winner.find({ user: req.user.id })
      .populate('draw', 'month year winningNumbers')
      .sort({ createdAt: -1 })
      .limit(10)

    const totalWon = winnings
      .filter((w) => w.payoutStatus === 'paid')
      .reduce((sum, w) => sum + w.prizeAmount, 0)

    // Draw participation count
    const drawsEntered = await Draw.countDocuments({
      isPublished: true,
      'participants.user': req.user.id,
    })

    // Next draw info (current month if no draw published yet, else next month)
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()
    const currentMonthDraw = await Draw.findOne({
      month: currentMonth,
      year: currentYear,
      isPublished: true,
    })

    const upcomingDraw = currentMonthDraw
      ? null
      : {
          month: currentMonth,
          year: currentYear,
          label: now.toLocaleString('en-GB', { month: 'long', year: 'numeric' }),
        }

    // Charity contribution this user has made
    const sub = user.subscription
    const charityContribution =
      sub && sub.status === 'active'
        ? (sub.amount / 100) * ((user.charityPercentage || 10) / 100)
        : 0

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        charityPercentage: user.charityPercentage,
        joinedAt: user.createdAt,
      },
      subscription: user.subscription || null,
      selectedCharity: user.selectedCharity || null,
      scores,
      draws: {
        entered: drawsEntered,
        upcoming: upcomingDraw,
      },
      winnings: {
        history: winnings,
        totalWon,
        totalWonFormatted: `£${totalWon.toFixed(2)}`,
        pending: winnings.filter((w) => w.payoutStatus === 'pending').length,
      },
      charity: {
        selected: user.selectedCharity,
        percentage: user.charityPercentage,
        estimatedMonthlyContribution: charityContribution.toFixed(2),
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body
    const user = await User.findById(req.user.id)

    if (name) user.name = name.trim()
    if (email) {
      // Check email not taken by another user
      const existing = await User.findOne({ email: email.toLowerCase(), _id: { $ne: user._id } })
      if (existing) return res.status(400).json({ message: 'Email already in use' })
      user.email = email.toLowerCase()
    }

    const updated = await user.save()
    res.json({
      message: 'Profile updated',
      user: { id: updated._id, name: updated.name, email: updated.email },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update charity preference
// @route   PUT /api/users/charity
// @access  Private
const updateCharity = async (req, res, next) => {
  try {
    const { charityId, charityPercentage } = req.body

    if (!charityId) return res.status(400).json({ message: 'Charity ID is required' })

    const pct = parseInt(charityPercentage)
    if (pct && (pct < 10 || pct > 100)) {
      return res.status(400).json({ message: 'Charity percentage must be between 10 and 100' })
    }

    const user = await User.findById(req.user.id)
    user.selectedCharity = charityId
    if (pct) user.charityPercentage = pct
    await user.save()

    const updated = await User.findById(req.user.id).populate(
      'selectedCharity',
      'name description website logo'
    )

    res.json({
      message: 'Charity preference updated',
      selectedCharity: updated.selectedCharity,
      charityPercentage: updated.charityPercentage,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Change password
// @route   PUT /api/users/password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new password are required' })
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters' })
    }

    const user = await User.findById(req.user.id).select('+password')
    const isMatch = await user.matchPassword(currentPassword)

    if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' })

    user.password = newPassword
    await user.save()

    res.json({ message: 'Password changed successfully' })
  } catch (error) {
    next(error)
  }
}

module.exports = { getUserDashboard, updateUserProfile, updateCharity, changePassword }