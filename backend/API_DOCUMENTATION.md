# ARAMBH Backend API Documentation

Complete API reference for integrating with the ARAMBH backend.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Auth Endpoints

### 1. Sign Up
**POST** `/auth/signup`

Create a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### 2. Login
**POST** `/auth/login`

Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": null
  }
}
```

### 3. Get Current User
**GET** `/auth/me`

Get authenticated user information.

**Headers:** 
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "avatar": "avatar_url",
    "bio": "Software Engineer",
    "jobTitle": "Senior Developer",
    "company": "Tech Corp",
    "location": "San Francisco",
    "role": "user",
    "status": "active",
    "totalSessions": 10,
    "completedSessions": 8,
    "averageScore": 78.5,
    "createdAt": "2024-02-20T10:30:00Z"
  }
}
```

---

## User Endpoints

### 1. Get User Profile
**GET** `/users/me`

**Headers:** 
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "jobTitle": "Senior Developer"
  }
}
```

### 2. Update Profile
**PUT** `/users/profile`

Update user profile information.

**Headers:** 
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "bio": "Passionate developer",
  "jobTitle": "Senior Software Engineer",
  "company": "Tech Corp",
  "location": "San Francisco",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "bio": "Passionate developer",
    "jobTitle": "Senior Software Engineer",
    "company": "Tech Corp",
    "location": "San Francisco",
    "avatar": "https://example.com/avatar.jpg",
    "totalSessions": 10,
    "completedSessions": 8,
    "averageScore": 78.5
  }
}
```

### 3. Change Password
**PUT** `/users/change-password`

Change user password.

**Headers:** 
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### 4. Get User Stats
**GET** `/users/:id/stats`

Get user statistics.

**Headers:** 
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalSessions": 10,
    "completedSessions": 8,
    "averageScore": 78.5,
    "lastSessionDate": "2024-02-20T10:30:00Z"
  }
}
```

---

## Settings Endpoints

### 1. Get Settings
**GET** `/settings`

**Headers:** 
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439011",
    "interviewSettings": {
      "difficulty": "medium",
      "category": "mixed",
      "duration": 30,
      "autoSave": true,
      "videoRecording": true,
      "feedbackLevel": "detailed"
    },
    "mediaSettings": {
      "cameraResolution": "720p",
      "microphoneVolume": 80,
      "enableNoiseCancellation": true
    },
    "displaySettings": {
      "theme": "dark",
      "language": "en",
      "fontSize": "medium"
    },
    "privacySettings": {
      "profilePrivacy": "private",
      "showProgressOnLeaderboard": false,
      "allowDataSharing": false
    }
  }
}
```

### 2. Update Interview Settings
**PUT** `/settings/interview`

**Headers:** 
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "difficulty": "hard",
  "category": "technical",
  "duration": 45,
  "autoSave": true,
  "videoRecording": true,
  "feedbackLevel": "comprehensive"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Interview settings updated",
  "data": { /* full settings object */ }
}
```

### 3. Update Display Settings
**PUT** `/settings/display`

**Request Body:**
```json
{
  "theme": "light",
  "language": "en",
  "fontSize": "large"
}
```

### 4. Update Privacy Settings
**PUT** `/settings/privacy`

**Request Body:**
```json
{
  "profilePrivacy": "public",
  "showProgressOnLeaderboard": true,
  "allowDataSharing": true
}
```

---

## Session Endpoints

### 1. Create Session
**POST** `/sessions`

Create a new interview session.

**Headers:** 
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Google Interview - Tech Round",
  "description": "Preparing for Google technical interview",
  "category": "technical",
  "difficulty": "hard"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Session created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439011",
    "title": "Google Interview - Tech Round",
    "description": "Preparing for Google technical interview",
    "category": "technical",
    "difficulty": "hard",
    "status": "setup",
    "createdAt": "2024-02-20T10:30:00Z"
  }
}
```

### 2. Get All Sessions
**GET** `/sessions?page=1&limit=10&status=completed`

**Headers:** 
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (setup, in-progress, completed, etc.)
- `category` (optional): Filter by category
- `difficulty` (optional): Filter by difficulty

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Google Interview",
      "status": "completed",
      "duration": 1800,
      "overallScore": 85,
      "createdAt": "2024-02-20T10:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "pages": 5,
    "total": 45
  }
}
```

### 3. Get Session Details
**GET** `/sessions/:sessionId`

**Headers:** 
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439011",
    "title": "Google Interview",
    "status": "completed",
    "startTime": "2024-02-20T10:30:00Z",
    "endTime": "2024-02-20T11:00:00Z",
    "duration": 1800,
    "overallScore": 85,
    "confidenceScore": 78,
    "transcription": "...",
    "feedback": "Good performance overall",
    "speechMetricsId": "507f1f77bcf86cd799439011",
    "confidenceMetricsId": "507f1f77bcf86cd799439011"
  }
}
```

### 4. Start Session
**PUT** `/sessions/:sessionId/start`

**Headers:** 
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Session started",
  "data": { /* updated session */ }
}
```

### 5. Pause Session
**PUT** `/sessions/:sessionId/pause`

**Headers:** 
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Session paused",
  "data": { /* updated session */ }
}
```

### 6. Resume Session
**PUT** `/sessions/:sessionId/resume`

**Headers:** 
```
Authorization: Bearer <token>
```

### 7. Complete Session
**PUT** `/sessions/:sessionId/complete`

**Headers:** 
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "transcription": "Full transcription of the interview...",
  "feedback": "Good overall performance"
}
```

### 8. Add Session Note
**POST** `/sessions/:sessionId/notes`

**Headers:** 
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "timestamp": 120,
  "note": "Stuttered while explaining algorithms"
}
```

---

## Metrics Endpoints

### 1. Update Speech Metrics
**POST** `/metrics/speech/:sessionId`

**Headers:** 
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "pace": 135,
  "clarity": 82,
  "articulation": 78,
  "fillers": 5,
  "pauseCount": 12,
  "averagePauseDuration": 2.5,
  "tone": 75,
  "overallScore": 79
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Speech metrics updated",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "sessionId": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439011",
    "pace": 135,
    "clarity": 82,
    "articulation": 78,
    "fillers": 5,
    "overallScore": 79
  }
}
```

### 2. Get Speech Metrics
**GET** `/metrics/speech/:sessionId`

**Headers:** 
```
Authorization: Bearer <token>
```

### 3. Update Confidence Metrics
**POST** `/metrics/confidence/:sessionId`

**Request Body:**
```json
{
  "eyeContact": 75,
  "facialExpressions": 68,
  "posture": 82,
  "gestures": 70,
  "nervousness": 35,
  "engagement": 80,
  "overallConfidenceScore": 74
}
```

### 4. Add Confidence Timeline
**POST** `/metrics/confidence/:sessionId/timeline`

Add real-time metrics updates during interview.

**Request Body:**
```json
{
  "timestamp": 60,
  "eyeContact": 75,
  "posture": 82,
  "gestures": 70,
  "nervousness": 35,
  "engagement": 80
}
```

### 5. Get Metrics Summary
**GET** `/metrics/:sessionId/summary`

**Headers:** 
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "session": {
      "id": "507f1f77bcf86cd799439011",
      "title": "Google Interview",
      "status": "completed",
      "startTime": "2024-02-20T10:30:00Z",
      "duration": 1800
    },
    "speechMetrics": { /* speech metrics object */ },
    "confidenceMetrics": { /* confidence metrics object */ }
  }
}
```

---

## Report Endpoints

### 1. Generate Report
**POST** `/reports/generate/:sessionId`

Generate analysis report for completed session.

**Headers:** 
```
Authorization: Bearer <token>
```

**Response (201):**
```json
{
  "success": true,
  "message": "Report generated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "sessionId": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439011",
    "title": "Google Interview - Tech Round",
    "overallScore": 79.3,
    "confidenceScore": 74,
    "speechScore": 79,
    "contentScore": 85,
    "strengths": [
      "Clear and articulate speech",
      "Excellent eye contact",
      "Comprehensive answers"
    ],
    "areasForImprovement": [
      "Reduce filler words",
      "Work on managing nervousness"
    ],
    "recommendations": [
      {
        "category": "Speech",
        "suggestion": "Record yourself and listen for filler words",
        "priority": "medium"
      }
    ],
    "executiveSummary": "Overall Score: Good (79.3/100)...",
    "detailedFeedback": "During this 30 minute interview...",
    "createdAt": "2024-02-20T11:30:00Z"
  }
}
```

### 2. Get All Reports
**GET** `/reports?page=1&limit=10&status=completed`

**Headers:** 
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Google Interview",
      "overallScore": 79,
      "confidenceScore": 74,
      "speechScore": 79,
      "createdAt": "2024-02-20T11:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "pages": 3,
    "total": 25
  }
}
```

### 3. Get Report Details
**GET** `/reports/:reportId`

**Headers:** 
```
Authorization: Bearer <token>
```

### 4. Delete Report
**DELETE** `/reports/:reportId`

**Headers:** 
```
Authorization: Bearer <token>
```

---

## Admin Endpoints

### 1. Get Dashboard
**GET** `/admin/dashboard`

**Headers:** 
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "statistics": {
      "totalUsers": 150,
      "totalSessions": 1200,
      "totalReports": 1050,
      "activeUsers": 95,
      "averageUserScore": 76.5
    },
    "recentSessions": [ /* array of recent sessions */ ],
    "recentReports": [ /* array of recent reports */ ],
    "sessionStatusDistribution": [
      { "_id": "completed", "count": 800 },
      { "_id": "in-progress", "count": 150 }
    ]
  }
}
```

### 2. Get All Users
**GET** `/admin/users?page=1&limit=10&role=user&status=active`

### 3. Get User Details
**GET** `/admin/users/:userId`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { /* full user object */ },
    "recentSessions": [ /* last 10 sessions */ ],
    "recentReports": [ /* last 5 reports */ ],
    "auditLogs": [ /* last 15 audit logs */ ]
  }
}
```

### 4. Update User Role
**PUT** `/admin/users/:userId/role`

**Request Body:**
```json
{
  "role": "admin"
}
```

### 5. Get All Sessions
**GET** `/admin/sessions?page=1&limit=10&status=completed`

### 6. Get Analytics
**GET** `/admin/analytics?dateRange=30`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "userGrowth": [
      { "_id": "2024-02-20", "count": 5 },
      { "_id": "2024-02-21", "count": 8 }
    ],
    "sessionActivity": [
      { "_id": "completed", "count": 800 },
      { "_id": "in-progress", "count": 150 }
    ],
    "averageScores": {
      "avgOverall": 76.5,
      "avgConfidence": 73.2,
      "avgSpeech": 78.1
    }
  }
}
```

### 7. Get Audit Logs
**GET** `/admin/audit-logs?page=1&limit=20&severity=error`

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Not authorized - Admin access required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Session not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Error updating profile"
}
```

---

## Frontend Integration Example

```javascript
// Using fetch
const token = localStorage.getItem('token');

async function updateProfile(profileData) {
  const response = await fetch('http://localhost:5000/api/users/profile', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(profileData)
  });

  const data = await response.json();
  return data;
}

// Using axios
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

api.put('/users/profile', profileData);
```

---

## Common Status Codes

- `200` - OK (Request succeeded)
- `201` - Created (Resource created successfully)
- `204` - No Content (Request succeeded, no content to return)
- `400` - Bad Request (Invalid parameters)
- `401` - Unauthorized (Authentication required)
- `403` - Forbidden (Authenticated but not authorized)
- `404` - Not Found (Resource not found)
- `500` - Server Error (Internal server error)

---

For more information, refer to the main [README.md](./README.md)
