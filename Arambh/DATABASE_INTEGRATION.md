# 📚 Database Integration Guide

## Overview

All information across the ARAMBH project is now integrated with the MongoDB database. Every action in the frontend is stored in the backend for persistence and analytics.

---

## 🎯 What Gets Stored in Database

### 1. **User Profile Data**
- First name, last name, email
- Phone number, job title, company
- Location, bio
- Avatar, role, status
- Member since date

**Storage:** Stored in `Users` collection  
**Endpoint:** `PUT /api/users/profile`  
**Hook:** `useProfile()`  

```javascript
import { useProfile } from '../hooks/useProfile';

const { updateProfile } = useProfile();
await updateProfile({
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890',
  jobTitle: 'Engineer',
  company: 'Tech Corp',
  location: 'San Francisco',
  bio: 'Passionate about interviews'
});
```

---

### 2. **Interview Sessions**
- Session title, category, difficulty
- Start time, end time, duration
- Session status (setup, in-progress, paused, completed, cancelled)
- Overall score, confidence score
- Video URL, transcriptions, feedback
- Session notes

**Storage:** Stored in `Sessions` collection  
**Endpoints:**
- `POST /api/sessions` - Create session
- `PUT /api/sessions/:id/start` - Start session
- `PUT /api/sessions/:id/pause` - Pause session
- `PUT /api/sessions/:id/resume` - Resume session
- `PUT /api/sessions/:id/complete` - Complete session
- `POST /api/sessions/:id/notes` - Add notes

**Hook:** `useSession()`

```javascript
import { useSession } from '../hooks/useSession';

const { createSession, startSession, completeSession } = useSession();

// Create session
const session = await createSession({
  title: 'Mock Interview',
  category: 'Technical',
  difficulty: 'Medium'
});

// Start session
await startSession(session._id);

// Complete session
await completeSession(session._id, {
  overallScore: 82,
  confidenceScore: 85
});
```

---

### 3. **Speech Metrics**
- Pace (words per minute)
- Clarity and articulation scores
- Filler word count
- Pause count and duration
- Tone, volume, pitch analysis
- Intonation and emphasis
- Real-time insights and recommendations

**Storage:** Stored in `SpeechMetrics` collection  
**Endpoints:**
- `POST /api/metrics/speech/:sessionId` - Create/update metrics
- `GET /api/metrics/speech/:sessionId` - Get metrics
- `POST /api/metrics/speech/:sessionId/insights` - Add insights

**Hook:** `useMetrics()`

```javascript
import { useMetrics } from '../hooks/useSession';

const { updateSpeechMetrics, getSpeechMetrics } = useMetrics();

// Update speech metrics
await updateSpeechMetrics(sessionId, {
  pace: 145,
  clarity: 85,
  articulation: 88,
  fillers: 3,
  pauseCount: 5,
  tone: 'Confident',
  volume: 75,
  pitch: 'Steady'
});

// Add insight during interview
await addSpeechInsight(sessionId, {
  metric: 'Filler Words',
  value: 2,
  feedback: 'Try to reduce filler words'
});
```

---

### 4. **Confidence Metrics**
- Eye contact percentage
- Facial expressions analysis
- Body posture evaluation
- Gesture frequency and quality
- Nervousness level
- Engagement score
- Fidgeting detection
- Emotional intelligence metrics
- Real-time timeline tracking

**Storage:** Stored in `ConfidenceMetrics` collection  
**Endpoints:**
- `POST /api/metrics/confidence/:sessionId` - Create/update metrics
- `GET /api/metrics/confidence/:sessionId` - Get metrics
- `POST /api/metrics/confidence/:sessionId/timeline` - Add timeline data

**Hook:** `useMetrics()`

```javascript
import { useMetrics } from '../hooks/useSession';

const { updateConfidenceMetrics, addConfidenceTimeline } = useMetrics();

// Update confidence metrics
await updateConfidenceMetrics(sessionId, {
  eyeContact: 80,
  posture: 85,
  gestures: 75,
  nervousness: 20,
  engagement: 85,
  smiling: 60,
  blinking: 'Normal',
  fidgeting: 10
});

// Add real-time timeline during interview
await addConfidenceTimeline(sessionId, {
  timestamp: new Date(),
  eyeContact: 82,
  nervousness: 18,
  engagement: 87
});
```

---

### 5. **Performance Reports**
- Overall score, category scores
- Confidence score, speech score, content score
- Strengths identified
- Areas for improvement
- Personalized recommendations
- Executive summary
- Detailed feedback
- Progress comparison with previous sessions

**Storage:** Stored in `Reports` collection  
**Endpoints:**
- `POST /api/reports/generate/:sessionId` - Generate report
- `GET /api/reports` - List reports
- `GET /api/reports/:id` - Get report details
- `DELETE /api/reports/:id` - Delete report

**Hook:** `useReport()`

```javascript
import { useReport } from '../hooks/useReport';

const { generateReport, fetchReports, getReport } = useReport();

// Generate report after session
const report = await generateReport(sessionId);

// Fetch all reports
const allReports = await fetchReports(page, limit);

// Get specific report
const reportDetails = await getReport(reportId);
```

---

### 6. **User Settings**
- Interview preferences (difficulty, category, duration, feedback level)
- Media settings (microphone, camera, volume, resolution)
- Notification settings (email, reminders, push notifications)
- Display settings (theme, language, font size)
- Privacy settings (profile privacy, leaderboard, data sharing)
- Analytics settings (tracking, data retention)

**Storage:** Stored in `Settings` collection  
**Endpoints:**
- `GET /api/settings` - Get all settings
- `PUT /api/settings/interview` - Update interview settings
- `PUT /api/settings/media` - Update media settings
- `PUT /api/settings/notifications` - Update notifications
- `PUT /api/settings/display` - Update display settings
- `PUT /api/settings/privacy` - Update privacy settings
- `POST /api/settings/reset` - Reset to defaults

**Hook:** `useSettings()`

```javascript
import { useSettings } from '../hooks/useSettings';

const {
  settings,
  updateInterviewSettings,
  updateMediaSettings,
  updateNotificationSettings
} = useSettings();

// Update interview settings
await updateInterviewSettings({
  difficulty: 'Hard',
  category: 'Behavioral',
  duration: 30,
  feedbackLevel: 'Detailed'
});

// Update media settings
await updateMediaSettings({
  microphone: 'HD Microphone',
  camera: 'Logitech 4K',
  volume: 80,
  resolution: '1080p'
});
```

---

### 7. **Audit Logs**
- User login/logout activities
- Session created/completed
- Report generated
- Settings changed
- Profile updated
- Admin actions
- IP address and user agent
- Timestamp and status

**Storage:** Stored in `AuditLogs` collection (Auto-expires after 90 days)  
**Endpoint:** `GET /api/admin/audit-logs`

---

## 📱 Pages and Their Database Integration

| Page | Data Stored | API Calls |
|------|------------|-----------|
| **Profile.jsx** | User profile | POST /api/users/profile |
| **Settings.jsx** | User preferences | PUT /api/settings/* |
| **Interview Setup** | Session created | POST /api/sessions |
| **Interview Live** | Metrics collected | POST /api/metrics/* |
| **Analysis Playback** | Report generated | POST /api/reports/generate |
| **Dashboard** | User stats | GET /api/users/me/stats |
| **Reports List** | Report list | GET /api/reports |
| **Admin Dashboard** | All stats | GET /api/admin/dashboard |

---

## 🔧 Using the API Service

### Import Service Functions
```javascript
import { userAPI, sessionAPI, metricsAPI, reportAPI, settingsAPI } from '../services/endpoints';

// Or use hooks
import { useProfile } from '../hooks/useProfile';
import { useSession, useMetrics } from '../hooks/useSession';
import { useReport } from '../hooks/useReport';
import { useSettings } from '../hooks/useSettings';
```

### Direct API Calls (if needed)
```javascript
// User API
await userAPI.updateProfile(profileData);
await userAPI.getProfile();
await userAPI.changePassword(currentPass, newPass);

// Session API
await sessionAPI.createSession(sessionData);
await sessionAPI.startSession(sessionId);
await sessionAPI.completeSession(sessionId, completionData);

// Metrics API
await metricsAPI.updateSpeechMetrics(sessionId, metricsData);
await metricsAPI.updateConfidenceMetrics(sessionId, metricsData);
await metricsAPI.addConfidenceTimeline(sessionId, timelineData);

// Report API
await reportAPI.generateReport(sessionId);
await reportAPI.getReports(page, limit);

// Settings API
await settingsAPI.updateInterviewSettings(settings);
await settingsAPI.updateMediaSettings(settings);
```

---

## 💾 Data Persistence Flow

```
User Action (e.g., Complete Interview)
           ↓
Component calls Hook (useSession)
           ↓
Hook calls API Function (completeSession)
           ↓
API Service sends HTTP Request
           ↓
Backend validates data
           ↓
Data saved to MongoDB
           ↓
Response returned to frontend
           ↓
Component updates UI
           ↓
User sees confirmation
```

---

## ✅ Automatic Data Collection

These are automatically collected with every request:
- ✅ User ID
- ✅ Timestamp
- ✅ IP Address
- ✅ User Agent (browser info)
- ✅ Action performed
- ✅ Resource affected

---

## 🚀 Example: Complete Session Flow

```javascript
// Step 1: Create session - Data saved to DB
import { useSession } from '../hooks/useSession';
const { createSession, startSession, completeSession } = useSession();

const session = await createSession({
  title: 'Mock Interview',
  category: 'Technical',
  difficulty: 'Medium'
});
// DB: Sessions collection updated

// Step 2: Start session - Session status updated
await startSession(session._id);
// DB: Session.status = 'in-progress'

// Step 3: Update metrics during interview
import { useMetrics } from '../hooks/useSession';
const { updateSpeechMetrics, updateConfidenceMetrics } = useMetrics();

await updateSpeechMetrics(session._id, {
  pace: 150,
  clarity: 85
  // ... more metrics
});
// DB: SpeechMetrics collection updated

await updateConfidenceMetrics(session._id, {
  eyeContact: 80,
  nervousness: 20
  // ... more metrics
});
// DB: ConfidenceMetrics collection updated

// Step 4: Complete session - Triggers report generation
import { useReport } from '../hooks/useReport';
const { generateReport } = useReport();

await completeSession(session._id, {
  overallScore: 82,
  confidence: 85,
  videoUrl: 'https://...'
});
// DB: Session marked complete, Report auto-generated

// Step 5: Report available - Can be viewed/downloaded
const report = await generateReport(session._id);
// DB: Reports collection has new report
```

---

## 🔐 Data Security

✅ All data encrypted in transit (HTTPS)  
✅ Password hashed with bcrypt  
✅ Token-based authentication  
✅ Input validation on backend  
✅ Authorization checks on all endpoints  
✅ Audit logging of all actions  
✅ Automatic data cleanup (logs expire after 90 days)  

---

## 📊 Accessing Stored Data

### From Frontend
All data automatically synced when you use the hooks/APIs. Data persists across sessions because it's stored in MongoDB.

### From Backend
Database connection: `mongodb://localhost:27017/arambh`

Collections:
- `users` - User profiles and authentication
- `sessions` - Interview sessions
- `speechmetrics` - Speech analysis
- `confidencemetrics` - Confidence analysis
- `reports` - Generated reports
- `settings` - User preferences
- `auditlogs` - Activity logs (auto-expires)
- `interviewquestions` - Question bank

---

## 🔄 Syncing Data

Data automatically syncs when:
1. User logs in (fetches latest profile)
2. Page loads (fetches relevant data)
3. User performs action (updates immediately)
4. Component mounts (uses hooks to fetch data)

---

## 🎓 Next Steps

1. **Try saving profile** - Click Edit Profile, change data, click Save
2. **Create interview** - Start an interview session, data saves to DB
3. **Collect metrics** - During interview, metrics auto-save in real-time
4. **Generate report** - After interview, report auto-generated and saved
5. **Check admin panel** - All data visible in admin dashboard

All data is now **persistent** and **backed up** in the database! 🎉

---

## 📞 Troubleshooting

**Data not saving?**
- Check backend is running: `npm run dev` in `/backend`
- Check MongoDB is running: `mongod`
- Check network tab in DevTools for errors

**API call failing?**
- Verify token is in localStorage
- Check DevTools → Network tab
- Check backend logs for error details

**Data not appearing in DB?**
- Wait for response from API (check network tab)
- Verify collection names match above
- Use MongoDB Compass to inspect database
