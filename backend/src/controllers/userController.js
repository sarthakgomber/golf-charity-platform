// backend/src/controllers/userController.js
const User = require('../models/User');
const Score = require('../models/Score');
const Subscription = require('../models/Subscription');

// @desc    Get user dashboard data
// @route   GET /api/users/dashboard
// @access  Private
const getUserDashboard = async (req, res) => {
  try {
    // Get user data
    const user = await User.findById(req.user.id).populate('subscription').populate('selectedCharity');
    
    // Get user scores
    const scores = await Score.findOne({ user: req.user.id });
    
    // Get subscription status
    const subscription = user.subscription;
    
    res.json({
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        selectedCharity: user.selectedCharity,
        charityPercentage: user.charityPercentage
      },
      subscription: subscription ? {
        planType: subscription.planType,
        status: subscription.status,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        nextBillingDate: subscription.nextBillingDate
      } : null,
      scores: scores ? scores.scores : []
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const { name, email, charityId, charityPercentage } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (name) user.name = name;
    if (email) user.email = email;
    if (charityId) user.selectedCharity = charityId;
    if (charityPercentage) user.charityPercentage = charityPercentage;
    
    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      selectedCharity: updatedUser.selectedCharity,
      charityPercentage: updatedUser.charityPercentage
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserDashboard,
  updateUserProfile
};
