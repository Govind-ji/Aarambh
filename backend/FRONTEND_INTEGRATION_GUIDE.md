# Frontend-Backend Integration Guide

Quick reference for frontend developers to integrate each page with backend APIs.

## 🎯 Page-to-API Mapping

### Authentication Pages

#### Login.jsx
```javascript
// POST /api/auth/login
const handleLogin = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', response.data.token);
  navigate('/dashboard');
};
```
**Required Fields:** email, password
**Returns:** token, user data

#### Signup.jsx
```javascript
// POST /api/auth/signup
const handleSignup = async (firstName, lastName, email, password, confirmPassword) => {
  const response = await api.post('/auth/signup', {
    firstName,
    lastName,
    email,
    password,
    confirmPassword
  });
  localStorage.setItem('token', response.data.token);
  navigate('/dashboard');
};
```
**Required Fields:** firstName, lastName, email, password, confirmPassword
**Returns:** token, user data

#### ResetPassword.jsx
```javascript
// Step 1: POST /api/auth/forgot-password
const requestReset = async (email) => {
  await api.post('/auth/forgot-password', { email });
};

// Step 2: POST /api/auth/reset-password/:resetToken
const resetPassword = async (resetToken, password, confirmPassword) => {
  await api.post(`/auth/reset-password/${resetToken}`, {
    password,
    confirmPassword
  });
};
```

---

### Dashboard Page

#### Dashboard.jsx
```javascript
// GET /api/users/me - Get current user profile
const loadUserProfile = async () => {
  const response = await api.get('/users/me');
  setUser(response.data.data);
};

// GET /api/sessions - Get all sessions (with pagination)
const loadSessions = async (page = 1) => {
  const response = await api.get('/sessions', {
    params: { page, limit: 10 }
  });
  setSessions(response.data.data);
  setPagination(response.data.pagination);
};

// Optional: Get statistics
const loadStats = async () => {
  const response = await api.get('/users/me/stats');
  setStats(response.data.data);
};
```

---

### User Pages

#### Profile.jsx
```javascript
// GET /api/users/me
const loadProfile = async () => {
  const response = await api.get('/users/me');
  setProfile(response.data.data);
};

// PUT /api/users/profile
const updateProfile = async (profileData) => {
  const response = await api.put('/users/profile', {
    firstName: profileData.firstName,
    lastName: profileData.lastName,
    phone: profileData.phone,
    bio: profileData.bio,
    jobTitle: profileData.jobTitle,
    company: profileData.company,
    location: profileData.location,
    avatar: profileData.avatar
  });
  setProfile(response.data.data);
};

// PUT /api/users/change-password
const changePassword = async (currentPassword, newPassword, confirmPassword) => {
  await api.put('/users/change-password', {
    currentPassword,
    newPassword,
    confirmPassword
  });
};
```

#### Settings.jsx
```javascript
// GET /api/settings
const loadSettings = async () => {
  const response = await api.get('/settings');
  setSettings(response.data.data);
};

// PUT /api/settings/interview
const updateInterviewSettings = async (settings) => {
  await api.put('/settings/interview', settings);
};

// PUT /api/settings/display
const updateDisplaySettings = async (settings) => {
  await api.put('/settings/display', settings);
};

// PUT /api/settings/media
const updateMediaSettings = async (settings) => {
  await api.put('/settings/media', settings);
};

// PUT /api/settings/privacy
const updatePrivacySettings = async (settings) => {
  await api.put('/settings/privacy', settings);
};

// PUT /api/settings/notifications
const updateNotificationSettings = async (settings) => {
  await api.put('/settings/notifications', settings);
};

// POST /api/settings/reset
const resetSettingsToDefault = async () => {
  await api.post('/settings/reset');
};
```

#### SystemTest.jsx
```javascript
// GET /api/health - Check server status
const testServerConnection = async () => {
  const response = await api.get('/health');
  return response.data.success;
};

// GET /api/auth/me - Test authentication
const testAuthentication = async () => {
  const response = await api.get('/auth/me');
  return response.data.data;
};
```

---

### Interview Pages

#### InterviewSetup.jsx
```javascript
// POST /api/sessions
const createSession = async (sessionData) => {
  const response = await api.post('/sessions', {
    title: sessionData.title,
    description: sessionData.description,
    category: sessionData.category,
    difficulty: sessionData.difficulty
  });
  return response.data.data;
};

// GET /api/sessions/:id
const getSessionDetails = async (sessionId) => {
  const response = await api.get(`/sessions/${sessionId}`);
  return response.data.data;
};
```

#### InterviewLive.jsx
```javascript
// PUT /api/sessions/:id/start
const startInterview = async (sessionId) => {
  const response = await api.put(`/sessions/${sessionId}/start`);
  return response.data.data;
};

// POST /api/metrics/speech/:sessionId - Update during interview
const updateSpeechMetrics = async (sessionId, metrics) => {
  await api.post(`/metrics/speech/${sessionId}`, metrics);
};

// POST /api/metrics/confidence/:sessionId - Update during interview
const updateConfidenceMetrics = async (sessionId, metrics) => {
  await api.post(`/metrics/confidence/${sessionId}`, metrics);
};

// POST /api/metrics/confidence/:sessionId/timeline - Real-time timeline
const addMetricsTimeline = async (sessionId, timelineData) => {
  await api.post(`/metrics/confidence/${sessionId}/timeline`, timelineData);
};

// PUT /api/sessions/:id/complete
const completeInterview = async (sessionId, transcription, feedback) => {
  const response = await api.put(`/sessions/${sessionId}/complete`, {
    transcription,
    feedback
  });
  return response.data.data;
};

// POST /api/sessions/:id/notes
const addSessionNote = async (sessionId, note, timestamp) => {
  await api.post(`/sessions/${sessionId}/notes`, {
    timestamp,
    note
  });
};
```

#### InterviewPaused.jsx
```javascript
// PUT /api/sessions/:id/pause
const pauseInterview = async (sessionId) => {
  const response = await api.put(`/sessions/${sessionId}/pause`);
  return response.data.data;
};

// PUT /api/sessions/:id/resume
const resumeInterview = async (sessionId) => {
  const response = await api.put(`/sessions/${sessionId}/resume`);
  return response.data.data;
};
```

---

### Analysis Pages

#### AnalysisLive.jsx
```javascript
// GET /api/metrics/speech/:sessionId
const loadSpeechMetrics = async (sessionId) => {
  const response = await api.get(`/metrics/speech/${sessionId}`);
  return response.data.data;
};

// GET /api/metrics/confidence/:sessionId
const loadConfidenceMetrics = async (sessionId) => {
  const response = await api.get(`/metrics/confidence/${sessionId}`);
  return response.data.data;
};

// Use these to update charts in real-time as interview progresses
```

#### AnalysisPlayback.jsx
```javascript
// GET /api/metrics/:sessionId/summary
const loadMetricsSummary = async (sessionId) => {
  const response = await api.get(`/metrics/${sessionId}/summary`);
  return response.data.data;
};

// GET /api/sessions/:id
const loadSessionDetails = async (sessionId) => {
  const response = await api.get(`/sessions/${sessionId}`);
  return response.data.data;
};

// Use metrics data to generate playback visualizations
```

---

### Reports Pages

#### ReportsList.jsx
```javascript
// GET /api/reports - List all reports
const loadReports = async (page = 1, status = null) => {
  const response = await api.get('/reports', {
    params: { 
      page, 
      limit: 10, 
      status // filter by status if provided
    }
  });
  setReports(response.data.data);
  setPagination(response.data.pagination);
};

// Alternatively with sessions
// GET /api/sessions - For completed sessions
const loadCompletedSessions = async () => {
  const response = await api.get('/sessions', {
    params: { status: 'completed' }
  });
  return response.data.data;
};
```

#### ReportView.jsx
```javascript
// GET /api/reports/:id
const loadReport = async (reportId) => {
  const response = await api.get(`/reports/${reportId}`);
  return response.data.data;
};

// GET /api/sessions/:id - For reference
const loadSessionForReport = async (sessionId) => {
  const response = await api.get(`/sessions/${sessionId}`);
  return response.data.data;
};

// DELETE /api/reports/:id
const deleteReport = async (reportId) => {
  await api.delete(`/reports/${reportId}`);
};
```

---

### Admin Pages

#### AdminDashboard.jsx
```javascript
// GET /api/admin/dashboard
const loadDashboard = async () => {
  const response = await api.get('/admin/dashboard');
  const { statistics, recentSessions, recentReports, sessionStatusDistribution } = response.data.data;
  setStats(statistics);
  setRecentSessions(recentSessions);
  setRecentReports(recentReports);
  setSessionStatus(sessionStatusDistribution);
};

// GET /api/admin/analytics?dateRange=30
const loadAnalytics = async (days = 30) => {
  const response = await api.get('/admin/analytics', {
    params: { dateRange: days }
  });
  return response.data.data;
};
```

#### AdminUsers.jsx
```javascript
// GET /api/admin/users - List all users
const loadAllUsers = async (page = 1, filters = {}) => {
  const response = await api.get('/admin/users', {
    params: { 
      page, 
      limit: 10,
      ...filters // status, role, search
    }
  });
  setUsers(response.data.data);
  setPagination(response.data.pagination);
};

// GET /api/admin/users/:id - Get user details
const loadUserDetails = async (userId) => {
  const response = await api.get(`/admin/users/${userId}`);
  return response.data.data;
};

// PUT /api/admin/users/:id/role
const updateUserRole = async (userId, role) => {
  await api.put(`/admin/users/${userId}/role`, { role });
};

// DELETE /api/users/:id
const deleteUser = async (userId) => {
  await api.delete(`/api/users/${userId}`);
};
```

#### AdminSessions.jsx
```javascript
// GET /api/admin/sessions - List all sessions
const loadAllSessions = async (page = 1, filters = {}) => {
  const response = await api.get('/admin/sessions', {
    params: { 
      page, 
      limit: 10,
      ...filters // status, userId, category
    }
  });
  setSessions(response.data.data);
  setPagination(response.data.pagination);
};

// GET /api/admin/sessions/:id
const loadSessionDetails = async (sessionId) => {
  const response = await api.get(`/admin/sessions/${sessionId}`);
  return response.data.data;
};

// DELETE /api/admin/sessions/:id
const deleteSession = async (sessionId) => {
  await api.delete(`/admin/sessions/${sessionId}`);
};
```

---

## 🔌 Axios Configuration Example

```javascript
// src/api/axiosConfig.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

## 📋 Error Handling Pattern

```javascript
try {
  const response = await api.post('/endpoint', data);
  // Success
  if (response.data.success) {
    // Handle success
  }
} catch (error) {
  // Error
  if (error.response?.status === 401) {
    // Unauthorized - redirect to login
    navigate('/login');
  } else if (error.response?.status === 403) {
    // Forbidden - not admin
    alert('You do not have permission to access this resource');
  } else if (error.response?.status === 404) {
    // Not found
    alert('Resource not found');
  } else {
    // Server error or network error
    alert(error.response?.data?.message || 'An error occurred');
  }
}
```

## 🔐 Authentication Flow

1. **User Signup/Login** → Get JWT token
2. **Store Token** → localStorage.setItem('token', token)
3. **Every Request** → Include token in Authorization header
4. **Token Expiry** → Re-login to get new token
5. **Logout** → Clear token from localStorage

```javascript
// Store token after login
const { token, user } = response.data;
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(user));

// Clear token on logout
localStorage.removeItem('token');
localStorage.removeItem('user');
```

## 📊 Response Handling Pattern

```javascript
// Pagination
if (response.data.pagination) {
  setCurrentPage(response.data.pagination.currentPage);
  setTotalPages(response.data.pagination.pages);
  setTotal(response.data.pagination.total);
}

// Data access
const data = response.data.data; // Actual response data is in .data field

// Success check
if (response.data.success) {
  // Operation successful
}
```

## ⚡ Quick Integration Checklist

- [ ] Install axios or fetch
- [ ] Setup API base URL
- [ ] Create API configuration file
- [ ] Add token to localStorage
- [ ] Setup request/response interceptors
- [ ] Test health check endpoint
- [ ] Test login flow
- [ ] Test protected routes
- [ ] Implement error handling
- [ ] Test each page's API calls
- [ ] Setup environment variables
- [ ] Test on production backend

---

**All backends endpoints are ready! Start integrating from any page and the backend will handle it. 🚀**
