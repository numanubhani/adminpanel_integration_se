# ⚡ Test Promote Endpoint - RIGHT NOW

## ✅ Fix Applied!

The promote endpoint now checks **both** `email` and `username` fields, so it will find your user!

---

## 🧪 Test in Swagger (2 Steps)

### **Step 1: Verify Contributor Exists**

Open: http://127.0.0.1:8000/api/docs/

If you haven't registered yet:
```
POST /api/accounts/register/contributor/

{
  "email": "qazi@gmail.com",
  "password": "Test@123456",
  "screenName": "qazi"
}

Click "Execute"
```

---

### **Step 2: Promote to Admin**

```
POST /api/accounts/admin/promote/

{
  "email": "qazi@gmail.com",
  "isAdmin": true
}

Click "Execute"

Expected Response (201 Created):
{
  "message": "Contributor promoted to admin successfully",
  "admin": {
    "id": 1,
    "email": "qazi@gmail.com",
    "is_admin": true,
    "created_at": "2025-10-08T...",
    "updated_at": "2025-10-08T..."
  }
}
```

✅ **Success!**

---

### **Step 3: Login as Admin (React)**

Open: http://localhost:3000/login

```
Email: qazi@gmail.com
Password: Test@123456
Role: Admin

Click "Login"

Expected:
✅ Redirects to /admin/dashboard
✅ Console: "✅ Admin logged in: {email: qazi@gmail.com, is_admin: true}"
✅ Topbar shows: qazi@gmail.com
```

---

## 🔧 What Was Fixed

**Before:**
```python
user = User.objects.get(email=email)  # Only checked email field
```

**After:**
```python
try:
    user = User.objects.get(email=email)  # Check email field first
except User.DoesNotExist:
    user = User.objects.get(username=email)  # Then check username field
```

**Now it finds users stored in either field!** ✅

---

## 📋 Quick Checklist

- [ ] Backend server running (should auto-reload with fix)
- [ ] Contributor `qazi@gmail.com` exists
- [ ] Try promote in Swagger
- [ ] Should get 201 Created ✅
- [ ] Login in React app
- [ ] Success! ✅

---

## 🎉 Result

**The promote endpoint is fixed and should work now!**

**Try it in Swagger right now!** 🚀

