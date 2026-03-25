// backend/src/controllers/charityController.js
const Charity = require('../models/Charity');

// @desc    Get all active charities
// @route   GET /api/charities
// @access  Public
const getAllCharities = async (req, res) => {
  try {
    const charities = await Charity.find({ isActive: true }).sort({ name: 1 });
    res.json(charities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get charity by ID
// @route   GET /api/charities/:id
// @access  Public
const getCharityById = async (req, res) => {
  try {
    const charity = await Charity.findById(req.params.id);
    
    if (!charity) {
      return res.status(404).json({ message: 'Charity not found' });
    }
    
    res.json(charity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCharities,
  getCharityById
};
