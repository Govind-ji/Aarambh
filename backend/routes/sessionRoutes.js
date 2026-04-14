const express = require('express');
const router = express.Router();
const {
  createSession,
  getSessions,
  getSessionById,
  startSession,
  pauseSession,
  resumeSession,
  completeSession,
  cancelSession,
  deleteSession,
  addSessionNote,
} = require('../controllers/sessionController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Session management
router.post('/', createSession);
router.get('/', getSessions);
router.get('/:id', getSessionById);

// Session status operations
router.put('/:id/start', startSession);
router.put('/:id/pause', pauseSession);
router.put('/:id/resume', resumeSession);
router.put('/:id/complete', completeSession);
router.put('/:id/cancel', cancelSession);

// Session management
router.delete('/:id', deleteSession);
router.post('/:id/notes', addSessionNote);

module.exports = router;
