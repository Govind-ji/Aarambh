const mongoose = require('mongoose');

const confidenceMetricsSchema = new mongoose.Schema({
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
  
  // Facial Metrics
  eyeContact: {
    type: Number,
    default: 0, // 0-100
  },
  facialExpressions: {
    type: Number,
    default: 0, // 0-100
  },
  smiling: {
    type: Number,
    default: 0, // percentage of time smiling
  },
  blinking: {
    type: Number,
    default: 0, // times per minute
  },
  
  // Body Language
  posture: {
    type: Number,
    default: 0, // 0-100
  },
  gestures: {
    type: Number,
    default: 0, // 0-100
  },
  handMovements: {
    type: Number,
    default: 0, // 0-100
  },
  fidgeting: {
    type: Number,
    default: 0, // 0-100 (lower is better)
  },
  movement: {
    type: Number,
    default: 0, // 0-100
  },
  
  // Behavioral
  responseTime: {
    type: Number,
    default: 0, // in seconds
  },
  nervousness: {
    type: Number,
    default: 0, // 0-100 (lower is better)
  },
  engagement: {
    type: Number,
    default: 0, // 0-100
  },
  
  // Emotional Intelligence
  empathy: {
    type: Number,
    default: 0, // 0-100
  },
  adaptability: {
    type: Number,
    default: 0, // 0-100
  },
  authenticity: {
    type: Number,
    default: 0, // 0-100
  },
  
  // Overall
  overallConfidenceScore: {
    type: Number,
    default: 0, // 0-100
  },
  
  // Time-based metrics
  metricsByTimestamp: [{
    timestamp: Number, // seconds elapsed
    eyeContact: Number,
    posture: Number,
    gestures: Number,
    nervousness: Number,
    engagement: Number,
  }],
  
  // Insights
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

module.exports = mongoose.model('ConfidenceMetrics', confidenceMetricsSchema);
