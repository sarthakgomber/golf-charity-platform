// backend/src/models/Score.js
const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scores: [{
    value: {
      type: Number,
      required: true,
      min: 1,
      max: 45
    },
    date: {
      type: Date,
      required: true
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure we only keep the last 5 scores
scoreSchema.pre('save', function(next) {
  if (this.scores.length > 5) {
    // Sort by date descending and keep only the last 5
    this.scores.sort((a, b) => b.date - a.date);
    this.scores = this.scores.slice(0, 5);
  }
  next();
});

module.exports = mongoose.model('Score', scoreSchema);
