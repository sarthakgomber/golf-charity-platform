// backend/src/models/Draw.js
const mongoose = require('mongoose');

const drawSchema = new mongoose.Schema({
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  drawType: {
    type: String,
    enum: ['5-number-match', '4-number-match', '3-number-match'],
    required: true
  },
  winningNumbers: [{
    type: Number,
    min: 1,
    max: 45
  }],
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    numbers: [Number],
    entryDate: Date
  }],
  winners: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    prizeAmount: Number,
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
    }
  }],
  prizePool: {
    type: Number,
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  rolloverAmount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Draw', drawSchema);
