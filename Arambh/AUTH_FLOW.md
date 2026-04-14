# Authentication Flow Guide - ARAMBH

## 🔐 Complete Authentication Setup

Your ARAMBH application now has a complete authentication system with:
- ✅ User signup (create new account)
- ✅ User login (authenticate with credentials)
- ✅ Token management (JWT with 7-day expiration)
- ✅ Protected routes (redirects to login if not authenticated)
- ✅ Persistent sessions (stays logged in on page refresh)
- ✅ Auto logout (when token expires)

---

## 🎯 User Flow

### New User
```
1. Visit http://localhost:5173
   ↓
2. Redirected to /login
   ↓
3. Click "Sign Up" → Goes to /signup
   ↓
4. Enter First Name, Last Name, Email, Password
   ↓
5. Click "Create Account"
   ↓ Auth Context calls POST /api/auth/signup
   ↓
6. Account created successfully
   ↓
7. Redirected back to /login
   ↓
8. Login with same email + password
   ↓ Auth Context calls POST /api/auth/login
   ↓
9. Token received and stored
   ↓
10. Redirected to /dashboard
```

### Existing User
```
1. Visit http://localhost:5173
   ↓
2. Redirected to /login
   ↓
3. Enter Email and Password
   ↓
4. Click "Sign In"
   ↓ Auth Context calls POST /api/auth/login
   ↓
5. Token received and stored
   ↓
6. Redirected to /dashboard
   ↓
7. Access all protected pages
```

### Session Persistence
```
User logs in → Token stored in localStorage
                ↓
User refreshes page → App reads token from localStorage
                      ↓
                      User stays logged in
```

### Token Expiration
```
Token expires after 7 days
                ↓
User makes request with expired token
                ↓
Server returns 401 Unauthorized
                ↓
API interceptor detects 401
                ↓
Clears token from localStorage
                ↓
Redirects user to /login
```

---

## 🏗️ Architecture

### AuthContext (`src/context/AuthContext.jsx`)
Central hub for authentication state management:

```javascript
{
  user,              // Current logged-in user object
  token,             // JWT token (stored in localStorage)
  loading,           // Loading state during API calls
  error,             // Error messages from auth operations
  isAuthenticated,   // Boolean: user is logged in
  signup(),          // Function to register new user
  login(),           // Function to login existing user
  logout(),          // Function to logout user
  getCurrentUser()   // Function to fetch current user from API
}
```

### API Service (`src/services/api.js`)
Axios instance with automatic token injection:

```javascript
// Request Interceptor
// Automatically adds: Authorization: Bearer {token}
// To every request

// Response Interceptor
// Catches 401 errors
// Clears token & redirects to login
```

### PrivateRoute (`src/components/PrivateRoute.jsx`)
Protects authenticated pages:

```javascript
<PrivateRoute>
  <MainLayout />  {/* All protected routes inside */}
</PrivateRoute>
```

Protected routes:
- ✓ /dashboard
- ✓ /profile
- ✓ /settings
- ✓ /system-test
- ✓ /interview-*
- ✓ /analysis-*
- ✓ /reports
- ✓ /admin-*

---

## 🔧 Setup Instructions

### 1. Backend Server Running
```bash
cd backend
npm install
npm run dev
# Server starts on http://localhost:5000
```

### 2. Frontend with Backend Connection
Frontend is already configured to call:
```
http://localhost:5000/api
```

Located in: `src/services/api.js`

### 3. Start Frontend
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 📝 Test the Flow

### Test 1: New User Signup
```
1. Go to http://localhost:5173
2. You'll be redirected to /login
3. Click "Sign Up" link
4. Fill the form:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Password: password123
5. Click "Create Account"
6. Should see: ✓ Redirected back to login
7. Login with: john@example.com / password123
8. Should see: ✓ Redirected to /dashboard
```

### Test 2: Use Demo Account
From seed.js, demo user created:
```
Email: john@example.com
Password: password123
```

Or admin account:
```
Email: admin@example.com
Password: admin123
```

### Test 3: Password Validation
```
1. Go to /signup
2. Try password less than 6 characters
3. Should see error: "Password must be at least 6 characters"
```

### Test 4: Session Persistence
```
1. Login to your account
2. Refresh the page (Ctrl+R)
3. You should STAY logged in
4. Check browser DevTools → Application → LocalStorage
5. See: 'token' and 'user' stored
```

### Test 5: Token Expiration
```
1. Login with demo account
2. Wait 7 days (or modify JWT_EXPIRE in backend .env)
3. Make any request to protected endpoint
4. You'll be logged out automatically
5. Redirected to /login
```

---

## 🔄 API Integration Example

When a page needs to make authenticated requests:

```javascript
// In any component
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function MyComponent() {
  const { user, token, logout } = useAuth();

  // Make API call - token automatically added to header
  const fetchData = async () => {
    try {
      const response = await api.get('/dashboard-data');
      console.log(response.data);
    } catch (error) {
      console.error('Failed to fetch:', error);
    }
  };

  return (
    <div>
      <p>Logged in as: {user?.email}</p>
      <button onClick={logout}>Logout</button>
      <button onClick={fetchData}>Load Data</button>
    </div>
  );
}
```

---

## 📱 Frontend Pages Status

All these pages will now:
1. ✓ Require login to access
2. ✓ Have token automatically included in API calls
3. ✓ Redirect to login if token is missing/expired

**Core Pages:**
- Dashboard
- Profile  
- Settings
- System Test

**Interview Pages:**
- Interview Setup
- Interview Live
- Interview Paused

**Analysis Pages:**
- Analysis Live
- Analysis Playback

**Report Pages:**
- Reports List
- Report View

**Admin Pages:**
- Admin Dashboard
- Admin Users
- Admin Sessions

---

## 🐛 Troubleshooting

### Issue: Can't signup/login
**Solution:**
1. Check backend is running: `npm run dev` in `/backend`
2. Check backend is on port 5000: Verify in `backend/.env`
3. Check frontend API_BASE_URL: See `src/services/api.js`
4. Check MongoDB connection: See backend console

### Issue: "CORS error" in console
**Solution:**
1. Ensure backend CORS_ORIGIN is set to `http://localhost:5173`
2. In `backend/.env`:
   ```
   CORS_ORIGIN=http://localhost:5173
   ```

### Issue: Login works but immediately logs out
**Solution:**
1. Check JWT_SECRET is set in backend `.env`
2. Restart backend server after changing .env
3. Check token expiration time: `JWT_EXPIRE=7d`

### Issue: Page still lets you access after logout
**Solution:**
1. Clear localStorage: `localStorage.clear()`
2. Refresh page: Ctrl+Shift+R (hard refresh)
3. Check PrivateRoute wrapper in App.jsx

---

## 🔐 Security Implementation

### Password Security
✓ Sent over HTTPS (in production)  
✓ Hashed with bcrypt on server  
✓ Never stored in plain text  
✓ Minimum 6 characters  

### Token Security
✓ JWT with 7-day expiration  
✓ Stored in browser localStorage  
✓ Automatically added to all requests  
✓ Removed on 401 response  

### Request Security
✓ All sensitive requests require token  
✓ Invalid tokens rejected  
✓ Token verified on server  
✓ Admin routes require admin role  

---

## 📚 File Structure

```
src/
├── context/
│   └── AuthContext.jsx        ← Global auth state
├── services/
│   └── api.js                 ← Axios with interceptors
├── components/
│   └── PrivateRoute.jsx       ← Route protection
├── pages/
│   ├── Login.jsx              ← Updated with API calls
│   └── Signup.jsx             ← Updated with API calls
├── App.jsx                    ← Updated with PrivateRoute
└── main.jsx                   ← Updated with AuthProvider
```

---

## 🚀 Next Steps

1. **Test Authentication** (see Test the Flow above)
2. **Implement User Features** (profile updates, settings)
3. **Add Interview Functionality** (create sessions, collect metrics)
4. **Build Report Generation** (create and view reports)
5. **Admin Panel** (user management, analytics)

---

## 💡 Useful Commands

```bash
# Start backend
cd backend && npm run dev

# Start frontend  
cd Arambh && npm run dev

# Seed demo data (in backend folder)
npm run seed

# Clear browser cache & localStorage
# DevTools → Application → Storage → Clear All

# Build for production
npm run build

# View frontend build
npm run preview
```

---

## ✅ Implementation Checklist

- ✅ AuthContext created
- ✅ API service with Axios configured
- ✅ PrivateRoute component implemented
- ✅ Login page updated with API calls
- ✅ Signup page updated with API calls
- ✅ App.jsx routing updated with protection
- ✅ main.jsx wrapped with AuthProvider
- ✅ axios dependency installed
- ✅ Token interceptor setup
- ✅ Auto logout on token expiration
- ✅ Session persistence implemented

---

**Your authentication system is now complete and ready to use! 🎉**

For more details, see the backend documentation in `/backend/FRONTEND_INTEGRATION_GUIDE.md`
