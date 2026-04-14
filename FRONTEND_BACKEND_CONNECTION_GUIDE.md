# Frontend Pages - Complete Backend Connection Guide

This guide shows exactly how to update each frontend page to fetch and save data from the backend.

---

## 🔌 Setup: API Service Endpoints File

First, create `src/services/endpoints.js` to organize all API calls:

```javascript
import api from './api'; // Your axios instance

// ==================== AUTH ENDPOINTS ====================
export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  signup: (firstName, lastName, email, password, confirmPassword) => 
    api.post('/auth/signup', { firstName, lastName, email, password, confirmPassword }),
  forgotPassword: (email) => 
    api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password, confirmPassword) => 
    api.post(`/auth/reset-password/${token}`, { password, confirmPassword }),
  logout: () => 
    api.post('/auth/logout'),
};

// ==================== USER ENDPOINTS ====================
export const userAPI = {
  getProfile: () => 
    api.get('/users/me'),
  updateProfile: (profileData) => 
    api.put('/users/profile', profileData),
  changePassword: (currentPassword, newPassword, confirmPassword) => 
    api.put('/users/change-password', { currentPassword, newPassword, confirmPassword }),
  getStats: () => 
    api.get('/users/me/stats'),
};

// ==================== SETTINGS ENDPOINTS ====================
export const settingsAPI = {
  getAll: () => 
    api.get('/settings'),
  updateInterview: (settings) => 
    api.put('/settings/interview', settings),
  updateDisplay: (settings) => 
    api.put('/settings/display', settings),
  updateMedia: (settings) => 
    api.put('/settings/media', settings),
  updatePrivacy: (settings) => 
    api.put('/settings/privacy', settings),
  updateNotifications: (settings) => 
    api.put('/settings/notifications', settings),
  reset: () => 
    api.post('/settings/reset'),
};

// ==================== QUESTIONS ENDPOINTS ====================
export const questionsAPI = {
  getAll: (category, difficulty, page = 1, limit = 10) => 
    api.get('/questions', { params: { category, difficulty, page, limit } }),
  getById: (id) => 
    api.get(`/questions/${id}`),
  getRandom: (count = 5, category, difficulty) => 
    api.get('/questions/random', { params: { count, category, difficulty } }),
  getCategories: () => 
    api.get('/questions/categories/list'),
  getDifficulties: () => 
    api.get('/questions/difficulties/list'),
};

// ==================== SESSION ENDPOINTS ====================
export const sessionAPI = {
  create: (sessionData) => 
    api.post('/sessions', sessionData),
  getAll: (page = 1, limit = 10) => 
    api.get('/sessions', { params: { page, limit } }),
  getById: (id) => 
    api.get(`/sessions/${id}`),
  start: (id) => 
    api.put(`/sessions/${id}/start`),
  pause: (id) => 
    api.put(`/sessions/${id}/pause`),
  resume: (id) => 
    api.put(`/sessions/${id}/resume`),
  complete: (id) => 
    api.put(`/sessions/${id}/complete`),
  cancel: (id) => 
    api.put(`/sessions/${id}/cancel`),
  delete: (id) => 
    api.delete(`/sessions/${id}`),
};

// ==================== METRICS ENDPOINTS ====================
export const metricsAPI = {
  saveSpeech: (data) => 
    api.post('/metrics/speech', data),
  saveConfidence: (data) => 
    api.post('/metrics/confidence', data),
  getSessionMetrics: (sessionId) => 
    api.get(`/metrics/${sessionId}`),
  getSummary: () => 
    api.get('/metrics/summary'),
};

// ==================== REPORTS ENDPOINTS ====================
export const reportAPI = {
  getAll: (page = 1, limit = 10, startDate, endDate) => 
    api.get('/reports', { params: { page, limit, startDate, endDate } }),
  getById: (id) => 
    api.get(`/reports/${id}`),
  download: (id) => 
    api.get(`/reports/${id}/download`, { responseType: 'blob' }),
  getFeedback: (id) => 
    api.get(`/reports/${id}/feedback`),
  delete: (id) => 
    api.delete(`/reports/${id}`),
};

// ==================== ADMIN ENDPOINTS ====================
export const adminAPI = {
  getStats: () => 
    api.get('/admin/stats'),
  getUsers: (page = 1, limit = 20, search) => 
    api.get('/admin/users', { params: { page, limit, search } }),
  getSessions: (page = 1, limit = 20, status, userId) => 
    api.get('/admin/sessions', { params: { page, limit, status, userId } }),
  getActivity: () => 
    api.get('/admin/activity'),
};

export default {
  authAPI,
  userAPI,
  settingsAPI,
  questionsAPI,
  sessionAPI,
  metricsAPI,
  reportAPI,
  adminAPI,
};
```

---

## 📄 Page-by-Page Implementation

### 1. Profile.jsx - Updated with Backend

```javascript
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/endpoints';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    company: '',
    location: '',
    bio: '',
  });

  // Fetch profile and stats on mount
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      // Fetch profile
      const profileRes = await userAPI.getProfile();
      setProfile(profileRes.data.data);
      setFormData(profileRes.data.data);

      // Fetch stats
      const statsRes = await userAPI.getStats();
      setStats(statsRes.data.data);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to load profile',
      });
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const response = await userAPI.updateProfile(formData);
      setProfile(response.data.data);
      setIsEditing(false);
      setMessage({
        type: 'success',
        text: 'Profile updated successfully!',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update profile',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!profile) {
    return <div className="text-center py-10">Loading profile...</div>;
  }

  return (
    <div className="p-6">
      {/* Show message */}
      {message.text && (
        <div className={`mb-6 p-4 rounded ${
          message.type === 'success' ? 'bg-green-900/30' : 'bg-red-900/30'
        }`}>
          {message.text}
        </div>
      )}

      {/* Stats Section */}
      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900/50 p-4 rounded-lg">
            <p className="text-sm text-slate-400">Total Interviews</p>
            <p className="text-2xl font-bold">{stats.totalSessions || 0}</p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-lg">
            <p className="text-sm text-slate-400">Total Time</p>
            <p className="text-2xl font-bold">{stats.totalTime || '0h'}</p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-lg">
            <p className="text-sm text-slate-400">Avg Score</p>
            <p className="text-2xl font-bold">{stats.avgScore || 0}/100</p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-lg">
            <p className="text-sm text-slate-400">Member Since</p>
            <p className="text-2xl font-bold">
              {new Date(profile.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                year: 'numeric' 
              })}
            </p>
          </div>
        </div>
      )}

      {/* Profile Form */}
      <div className="bg-slate-900/50 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Profile Information</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-cyan"
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">First Name</label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Last Name</label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 disabled:opacity-50"
            />
          </div>
          {/* Continue with other fields... */}
        </div>

        {isEditing && (
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="btn-cyan"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData(profile);
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

### 2. InterviewSetup.jsx - With Backend

```javascript
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionsAPI, sessionAPI } from '../services/endpoints';

export default function InterviewSetup() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    difficulty: 'medium',
    description: '',
  });

  useEffect(() => {
    loadSetupData();
  }, []);

  const loadSetupData = async () => {
    try {
      setIsLoading(true);
      const [catRes, diffRes] = await Promise.all([
        questionsAPI.getCategories(),
        questionsAPI.getDifficulties(),
      ]);
      setCategories(catRes.data.data);
      setDifficulties(diffRes.data.data);
    } catch (error) {
      console.error('Failed to load setup data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartInterview = async () => {
    if (!formData.category || !formData.title) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setIsCreating(true);
      const response = await sessionAPI.create({
        title: formData.title,
        category: formData.category,
        difficulty: formData.difficulty,
        description: formData.description,
      });

      const sessionId = response.data.data._id;
      navigate(`/interview-live/${sessionId}`);
    } catch (error) {
      alert('Failed to create session: ' + error.response?.data?.message);
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) return <div>Loading interview setup...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Interview Setup</h1>

      <div className="bg-slate-900/50 p-6 rounded-lg space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-2">Interview Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Senior Software Engineer Role"
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">Category *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">Difficulty</label>
          <select
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2"
          >
            {difficulties.map((diff) => (
              <option key={diff} value={diff}>{diff}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Additional details about the interview..."
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 h-24"
          />
        </div>

        <button
          onClick={handleStartInterview}
          disabled={isCreating}
          className="w-full btn-cyan mt-6"
        >
          {isCreating ? 'Starting...' : 'Start Interview'}
        </button>
      </div>
    </div>
  );
}
```

---

### 3. InterviewLive.jsx - With Real-time Metrics

```javascript
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { sessionAPI, metricsAPI } from '../services/endpoints';

export default function InterviewLive() {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  const loadSession = async () => {
    try {
      const response = await sessionAPI.getById(sessionId);
      setSession(response.data.data);
      
      // Start session if not already started
      if (response.data.data.status === 'pending') {
        await sessionAPI.start(sessionId);
      }
    } catch (error) {
      console.error('Failed to load session:', error);
    }
  };

  // Save metrics in real-time
  const saveSpeechMetrics = async (metricsData) => {
    try {
      await metricsAPI.saveSpeech({
        sessionId,
        ...metricsData,
      });
    } catch (error) {
      console.error('Failed to save speech metrics:', error);
    }
  };

  const saveConfidenceMetrics = async (metricsData) => {
    try {
      await metricsAPI.saveConfidence({
        sessionId,
        ...metricsData,
      });
    } catch (error) {
      console.error('Failed to save confidence metrics:', error);
    }
  };

  const handleCompleteInterview = async () => {
    try {
      await sessionAPI.complete(sessionId);
      // Redirect to report view
      window.location.href = `/reports`;
    } catch (error) {
      alert('Failed to complete interview: ' + error.response?.data?.message);
    }
  };

  if (!session) return <div>Loading interview...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{session.title}</h1>
      
      {/* Your interview UI here */}
      {/* Call saveSpeechMetrics() and saveConfidenceMetrics() as needed */}

      <button
        onClick={handleCompleteInterview}
        className="btn-cyan mt-8"
      >
        Complete Interview
      </button>
    </div>
  );
}
```

---

### 4. ReportsList.jsx - With Backend

```javascript
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportAPI } from '../services/endpoints';

export default function ReportsList() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadReports();
  }, [page]);

  const loadReports = async () => {
    try {
      setIsLoading(true);
      const response = await reportAPI.getAll(page, 10);
      setReports(response.data.data);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (reportId) => {
    try {
      const response = await reportAPI.download(reportId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
    } catch (error) {
      alert('Failed to download report');
    }
  };

  const handleDelete = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;

    try {
      await reportAPI.delete(reportId);
      loadReports();
    } catch (error) {
      alert('Failed to delete report');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Your Reports</h1>

      {isLoading ? (
        <div>Loading reports...</div>
      ) : reports.length === 0 ? (
        <div className="text-center text-slate-400">No reports yet</div>
      ) : (
        <>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report._id} className="bg-slate-900/50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{report.title}</h3>
                    <p className="text-sm text-slate-400">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-lg font-bold mt-2">Score: {report.overallScore}/100</p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => navigate(`/reports/${report._id}`)}
                      className="btn-cyan"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDownload(report._id)}
                      className="btn-secondary"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleDelete(report._id)}
                      className="btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="btn-secondary"
            >
              Previous
            </button>
            <span className="self-center">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="btn-secondary"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
```

---

### 5. AdminDashboard.jsx - With Backend Stats

```javascript
import { useState, useEffect } from 'react';
import { adminAPI } from '../services/endpoints';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const response = await adminAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading dashboard...</div>;
  if (!stats) return <div>Failed to load statistics</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 p-6 rounded-lg">
          <p className="text-sm text-slate-400 mb-2">Total Users</p>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 p-6 rounded-lg">
          <p className="text-sm text-slate-400 mb-2">Total Sessions</p>
          <p className="text-3xl font-bold">{stats.totalSessions}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 p-6 rounded-lg">
          <p className="text-sm text-slate-400 mb-2">Average Score</p>
          <p className="text-3xl font-bold">{stats.avgScore.toFixed(1)}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-6 rounded-lg">
          <p className="text-sm text-slate-400 mb-2">Active Now</p>
          <p className="text-3xl font-bold">{stats.activeNow}</p>
        </div>
      </div>
    </div>
  );
}
```

---

## ✅ Implementation Checklist for Frontend

- [ ] Create `src/services/endpoints.js` with all endpoint definitions
- [ ] Update `Profile.jsx` to use `userAPI`
- [ ] Update `Settings.jsx` to use `settingsAPI`
- [ ] Update `InterviewSetup.jsx` to use `questionsAPI` and `sessionAPI`
- [ ] Update `InterviewLive.jsx` to save metrics in real-time
- [ ] Update `ReportsList.jsx` and `ReportView.jsx` to fetch from backend
- [ ] Update `AdminDashboard.jsx` to use `adminAPI`
- [ ] Update `AdminUsers.jsx` to use `adminAPI.getUsers()`
- [ ] Update `AdminSessions.jsx` to use `adminAPI.getSessions()`
- [ ] Add error handling to all API calls
- [ ] Add loading states
- [ ] Test all pages with real backend data

---

## 🚀 Testing Workflow

1. **Backend Ready:** Ensure all endpoints are implemented
2. **Frontend Updated:** Update each page with backend calls
3. **Test Data:** Create test user and sessions in database
4. **End-to-End:** Test full flows (signup → interview → report)
5. **Error Handling:** Test with network errors and server errors
6. **Performance:** Check loading times and optimize if needed

---

