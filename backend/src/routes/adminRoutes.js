// backend/src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { 
  getAdminStats, 
  getAllUsers,
  createCharity
} = require('../controllers/adminController');

router.get('/stats', protect, admin, getAdminStats);
router.get('/users', protect, admin, getAllUsers);
router.post('/charities', protect, admin, createCharity);

module.exports = router;
