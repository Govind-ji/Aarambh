# 🗂️ Database Integration - Quick Reference

## API Endpoints Available

### Authentication
```
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
POST   /api/auth/forgot-password
POST   /api/auth/reset-password/:token
```

### User Profile
```
GET    /api/users/me
PUT    /api/users/profile
PUT    /api/users/change-password
GET    /api/users/me/stats
```

### Settings
```
GET    /api/settings
PUT    /api/settings/interview
PUT    /api/settings/media
PUT    /api/settings/notifications
PUT    /api/settings/display
PUT    /api/settings/privacy
POST   /api/settings/reset
```

### Sessions
```
POST   /api/sessions
GET    /api/sessions
GET    /api/sessions/:id
PUT    /api/sessions/:id/start
PUT    /api/sessions/:id/pause
PUT    /api/sessions/:id/resume
PUT    /api/sessions/:id/complete
PUT    /api/sessions/:id/cancel
DELETE /api/sessions/:id
POST   /api/sessions/:id/notes
```

### Metrics
```
POST   /api/metrics/speech/:sessionId
GET    /api/metrics/speech/:sessionId
POST   /api/metrics/speech/:sessionId/insights

POST   /api/metrics/confidence/:sessionId
GET    /api/metrics/confidence/:sessionId
POST   /api/metrics/confidence/:sessionId/insights
POST   /api/metrics/confidence/:sessionId/timeline

GET    /api/metrics/summary/:sessionId
```

### Reports
```
POST   /api/reports/generate/:sessionId
GET    /api/reports
GET    /api/reports/:id
DELETE /api/reports/:id
```

### Admin
```
GET    /api/admin/dashboard
GET    /api/admin/users
GET    /api/admin/users/:id
PUT    /api/admin/users/:id/role
GET    /api/admin/sessions
GET    /api/admin/sessions/:id
DELETE /api/admin/sessions/:id
GET    /api/admin/reports
GET    /api/admin/analytics
GET    /api/admin/audit-logs
```

---

## React Hooks Available

### useProfile()
```javascript
import { useProfile } from '../hooks/useProfile';

const {
  profile,
  loading,
  error,
  fetchProfile,
  updateProfile,
  getStats
} = useProfile();
```

### useSession() & useMetrics()
```javascript
import { useSession, useMetrics } from '../hooks/useSession';

// useSession
const {
  sessions,
  loading,
  error,
  createSession,
  fetchSessions,
  startSession,
  pauseSession,
  completeSession,
  deleteSession
} = useSession();

// useMetrics
const {
  loading,
  error,
  updateSpeechMetrics,
  getSpeechMetrics,
  updateConfidenceMetrics,
  getConfidenceMetrics,
  addConfidenceTimeline,
  getMetricsSummary
} = useMetrics();
```

### useReport()
```javascript
import { useReport } from '../hooks/useReport';

const {
  reports,
  loading,
  error,
  generateReport,
  fetchReports,
  getReport,
  deleteReport
} = useReport();
```

### useSettings()
```javascript
import { useSettings } from '../hooks/useSettings';

const {
  settings,
  loading,
  error,
  updateInterviewSettings,
  updateMediaSettings,
  updateNotificationSettings,
  updateDisplaySettings,
  updatePrivacySettings,
  resetSettings
} = useSettings();
```

---

## Direct API Calls

```javascript
import { 
  authAPI, 
  userAPI, 
  sessionAPI, 
  metricsAPI, 
  reportAPI, 
  settingsAPI 
} from '../services/endpoints';

// User Profile
await userAPI.updateProfile({ firstName: 'John' });
await userAPI.getProfile();
await userAPI.getUserStats();

// Sessions
await sessionAPI.createSession({ title: 'Interview' });
await sessionAPI.getSessions(1, 10);
await sessionAPI.startSession(sessionId);

// Metrics
await metricsAPI.updateSpeechMetrics(sessionId, metricsData);
await metricsAPI.getSpeechMetrics(sessionId);

// Reports
await reportAPI.generateReport(sessionId);
await reportAPI.getReports(1, 10);

// Settings
await settingsAPI.getSettings();
await settingsAPI.updateInterviewSettings(settingsData);
```

---

## Database Collections

| Collection | Purpose | Fields |
|-----------|---------|--------|
| **users** | User accounts | firstName, lastName, email, password (hashed), phone, jobTitle, company, location, bio, role, status, totalSessions, completedSessions, averageScore |
| **sessions** | Interview sessions | userId, title, category, difficulty, status, startTime, endTime, duration, overallScore, videoUrl, transcription |
| **speechmetrics** | Speech analysis | sessionId, userId, pace, clarity, articulation, fillers, pauseCount, tone, volume, pitch, overallScore, insights |
| **confidencemetrics** | Confidence analysis | sessionId, userId, eyeContact, posture, gestures, nervousness, engagement, overallConfidenceScore, metricsByTimestamp |
| **reports** | Performance reports | sessionId, userId, title, overallScore, confidenceScore, speechScore, contentScore, strengths, areasForImprovement, recommendations |
| **settings** | User preferences | userId, interviewSettings, mediaSettings, notificationSettings, displaySettings, privacySettings, analyticsSettings |
| **auditlogs** | Activity logs | userId, action, resourceType, resourceId, status, timestamp, expiresAt (auto-delete after 90 days) |
| **interviewquestions** | Question bank | text, category, difficulty, topic, keywords, evaluationCriteria, sampleAnswers |

---

## Common Tasks

### Save User Profile
```javascript
const { updateProfile } = useProfile();
await updateProfile({
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890'
});
```

### Create & Complete Interview
```javascript
const { createSession, startSession, completeSession } = useSession();

// Create
const session = await createSession({
  title: 'Mock Interview',
  category: 'Technical'
});

// Start
await startSession(session._id);

// Complete
await completeSession(session._id, {
  overallScore: 82
});
```

### Save Metrics During Interview
```javascript
const { updateSpeechMetrics, updateConfidenceMetrics } = useMetrics();

await updateSpeechMetrics(sessionId, {
  pace: 150,
  clarity: 85
});

await updateConfidenceMetrics(sessionId, {
  eyeContact: 80,
  nervousness: 20
});
```

### Generate & View Reports
```javascript
const { generateReport, fetchReports } = useReport();

// Generate
await generateReport(sessionId);

// Fetch all
const reports = await fetchReports(1, 10);
```

### Update Settings
```javascript
const { updateInterviewSettings } = useSettings();

await updateInterviewSettings({
  difficulty: 'Hard',
  duration: 30
});
```

---

## Error Handling

```javascript
import { useSession } from '../hooks/useSession';

const { createSession, error, loading } = useSession();

const handleCreate = async () => {
  try {
    const session = await createSession(data);
    console.log('Success:', session);
  } catch (err) {
    console.error('Error:', error);
    // Show error toast/alert to user
  }
};
```

---

## Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | OK | Request succeeded |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid data |
| 401 | Unauthorized | Need to login |
| 403 | Forbidden | Not allowed |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Backend issue |

---

## Tips

✅ Always check `loading` and `error` states  
✅ Use hooks instead of direct API calls  
✅ data auto-validates on backend  
✅ Token auto-added to all requests  
✅ 401 error → auto redirects to login  
✅ All timestamps in UTC  
✅ Passwords auto-hashed  
✅ IDs are MongoDB ObjectIDs  

---

See **DATABASE_INTEGRATION.md** for detailed guide!
