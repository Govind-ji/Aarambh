# Profile Update - Complete Debugging & Testing Guide

## What Was Fixed in Profile.jsx

1. ✅ **Added useEffect to load profile data on mount**
   - Calls `userAPI.getProfile()` automatically when component loads
   - Initializes form fields with real database values

2. ✅ **Removed hardcoded default values**
   - Replaced 'John', 'Doe', 'john@example.com' with actual user data
   - Falls back to empty strings if fields are not set

3. ✅ **Added loading state**
   - Shows loading spinner while fetching profile
   - Displays loading message until data is ready

4. ✅ **Added comprehensive console logging**
   - Logs when profile is fetched
   - Logs when data is received
   - Logs when save is attempted
   - Logs errors with full details

5. ✅ **Updated backend logging**
   - userController now logs all profile get/update requests
   - Logs the data received and sent
   - Logs success/failure with user info

---

## 🧪 Testing Steps

### Step 1: Start Backend Server
```bash
cd backend
npm start
```
Expected output:
```
Server running on port 5000
Environment: development
```

### Step 2: Check Database Connection
```
MongoDB URI: mongodb://localhost:27017/arambh
```

Make sure MongoDB is running:
```bash
# Windows Command Prompt or PowerShell
mongod
```

### Step 3: Start Frontend
```bash
cd Arambh
npm run dev
```
Expected output:
```
VITE v... ready in ... ms
➜  Local:   http://localhost:5173/
```

### Step 4: Login & Navigate to Profile

1. Go to http://localhost:5173/login
2. Login with your test credentials
3. Navigate to Profile page
4. **Watch the browser console** (F12 → Console tab)

Expected console logs:
```
📥 Fetching profile data from backend...
✅ Profile data received: {
  _id: "...",
  firstName: "John",
  lastName: "Doe",
  email: "john@email.com",
  ...
}
```

### Step 5: Edit and Save Profile

1. Click "Edit" button
2. Change any field (e.g., Job Title)
3. Click "Save Changes"
4. **Watch both console tabs**

**Frontend Console should show:**
```
Field changed: jobTitle = Senior Software Engineer
💾 Saving profile with data: {
  firstName: "John",
  lastName: "Doe",
  ...
  jobTitle: "Senior Software Engineer"
}
✅ Profile saved successfully: {
  _id: "...",
  success: true,
  data: { ... updated data ... }
}
```

**Backend Console should show (Terminal running `npm start`):**
```
2026-03-06T10:30:45.123Z - PUT /api/users/profile
📝 [PUT /users/profile] Updating profile for user: 507f1f77bcf86cd799439011
📦 Data received: {
  firstName: "John",
  lastName: "Doe",
  jobTitle: "Senior Software Engineer"
}
✅ Profile updated successfully: john@email.com
```

### Step 6: Verify Database Save

Open MongoDB compass or use mongo shell:

```javascript
// In MongoDB shell
use arambh
db.users.findOne({ email: "john@email.com" })
```

Should show updated jobTitle:
```javascript
{
  _id: ObjectId("..."),
  firstName: "John",
  lastName: "Doe",
  email: "john@email.com",
  jobTitle: "Senior Software Engineer",  // ← Updated!
  ...
}
```

---

## 🔍 Troubleshooting

### Problem: Profile shows "Loading..." but never loads

**Diagnosis:**
1. Check browser console → Network tab (Ctrl+Shift+E)
2. Look for `/api/users/me` request
3. Check response status

**Solution:**
- If 401 error: Token expired, login again
- If 404 error: Route not found, check server
- If 500 error: Server error, check backend console

### Problem: Data saves but doesn't show success message

**Check:**
1. Is the success message appearing at all?
2. Check both browser & backend console for errors
3. Is the response actually returning `success: true`?

**Solution:**
```javascript
// In browser console
// Manually test the API
const userAPI = require('./services/endpoints').userAPI
userAPI.getProfile()
  .then(r => console.log('Response:', r))
  .catch(e => console.log('Error:', e))
```

### Problem: Changes save but profile shows old data on refresh

**Issue:** Profile data is being fetched but not updated properly

**Solution:**
1. Make sure you're calling `setProfileData()` after successful save
2. Check that form fields update with new data
3. Refresh the page manually to verify database save

### Problem: Backend not receiving the request

**Check:**
1. Is the server running? (`npm start` output visible?)
2. Is CORS enabled? (Check server.js)
3. Is Authorization header being sent? (Check Network → Headers tab)

**Solution:**
```javascript
// Manually verify token
console.log(localStorage.getItem('token'))
// Should print a JWT token like: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📝 API Request/Response Format

### Request to Save Profile
```bash
PUT /api/users/profile HTTP/1.1
Host: localhost:5000
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "jobTitle": "Senior Engineer",
  "company": "Tech Corp",
  "location": "San Francisco",
  "bio": "Passionate developer"
}
```

### Success Response
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@email.com",
    "phone": "+1234567890",
    "jobTitle": "Senior Engineer",
    "company": "Tech Corp",
    "location": "San Francisco",
    "bio": "Passionate developer",
    "createdAt": "2026-03-01T10:00:00.000Z",
    "updatedAt": "2026-03-06T10:30:45.000Z"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error updating profile",
  "error": "Detailed error message if in development mode"
}
```

---

## 🐛 Enable Extra Debugging

### Frontend Debugging

Add this to the beginning of Profile.jsx to see all state changes:

```javascript
useEffect(() => {
  console.log('Component state changed:', {
    isEditing,
    isSaving,
    isLoading,
    profileData,
    formData,
    message,
  });
}, [isEditing, isSaving, isLoading, profileData, formData, message]);
```

### Backend Debugging

Uncomment additional logs in userController.js:

```javascript
// Before update
console.log('Before update - User data:', user);

// After update
console.log('After update - User data:', user);

// Check what fields were actually updated
console.log('Update delta:', { ...updateData });
```

---

## 🎯 Success Indicators

| Check | Expected Result |
|-------|-----------------|
| Profile page loads | Shows "Loading..." briefly, then profile data |
| Edit button works | Form becomes editable, button changes to "Cancel" |
| Typing works | Can change all fields except email |
| Save button works | Shows "Saving..." state, then success message |
| Success persists | Refresh page, data still shows new values |
| Database record | Updated in MongoDB when checked directly |
| Backend logs | Shows PUT request with correct data |
| Frontend logs | Shows all steps from fetch to save |

---

## 📋 Quick Checklist

Before declaring "fixed", verify:

- [ ] Profile data loads from database on page open
- [ ] Form fields populated with real user data (not hardcoded)
- [ ] Can edit all fields (except email)
- [ ] Save button updates data in database
- [ ] Success message appears after save
- [ ] Page refresh shows saved data
- [ ] Backend logs show all requests
- [ ] Frontend console shows all steps
- [ ] MongoDB shows updated records
- [ ] Error handling works for failed saves

---

## 🚀 Next Steps If Issues Persist

1. **Check MongoDB connection:**
   ```bash
   mongo
   use arambh
   db.users.find().pretty()
   ```

2. **Check JWT token validity:**
   - Open browser DevTools → Application → LocalStorage
   - Verify `token` and `user` are present
   - Token should be a long string starting with `eyJ...`

3. **Test API directly with curl/Postman:**
   ```bash
   curl -X GET http://localhost:5000/api/users/me \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```

4. **Check for network issues:**
   - Ensure both frontend and backend are running
   - Check no firewalls blocking port 5000 or 5173
   - Verify CORS is enabled in server.js

5. **Reset and retry:**
   - Clear localStorage: `localStorage.clear()`
   - Close browser entirely
   - Restart both servers
   - Login again fresh

