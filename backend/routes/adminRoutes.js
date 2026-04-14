const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getAllUsersAdmin,
  getUserDetailsAdmin,
  updateUserRole,
  getAllSessionsAdmin,
  getSessionDetailsAdmin,
  deleteSessionAdmin,
  getAllReportsAdmin,
  getAnalytics,
  getAuditLogs,
} = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// All routes require authentication and admin role
router.use(authMiddleware);
router.use(adminMiddleware);

// Dashboard
router.get('/dashboard', getDashboard);

// User Management
router.get('/users', getAllUsersAdmin);
router.get('/users/:id', getUserDetailsAdmin);
router.put('/users/:id/role', updateUserRole);

// Session Management
router.get('/sessions', getAllSessionsAdmin);
router.get('/sessions/:id', getSessionDetailsAdmin);
router.delete('/sessions/:id', deleteSessionAdmin);

// Reports Management
router.get('/reports', getAllReportsAdmin);

// Analytics
router.get('/analytics', getAnalytics);

// Audit Logs
router.get('/audit-logs', getAuditLogs);

module.exports = router;
