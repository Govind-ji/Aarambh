# PROFILE UPDATE - VERIFICATION CHECKLIST

## Before You Test
- [ ] MongoDB is running (`mongod` in a terminal)
- [ ] Backend server is running (`npm start` in backend folder)
- [ ] Frontend is running (`npm run dev` in Arambh folder)

---

## Test 1: Profile Loads Correctly

### What to do:
1. Go to http://localhost:5173/profile
2. Open DevTools (F12) and go to Console tab

### What you should see:
✅ **Browser Console:**
```
📥 Fetching profile data from backend...
✅ Profile data received: {_id: "...", firstName: "...", lastName: "...", email: "..."}
```

✅ **Backend Terminal:**
```
2026-03-06T10:30:00.000Z - GET /api/users/me
📥 [GET /users/me] Fetching profile for user: 507f1f77bcf86cd799439011
✅ Profile returned: user@email.com
```

✅ **Profile Page displays:**
- User's actual first name (not "John")
- User's actual last name (not "Doe")
- User's actual email
- Actual job title, company, location, bio (if set)

### ❌ If NOT working:
- Profile shows "Loading..." forever → Backend not responding
- Profile shows "John Doe" → Still using hardcoded values
- Error message appears → Check error details in console

---

## Test 2: Edit Profile

### What to do:
1. Click the "Edit" button on profile page
2. Change the "Job Title" field (e.g., to "Senior Software Engineer")
3. Click "Save Changes"

### What you should see:
✅ **Browser Console:**
```
Field changed: jobTitle = Senior Software Engineer
💾 Saving profile with data: {firstName: "...", lastName: "...", jobTitle: "Senior Software Engineer", ...}
✅ Profile saved successfully: {success: true, message: "Profile updated successfully", data: {...}}
```

✅ **Backend Terminal:**
```
2026-03-06T10:30:45.123Z - PUT /api/users/profile
📝 [PUT /users/profile] Updating profile for user: 507f1f77bcf86cd799439011
📦 Data received: {firstName: "...", lastName: "...", jobTitle: "Senior Software Engineer", ...}
✅ Profile updated successfully: user@email.com
```

✅ **Profile Page shows:**
- Green success message "Profile updated successfully! ✓"
- Edit button again (not "Cancel" anymore)
- Job Title now shows "Senior Software Engineer"

### ❌ If NOT working:
- No console output → Check network tab (Network tab in DevTools)
- Error message appears → Read the error message
- No change in displayed data → Data saved but form not updated

---

## Test 3: Verify Database Save

### What to do:
1. Open MongoDB (mongod running)
2. In another terminal, run:
```bash
mongo
use arambh
db.users.findOne({email: "your@email.com"})
```

### What you should see:
```javascript
{
  _id: ObjectId("..."),
  firstName: "...",
  lastName: "...",
  email: "your@email.com",
  jobTitle: "Senior Software Engineer",  // ← Your change here!
  phone: "...",
  company: "...",
  location: "...",
  bio: "...",
  role: "user",
  createdAt: ISODate("2026-03-01T..."),
  updatedAt: ISODate("2026-03-06T10:30:45.123Z")  // ← Recent timestamp
}
```

### ❌ If NOT working:
- jobTitle still shows old value → Data not saving to DB
- updatedAt is old → Update is not working

---

## Test 4: Refresh and Verify Persistence

### What to do:
1. Make sure the edit was successful (green message appeared)
2. Close the browser tab
3. Re-open http://localhost:5173/profile
4. Login again if needed

### What you should see:
✅ Profile page loads again with updated data
✅ Job Title shows "Senior Software Engineer" (not reverted)
✅ All changes persist even after refresh

### ❌ If NOT working:
- Data reverts after refresh → Not truly saving to DB
- Profile shows old values → Check database query

---

## Test 5: Multiple Fields Save

### What to do:
1. Click Edit
2. Change MULTIPLE fields:
   - First Name → "James"
   - Job Title → "Lead Engineer"
   - Company → "New Company"
   - Bio → "New bio text"
3. Click Save

### What you should see:
✅ Single PUT request to `/api/users/profile`
✅ All changed fields sent in request:
```javascript
{
  firstName: "James",
  jobTitle: "Lead Engineer",
  company: "New Company",
  bio: "New bio text"
}
```

✅ All fields update simultaneously
✅ One success message

### ❌ If NOT working:
- Some fields don't save → Check the data sent
- Multiple requests made → Should be one request
- Only some fields update → Backend may have validation issues

---

## Test 6: Error Handling

### What to do:
1. Open DevTools → Network tab
2. Set network to "Offline" (simulate network error)
3. Click Edit
4. Try to save profile
5. Set network back to "Online"

### What you should see:
✅ Error message appears on profile
✅ Error message is readable and helpful
✅ No "undefined" or blank errors

### ✅ Also test these scenarios:
- Edit with empty First Name (required field)
- Invalid email format
- Save with backend down

---

## Test 7: Loading State

### What to do:
1. Go to Profile page
2. Watch carefully for the loading state

### What you should see:
✅ Brief loading spinner while fetching
✅ "Loading profile..." indicator
✅ Then content appears

### ✅ Also happens when:
- Clicking Save
- Button shows "Saving..." and is disabled
- Cannot click save button while saving

---

## Automated Test (Optional)

### Copy-paste this in browser console while on Profile page:
```javascript
async function testProfileUpdate() {
  console.log('🧪 Starting Profile Update Test...\n');
  
  const userAPI = (await import('./services/endpoints.js')).userAPI;
  
  try {
    // Test 1: Get profile
    console.log('Test 1: Fetching profile...');
    const profile = await userAPI.getProfile();
    console.log('✅ Profile fetched:', profile.data.data.email);
    
    // Test 2: Update profile
    console.log('\nTest 2: Updating profile...');
    const updated = await userAPI.updateProfile({
      firstName: 'Test',
      lastName: 'User',
      jobTitle: 'Test Engineer',
      company: 'Test Corp',
      location: 'Test City',
      bio: 'Test bio',
      phone: '+1-555-0000'
    });
    console.log('✅ Profile updated:', updated.data.success);
    
    // Test 3: Verify
    console.log('\nTest 3: Verifying update...');
    const verified = await userAPI.getProfile();
    console.log('✅ Verification - Job Title:', verified.data.data.jobTitle);
    
    console.log('\n🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testProfileUpdate();
```

---

## Success = All Tests Pass ✅

Once all 7 tests pass:
1. ✅ Profile loads with real data
2. ✅ Single field edits work
3. ✅ Data saves to database
4. ✅ Data persists after refresh
5. ✅ Multiple field edits work
6. ✅ Error handling works
7. ✅ Loading states appear

**You're done! The profile update system is fully working.**

---

## Still Having Issues?

1. Read [PROFILE_UPDATE_DEBUGGING_GUIDE.md](./PROFILE_UPDATE_DEBUGGING_GUIDE.md)
2. Check the console logs at each step
3. Verify backend logs match frontend logs
4. Check MongoDB directly for database record
5. Look at Network tab for actual request/response

