const Report = require('../models/Report');
const Session = require('../models/Session');
const SpeechMetrics = require('../models/SpeechMetrics');
const ConfidenceMetrics = require('../models/ConfidenceMetrics');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

// @desc    Generate report for a session
// @route   POST /api/reports/generate/:sessionId
// @access  Private
exports.generateReport = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId)
      .populate('speechMetricsId')
      .populate('confidenceMetricsId');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      });
    }

    if (session.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to generate report for this session',
      });
    }

    // Calculate overall scores
    const speechScore = session.speechMetricsId?.overallScore || 0;
    const confidenceScore = session.confidenceMetricsId?.overallConfidenceScore || 0;
    const contentScore = session.speechMetricsId?.completeness || 0;
    const overallScore = (speechScore + confidenceScore + contentScore) / 3;

    // Generate insights
    const strengths = generateStrengths(session.speechMetricsId, session.confidenceMetricsId);
    const areasForImprovement = generateAreasForImprovement(session.speechMetricsId, session.confidenceMetricsId);
    const recommendations = generateRecommendations(session.speechMetricsId, session.confidenceMetricsId);

    // Create report
    const report = await Report.create({
      sessionId,
      userId: req.user.id,
      title: session.title,
      description: `Report for interview: ${session.title}`,
      overallScore,
      confidenceScore,
      speechScore,
      contentScore,
      categories: [
        { name: 'Speech Quality', score: speechScore, weight: 0.3 },
        { name: 'Confidence & Body Language', score: confidenceScore, weight: 0.4 },
        { name: 'Content & Knowledge', score: contentScore, weight: 0.3 },
      ],
      speechAnalysis: {
        paceSummary: `Pace: ${session.speechMetricsId?.pace || 0} WPM`,
        clarityScore: session.speechMetricsId?.clarity || 0,
        articulationScore: session.speechMetricsId?.articulation || 0,
        fillerCount: session.speechMetricsId?.fillers || 0,
        pauseAnalysis: `Average pause: ${session.speechMetricsId?.averagePauseDuration || 0}s`,
      },
      confidenceAnalysis: {
        eyeContactScore: session.confidenceMetricsId?.eyeContact || 0,
        postureScore: session.confidenceMetricsId?.posture || 0,
        gestureScore: session.confidenceMetricsId?.gestures || 0,
        engagementScore: session.confidenceMetricsId?.engagement || 0,
        nervousnessLevel: nervousnessLevel(session.confidenceMetricsId?.nervousness || 0),
      },
      contentAnalysis: {
        completenessScore: session.speechMetricsId?.completeness || 0,
        accuracyScore: session.speechMetricsId?.accuracy || 0,
        relevanceScore: session.speechMetricsId?.relevance || 0,
        depthOfKnowledge: depthLevel(session.speechMetricsId?.completeness || 0),
      },
      strengths,
      areasForImprovement,
      recommendations,
      executiveSummary: generateExecutiveSummary(overallScore, strengths, areasForImprovement),
      detailedFeedback: generateDetailedFeedback(session, session.speechMetricsId, session.confidenceMetricsId),
    });

    // Update user average score
    const user = await User.findById(req.user.id);
    user.averageScore = (user.averageScore * (user.completedSessions - 1) + overallScore) / user.completedSessions;
    await user.save();

    await AuditLog.create({
      userId: req.user.id,
      action: 'report_generated',
      resourceType: 'Report',
      resourceId: report._id.toString(),
      status: 'success',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.status(201).json({
      success: true,
      message: 'Report generated successfully',
      data: report,
    });
  } catch (error) {
    console.error('Generate Report Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating report',
    });
  }
};

// @desc    Get all reports for current user
// @route   GET /api/reports
// @access  Private
exports.getReports = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, sortBy = 'createdAt' } = req.query;
    let query = { userId: req.user.id };

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const reports = await Report.find(query)
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ [sortBy]: -1 });

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
    console.error('Get Reports Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reports',
    });
  }
};

// @desc    Get report details
// @route   GET /api/reports/:id
// @access  Private
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    if (report.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this report',
      });
    }

    await AuditLog.create({
      userId: req.user.id,
      action: 'report_viewed',
      resourceType: 'Report',
      resourceId: report._id.toString(),
      status: 'success',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('Get Report By ID Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching report',
    });
  }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    if (report.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this report',
      });
    }

    await Report.findByIdAndDelete(req.params.id);

    await AuditLog.create({
      userId: req.user.id,
      action: 'admin_report_action',
      resourceType: 'Report',
      resourceId: req.params.id,
      status: 'success',
      details: { action: 'report_deleted' },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.status(200).json({
      success: true,
      message: 'Report deleted successfully',
    });
  } catch (error) {
    console.error('Delete Report Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting report',
    });
  }
};

// Helper functions
function generateStrengths(speechMetrics, confidenceMetrics) {
  const strengths = [];
  
  if (speechMetrics?.clarity > 80) strengths.push('Clear and articulate speech');
  if (confidenceMetrics?.eyeContact > 80) strengths.push('Excellent eye contact');
  if (confidenceMetrics?.posture > 80) strengths.push('Professional posture');
  if (speechMetrics?.completeness > 80) strengths.push('Comprehensive answers');
  if (confidenceMetrics?.engagement > 80) strengths.push('High engagement');

  return strengths.length > 0 ? strengths : ['Good overall performance'];
}

function generateAreasForImprovement(speechMetrics, confidenceMetrics) {
  const areas = [];
  
  if (speechMetrics?.clarity < 70) areas.push('Improve speech clarity');
  if (speechMetrics?.fillers > 10) areas.push('Reduce filler words');
  if (confidenceMetrics?.nervousness > 50) areas.push('Work on managing nervousness');
  if (confidenceMetrics?.gestures < 60) areas.push('Use more purposeful gestures');
  if (speechMetrics?.pace < 100 || speechMetrics?.pace > 180) areas.push('Adjust speaking pace');

  return areas.length > 0 ? areas : ['Continue practicing'];
}

function generateRecommendations(speechMetrics, confidenceMetrics) {
  const recommendations = [];
  
  if (speechMetrics?.clarity < 70) {
    recommendations.push({
      category: 'Speech',
      suggestion: 'Practice pronunciation exercises daily',
      priority: 'high',
    });
  }
  
  if (confidenceMetrics?.nervousness > 50) {
    recommendations.push({
      category: 'Confidence',
      suggestion: 'Practice relaxation techniques before interviews',
      priority: 'high',
    });
  }
  
  if (speechMetrics?.fillers > 10) {
    recommendations.push({
      category: 'Speech',
      suggestion: 'Record yourself and listen for filler words',
      priority: 'medium',
    });
  }

  return recommendations;
}

function nervousnessLevel(nervousness) {
  if (nervousness < 30) return 'Very Confident';
  if (nervousness < 50) return 'Confident';
  if (nervousness < 70) return 'Moderately Nervous';
  return 'Very Nervous';
}

function depthLevel(completeness) {
  if (completeness > 80) return 'Excellent';
  if (completeness > 60) return 'Good';
  if (completeness > 40) return 'Fair';
  return 'Needs Improvement';
}

function generateExecutiveSummary(score, strengths, areas) {
  const scoreLevel = score > 80 ? 'Excellent' : score > 60 ? 'Good' : score > 40 ? 'Fair' : 'Needs Improvement';
  return `Overall Score: ${scoreLevel} (${score.toFixed(1)}/100). Your key strengths include ${strengths.slice(0, 2).join(' and ')}. Focus on ${areas[0] || 'continuous improvement'}.`;
}

function generateDetailedFeedback(session, speechMetrics, confidenceMetrics) {
  return `During this ${(session.duration / 60).toFixed(1)} minute interview, you demonstrated good communication skills. 
  Your speech clarity was at ${speechMetrics?.clarity || 75}/100, with an average speaking pace of ${speechMetrics?.pace || 120} words per minute. 
  Body language showed ${confidenceMetrics?.gestures || 70}/100 for purposeful gestures and ${confidenceMetrics?.eyeContact || 75}/100 for eye contact.
  Continue practicing to further improve these areas.`;
}
