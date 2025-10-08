# 🔗 Frontend-Backend Integration Guide

## Overview
Connect your React frontend (D:\Projects\SE-AdminPanel\SE-AdminPanel) with Django backend (C:\Users\PMLS\Desktop\adminpanel_integration_se\backend)

---

## ✅ Backend Setup (Already Done!)

### **CORS Configured:**
- ✅ `django-cors-headers` installed
- ✅ CORS middleware enabled
- ✅ Allowed origins configured for React ports

### **Backend Running:**
```bash
cd C:\Users\PMLS\Desktop\adminpanel_integration_se\backend
python manage.py runserver
```

**Backend URL:** `http://127.0.0.1:8000`  
**API Docs:** `http://127.0.0.1:8000/api/docs/`

---

## 🚀 Frontend Setup

### **Step 1: Navigate to Frontend**
```bash
cd D:\Projects\SE-AdminPanel\SE-AdminPanel
```

### **Step 2: Install Dependencies** (if needed)
```bash
npm install
# or
yarn install
```

### **Step 3: Start React App**
```bash
npm start
# or
yarn start
```

**Frontend will run on:** `http://localhost:3000`

---

## 🔌 API Integration in React

### **Base API URL**
Create an API configuration file:

**File:** `src/config/api.js`
```javascript
// API Configuration
export const API_BASE_URL = 'http://127.0.0.1:8000';
export const API_ENDPOINTS = {
  // Contributor Registration
  registerContributor: `${API_BASE_URL}/api/accounts/register/contributor/`,
  
  // Admin Endpoints
  adminPromote: `${API_BASE_URL}/api/accounts/admin/promote/`,
  adminLogin: `${API_BASE_URL}/api/accounts/admin/login/`,
  
  // User Endpoints
  login: `${API_BASE_URL}/api/accounts/login/`,
  me: `${API_BASE_URL}/api/accounts/me/`,
};
```

---

## 📝 Admin Integration Example

### **1. Promote Contributor to Admin**

**File:** `src/services/adminService.js`
```javascript
import { API_ENDPOINTS } from '../config/api';

export const promoteToAdmin = async (email) => {
  try {
    const response = await fetch(API_ENDPOINTS.adminPromote, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        isAdmin: true
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to promote to admin');
    }

    return data;
  } catch (error) {
    console.error('Promote to admin error:', error);
    throw error;
  }
};
```

### **2. Admin Login**

```javascript
export const adminLogin = async (email, password) => {
  try {
    const response = await fetch(API_ENDPOINTS.adminLogin, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // Save tokens to localStorage
    localStorage.setItem('accessToken', data.tokens.access);
    localStorage.setItem('refreshToken', data.tokens.refresh);
    localStorage.setItem('adminData', JSON.stringify(data.admin));

    return data;
  } catch (error) {
    console.error('Admin login error:', error);
    throw error;
  }
};
```

---

## 🎨 React Component Example

### **Admin Promotion Component**

**File:** `src/components/AdminPromotion.jsx`
```javascript
import React, { useState } from 'react';
import { promoteToAdmin } from '../services/adminService';

const AdminPromotion = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePromote = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const result = await promoteToAdmin(email);
      setMessage(`✅ ${result.message}`);
      setEmail('');
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-promotion">
      <h2>Promote User to Admin</h2>
      <form onSubmit={handlePromote}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter user email"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Promoting...' : 'Promote to Admin'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminPromotion;
```

### **Admin Login Component**

**File:** `src/components/AdminLogin.jsx`
```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../services/adminService';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await adminLogin(formData.email, formData.password);
      console.log('Admin logged in:', result.admin);
      navigate('/admin/dashboard'); // Redirect to admin dashboard
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default AdminLogin;
```

---

## 🔐 Authentication Headers

### **For Protected Routes:**

```javascript
const fetchProtectedData = async () => {
  const token = localStorage.getItem('accessToken');

  const response = await fetch('http://127.0.0.1:8000/api/protected-endpoint/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  return response.json();
};
```

---

## 🧪 Testing the Connection

### **Test 1: Basic Connectivity**
```javascript
// In browser console or React component
fetch('http://127.0.0.1:8000/api/docs/')
  .then(res => res.text())
  .then(data => console.log('Backend connected!'))
  .catch(err => console.error('Connection failed:', err));
```

### **Test 2: Promote API**
```javascript
fetch('http://127.0.0.1:8000/api/accounts/admin/promote/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com', isAdmin: true })
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

---

## 📁 Recommended Frontend Structure

```
src/
├── config/
│   └── api.js                 # API configuration
├── services/
│   ├── adminService.js        # Admin-related API calls
│   ├── authService.js         # Auth-related API calls
│   └── contributorService.js  # Contributor-related API calls
├── components/
│   ├── AdminLogin.jsx
│   ├── AdminPromotion.jsx
│   └── ...
├── pages/
│   ├── AdminDashboard.jsx
│   └── ...
└── utils/
    └── auth.js                # Auth utilities (token management)
```

---

## 🛠️ Troubleshooting

### **Issue: CORS Error**
**Solution:**
- Check backend is running on `http://127.0.0.1:8000`
- Verify CORS settings in `backend/settings.py`
- Make sure your React app port is in `CORS_ALLOWED_ORIGINS`

### **Issue: 404 Not Found**
**Solution:**
- Check API endpoint URLs match backend routes
- Verify backend server is running
- Test endpoint in Swagger first

### **Issue: 401 Unauthorized**
**Solution:**
- Check JWT token is being sent in headers
- Verify token hasn't expired
- Re-login to get fresh token

---

## 📋 Quick Checklist

Before connecting:
- [ ] Backend running on `http://127.0.0.1:8000`
- [ ] CORS configured in Django settings
- [ ] Frontend has API base URL configured
- [ ] Test API endpoints in Swagger first
- [ ] JWT tokens stored in localStorage after login

---

## 🚀 Production Deployment

### **Environment Variables (React):**

**File:** `.env`
```bash
REACT_APP_API_URL=https://your-backend-domain.com
```

**Usage:**
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
```

### **Django Settings Update:**
Update `CORS_ALLOWED_ORIGINS` with production frontend URL.

---

## ✅ Summary

**Backend:** ✅ Running on `http://127.0.0.1:8000`  
**Frontend:** React app on `http://localhost:3000`  
**CORS:** ✅ Configured  
**Endpoints Ready:**
- `/api/accounts/admin/promote/` - Promote to admin
- `/api/accounts/admin/login/` - Admin login

**Next Steps:**
1. Start both servers
2. Integrate API calls in React components
3. Test the connection
4. Build admin dashboard!

**Need help?** Check Swagger docs at `http://127.0.0.1:8000/api/docs/`

