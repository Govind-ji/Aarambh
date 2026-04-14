const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  
  action: {
    type: String,
    required: true,
    enum: [
      'login',
      'logout',
      'signup',
      'password_reset',
      'profile_update',
      'settings_update',
      'session_created',
      'session_started',
      'session_paused',
      'session_resumed',
      'session_completed',
      'session_deleted',
      'report_generated',
      'report_viewed',
      'admin_user_action',
      'admin_session_action',
      'admin_report_action',
      'file_upload',
      'file_download',
      'data_export',
      'system_test',
      'error_occurred',
      'unexpected_event'
    ],
  },
  
  resourceType: {
    type: String,
    enum: ['User', 'Session', 'Report', 'Settings', 'System', 'Admin'],
    default: 'System',
  },
  
  resourceId: {
    type: String,
    default: null,
  },
  
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  
  ipAddress: String,
  userAgent: String,
  
  status: {
    type: String,
    enum: ['success', 'failure', 'partial'],
    default: 'success',
  },
  
  errorMessage: {
    type: String,
    default: null,
  },
  
  severity: {
    type: String,
    enum: ['info', 'warning', 'error', 'critical'],
    default: 'info',
  },
  
  duration: {
    type: Number,
    default: 0, // in milliseconds
  },
  
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  
  // For automatic deletion of old logs (optional)
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    index: { expires: 0 }, // TTL index
  },
}, { timestamps: false });

module.exports = mongoose.model('AuditLog', auditLogSchema);
