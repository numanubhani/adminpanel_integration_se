# 🔧 Fix Login Error - "Unexpected token '<', '<!DOCTYPE'"

## 🔍 What This Error Means

This error occurs when the frontend expects JSON but receives HTML instead. This typically means:

1. ❌ Backend is not running
2. ❌ Wrong API URL (404 page)
3. ❌ CORS issue (returns error page)
4. ❌ Backend crashed (Django error page)

---

## ✅ What I Fixed

Updated the `/api/accounts/login/` endpoint to check both `email` and `username` fields when looking up users.

**Before:**
```python
user = User.objects.get(username=email)  # Only checks username
```

**After:**
```python
# Try email first, then username
try:
    user = User.objects.get(email=email)
except User.DoesNotExist:
    user = User.objects.get(username=email)
```

---

## 🚀 Steps to Fix

### **Step 1: Make Sure Backend is Running**

Check if Django is running on port 8000:

```powershell
# If backend is running, you should see this in terminal:
Starting development server at http://127.0.0.1:8000/
```

**If not running:**
```powershell
cd C:\Users\PMLS\Desktop\adminpanel_integration_se\backend
python manage.py runserver
```

---

### **Step 2: Test Backend Endpoint Directly**

**Option A: Use Swagger**
```
http://127.0.0.1:8000/api/docs/

Go to: POST /api/accounts/login/
Click "Try it out"

Body:
{
  "email": "your@email.com",
  "password": "your_password"
}

Click "Execute"

Expected: 200 OK with JSON response
```

**Option B: Use Browser**
```
http://127.0.0.1:8000/api/accounts/login/

Should show: {"detail": "Method \"GET\" not allowed."}
(Not HTML page)
```

---

### **Step 3: Check API URL in Frontend**

Open `frontend/SE-AdminPanel/src/Instance.jsx`:

```javascript
export const API_BASE_URL = 'http://127.0.0.1:8000';
```

Make sure it matches your backend URL ✅

---

### **Step 4: Test Login Again**

1. **Restart Backend** (if you made changes)
2. **Open React:** http://localhost:3000/login
3. **Try logging in** with registered email
4. **Check Console** (F12) for errors

---

## 🧪 Detailed Debugging

### **Check 1: Backend Running?**

```powershell
# Open PowerShell
curl http://127.0.0.1:8000/api/accounts/login/

# Should return:
{"detail":"Method \"GET\" not allowed."}

# NOT:
<!DOCTYPE html> (HTML page)
```

---

### **Check 2: User Exists?**

```powershell
cd backend
python manage.py shell
```

```python
from django.contrib.auth.models import User

# Check your user
email = "your@email.com"  # Replace with your email

# Check by email
try:
    user = User.objects.get(email=email)
    print(f"✅ User found by email: {user.username}")
except User.DoesNotExist:
    print("❌ User NOT found by email")

# Check by username
try:
    user = User.objects.get(username=email)
    print(f"✅ User found by username: {user.email}")
except User.DoesNotExist:
    print("❌ User NOT found by username")

exit()
```

---

### **Check 3: Frontend API Call**

Open Browser Console (F12) → Network tab:

1. Try logging in
2. Look for request to `/api/accounts/login/`
3. Check:
   - **Request URL:** Should be `http://127.0.0.1:8000/api/accounts/login/`
   - **Status Code:** 200 (success) or 401 (wrong password)
   - **Response:** Should be JSON, not HTML

**If you see HTML:**
- Backend not running
- Wrong URL
- CORS issue

---

### **Check 4: CORS Settings**

In `backend/backend/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]
```

Should already be there ✅

---

## 🎯 Quick Fix Checklist

- [ ] Backend is running on port 8000
- [ ] Can access http://127.0.0.1:8000/api/docs/
- [ ] User is registered (check with shell)
- [ ] Frontend API_BASE_URL is correct
- [ ] Browser console shows request to correct URL
- [ ] Response is JSON (not HTML)

---

## 💡 Common Issues & Solutions

### **Issue 1: "Connection refused"**
```
Error: Failed to fetch
```
**Fix:** Backend not running. Start it:
```powershell
cd backend
python manage.py runserver
```

---

### **Issue 2: "404 Not Found"**
```
<!DOCTYPE html><html>...Page not found
```
**Fix:** Wrong URL. Check `Instance.jsx` API_BASE_URL

---

### **Issue 3: "Invalid credentials"**
```
{"detail": "Invalid credentials"}
```
**Fix:** 
- Wrong password
- User not registered
- Email stored differently (check with shell)

---

### **Issue 4: "CORS error"**
```
Access to fetch blocked by CORS policy
```
**Fix:** Add your frontend URL to CORS_ALLOWED_ORIGINS in settings.py

---

## 🔍 Step-by-Step Test

### **1. Test Backend Directly:**

```bash
# PowerShell
curl -X POST http://127.0.0.1:8000/api/accounts/login/ `
  -H "Content-Type: application/json" `
  -d '{"email":"your@email.com","password":"your_password"}'
```

**Expected Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1Qi...",
  "refresh": "eyJ0eXAiOiJKV1Qi...",
  "profile": {
    "screen_name": "yourname",
    "email": "your@email.com"
  }
}
```

---

### **2. Test in Swagger:**

```
http://127.0.0.1:8000/api/docs/

POST /api/accounts/login/
{
  "email": "your@email.com",
  "password": "your_password"
}
```

**Expected:** 200 OK with tokens

---

### **3. Test in React:**

```
http://localhost:3000/login

Email: your@email.com
Password: your_password
```

**Expected:** Redirects to dashboard

---

## ✅ Final Solution

**If backend is running and you still get the error:**

1. **Clear browser cache** (Ctrl + Shift + Delete)
2. **Restart backend** (Ctrl + C, then `python manage.py runserver`)
3. **Restart frontend** (Ctrl + C, then `npm start`)
4. **Try login again**

**The login endpoint now checks both `email` and `username` fields, so it should work regardless of how the email was stored during registration!** ✅

---

## 📝 Summary

**Issue:** HTML returned instead of JSON  
**Cause:** Backend not running or wrong endpoint  
**Fix:** 
1. ✅ Updated login to check both email and username
2. ✅ Ensure backend is running
3. ✅ Test endpoint directly

**Try logging in again!** 🎯

