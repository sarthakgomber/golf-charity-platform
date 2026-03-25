// src/routes/userRoutes.js
const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const {
  getUserDashboard,
  updateUserProfile,
  updateCharity,
  changePassword,
} = require('../controllers/userController')

router.get('/dashboard', protect, getUserDashboard)
router.put('/profile',  protect, updateUserProfile)
router.put('/charity',  protect, updateCharity)
router.put('/password', protect, changePassword)

module.exports = router