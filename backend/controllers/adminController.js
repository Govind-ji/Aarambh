const User = require('../models/User');
const Session = require('../models/Session');
const Report = require('../models/Report');
const AuditLog = require('../models/AuditLog');

// ====== ADMIN DASHBOARD ======

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSessions = await Session.countDocuments();
    const totalReports = await Report.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });

    // Get recent sessions
    const recentSessions = await Session.find()
      .populate('userId', 'firstName lastName email')
      .limit(5)
      .sort({ createdAt: -1 });

    // Get recent reports
    const recentReports = await Report.find()
      .populate('userId', 'firstName lastName email')
      .limit(5)
      .sort({ createdAt: -1 });

    // Average scores
    const avgUserScore = await User.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$averageScore' } } },
    ]);

    // Session status distribution
    const sessionStatus = await Session.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        statistics: {
          totalUsers,
          totalSessions,
          totalReports,
          activeUsers,
          averageUserScore: avgUserScore[0]?.avgScore || 0,
        },
        recentSessions,
        recentReports,
        sessionStatusDistribution: sessionStatus,
      },
    });
  } catch (error) {
    console.error('Get Dashboard Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
    });
  }
};

// ====== USER MANAGEMENT ======

// @desc    Get all users with details
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsersAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, role, search } = req.query;

    let query = {};

    if (status) query.status = status;
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select('-password -passwordResetToken -passwordResetExpires')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        currentPage: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error('Get All Users Admin Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
    });
  }
};

// @desc    Get user details with sessions
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUserDetailsAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -passwordResetToken -passwordResetExpires');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const sessions = await Session.find({ userId: req.params.id }).limit(10).sort({ createdAt: -1 });
    const reports = await Report.find({ userId: req.params.id }).limit(5).sort({ createdAt: -1 });
    const auditLogs = await AuditLog.find({ userId: req.params.id }).limit(15).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        user,
        recentSessions: sessions,
        recentReports: reports,
        auditLogs,
      },
    });
  } catch (error) {
    console.error('Get User Details Admin Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user details',
    });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    await AuditLog.create({
      userId: req.user.id,
      action: 'admin_user_action',
      resourceType: 'User',
      resourceId: user._id.toString(),
      status: 'success',
      details: { action: 'role_update', newRole: role },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.status(200).json({
      success: true,
      message: 'User role updated',
      data: user,
    });
  } catch (error) {
    console.error('Update User Role Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user role',
    });
  }
};

// ====== SESSION MANAGEMENT ======

// @desc    Get all sessions (Admin view)
// @route   GET /api/admin/sessions
// @access  Private/Admin
exports.getAllSessionsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, userId, category } = req.query;

    let query = {};

    if (status) query.status = status;
    if (userId) query.userId = userId;
    if (category) query.category = category;

    const skip = (page - 1) * limit;

    const sessions = await Session.find(query)
      .populate('userId', 'firstName lastName email')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Session.countDocuments(query);

    res.status(200).json({
      success: true,
      data: sessions,
      pagination: {
        currentPage: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error('Get All Sessions Admin Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sessions',
    });
  }
};

// @desc    Get session details (Admin view)
// @route   GET /api/admin/sessions/:id
// @access  Private/Admin
exports.getSessionDetailsAdmin = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('userId', 'firstName lastName email')
      .populate('speechMetricsId')
      .populate('confidenceMetricsId');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      });
    }

    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error('Get Session Details Admin Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching session details',
    });
  }
};

// @desc    Delete session (Admin)
// @route   DELETE /api/admin/sessions/:id
// @access  Private/Admin
exports.deleteSessionAdmin = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      });
    }

    await Session.findByIdAndDelete(req.params.id);

    await AuditLog.create({
      userId: req.user.id,
      action: 'admin_session_action',
      resourceType: 'Session',
      resourceId: req.params.id,
      status: 'success',
      details: { action: 'session_deleted_by_admin' },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.status(200).json({
      success: true,
      message: 'Session deleted successfully',
    });
  } catch (error) {
    console.error('Delete Session Admin Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting session',
    });
  }
};

// ====== REPORTS MANAGEMENT ======

// @desc    Get all reports (Admin view)
// @route   GET /api/admin/reports
// @access  Private/Admin
exports.getAllReportsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, userId, status } = req.query;

    let query = {};

    if (userId) query.userId = userId;
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const reports = await Report.find(query)
      .populate('userId', 'firstName lastName email')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Report.countDocuments(query);

    res.status(200).json({
      success: true,
      data: reports,
      pagination: {
        currentPage: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error('Get All Reports Admin Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reports',
    });
  }
};

// @desc    Get analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
exports.getAnalytics = async (req, res) => {
  try {
    const { dateRange = 30 } = req.query;

    const startDate = new Date(Date.now() - dateRange * 24 * 60 * 60 * 1000);

    // User growth
    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Session activity
    const sessionActivity = await Session.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Average scores
    const averageScores = await Report.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          avgOverall: { $avg: '$overallScore' },
          avgConfidence: { $avg: '$confidenceScore' },
          avgSpeech: { $avg: '$speechScore' },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        userGrowth,
        sessionActivity,
        averageScores: averageScores[0] || {},
      },
    });
  } catch (error) {
    console.error('Get Analytics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
    });
  }
};

// @desc    Get audit logs
// @route   GET /api/admin/audit-logs
// @access  Private/Admin
exports.getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, action, userId, severity } = req.query;

    let query = {};

    if (action) query.action = action;
    if (userId) query.userId = userId;
    if (severity) query.severity = severity;

    const skip = (page - 1) * limit;

    const logs = await AuditLog.find(query)
      .populate('userId', 'firstName lastName email')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await AuditLog.countDocuments(query);

    res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        currentPage: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error('Get Audit Logs Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching audit logs',
    });
  }
};
