// backend/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getUserDashboard, updateUserProfile } = require('../controllers/userController');

router.get('/dashboard', protect, getUserDashboard);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
