# ARAMBH Backend Setup Guide

Step-by-step guide to set up and run the ARAMBH backend locally.

## Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (local or cloud instance)
- **npm** or **yarn**

## Installation Steps

### 1. Install Dependencies

```bash
cd backend
npm install
```

All dependencies will be installed from `package.json`:
- express
- mongoose
- jsonwebtoken
- bcryptjs
- cors
- dotenv
- express-validator
- multer
- uuid
- moment

### 2. Configure Environment Variables

Copy the example environment file and update it:

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/arambh

# JWT Configuration
JWT_SECRET=your_very_secret_key_change_in_production_12345
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Optional: Email Configuration (for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Optional: AWS S3 Configuration (for file uploads)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_BUCKET_NAME=arambh-uploads
AWS_REGION=us-east-1
```

### 3. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**Cloud MongoDB (MongoDB Atlas):**
- Create account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
- Create cluster and database
- Get connection string
- Update `MONGODB_URI` in `.env`

### 4. Seed Initial Data (Optional)

Populate database with demo users and interview questions:

```bash
npm run seed
```

This creates:
- 3 demo users (2 regular users + 1 admin)
- 6 sample interview questions

**Demo Credentials:**
- User: john@example.com / password123
- User: jane@example.com / password123
- Admin: admin@example.com / admin123

### 5. Start the Server

#### Development Mode (with auto-reload)
```bash
npm run dev
```

Server runs on: `http://localhost:5000`

#### Production Mode
```bash
npm start
```

## Verification

### Health Check

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-02-20T10:30:00Z"
}
```

### Test Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## Project Structure

```
backend/
├── config/
│   └── database.js           # MongoDB connection
├── controllers/
│   ├── authController.js     # Auth logic
│   ├── userController.js     # User management
│   ├── settingsController.js # User settings
│   ├── sessionController.js  # Interview sessions
│   ├── metricsController.js  # Speech & confidence metrics
│   ├── reportController.js   # Report generation
│   └── adminController.js    # Admin operations
├── middleware/
│   ├── auth.js              # JWT verification
│   ├── admin.js             # Admin access check
│   └── errorHandler.js      # Error handling
├── models/
│   ├── User.js              # User schema
│   ├── Session.js           # Interview session schema
│   ├── SpeechMetrics.js     # Speech analysis schema
│   ├── ConfidenceMetrics.js # Confidence analysis schema
│   ├── Report.js            # Report schema
│   ├── Settings.js          # User settings schema
│   ├── AuditLog.js          # Activity logs schema
│   └── InterviewQuestion.js # Question bank schema
├── routes/
│   ├── authRoutes.js        # /api/auth
│   ├── userRoutes.js        # /api/users
│   ├── settingsRoutes.js    # /api/settings
│   ├── sessionRoutes.js     # /api/sessions
│   ├── metricsRoutes.js     # /api/metrics
│   ├── reportRoutes.js      # /api/reports
│   └── adminRoutes.js       # /api/admin
├── utils/
│   └── tokenUtils.js        # JWT utilities
├── scripts/
│   └── seed.js              # Database seed script
├── server.js                # Express app entry point
├── package.json             # Dependencies
├── .env.example             # Environment template
├── README.md                # Full documentation
├── API_DOCUMENTATION.md     # API reference
└── SETUP_GUIDE.md          # This file
```

## Database Models Overview

### User
- Stores user profile and authentication information
- Tracks session history and average scores
- Supports admin role

### Session
- Interview session records
- Tracks status (setup, in-progress, completed, etc.)
- Links to metrics and reports

### SpeechMetrics
- Speech quality analysis
- Pace, clarity, articulation, filler words
- Insights and recommendations

### ConfidenceMetrics
- Body language analysis
- Eye contact, posture, gestures, nervousness
- Time-based metrics for analysis

### Report
- Generated performance reports
- Overall and category scores
- Strengths, improvements, recommendations

### Settings
- User preferences for interviews
- Media/audio/video settings
- Display and privacy preferences

### AuditLog
- Records all system activities
- User actions and admin operations
- Automatic cleanup after 90 days (TTL)

### InterviewQuestion
- Bank of interview questions
- Different categories and difficulties
- Sample answers and evaluation criteria

## API Endpoints Summary

### Authentication
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password/:token` - Reset password
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/me` - Get profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/change-password` - Change password

### Settings
- `GET /api/settings` - Get settings
- `PUT /api/settings/interview` - Interview settings
- `PUT /api/settings/display` - Display settings
- `PUT /api/settings/privacy` - Privacy settings

### Sessions
- `POST /api/sessions` - Create session
- `GET /api/sessions` - List sessions
- `GET /api/sessions/:id` - Get session
- `PUT /api/sessions/:id/start` - Start session
- `PUT /api/sessions/:id/complete` - Complete session

### Metrics
- `POST /api/metrics/speech/:sessionId` - Update speech metrics
- `POST /api/metrics/confidence/:sessionId` - Update confidence metrics
- `GET /api/metrics/:sessionId/summary` - Get summary

### Reports
- `POST /api/reports/generate/:sessionId` - Generate report
- `GET /api/reports` - List reports
- `GET /api/reports/:id` - Get report

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - All users
- `GET /api/admin/sessions` - All sessions
- `GET /api/admin/analytics` - Analytics
- `GET /api/admin/audit-logs` - Activity logs

## Frontend Integration

### Update Frontend API Base URL

In your React frontend (e.g., `src/api/axiosConfig.js` or similar):

```javascript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Login Implementation

```javascript
async function handleLogin(email, password) {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password
    });
    
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      // Redirect to dashboard
      navigate('/dashboard');
    }
  } catch (error) {
    console.error('Login failed:', error.response.data.message);
  }
}
```

### Create Session Implementation

```javascript
async function createNewSession(sessionData) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      'http://localhost:5000/api/sessions',
      sessionData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    return response.data.data;
  } catch (error) {
    console.error('Error creating session:', error.response.data.message);
  }
}
```

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Ensure MongoDB is running with `mongod` command

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution:** Change PORT in `.env` or kill process using port 5000

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** 
1. Update `CORS_ORIGIN` in `.env` to match frontend URL
2. Ensure headers are correct in frontend requests

### Invalid Token Error
```
Not authorized to access this route
```
**Solution:**
1. Check token is stored and included in headers
2. Verify token hasn't expired (7 days)
3. Re-login to get new token

### Database Validation Error
```
ValidationError: password: ...
```
**Solution:** 
1. Check required fields are provided
2. Verify data types match schema
3. Refer to API documentation

## Development Tips

### Monitor Logs
```bash
npm run dev  # Shows all request logs
```

### Test Endpoints with cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get profile (replace TOKEN)
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/users/me
```

### Test with Postman
1. Download [Postman](https://www.postman.com)
2. Import API collection
3. Set `{{base_url}}` to `http://localhost:5000/api`
4. Set `{{token}}` from login response

## Production Deployment

### Prepare for Production

1. **Update .env**
   ```env
   NODE_ENV=production
   JWT_SECRET=<strong-random-secret>
   MONGODB_URI=<production-mongodb-uri>
   CORS_ORIGIN=<production-frontend-url>
   ```

2. **Use Production Database**
   - MongoDB Atlas or similar managed service
   - Enable authentication
   - Setup backups

3. **Set Strong Secrets**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **Use Process Manager** (PM2)
   ```bash
   npm install -g pm2
   pm2 start server.js --name "arambh-api"
   pm2 save
   ```

5. **Setup Reverse Proxy** (Nginx)
   ```nginx
   server {
     listen 80;
     location / {
       proxy_pass http://localhost:5000;
     }
   }
   ```

6. **Enable SSL** (Let's Encrypt)
   ```bash
   certbot certonly -d yourdomain.com
   ```

## Support & Resources

- [Express.js Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [JWT Guide](https://jwt.io/introduction)
- [Mongoose ODM](https://mongoosejs.com)

## Next Steps

1. ✅ Backend is now set up and running
2. Next: Connect frontend to backend APIs
3. Update frontend API calls to use backend endpoints
4. Test authentication flow end-to-end
5. Deploy to cloud when ready

---

Need help? Check [README.md](./README.md) or [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
