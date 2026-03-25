// backend/src/models/Charity.js
const mongoose = require('mongoose');

const charitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Charity name is required'],
    trim: true,
    maxlength: [100, 'Charity name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Charity description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  website: {
    type: String,
    match: [/^https?:\/\/.+\..+/, 'Please enter a valid URL']
  },
  logo: {
    type: String // URL to charity logo
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalContributions: {
    type: Number,
    default: 0
  },
  upcomingEvents: [{
    title: String,
    date: Date,
    description: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Charity', charitySchema);
