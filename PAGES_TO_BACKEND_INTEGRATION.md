# Complete Pages-to-Backend Integration Plan

## Overview
This document maps all 17 frontend pages to their required backend API endpoints, database models, and data structures.

---

## 📊 Page-by-Page Integration Map

### **Authentication & Setup (3 pages)**

#### 1. **Login.jsx**
- **Purpose:** User authentication
- **API Endpoints:**
  - `POST /api/auth/login` - Authenticate user
  - `POST /api/auth/logout` - Logout user
- **Required Data:** email, password
- **Returns:** token, user object, permissions
- **Database Models:** User
- **Status:** ✅ IMPLEMENTED

#### 2. **Signup.jsx**
- **Purpose:** New user registration
- **API Endpoints:**
  - `POST /api/auth/signup` - Create new user
  - `POST /api/auth/verify-email` - Email verification (optional)
- **Required Data:** firstName, lastName, email, password, confirmPassword
- **Returns:** token, user object
- **Database Models:** User, Settings (default)
- **Status:** ✅ IMPLEMENTED

#### 3. **ResetPassword.jsx**
- **Purpose:** Password recovery flow
- **API Endpoints:**
  - `POST /api/auth/forgot-password` - Request password reset
  - `POST /api/auth/reset-password/:token` - Reset with token
  - `PUT /api/users/change-password` - Change known password
- **Required Data:** email, token, newPassword, oldPassword
- **Returns:** success message, token
- **Database Models:** User
- **Status:** ✅ IMPLEMENTED

---

### **User Profile & Settings (3 pages)**

#### 4. **Profile.jsx**
- **Purpose:** View and edit user profile
- **API Endpoints:**
  - `GET /api/users/me` - Get current user profile
  - `PUT /api/users/profile` - Update profile information
  - `GET /api/users/me/stats` - Get user statistics
  - `PUT /api/users/avatar` - Upload profile picture (optional)
- **Required Data:** firstName, lastName, email, phone, bio, jobTitle, company, location, avatar
- **Database Models:** User, Session (for stats)
- **Status:** ✅ IMPLEMENTED (mostly)
- **Todos:**
  - Add avatar upload endpoint
  - Ensure stats endpoint returns correct metrics

#### 5. **Settings.jsx**
- **Purpose:** Configure user preferences
- **API Endpoints:**
  - `GET /api/settings` - Get all settings
  - `PUT /api/settings/interview` - Update interview preferences
  - `PUT /api/settings/display` - Update display settings
  - `PUT /api/settings/media` - Update media/device settings
  - `PUT /api/settings/privacy` - Update privacy settings
  - `PUT /api/settings/notifications` - Update notification preferences
  - `POST /api/settings/reset` - Reset to defaults
- **Required Data:** Various setting categories with boolean/string values
- **Database Models:** Settings
- **Status:** ✅ IMPLEMENTED

#### 6. **SystemTest.jsx**
- **Purpose:** Test system capabilities (cameras, microphone, etc.)
- **API Endpoints:**
  - `GET /api/health` - Check server health
  - `GET /api/auth/me` - Verify authentication
- **Required Data:** None
- **Returns:** status, server info, user info
- **Database Models:** None
- **Status:** ✅ IMPLEMENTED

---

### **Dashboard & Reporting (4 pages)**

#### 7. **Dashboard.jsx** (Main user dashboard)
- **Purpose:** Overview of user activity and sessions
- **API Endpoints:**
  - `GET /api/users/me` - Get current user
  - `GET /api/sessions?page=1&limit=10` - Get user's sessions
  - `GET /api/users/me/stats` - Get user statistics
  - `GET /api/metrics/summary` - Get performance summary
- **Required Data:** None (user context from token)
- **Returns:** user data, sessions list, statistics
- **Database Models:** User, Session, SpeechMetrics, ConfidenceMetrics
- **Status:** ✅ PARTIALLY IMPLEMENTED
- **Todos:**
  - Add metrics summary endpoint
  - Implement pagination properly

#### 8. **ReportsList.jsx**
- **Purpose:** View all generated reports
- **API Endpoints:**
  - `GET /api/reports?page=1&limit=10` - Get paginated reports
  - `GET /api/reports/?userId=:id` - Filter reports by user
  - `DELETE /api/reports/:id` - Delete report
  - `GET /api/reports/:id/download` - Download report as PDF
- **Required Data:** Optional filters (date range, type)
- **Returns:** reports list with pagination
- **Database Models:** Report, Session
- **Status:** ⚠️ PARTIAL (need download endpoint)
- **Todos:**
  - Add PDF generation and download
  - Add filtering by date range

#### 9. **ReportView.jsx**
- **Purpose:** View detailed report for a session
- **API Endpoints:**
  - `GET /api/reports/:id` - Get report details
  - `GET /api/sessions/:id` - Get session details
  - `GET /api/metrics/:sessionId` - Get all metrics for session
  - `POST /api/reports/:id/share` - Share report
  - `GET /api/reports/:id/feedback` - Get feedback/recommendations
- **Required Data:** reportId (from params)
- **Returns:** detailed report with charts, metrics, feedback
- **Database Models:** Report, Session, SpeechMetrics, ConfidenceMetrics
- **Status:** ⚠️ PARTIAL
- **Todos:**
  - Implement feedback/recommendations endpoint
  - Add sharing functionality
  - Connect metrics visualization

#### 10. **AnalysisLive.jsx**
- **Purpose:** Real-time analysis during interview
- **API Endpoints:**
  - `GET /api/sessions/:id` - Get current session
  - `POST /api/metrics/speech` - Save speech metrics
  - `POST /api/metrics/confidence` - Save confidence metrics
  - `PUT /api/sessions/:id/metrics` - Update session metrics
  - WebSocket: Real-time metric updates (optional)
- **Required Data:** sessionId, metric values
- **Returns:** acknowledgment
- **Database Models:** Session, SpeechMetrics, ConfidenceMetrics
- **Status:** ❌ NEEDS IMPLEMENTATION
- **Todos:**
  - Implement WebSocket for real-time updates
  - Add metric aggregation

#### 11. **AnalysisPlayback.jsx**
- **Purpose:** Review analysis from previous sessions
- **API Endpoints:**
  - `GET /api/sessions/:id` - Get session data
  - `GET /api/metrics/:sessionId` - Get all metrics
  - `GET /api/sessions/:id/recording` - Get video/audio recording
- **Required Data:** sessionId
- **Returns:** session data with metrics timeline
- **Database Models:** Session, SpeechMetrics, ConfidenceMetrics
- **Status:** ⚠️ PARTIAL (need recording storage)
- **Todos:**
  - Add video/audio storage and retrieval
  - Connect metrics timeline to recording

---

### **Interview Pages (4 pages)**

#### 12. **InterviewSetup.jsx**
- **Purpose:** Configure interview before starting
- **API Endpoints:**
  - `POST /api/sessions` - Create new session
  - `GET /api/sessions/categories` - Get interview categories
  - `GET /api/sessions/difficulties` - Get difficulty levels
  - `GET /api/questions` - Get available questions
- **Required Data:** title, description, category, difficulty
- **Returns:** sessionId, questions list
- **Database Models:** Session, InterviewQuestion, Settings
- **Status:** ⚠️ PARTIAL (need question management)
- **Todos:**
  - Create questions endpoint
  - Add question bank management
  - Add category and difficulty endpoints

#### 13. **InterviewLive.jsx**
- **Purpose:** Conduct active interview with real-time feedback
- **API Endpoints:**
  - `GET /api/sessions/:id` - Get session details
  - `PUT /api/sessions/:id/start` - Start interview
  - `PUT /api/sessions/:id/pause` - Pause interview
  - `PUT /api/sessions/:id/resume` - Resume interview
  - `POST /api/metrics/speech` - Save speech metrics
  - `POST /api/metrics/confidence` - Save confidence metrics
- **Required Data:** sessionId, metrics
- **Returns:** acknowledgment, current questions
- **Database Models:** Session, SpeechMetrics, ConfidenceMetrics
- **Status:** ⚠️ PARTIAL
- **Todos:**
  - Implement real-time metric submission
  - Add question progression

#### 14. **InterviewPaused.jsx**
- **Purpose:** Show options when interview is paused
- **API Endpoints:**
  - `GET /api/sessions/:id` - Get session state
  - `PUT /api/sessions/:id/resume` - Resume
  - `PUT /api/sessions/:id/complete` - Finish interview
- **Required Data:** sessionId
- **Returns:** session state
- **Database Models:** Session
- **Status:** ✅ IMPLEMENTED

---

### **Admin Pages (3 pages)**

#### 15. **AdminDashboard.jsx**
- **Purpose:** Admin overview of all activity
- **API Endpoints:**
  - `GET /api/admin/stats` - Get system statistics
  - `GET /api/admin/users/count` - Count total users
  - `GET /api/admin/sessions/count` - Count total sessions
  - `GET /api/admin/active-users` - Get currently active users
  - `GET /api/admin/recent-activity` - Get recent activities
- **Required Data:** None (admin only)
- **Returns:** Various statistics
- **Database Models:** User, Session, AuditLog
- **Status:** ⚠️ PARTIAL
- **Todos:**
  - Implement stats aggregation
  - Add active users tracking

#### 16. **AdminUsers.jsx**
- **Purpose:** Manage user accounts
- **API Endpoints:**
  - `GET /api/users?page=1&limit=20` - List all users (admin)
  - `GET /api/users/:id` - Get user details (admin)
  - `PUT /api/users/:id/status` - Activate/deactivate user
  - `DELETE /api/users/:id` - Delete user (admin)
  - `PUT /api/users/:id/role` - Change user role
  - `POST /api/users/:id/send-email` - Send email to user
- **Required Data:** userId, action
- **Returns:** user list, confirmation
- **Database Models:** User, AuditLog
- **Status:** ⚠️ PARTIAL
- **Todos:**
  - Add role management
  - Add email notification system
  - Add bulk operations

#### 17. **AdminSessions.jsx**
- **Purpose:** Monitor and manage all sessions
- **API Endpoints:**
  - `GET /api/admin/sessions?page=1&limit=20` - List all sessions
  - `GET /api/sessions/:id` - Get session details
  - `DELETE /api/sessions/:id` - Delete session
  - `GET /api/admin/sessions/report` - Session report
  - `PUT /api/sessions/:id/status` - Update session status
- **Required Data:** Optional filters (date, user, status)
- **Returns:** sessions list with pagination
- **Database Models:** Session, User, SpeechMetrics, ConfidenceMetrics
- **Status:** ⚠️ PARTIAL
- **Todos:**
  - Add admin filtering
  - Add bulk operations
  - Add session reports

---

## 📋 Summary of What Needs Implementation

### ✅ Already Implemented
1. Authentication (Login, Signup, Password Reset)
2. User Profile (Get & Update)
3. Settings Management
4. Session CRUD Operations
5. Basic Metrics Storage

### ⚠️ Partially Implemented
1. Reporting (need download, sharing, recommendations)
2. Admin Dashboard (need stats aggregation)
3. Admin Users (need role management)
4. Admin Sessions (need filtering, reports)
5. Interview Setup (need question management)

### ❌ Needs Complete Implementation
1. Real-time Metrics Updates (WebSocket)
2. Live Analysis During Interview
3. Playback with Recording
4. Question Bank Management
5. PDF Report Generation
6. Email Notifications
7. Advanced Admin Features

---

## 🔧 Implementation Priority

### Priority 1 (Critical) - Start with these
- [ ] Question Management Endpoints
- [ ] Real-time Metrics Integration
- [ ] Admin Statistics Aggregation
- [ ] Basic Report Generation

### Priority 2 (Important) - Then add these
- [ ] PDF Download
- [ ] Recording Storage
- [ ] Email Notifications
- [ ] Advanced Filtering

### Priority 3 (Nice to Have) - Polish with these
- [ ] WebSocket Real-time Updates
- [ ] Advanced Analytics
- [ ] Bulk Operations
- [ ] Data Export Features

---

## 📁 Database Models Status

| Model | Status | Notes |
|-------|--------|-------|
| User | ✅ Complete | Has all necessary fields |
| Session | ✅ Complete | Tracks interview sessions |
| SpeechMetrics | ✅ Complete | Stores speech analysis |
| ConfidenceMetrics | ✅ Complete | Stores confidence scores |
| ConfidenceMetrics | ✅ Complete | Stores confidence scores |
| Report | ✅ Complete | Stores generated reports |
| Settings | ✅ Complete | User preferences |
| InterviewQuestion | ✅ Complete | Questions bank |
| AuditLog | ✅ Complete | Activity tracking |

All necessary models exist! Just need endpoint enhancements.

---

## 🚀 Next Steps

1. **Review this document** and identify which pages need work
2. **Implement missing endpoints** (see sections marked with ⚠️ or ❌)
3. **Test each page's data flow** with the frontend
4. **Add error handling** and validation
5. **Document all new endpoints** in API_DOCUMENTATION.md

