const mongoose = require('mongoose');

const interviewQuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  
  category: {
    type: String,
    enum: ['technical', 'behavioral', 'system-design', 'general'],
    required: true,
  },
  
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  
  topic: {
    type: String,
    default: '',
  },
  
  expectedDuration: {
    type: Number,
    default: 180, // in seconds (3 minutes)
  },
  
  keywords: [String],
  
  suggestedAnswer: {
    type: String,
    default: '',
  },
  
  answerTemplate: {
    type: String,
    default: '',
  },
  
  evaluationCriteria: [{
    name: String,
    description: String,
    weight: Number,
  }],
  
  followUpQuestions: [{
    text: String,
    trigger: String, // condition for asking this follow-up
  }],
  
  sampleAnswers: [{
    quality: {
      type: String,
      enum: ['excellent', 'good', 'average', 'poor'],
    },
    text: String,
    explanation: String,
  }],
  
  difficulty_tags: [String],
  
  industry: [String],
  
  role: [String],
  
  isActive: {
    type: Boolean,
    default: true,
  },
  
  usageCount: {
    type: Number,
    default: 0,
  },
  
  averageScore: {
    type: Number,
    default: 0,
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  
  source: {
    type: String,
    enum: ['system', 'admin', 'user-contributed'],
    default: 'system',
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('InterviewQuestion', interviewQuestionSchema);
