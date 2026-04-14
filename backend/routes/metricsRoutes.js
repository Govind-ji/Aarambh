const express = require('express');
const router = express.Router();
const {
  updateSpeechMetrics,
  getSpeechMetrics,
  addSpeechInsight,
  updateConfidenceMetrics,
  getConfidenceMetrics,
  addConfidenceInsight,
  addConfidenceTimeline,
  getMetricsSummary,
} = require('../controllers/metricsController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Speech Metrics
router.post('/speech/:sessionId', updateSpeechMetrics);
router.get('/speech/:sessionId', getSpeechMetrics);
router.post('/speech/:sessionId/insights', addSpeechInsight);

// Confidence Metrics
router.post('/confidence/:sessionId', updateConfidenceMetrics);
router.get('/confidence/:sessionId', getConfidenceMetrics);
router.post('/confidence/:sessionId/insights', addConfidenceInsight);
router.post('/confidence/:sessionId/timeline', addConfidenceTimeline);

// Summary
router.get('/:sessionId/summary', getMetricsSummary);

module.exports = router;
