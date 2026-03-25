// src/routes/drawRoutes.js
const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { admin } = require('../middleware/authMiddleware')
const {
  simulate,
  execute,
  getAllDraws,
  getDrawByMonth,
  getMyDrawHistory,
} = require('../controllers/drawController')

// Public
router.get('/',              getAllDraws)
router.get('/:year/:month',  getDrawByMonth)

// Private (user)
router.get('/my-history',    protect, getMyDrawHistory)

// Admin only
router.post('/simulate',     protect, admin, simulate)
router.post('/execute',      protect, admin, execute)

module.exports = router