# 🧪 Complete Screen Name Test

## Issue
Registered `me@gmail.com` with screenName `me`, but MyInfo shows "Admin User".

---

## 🔍 Root Cause Check

The issue could be:
1. ❌ screenName not saved during registration
2. ❌ Backend not returning screen_name in response
3. ❌ Frontend not reading screen_name correctly

---

## ✅ Solution: Test & Fix

### **Step 1: Verify Registration (Swagger)**

Open: http://127.0.0.1:8000/api/docs/

```
POST /api/accounts/register/contributor/

{
  "email": "test@gmail.com",
  "password": "Test@123456",
  "screenName": "testuser"      ← Use camelCase!
}

Click "Execute"

Response should include:
{
  "profile": {
    "screen_name": "testuser",  ← Check if this appears (snake_case in response)
    "email": "test@gmail.com",
    // ...
  }
}
```

**Important:** Use `screenName` (camelCase) in request, backend converts to `screen_name` (snake_case).

---

### **Step 2: Promote to Admin**

```
POST /api/accounts/admin/promote/

{
  "email": "test@gmail.com",
  "isAdmin": true
}

Response:
{
  "message": "Contributor promoted to admin successfully",
  "admin": {
    "id": X,
    "email": "test@gmail.com",
    "screen_name": "testuser",  ← Check if this is here!
    "is_admin": true
  }
}
```

---

### **Step 3: Test Admin Login**

```
POST /api/accounts/admin/login/

{
  "email": "test@gmail.com",
  "password": "Test@123456"
}

Response:
{
  "message": "Login successful",
  "admin": {
    "id": X,
    "email": "test@gmail.com",
    "screen_name": "testuser",  ← MUST be here!
    "is_admin": true
  },
  "tokens": { ... }
}
```

---

### **Step 4: Login in React**

Open: http://localhost:3000/login

```
Email: test@gmail.com
Password: Test@123456
Role: Admin

Click "Login"
```

**Check Console (F12):**
```
Backend admin response: {id: X, email: "test@gmail.com", screen_name: "testuser", is_admin: true}
                                                          ↑
                                                  Should show "testuser"
```

---

### **Step 5: Check My Info**

Open: http://localhost:3000/my-info

**Check Console:**
```
MyInfo - Backend response: {screen_name: "testuser", email: "test@gmail.com", ...}
MyInfo - Loaded data: {screenName: "testuser", email: "test@gmail.com"}
```

**Check UI:**
```
Profile Details
  Screen Name: testuser     ← Should show this!
  
Security
  Email Address: test@gmail.com ✓
```

---

## 🔧 Fix for Existing User (me@gmail.com)

If `me@gmail.com` doesn't have screen_name in database:

### **Option A: Update via Django Shell**

```bash
cd C:\Users\PMLS\Desktop\adminpanel_integration_se\backend
python manage.py shell
```

```python
from accounts.models import Profile
from django.contrib.auth.models import User

# Find user
user = User.objects.get(username='me@gmail.com')
profile = Profile.objects.get(user=user)

# Check current value
print(f"Current screen_name: '{profile.screen_name}'")

# Update it
profile.screen_name = 'me'
profile.save()

print(f"Updated screen_name to: '{profile.screen_name}'")
exit()
```

### **Option B: Update via Django Admin Panel**

1. Go to: http://127.0.0.1:8000/admin/
2. Login
3. Navigate to: Accounts → Profiles
4. Find user: me@gmail.com
5. Edit `screen_name` field: Enter "me"
6. Click Save

### **After Fix:**

1. **Logout** from React app
2. **Login again** with me@gmail.com
3. **Topbar should show:** "me"
4. **MyInfo should show:** screenName: "me"

---

## 📊 Backend Field Mapping

| Frontend (Request) | Backend (Serializer) | Database (Model) |
|-------------------|---------------------|------------------|
| `screenName` | `source="screen_name"` | `screen_name` |
| `firstName` | `source="first_name"` | `first_name` |
| `lastName` | `source="last_name"` | `last_name` |

**When registering, use camelCase in frontend/Swagger:**
```json
{
  "screenName": "me",        ← camelCase in request
  "firstName": "First",
  "lastName": "Last"
}
```

**Backend converts to snake_case automatically!**

---

## ✅ Verification

After logging in, run in console:

```javascript
// Get all relevant data
const admin = JSON.parse(localStorage.getItem('adminData'));
const username = localStorage.getItem('username');

console.log('=== Screen Name Debug ===');
console.log('1. adminData.screen_name:', admin.screen_name);
console.log('2. adminData.email:', admin.email);
console.log('3. localStorage.username:', username);
console.log('4. Should Topbar show:', admin.screen_name || admin.email);

// Expected output:
// 1. adminData.screen_name: "me"
// 2. adminData.email: "me@gmail.com"
// 3. localStorage.username: "me"
// 4. Should Topbar show: "me"
```

---

## 🎯 Summary

**Issue:** screen_name not showing  
**Likely Cause:** Database field is empty  
**Solution:** Update profile.screen_name in database  
**Verification:** Check console logs and localStorage  

**Follow the debug steps above to identify the exact issue!** 🔍

