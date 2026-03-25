// src/routes/winnerRoutes.js
const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { admin } = require('../middleware/authMiddleware')
const {
  getAllWinners,
  getMyWinnings,
  submitProof,
  verifyWinner,
} = require('../controllers/winnerController')

// Private (user)
router.get('/me',              protect, getMyWinnings)
router.post('/:id/proof',      protect, submitProof)

// Admin only
router.get('/',                protect, admin, getAllWinners)
router.put('/:id/verify',      protect, admin, verifyWinner)

module.exports = router