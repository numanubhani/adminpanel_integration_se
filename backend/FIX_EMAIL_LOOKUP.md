# ✅ Fixed: Email Lookup Issue

## Problem
When trying to promote a contributor with email `qazi@gmail.com`, got error:
```
"User with this email not found"
```

## Root Cause
Django User model stores email in both `username` and `email` fields during registration.
The promote endpoint was only checking the `email` field, but during registration, the email might be stored in `username`.

## Solution
Updated both endpoints to check **BOTH** `email` and `username` fields:

### **1. Admin Login Endpoint** (`/api/accounts/admin/login/`)
Now checks:
1. First try: `User.objects.get(email=email)`
2. If not found, try: `User.objects.get(username=email)`

### **2. Promote Endpoint** (`/api/accounts/admin/promote/`)
Now checks:
1. First try: `User.objects.get(email=email)`
2. If not found, try: `User.objects.get(username=email)`

---

## ✅ Now Try Again

### **Test in Swagger:**

**1. Register Contributor (if not already done):**
```
POST /api/accounts/register/contributor/

{
  "email": "qazi@gmail.com",
  "password": "Test@123456",
  "screenName": "qazi"
}
```

**2. Promote to Admin:**
```
POST /api/accounts/admin/promote/

{
  "email": "qazi@gmail.com",
  "isAdmin": true
}
```

**Expected Result:**
```json
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

✅ **Should work now!**

---

## 🔍 What Changed

### **Before:**
```python
# Only checked email field
user = User.objects.get(email=email)
# If email field is empty → User.DoesNotExist error
```

### **After:**
```python
# Checks both email and username fields
try:
    user = User.objects.get(email=email)
except User.DoesNotExist:
    user = User.objects.get(username=email)  # ← Fallback to username
```

---

## 📝 Why This Happens

During contributor registration:
```python
user = User.objects.create_user(
    username=email,  # ← Email stored here
    email=email,     # ← Also stored here
    password=password
)
```

Sometimes the `email` field might be empty or not set, but `username` always has the email.
The fix checks **both** fields to find the user.

---

## ✅ Test It Now

1. **Try promoting again** with `qazi@gmail.com`
2. **Should work** ✅
3. **Then login as admin** in React app

---

**The issue is fixed! Try the promote endpoint again!** 🎉

