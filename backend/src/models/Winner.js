// backend/src/models/Winner.js
const mongoose = require('mongoose');

const winnerSchema = new mongoose.Schema({
  draw: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Draw',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  matchType: {
    type: String,
    enum: ['5-number-match', '4-number-match', '3-number-match'],
    required: true
  },
  prizeAmount: {
    type: Number,
    required: true
  },
  payoutStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  },
  proofSubmitted: {
    type: Boolean,
    default: false
  },
  proofImage: String,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verificationNotes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Winner', winnerSchema);
