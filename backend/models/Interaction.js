const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  input: {
    type: String,
    required: true
  },
  response: {
    type: String,
    required: true
  },
  feedback: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    default: 'neutral'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  sentimentScore: {
    type: Number,
    min: -1,
    max: 1,
    default: 0
  },
  responseStrategy: {
    type: Number,
    min: 0,
    max: 4
  }
});

// Index user interactions by user and timestamp for efficient queries
interactionSchema.index({ user: 1, timestamp: -1 });

module.exports = mongoose.model('Interaction', interactionSchema);
