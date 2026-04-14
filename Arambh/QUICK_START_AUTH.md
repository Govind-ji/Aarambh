# 🚀 Quick Start Guide - Authentication Flow

## Prerequisites
- ✅ Backend running on port 5000
- ✅ Frontend dependencies installed
- ✅ MongoDB running

---

## 5-Minute Setup

### Step 1: Start the Backend (Terminal 1)
```bash
cd backend
npm run dev
```

**Expected Output:**
```
Connected to MongoDB
Server running on port 5000
```

### Step 2: Seed Demo Data (Terminal 2)
```bash
cd backend
npm run seed
```

**Demo Accounts Created:**
```
👤 User Account
   Email: john@example.com
   Password: password123

👨‍💼 Admin Account  
   Email: admin@example.com
   Password: admin123
```

### Step 3: Start the Frontend (Terminal 3)
```bash
cd Arambh
npm run dev
```

**Expected Output:**
```
VITE v7.3.1 running at:
➜  Local:   http://localhost:5173/
```

### Step 4: Open in Browser
Click the link or visit: **http://localhost:5173**

---

## 🎯 Test Scenarios

### Scenario 1: Login with Demo Account (2 min)
```
1. Page opens at /login
2. Enter:
   - Email: john@example.com
   - Password: password123
3. Click "Sign In"
4. ✓ Should redirect to /dashboard
5. ✓ You're now logged in!
```

### Scenario 2: Create New Account (3 min)
```
1. At /login, click "Sign Up"
2. Fill form:
   - First Name: Jane
   - Last Name: Smith
   - Email: jane@example.com
   - Password: password123
3. Click "Create Account"
4. ✓ Redirected back to /login
5. Login with new credentials:
   - Email: jane@example.com
   - Password: password123
6. ✓ Should redirect to /dashboard
```

### Scenario 3: Test Session Persistence (2 min)
```
1. Login with any account
2. Refresh page (Ctrl+R)
3. ✓ Should STAY logged in (no redirect to login)
4. Open DevTools → Application → LocalStorage
5. ✓ See 'token' and 'user' keys stored
```

### Scenario 4: Test Logout
```
1. Login to account
2. Look in MainLayout for logout button
3. Click logout
4. ✓ Token cleared from localStorage  
5. ✓ Redirected to /login
```

---

## 🔍 Monitoring

### Watch Backend Console
```bash
npm run dev  # in /backend folder
# Shows all API requests and responses
```

### Watch Frontend Console  
```
DevTools → Console tab
# Shows auth flow, errors, network issues
```

### Check Network Requests
```
DevTools → Network tab
# Check each request to /api endpoints
# Verify Authorization header is present
```

### Inspect LocalStorage
```
DevTools → Application → LocalStorage
# Should contain after login:
# - token: eyJhbGc...
# - user: {"_id":"...", "email":"...", ...}
```

---

## ✅ Success Indicators

### After Signup/Login
- ✓ Redirected to /dashboard
- ✓ Can access /profile, /settings, /system-test
- ✓ Token exists in localStorage
- ✓ Backend logs show successful login

### After Refresh
- ✓ Still logged in (no redirect to login)
- ✓ User info still accessible
- ✓ All API requests include Authorization header

### After Logout
- ✓ Redirected to /login
- ✓ localStorage cleared
- ✓ Cannot access protected pages
- ✓ Trying to visit /dashboard → redirects to /login

---

## ⚠️ Common Issues & Fixes

### "Cannot reach API" / Network Error
**Check:**
1. Backend running? `npm run dev` in /backend
2. Port 5000 free? (if not, change BACKEND PORT)
3. API URL correct? Check `src/services/api.js`
4. No CORS error? Check backend .env has CORS_ORIGIN

**Fix:**
```bash
# Kill process on port 5000
# Windows: netstat -ano | findstr :5000
# Restart backend
cd backend && npm run dev
```

### "Invalid email or password"
**Check:**
1. Email address spelled correctly
2. Password matches what you entered
3. Account exists (did you signup first?)
4. Database has demo data (ran `npm run seed`?)

**Fix:**
```bash
# Reseed the database
cd backend
npm run seed
```

### "CORS error" in console
**Check:** Backend .env has:
```
CORS_ORIGIN=http://localhost:5173
```

**Fix:**
```bash
1. Stop backend (Ctrl+C)
2. Edit backend/.env  
3. Add/fix CORS_ORIGIN line
4. Restart backend (npm run dev)
```

### "Stays on login page after signup"
**Check:**
1. Check frontend console for errors
2. Check network tab - is /api/auth/signup request succeeding?
3. Check backend console for error messages

**Fix:**
```bash
# Check backend error logs
cd backend && npm run dev
# Look for error messages
```

### "Page keeps redirecting to login"
**Check:**
1. Token in localStorage? (DevTools → Storage)
2. Token valid? (not expired)
3. Backend API responding? (check network tab)

**Fix:**
```bash
# Clear everything and restart
localStorage.clear()  # In DevTools console
# Refresh page
# Try login again
```

---

## 📊 Data Flow Diagram

```
User enters email/password
         ↓
Login.jsx form submission
         ↓
useAuth hook calls login()
         ↓
POST /api/auth/login (in backend)
         ↓
Backend validates credentials
         ↓
JWT token generated (7-day expiration)
         ↓
Response: {token, user}
         ↓
AuthContext stores in state
         ↓
localStorage.setItem('token', token)
localStorage.setItem('user', JSON.stringify(user))
         ↓
useNavigate('/dashboard')
         ↓
PrivateRoute checks isAuthenticated = true ✓
         ↓
MainLayout renders with user logged in
```

---

## 📱 Next Steps

After successful authentication:

1. **Explore Dashboard** - /dashboard
2. **Update Profile** - /profile  
3. **Configure Settings** - /settings
4. **Run System Test** - /system-test
5. **Create Interview** - /interview-setup
6. **View Reports** - /reports

Each page will now have backend integration!

---

## 🆘 Need Help?

1. Check **AUTH_FLOW.md** for detailed documentation
2. Review backend logs: `cd backend && npm run dev`
3. Check frontend console errors: DevTools → Console
4. Verify URLs in `src/services/api.js`
5. Ensure both servers (backend + frontend) running

---

## 🎉 You're Ready!

Everything is set up for:
- ✅ User signup
- ✅ User login  
- ✅ Session persistence
- ✅ Protected pages
- ✅ Auto logout on expiration
- ✅ Full API integration

**Start testing now!** → http://localhost:5173

Happy interviewing! 🚀
