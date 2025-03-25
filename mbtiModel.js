// backend/models/mbtiModel.js
const mongoose = require('mongoose');

const mbtiSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Analysts', 'Diplomats', 'Sentinels', 'Explorers']
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  traits: {
    type: [String],
    required: true
  },
  famousExamples: [String],
  strengths: [String],
  weaknesses: [String]
});

module.exports = mongoose.model('MBTI', mbtiSchema);