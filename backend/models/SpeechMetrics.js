const mongoose = require('mongoose');

const speechMetricsSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Speech Quality
  pace: {
    type: Number,
    default: 0, // words per minute
  },
  paceScore: {
    type: Number,
    default: 0, // 0-100
  },
  clarity: {
    type: Number,
    default: 0, // 0-100
  },
  articulation: {
    type: Number,
    default: 0, // 0-100
  },
  
  // Speech Patterns
  fillers: {
    type: Number,
    default: 0, // count of "um", "uh", "like", etc.
  },
  pauseCount: {
    type: Number,
    default: 0,
  },
  averagePauseDuration: {
    type: Number,
    default: 0, // in seconds
  },
  
  // Voice Quality
  tone: {
    type: Number,
    default: 0, // 0-100
  },
  volume: {
    type: Number,
    default: 0, // average volume level
  },
  pitch: {
    type: Number,
    default: 0, // average pitch
  },
  
  // Vocal Variety
  intonation: {
    type: Number,
    default: 0, // 0-100
  },
  emphasis: {
    type: Number,
    default: 0, // 0-100
  },
  
  // Content
  completeness: {
    type: Number,
    default: 0, // 0-100
  },
  accuracy: {
    type: Number,
    default: 0, // 0-100
  },
  relevance: {
    type: Number,
    default: 0, // 0-100
  },
  
  // Overall
  overallScore: {
    type: Number,
    default: 0, // 0-100
  },
  
  // Detailed Insights
  insights: [{
    timestamp: Number,
    metric: String,
    value: Number,
    feedback: String,
  }],
  
  recommendations: [String],
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('SpeechMetrics', speechMetricsSchema);
