// backend/src/models/PrizePool.js
const mongoose = require('mongoose');

const prizePoolSchema = new mongoose.Schema({
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
  totalPoolAmount: {
    type: Number,
    required: true,
    default: 0
  },
  distribution: [{
    matchType: {
      type: String,
      enum: ['5-number-match', '4-number-match', '3-number-match']
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100
    },
    amount: Number,
    rollover: Boolean
  }],
  numberOfSubscribers: {
    type: Number,
    default: 0
  },
  charityContribution: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PrizePool', prizePoolSchema);
