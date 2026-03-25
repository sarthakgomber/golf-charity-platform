// backend/src/controllers/scoreController.js
const Score = require('../models/Score');
const { scoreValidation } = require('../middleware/validationMiddleware');

// @desc    Get user scores
// @route   GET /api/scores
// @access  Private
const getUserScores = async (req, res) => {
  try {
    const scores = await Score.findOne({ user: req.user.id });
    
    if (!scores) {
      return res.json({ scores: [] });
    }
    
    // Sort scores by date descending (most recent first)
    const sortedScores = scores.scores.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.json({ scores: sortedScores });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add/update user scores
// @route   POST /api/scores
// @access  Private
const addUserScores = async (req, res) => {
  try {
    // Validate request body
    const { error } = scoreValidation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { scores } = req.body;
    
    // Find existing scores document or create new one
    let scoreDoc = await Score.findOne({ user: req.user.id });
    
    if (!scoreDoc) {
      // Create new scores document
      scoreDoc = new Score({
        user: req.user.id,
        scores: scores
      });
    } else {
      // Add new scores to existing document
      scoreDoc.scores.push(...scores);
    }
    
    // Save the document (pre-save hook will handle keeping only last 5)
    const savedScores = await scoreDoc.save();
    
    // Return sorted scores (most recent first)
    const sortedScores = savedScores.scores.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.status(201).json({ scores: sortedScores });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserScores,
  addUserScores
};
