// src/routes/adminRoutes.js
const express = require('express')
const router = express.Router()
const { protect, admin } = require('../middleware/authMiddleware')
const {
  getAdminStats,
  getAllUsers,
  updateUser,
  deleteUser,
  createCharity,
  updateCharity,
  deleteCharity,
  getAnalytics,
} = require('../controllers/adminController')
const { adminAddScore, adminUpdateScore } = require('../controllers/scoreController')

// All admin routes require auth + admin role
router.use(protect, admin)

// Stats & analytics
router.get('/stats',              getAdminStats)
router.get('/analytics',          getAnalytics)

// User management
router.get('/users',              getAllUsers)
router.put('/users/:id',          updateUser)
router.delete('/users/:id',       deleteUser)

// Score management (admin editing user scores)
router.post('/users/:userId/scores',              adminAddScore)
router.put('/users/:userId/scores/:scoreId',      adminUpdateScore)

// Charity management
router.post('/charities',         createCharity)
router.put('/charities/:id',      updateCharity)
router.delete('/charities/:id',   deleteCharity)

module.exports = router