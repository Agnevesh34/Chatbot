const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  mbti: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    required: true
  },
  personalityAnswers: {
    type: [Number],
    required: true
  },
  personalityTraits: {
    extraversion: Boolean,
    sensing: Boolean,
    thinking: Boolean,
    judging: Boolean
  },
  lastTrained: Date
});

module.exports = mongoose.model('User', userSchema);