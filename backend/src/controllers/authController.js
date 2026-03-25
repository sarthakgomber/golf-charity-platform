// src/controllers/authController.js
const User = require('../models/User')
const { generateToken } = require('../utils/tokenUtils')
const { sendWelcomeEmail } = require('../services/emailService')

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' })
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' })
    }

    const userExists = await User.findOne({ email: email.toLowerCase() })
    if (userExists) {
      return res.status(400).json({ message: 'An account with this email already exists' })
    }

    const user = await User.create({ name, email, password })

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user).catch((e) => console.error('Welcome email failed:', e.message))

    const token = generateToken({ id: user._id })

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Your account has been deactivated' })
    }

    const token = generateToken({ id: user._id })

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('selectedCharity', 'name description website logo')
      .populate('subscription', 'planType status endDate nextBillingDate')

    res.json(user)
  } catch (error) {
    next(error)
  }
}

module.exports = { registerUser, loginUser, getMe }