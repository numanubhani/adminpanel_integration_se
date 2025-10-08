# ⚡ Admin System - Quick Start

## 🎯 Two Endpoints Only

### **1. Promote User to Admin**
```
POST /api/accounts/admin/promote/

Body: { "email": "user@example.com", "isAdmin": true }
```

### **2. Admin Login**
```
POST /api/accounts/admin/login/

Body: { "email": "admin@example.com", "password": "password" }
```

---

## 📋 Quick Example

```bash
# Step 1: Promote existing contributor
curl -X POST http://127.0.0.1:8000/api/accounts/admin/promote/ \
  -H "Content-Type: application/json" \
  -d '{"email": "contributor@example.com", "isAdmin": true}'

# Step 2: Login as admin
curl -X POST http://127.0.0.1:8000/api/accounts/admin/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "contributor@example.com", "password": "their_password"}'
```

---

## 🌐 URLs

- **Server:** http://127.0.0.1:8000/
- **Swagger:** http://127.0.0.1:8000/api/docs/
- **Promote:** http://127.0.0.1:8000/api/accounts/admin/promote/
- **Login:** http://127.0.0.1:8000/api/accounts/admin/login/

---

## ✅ That's it!

Simple, clean, and efficient. No complex registration forms needed.

