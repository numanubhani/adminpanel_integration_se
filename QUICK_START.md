# ⚡ Quick Start - Frontend & Backend

## 🚀 Start Servers (2 Terminals)

### **Terminal 1 - Backend:**
```bash
cd C:\Users\PMLS\Desktop\adminpanel_integration_se\backend
python manage.py runserver
```
✅ http://127.0.0.1:8000

### **Terminal 2 - Frontend:**
```bash
cd C:\Users\PMLS\Desktop\adminpanel_integration_se\frontend\SE-AdminPanel
npm start
```
✅ http://localhost:3000

---

## 🧪 Quick Test (2 Minutes)

### **1. Create Admin (Swagger)**
Open: http://127.0.0.1:8000/api/docs/

```
A. POST /api/accounts/register/contributor/
   { "email": "admin@test.com", "password": "Test@123456", "screenName": "admin" }

B. POST /api/accounts/admin/promote/
   { "email": "admin@test.com", "isAdmin": true }
```

### **2. Login (React)**
Open: http://localhost:3000/login

```
Email: admin@test.com
Password: Test@123456
Role: Admin
Click "Login"

Result: ✅ Redirects to /admin/dashboard
```

---

## ✅ Integration Complete!

**Backend:** ✅ Admin API working  
**Frontend:** ✅ Connected to backend  
**Validation:** ✅ Only admins can login  
**No Dummy Data:** ✅ All from backend  

---

## 📚 Docs

- `COMPLETE_INTEGRATION_GUIDE.md` - Full guide
- `frontend/SE-AdminPanel/SETUP_GUIDE.md` - Frontend setup
- `backend/ADMIN_SYSTEM_FINAL.md` - Backend details

**Ready to use!** 🎉

