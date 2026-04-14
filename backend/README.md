# ARAMBH Backend API

Complete Node.js/Express backend for the ARAMBH Interview Analysis and Practice Platform.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Response Format](#response-format)

## Installation

```bash
cd backend
npm install
```

### Required Dependencies

- express - Web server framework
- mongoose - MongoDB ODM
- jsonwebtoken - JWT authentication
- bcryptjs - Password hashing
- cors - CORS middleware
- dotenv - Environment variables
- express-validator - Input validation

## Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/arambh

# JWT
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Database Setup

1. Start MongoDB locally or use cloud MongoDB
2. Connection string format: `mongodb://username:password@host:port/database`

## Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Server will start on `http://localhost:5000` (or configured PORT)

## Database Schema

### Collections

#### Users
- Authentication and user profile information
- Fields: firstName, lastName, email, password, phone, avatar, bio, jobTitle, company, location, role, status, totalSessions, completedSessions, averageScore, preferences

#### Sessions
- Interview session records
- Fields: userId, title, description, category, difficulty, status, startTime, endTime, duration, questions, overallScore, confidenceScore, videoUrl, transcription, feedback, notes

#### SpeechMetrics
- Speech analysis for interviews
- Fields: sessionId, userId, pace, clarity, articulation, fillers, pauseCount, tone, volume, pitch, intonation, emphasis, completeness, accuracy, relevance, overallScore, insights, recommendations

#### ConfidenceMetrics
- Body language and confidence analysis
- Fields: sessionId, userId, eyeContact, facialExpressions, posture, gestures, fidgeting, responseTime, nervousness, engagement, empathy, authenticity, overallConfidenceScore, metricsByTimestamp, insights

#### Reports
- Generated analysis reports
- Fields: sessionId, userId, title, description, overallScore, confidenceScore, speechScore, contentScore, categories, speechAnalysis, confidenceAnalysis, contentAnalysis, strengths, areasForImprovement, recommendations, progressComparison, executiveSummary, status

#### Settings
- User preferences and configurations
- Fields: userId, interviewSettings, mediaSettings, notificationSettings, displaySettings, analyticsSettings, privacySettings, advancedSettings

#### AuditLogs
- System activity logs for admin purposes
- Fields: userId, action, resourceType, resourceId, details, ipAddress, userAgent, status, errorMessage, severity, duration, metadata, expiresAt (TTL)

#### InterviewQuestion
- Question bank for interviews
- Fields: text, category, difficulty, topic, expectedDuration, keywords, suggestedAnswer, evaluationCriteria, followUpQuestions, sampleAnswers, isActive, usageCount, averageScore, createdBy, source

## API Endpoints

### Authentication (`/api/auth`)
- `POST /signup` - Register new user
- `POST /login` - Login user
- `POST /forgot-password` - Request password reset
- `POST /reset-password/:resetToken` - Reset password
- `GET /me` - Get current user (Protected)
- `POST /logout` - Logout (Protected)

### Users (`/api/users`)
- `GET /me` - Get user profile (Protected)
- `PUT /profile` - Update user profile (Protected)
- `PUT /change-password` - Change password (Protected)
- `GET /:id/stats` - Get user statistics (Protected)
- `GET /` - Get all users (Admin)
- `GET /:id` - Get user by ID (Admin)
- `PUT /:id/status` - Update user status (Admin)
- `DELETE /:id` - Delete user (Admin)

### Settings (`/api/settings`)
- `GET /` - Get user settings (Protected)
- `PUT /interview` - Update interview settings (Protected)
- `PUT /media` - Update media settings (Protected)
- `PUT /notifications` - Update notification settings (Protected)
- `PUT /display` - Update display settings (Protected)
- `PUT /privacy` - Update privacy settings (Protected)
- `POST /reset` - Reset to default settings (Protected)

### Sessions (`/api/sessions`)
- `POST /` - Create new session (Protected)
- `GET /` - Get all sessions (Protected)
- `GET /:id` - Get session details (Protected)
- `PUT /:id/start` - Start session (Protected)
- `PUT /:id/pause` - Pause session (Protected)
- `PUT /:id/resume` - Resume session (Protected)
- `PUT /:id/complete` - Complete session (Protected)
- `PUT /:id/cancel` - Cancel session (Protected)
- `DELETE /:id` - Delete session (Protected)
- `POST /:id/notes` - Add session note (Protected)

### Metrics (`/api/metrics`)
- `POST /speech/:sessionId` - Update speech metrics (Protected)
- `GET /speech/:sessionId` - Get speech metrics (Protected)
- `POST /speech/:sessionId/insights` - Add speech insight (Protected)
- `POST /confidence/:sessionId` - Update confidence metrics (Protected)
- `GET /confidence/:sessionId` - Get confidence metrics (Protected)
- `POST /confidence/:sessionId/insights` - Add confidence insight (Protected)
- `POST /confidence/:sessionId/timeline` - Add confidence timeline (Protected)
- `GET /:sessionId/summary` - Get metrics summary (Protected)

### Reports (`/api/reports`)
- `POST /generate/:sessionId` - Generate report (Protected)
- `GET /` - Get all reports (Protected)
- `GET /:id` - Get report details (Protected)
- `DELETE /:id` - Delete report (Protected)

### Admin (`/api/admin`)
- `GET /dashboard` - Get dashboard statistics (Admin)
- `GET /users` - Get all users (Admin)
- `GET /users/:id` - Get user details (Admin)
- `PUT /users/:id/role` - Update user role (Admin)
- `GET /sessions` - Get all sessions (Admin)
- `GET /sessions/:id` - Get session details (Admin)
- `DELETE /sessions/:id` - Delete session (Admin)
- `GET /reports` - Get all reports (Admin)
- `GET /analytics` - Get analytics (Admin)
- `GET /audit-logs` - Get audit logs (Admin)

## Authentication

### JWT Token Format

```
Authorization: Bearer <token>
```

### Token Generation

Tokens are generated on login/signup and expire after 7 days (configurable).

Include token in Authorization header for protected routes:

```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

### User Roles

- `user` - Regular user
- `admin` - Administrator with full access

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* response data */ }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "error": "Additional error info (development only)"
}
```

### Pagination Response

```json
{
  "success": true,
  "data": [ /* array of items */ ],
  "pagination": {
    "currentPage": 1,
    "pages": 5,
    "total": 45
  }
}
```

## Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Development

### Project Structure

```
backend/
├── config/          # Configuration files
├── controllers/     # Business logic
├── middleware/      # Express middleware
├── models/         # Mongoose models
├── routes/         # API routes
├── utils/          # Utility functions
├── server.js       # Entry point
└── package.json
```

### Adding New Endpoints

1. Create controller in `controllers/`
2. Create route in `routes/`
3. Import route in `server.js`
4. Update this documentation

### Database Migrations

MongoDB doesn't require migrations, but ensure models match frontend expectations.

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Configure production `MONGODB_URI`
4. Set `CORS_ORIGIN` to frontend URL
5. Use process manager (PM2, Docker)
6. Setup SSL/HTTPS
7. Configure proper logging
8. Setup monitoring and alerts

## Troubleshooting

### Connection Issues
- Verify MongoDB is running
- Check `MONGODB_URI` configuration
- Ensure network connectivity

### Authentication Issues
- Verify JWT_SECRET is set
- Check token format in headers
- Ensure token hasn't expired

### CORS Issues
- Verify frontend URL in `CORS_ORIGIN`
- Check browser console for CORS errors
- Ensure credentials flag in frontend requests if needed

## Support

For issues or questions, refer to the project documentation or create an issue in the repository.
