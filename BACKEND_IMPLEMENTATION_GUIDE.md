# Backend Implementation Guide - Missing Endpoints

This guide provides ready-to-use code for all missing backend endpoints.

---

## 1️⃣ Question Management Endpoints

### Create Questions Controller
**File:** `backend/controllers/questionController.js`

```javascript
const InterviewQuestion = require('../models/InterviewQuestion');

// @desc    Get all questions
// @route   GET /api/questions
// @access  Public
exports.getAllQuestions = async (req, res) => {
  try {
    const { category, difficulty, limit = 10, page = 1 } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    const questions = await InterviewQuestion.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await InterviewQuestion.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: questions,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching questions',
      error: error.message,
    });
  }
};

// @desc    Get question by ID
// @route   GET /api/questions/:id
// @access  Public
exports.getQuestionById = async (req, res) => {
  try {
    const question = await InterviewQuestion.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching question',
      error: error.message,
    });
  }
};

// @desc    Get random questions for interview
// @route   GET /api/questions/random
// @access  Public
exports.getRandomQuestions = async (req, res) => {
  try {
    const { count = 5, category, difficulty } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    const questions = await InterviewQuestion.aggregate([
      { $match: filter },
      { $sample: { size: Number(count) } },
    ]);

    res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching random questions',
      error: error.message,
    });
  }
};

// @desc    Create question (Admin only)
// @route   POST /api/questions
// @access  Private/Admin
exports.createQuestion = async (req, res) => {
  try {
    const { question, category, difficulty, hints, expectedAnswer } = req.body;

    if (!question || !category || !difficulty) {
      return res.status(400).json({
        success: false,
        message: 'Please provide question, category, and difficulty',
      });
    }

    const newQuestion = await InterviewQuestion.create({
      question,
      category,
      difficulty,
      hints: hints || [],
      expectedAnswer: expectedAnswer || '',
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: newQuestion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating question',
      error: error.message,
    });
  }
};

// @desc    Update question (Admin only)
// @route   PUT /api/questions/:id
// @access  Private/Admin
exports.updateQuestion = async (req, res) => {
  try {
    const question = await InterviewQuestion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      data: question,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating question',
      error: error.message,
    });
  }
};

// @desc    Delete question (Admin only)
// @route   DELETE /api/questions/:id
// @access  Private/Admin
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await InterviewQuestion.findByIdAndDelete(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting question',
      error: error.message,
    });
  }
};

// @desc    Get available categories
// @route   GET /api/questions/categories/list
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await InterviewQuestion.distinct('category');

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message,
    });
  }
};

// @desc    Get available difficulties
// @route   GET /api/questions/difficulties/list
// @access  Public
exports.getDifficulties = async (req, res) => {
  try {
    const difficulties = await InterviewQuestion.distinct('difficulty');

    res.status(200).json({
      success: true,
      data: difficulties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching difficulties',
      error: error.message,
    });
  }
};
```

### Create Questions Routes
**File:** `backend/routes/questionRoutes.js`

```javascript
const express = require('express');
const router = express.Router();
const {
  getAllQuestions,
  getQuestionById,
  getRandomQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getCategories,
  getDifficulties,
} = require('../controllers/questionController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// Public routes
router.get('/categories/list', getCategories);
router.get('/difficulties/list', getDifficulties);
router.get('/random', getRandomQuestions);
router.get('/', getAllQuestions);
router.get('/:id', getQuestionById);

// Admin only routes
router.use(authMiddleware, adminMiddleware);
router.post('/', createQuestion);
router.put('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);

module.exports = router;
```

### Add to server.js
```javascript
const questionRoutes = require('./routes/questionRoutes');
app.use('/api/questions', questionRoutes);
```

---

## 2️⃣ Enhanced Metrics Endpoints

### Update metricsController.js
Add these functions to `backend/controllers/metricsController.js`:

```javascript
// @desc    Save speech metrics
// @route   POST /api/metrics/speech
// @access  Private
exports.saveSpeechMetrics = async (req, res) => {
  try {
    const { sessionId, wordsPerMinute, fillerWords, pauseCount, clarity, confidence } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'SessionId is required',
      });
    }

    const speechMetrics = new SpeechMetrics({
      sessionId,
      userId: req.user.id,
      wordsPerMinute,
      fillerWords,
      pauseCount,
      clarity,
      confidence,
    });

    await speechMetrics.save();

    res.status(201).json({
      success: true,
      message: 'Speech metrics saved',
      data: speechMetrics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error saving speech metrics',
      error: error.message,
    });
  }
};

// @desc    Save confidence metrics
// @route   POST /api/metrics/confidence
// @access  Private
exports.saveConfidenceMetrics = async (req, res) => {
  try {
    const { sessionId, eyeContact, posture, gesture, voiceStability, score } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'SessionId is required',
      });
    }

    const confidenceMetrics = new ConfidenceMetrics({
      sessionId,
      userId: req.user.id,
      eyeContact,
      posture,
      gesture,
      voiceStability,
      score,
    });

    await confidenceMetrics.save();

    res.status(201).json({
      success: true,
      message: 'Confidence metrics saved',
      data: confidenceMetrics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error saving confidence metrics',
      error: error.message,
    });
  }
};

// @desc    Get metrics for a session
// @route   GET /api/metrics/:sessionId
// @access  Private
exports.getSessionMetrics = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const speechMetrics = await SpeechMetrics.findOne({ sessionId });
    const confidenceMetrics = await ConfidenceMetrics.findOne({ sessionId });

    res.status(200).json({
      success: true,
      data: {
        speech: speechMetrics,
        confidence: confidenceMetrics,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching metrics',
      error: error.message,
    });
  }
};

// @desc    Get metrics summary for user
// @route   GET /api/metrics/summary
// @access  Private
exports.getMetricsSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get average metrics
    const speechStats = await SpeechMetrics.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          avgWPM: { $avg: '$wordsPerMinute' },
          avgClarity: { $avg: '$clarity' },
          avgConfidence: { $avg: '$confidence' },
          totalCount: { $sum: 1 },
        },
      },
    ]);

    const confidenceStats = await ConfidenceMetrics.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          avgEyeContact: { $avg: '$eyeContact' },
          avgPosture: { $avg: '$posture' },
          avgGesture: { $avg: '$gesture' },
          avgVoiceStability: { $avg: '$voiceStability' },
          avgScore: { $avg: '$score' },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        speech: speechStats[0] || {},
        confidence: confidenceStats[0] || {},
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching metrics summary',
      error: error.message,
    });
  }
};
```

---

## 3️⃣ Enhanced Report Endpoints

### Add to reportController.js

```javascript
// @desc    Get all reports for user
// @route   GET /api/reports
// @access  Private
exports.getUserReports = async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate } = req.query;
    let filter = { userId: req.user.id };

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const reports = await Report.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Report.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: reports,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reports',
      error: error.message,
    });
  }
};

// @desc    Get report details
// @route   GET /api/reports/:id
// @access  Private
exports.getReportDetails = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('sessionId')
      .populate('userId', 'firstName lastName email');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    // Get associated metrics
    const speechMetrics = await SpeechMetrics.findOne({ sessionId: report.sessionId });
    const confidenceMetrics = await ConfidenceMetrics.findOne({ sessionId: report.sessionId });

    res.status(200).json({
      success: true,
      data: {
        ...report.toObject(),
        metrics: {
          speech: speechMetrics,
          confidence: confidenceMetrics,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching report',
      error: error.message,
    });
  }
};

// @desc    Generate PDF report
// @route   GET /api/reports/:id/download
// @access  Private
exports.downloadReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    // Install 'pdfkit' package: npm install pdfkit
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument();

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=report-${report._id}.pdf`);

    doc.pipe(res);

    // Add content to PDF
    doc.fontSize(20).text('Interview Report', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(12);
    doc.text(`Overall Score: ${report.overallScore}/100`);
    doc.text(`Date: ${new Date(report.createdAt).toLocaleDateString()}`);
    doc.moveDown();

    doc.fontSize(14).text('Feedback:', { underline: true });
    doc.fontSize(11).text(report.feedback || 'No feedback available');

    doc.end();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating PDF',
      error: error.message,
    });
  }
};

// @desc    Get feedback and recommendations
// @route   GET /api/reports/:id/feedback
// @access  Private
exports.getReportFeedback = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    const feedback = {
      strengths: report.strengths || [],
      areasForImprovement: report.areasForImprovement || [],
      recommendations: report.recommendations || [],
    };

    res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching feedback',
      error: error.message,
    });
  }
};
```

---

## 4️⃣ Admin Statistics Endpoints

### Add to adminController.js

```javascript
const User = require('../models/User');
const Session = require('../models/Session');
const SpeechMetrics = require('../models/SpeechMetrics');
const ConfidenceMetrics = require('../models/ConfidenceMetrics');
const AuditLog = require('../models/AuditLog');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSessions = await Session.countDocuments();
    const activeNow = await Session.countDocuments({ status: 'active' });

    const avgScoreResult = await ConfidenceMetrics.aggregate([
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$score' },
        },
      },
    ]);

    const avgScore = avgScoreResult[0]?.avgScore || 0;

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalSessions,
        activeNow,
        avgScore: parseFloat(avgScore.toFixed(1)),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stats',
      error: error.message,
    });
  }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    let filter = {};

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message,
    });
  }
};

// @desc    Get all sessions (admin)
// @route   GET /api/admin/sessions
// @access  Private/Admin
exports.getAllSessions = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, userId } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (userId) filter.userId = userId;

    const sessions = await Session.find(filter)
      .populate('userId', 'firstName lastName email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Session.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: sessions,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sessions',
      error: error.message,
    });
  }
};

// @desc    Get recent activity log
// @route   GET /api/admin/activity
// @access  Private/Admin
exports.getActivityLog = async (req, res) => {
  try {
    const activities = await AuditLog.find()
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      data: activities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching activity log',
      error: error.message,
    });
  }
};
```

### Update admin routes
Add these to `backend/routes/adminRoutes.js`:

```javascript
const {
  getDashboardStats,
  getAllUsers,
  getAllSessions,
  getActivityLog,
} = require('../controllers/adminController');

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/sessions', getAllSessions);
router.get('/activity', getActivityLog);
```

---

## 5️⃣ Real-time Metrics Socket Setup (Optional)

### Create WebSocket handler
**File:** `backend/services/metricsSocket.js`

```javascript
const SpeechMetrics = require('../models/SpeechMetrics');
const ConfidenceMetrics = require('../models/ConfidenceMetrics');

exports.registerMetricsHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('New metrics connection:', socket.id);

    // Save speech metrics in real-time
    socket.on('save-speech-metrics', async (data) => {
      try {
        const metrics = await SpeechMetrics.create({
          sessionId: data.sessionId,
          userId: data.userId,
          wordsPerMinute: data.wordsPerMinute,
          fillerWords: data.fillerWords,
          clarity: data.clarity,
        });

        // Broadcast to other connected clients
        io.to(data.sessionId).emit('metrics-updated', metrics);
        socket.emit('metrics-saved', { success: true, data: metrics });
      } catch (error) {
        socket.emit('metrics-error', { error: error.message });
      }
    });

    // Save confidence metrics in real-time
    socket.on('save-confidence-metrics', async (data) => {
      try {
        const metrics = await ConfidenceMetrics.create({
          sessionId: data.sessionId,
          userId: data.userId,
          eyeContact: data.eyeContact,
          posture: data.posture,
          score: data.score,
        });

        io.to(data.sessionId).emit('metrics-updated', metrics);
        socket.emit('metrics-saved', { success: true, data: metrics });
      } catch (error) {
        socket.emit('metrics-error', { error: error.message });
      }
    });

    socket.on('disconnect', () => {
      console.log('Metrics connection closed:', socket.id);
    });
  });
};
```

---

## 🔄 Update server.js

```javascript
const http = require('http');
const Server = require('socket.io').Server;
const metricsSocket = require('./services/metricsSocket');

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },
});

// Register metrics handlers
metricsSocket.registerMetricsHandlers(io);

// Listen instead of app.listen
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## ✅ Implementation Checklist

Copy each section into your respective files:

- [ ] Create `questionController.js` and `questionRoutes.js`
- [ ] Add to `server.js`: `const questionRoutes = require('./routes/questionRoutes');`
- [ ] Add to `server.js`: `app.use('/api/questions', questionRoutes);`
- [ ] Add functions to `metricsController.js`
- [ ] Add functions to `reportController.js`
- [ ] Add functions to `adminController.js`
- [ ] Update routes files with new endpoints
- [ ] Install required packages: `npm install pdfkit socket.io`
- [ ] Test each endpoint with Postman/Insomnia

---

## 📝 Frontend Integration Examples

Once endpoints are ready, update frontend services:

```javascript
// Update Arambh/src/services/endpoints.js

export const questionsAPI = {
  getAll: (category, difficulty) => 
    api.get('/questions', { params: { category, difficulty } }),
  getRandom: (count, category) => 
    api.get('/questions/random', { params: { count, category } }),
};

export const metricsAPI = {
  saveSpeech: (data) => api.post('/metrics/speech', data),
  saveConfidence: (data) => api.post('/metrics/confidence', data),
  getSessionMetrics: (sessionId) => api.get(`/metrics/${sessionId}`),
  getSummary: () => api.get('/metrics/summary'),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (page) => api.get('/admin/users', { params: { page } }),
  getSessions: (page) => api.get('/admin/sessions', { params: { page } }),
};
```

---

## 🚀 Next: Test Everything!

After implementation, add this to your documentation and test with real frontend code.

