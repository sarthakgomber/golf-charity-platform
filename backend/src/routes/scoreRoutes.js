// src/routes/scoreRoutes.js
const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { admin } = require('../middleware/authMiddleware')
const { requireSubscription } = require('../middleware/subscriptionMiddleware')
const {
  getUserScores,
  addScore,
  adminUpdateScore,
  adminAddScore,
} = require('../controllers/scoreController')

// User routes — subscription required to add scores
router.get('/',                    protect, getUserScores)
router.post('/',                   protect, requireSubscription, addScore)

// Admin routes
router.post('/admin/:userId',      protect, admin, adminAddScore)
router.put('/:userId/:scoreId',    protect, admin, adminUpdateScore)

module.exports = router