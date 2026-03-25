// backend/src/controllers/adminController.js
const User = require('../models/User');
const Charity = require('../models/Charity');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCharities = await Charity.countDocuments({ isActive: true });
    const activeSubscriptions = await User.countDocuments({ 
      subscription: { $exists: true, $ne: null } 
    });
    
    res.json({
      totalUsers,
      totalCharities,
      activeSubscriptions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new charity (admin)
// @route   POST /api/admin/charities
// @access  Private/Admin
const createCharity = async (req, res) => {
  try {
    const { name, description, website, logo } = req.body;
    
    const charity = new Charity({
      name,
      description,
      website,
      logo
    });
    
    const createdCharity = await charity.save();
    res.status(201).json(createdCharity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  createCharity
};
