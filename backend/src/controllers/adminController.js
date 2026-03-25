// src/controllers/adminController.js
const User = require('../models/User')
const Charity = require('../models/Charity')
const Subscription = require('../models/Subscription')
const Draw = require('../models/Draw')
const Winner = require('../models/Winner')
const PrizePool = require('../models/PrizePool')
const Score = require('../models/Score')
const { getContributionStats } = require('../services/charityService')

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalCharities,
      activeSubscriptions,
      lapsedSubscriptions,
      totalWinners,
      pendingPayouts,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Charity.countDocuments({ isActive: true }),
      Subscription.countDocuments({ status: 'active' }),
      Subscription.countDocuments({ status: { $in: ['cancelled', 'past_due'] } }),
      Winner.countDocuments(),
      Winner.countDocuments({ payoutStatus: 'pending' }),
    ])

    // Revenue this month
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const activeSubs = await Subscription.find({ status: 'active' })
    const monthlyRevenue = activeSubs.reduce((sum, s) => {
      return sum + (s.planType === 'yearly' ? s.amount / 12 : s.amount)
    }, 0)

    // Prize pool this month
    const currentPool = await PrizePool.findOne({
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    })

    // Charity totals
    const charityStats = await getContributionStats()
    const totalCharityRaised = charityStats.reduce((sum, c) => sum + c.totalContributions, 0)

    // Last draw
    const lastDraw = await Draw.findOne({ isPublished: true }).sort({ year: -1, month: -1 })

    res.json({
      users: {
        total: totalUsers,
        active: activeSubscriptions,
        lapsed: lapsedSubscriptions,
      },
      revenue: {
        monthly: monthlyRevenue,
        monthlyFormatted: `£${(monthlyRevenue / 100).toFixed(2)}`,
      },
      prizePool: {
        current: currentPool ? currentPool.totalPoolAmount : 0,
        currentFormatted: currentPool
          ? `£${(currentPool.totalPoolAmount / 100).toFixed(2)}`
          : '£0.00',
      },
      charity: {
        totalRaised: totalCharityRaised,
        totalRaisedFormatted: `£${totalCharityRaised.toFixed(2)}`,
        totalCharities,
        breakdown: charityStats,
      },
      draws: {
        lastDraw: lastDraw
          ? { month: lastDraw.month, year: lastDraw.year, numbers: lastDraw.winningNumbers }
          : null,
      },
      winners: {
        total: totalWinners,
        pendingPayouts,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query

    const filter = { role: 'user' }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ]
    }

    const users = await User.find(filter)
      .select('-password')
      .populate('subscription', 'planType status endDate nextBillingDate amount')
      .populate('selectedCharity', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))

    // Attach scores to each user
    const usersWithScores = await Promise.all(
      users.map(async (user) => {
        const scoreDoc = await Score.findOne({ user: user._id })
        const scores = scoreDoc
          ? [...scoreDoc.scores]
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 5)
          : []
        return { ...user.toObject(), scores }
      })
    )

    const total = await User.countDocuments(filter)

    res.json({
      users: usersWithScores,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update user (admin)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res, next) => {
  try {
    const { name, email, isActive, role } = req.body
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    if (name) user.name = name
    if (email) user.email = email
    if (isActive !== undefined) user.isActive = isActive
    if (role && ['user', 'admin'].includes(role)) user.role = role

    await user.save()
    res.json({ message: 'User updated', user })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete user (admin)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete an admin account' })
    }

    // Soft delete — deactivate rather than remove
    user.isActive = false
    await user.save()

    res.json({ message: 'User deactivated successfully' })
  } catch (error) {
    next(error)
  }
}

// @desc    Create charity (admin)
// @route   POST /api/admin/charities
// @access  Private/Admin
const createCharity = async (req, res, next) => {
  try {
    const { name, description, website, logo, category } = req.body
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' })
    }

    const charity = await Charity.create({ name, description, website, logo, category })
    res.status(201).json({ message: 'Charity created', charity })
  } catch (error) {
    next(error)
  }
}

// @desc    Update charity (admin)
// @route   PUT /api/admin/charities/:id
// @access  Private/Admin
const updateCharity = async (req, res, next) => {
  try {
    const charity = await Charity.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    )
    if (!charity) return res.status(404).json({ message: 'Charity not found' })
    res.json({ message: 'Charity updated', charity })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete / deactivate charity (admin)
// @route   DELETE /api/admin/charities/:id
// @access  Private/Admin
const deleteCharity = async (req, res, next) => {
  try {
    const charity = await Charity.findById(req.params.id)
    if (!charity) return res.status(404).json({ message: 'Charity not found' })

    // Check if users are assigned to this charity
    const usersCount = await User.countDocuments({ selectedCharity: charity._id })
    if (usersCount > 0) {
      // Soft delete — deactivate instead
      charity.isActive = false
      await charity.save()
      return res.json({
        message: `Charity deactivated (${usersCount} users still assigned — reassign before deleting)`,
      })
    }

    await charity.deleteOne()
    res.json({ message: 'Charity deleted' })
  } catch (error) {
    next(error)
  }
}

// @desc    Get analytics report
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = async (req, res, next) => {
  try {
    // Monthly signups for last 6 months
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const signupsByMonth = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, role: 'user' } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ])

    // Draw stats
    const drawStats = await Draw.aggregate([
      { $match: { isPublished: true } },
      {
        $project: {
          month: 1, year: 1,
          winnerCount: { $size: '$winners' },
          participantCount: { $size: '$participants' },
          prizePool: 1,
        },
      },
      { $sort: { year: -1, month: -1 } },
      { $limit: 12 },
    ])

    // Subscription plan split
    const planSplit = await Subscription.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$planType', count: { $sum: 1 } } },
    ])

    const charityBreakdown = await getContributionStats()

    res.json({ signupsByMonth, drawStats, planSplit, charityBreakdown })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAdminStats,
  getAllUsers,
  updateUser,
  deleteUser,
  createCharity,
  updateCharity,
  deleteCharity,
  getAnalytics,
}