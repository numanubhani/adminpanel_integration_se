# 🎯 Admin System - Simple & Clean

## Overview
The admin system uses a **simple 2-step process**:
1. **Register as Contributor** - User creates full profile
2. **Promote to Admin** - Admin gets promoted with one API call

---

## 🚀 API Endpoints

### **1. Promote Contributor to Admin**
**Endpoint:** `POST /api/accounts/admin/promote/`

**Request:**
```json
{
  "email": "contributor@example.com",
  "isAdmin": true
}
```

**Response (201):**
```json
{
  "message": "Contributor promoted to admin successfully",
  "admin": {
    "id": 1,
    "email": "contributor@example.com",
    "is_admin": true,
    "created_at": "2025-10-08T12:00:00Z",
    "updated_at": "2025-10-08T12:00:00Z"
  }
}
```

---

### **2. Admin Login**
**Endpoint:** `POST /api/accounts/admin/login/`

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "their_password"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "admin": {
    "id": 1,
    "email": "admin@example.com",
    "is_admin": true,
    "created_at": "2025-10-08T12:00:00Z",
    "updated_at": "2025-10-08T12:00:00Z"
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

---

## 📋 Complete Workflow

### **Step 1: User Registers as Contributor**
```bash
POST /api/accounts/register/contributor/
```
```json
{
  "email": "john@example.com",
  "password": "password123",
  "screenName": "john_doe",
  "firstName": "John",
  "lastName": "Doe",
  // ... all contributor fields
}
```

### **Step 2: Promote to Admin**
```bash
POST /api/accounts/admin/promote/
```
```json
{
  "email": "john@example.com",
  "isAdmin": true
}
```

### **Step 3: Login as Admin**
```bash
POST /api/accounts/admin/login/
```
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Done!** ✅

---

## 🏗️ Architecture

```
User (Django User)
  ↓ OneToOne
Profile (Contributor with all fields)
  ↓ OneToOne
Admin (is_admin=true)
```

**Key Points:**
- Admin uses existing contributor profile
- No duplicate data
- All contributor fields available via `admin.profile`
- Simple promotion process

---

## 💡 Benefits

✅ **No Complex Registration** - Just promote existing users  
✅ **No Duplicate Data** - Uses existing profile  
✅ **Simple API** - Only 2 fields needed to promote  
✅ **Preserves History** - All contributor data intact  
✅ **Fast & Clean** - One API call to promote  

---

## 🧪 Testing in Swagger

Visit: `http://127.0.0.1:8000/api/docs/`

**Available Endpoints:**
1. `POST /api/accounts/admin/promote/` - Promote contributor
2. `POST /api/accounts/admin/login/` - Admin login

---

## 🔐 Frontend Integration

### **Promote to Admin (React):**
```javascript
const promoteToAdmin = async (email) => {
  const response = await fetch('http://127.0.0.1:8000/api/accounts/admin/promote/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email,
      isAdmin: true
    })
  });
  
  const data = await response.json();
  return data;
};
```

### **Admin Login (React):**
```javascript
const loginAdmin = async (email, password) => {
  const response = await fetch('http://127.0.0.1:8000/api/accounts/admin/login/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (response.ok) {
    localStorage.setItem('accessToken', data.tokens.access);
    localStorage.setItem('refreshToken', data.tokens.refresh);
    return data.admin;
  }
  throw new Error(data.error);
};
```

---

## 📁 Files Structure

### **Models** (`accounts/models.py`):
```python
class Admin(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE)
    is_admin = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### **Serializers** (`accounts/serializers.py`):
```python
class AdminSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='profile.user.email', read_only=True)
    
    class Meta:
        model = Admin
        fields = ['id', 'email', 'is_admin', 'created_at', 'updated_at']
```

### **Views** (`accounts/views.py`):
- `AdminViewSet.promote_contributor()` - Promotes existing contributor
- `AdminViewSet.login()` - Admin login with JWT

### **URLs** (`accounts/urls.py`):
```python
router.register("admin", AdminViewSet, basename="admin")
```

---

## ❌ Error Handling

### **User Not Found:**
```json
{
  "error": "User with this email not found"
}
```

### **Already Admin:**
```json
{
  "error": "User is already an admin"
}
```

### **Invalid Credentials:**
```json
{
  "error": "Invalid credentials"
}
```

---

## 📝 Example Usage

### **Scenario: Promote Top Contributor**

1. Contributor is already registered and active
2. Admin decides to give them admin access
3. One API call promotes them:

```bash
curl -X POST http://127.0.0.1:8000/api/accounts/admin/promote/ \
  -H "Content-Type: application/json" \
  -d '{"email": "topuser@example.com", "isAdmin": true}'
```

4. User can now login as admin with their existing password

---

## ✅ Summary

**Two Simple Endpoints:**
1. `POST /admin/promote/` - Promote contributor (email + isAdmin)
2. `POST /admin/login/` - Login as admin (email + password)

**No complex registration needed!**

**Server:** `http://127.0.0.1:8000/` ✅  
**Swagger:** `http://127.0.0.1:8000/api/docs/` ✅  
**Status:** Ready to use! 🚀

