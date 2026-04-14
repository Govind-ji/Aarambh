# Quick Start Guide - ARAMBH Backend

Get the ARAMBH backend running in 5 minutes!

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies (1 minute)
```bash
cd backend
npm install
```

### Step 2: Configure Environment (1 minute)
```bash
cp .env.example .env
```

Edit `.env` and set:
```env
MONGODB_URI=mongodb://localhost:27017/arambh
JWT_SECRET=your-secret-key-here-change-in-production
CORS_ORIGIN=http://localhost:5173
```

### Step 3: Start MongoDB (1 minute)
```bash
# Option 1: Local MongoDB
mongod

# Option 2: Use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env with your connection string
```

### Step 4: Start Backend (1 minute)
```bash
npm run dev
```

You should see:
```
Server running on port 5000
Connected to MongoDB
```

### Step 5: Verify (1 minute)
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "success": true,
  "message": "Server is running"
}
```

✅ **Backend is running!**

---

## 🧪 Test Authentication

### Sign Up
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

You'll get a token:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Use Token
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:5000/api/users/me
```

---

## 📝 Load Demo Data

```bash
npm run seed
```

Creates:
- 3 demo users
- 6 interview questions

**Demo Credentials:**
```
john@example.com / password123
jane@example.com / password123
admin@example.com / admin123 (admin)
```

---

## 🔌 Connect Frontend

Update your React app to use the backend:

```javascript
// src/api/axiosConfig.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

```javascript
// In your login page
import api from './api/axiosConfig';

const handleLogin = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', response.data.token);
  // Redirect to dashboard
};
```

---

## 📚 Key Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/login` | Login user |
| POST | `/auth/signup` | Register user |
| GET | `/users/me` | Get profile |
| PUT | `/users/profile` | Update profile |
| POST | `/sessions` | Create interview |
| GET | `/sessions` | Get all interviews |
| POST | `/metrics/speech/:id` | Update speech metrics |
| POST | `/metrics/confidence/:id` | Update confidence metrics |
| POST | `/reports/generate/:id` | Generate report |
| GET | `/reports` | Get reports |
| GET | `/admin/dashboard` | Admin dashboard |

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

---

## 🆘 Troubleshooting

**"connect ECONNREFUSED"**
→ MongoDB not running. Run `mongod`

**"listen EADDRINUSE :::5000"**
→ Port in use. Change PORT in `.env`

**"CORS error"**
→ Update CORS_ORIGIN in `.env` to your frontend URL

**"Not authorized to access this route"**
→ Missing token in Authorization header

---

## 📂 Project Structure

```
backend/
├── config/database.js         # Database config
├── controllers/               # Business logic
├── models/                    # Database schemas
├── routes/                    # API routes
├── middleware/                # Auth, error handling
├── server.js                  # Express app
├── package.json               # Dependencies
└── .env                       # Configuration
```

---

## ✅ Checklist

- [ ] Install dependencies
- [ ] Create `.env` file
- [ ] Start MongoDB
- [ ] Run server (`npm run dev`)
- [ ] Test health endpoint
- [ ] Test signup/login
- [ ] Connect frontend
- [ ] Test end-to-end flow

---

## 🚀 Next Steps

1. **Integrate with Frontend** → Use endpoints in React
2. **Test API** → Use Postman or cURL
3. **Deploy** → When ready for production

---

## 📘 Documentation

- **Full Setup**: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Complete API**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Frontend Integration**: [FRONTEND_INTEGRATION_GUIDE.md](./FRONTEND_INTEGRATION_GUIDE.md)
- **Implementation Details**: [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
- **Full Documentation**: [README.md](./README.md)

---

## 💡 Pro Tips

1. Use `npm run dev` in development for auto-reload
2. Store token in localStorage on frontend
3. Include token in all protected endpoint requests
4. Check browser console for network errors
5. Use Postman for API testing before frontend integration

---

**Backend is ready! Now connect your frontend and start building. 🎉**
