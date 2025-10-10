// ============================================
// COMPLETE REACT INTEGRATION EXAMPLE
// ============================================

// 1. API Configuration
// File: src/config/api.js
export const API_BASE_URL = 'http://127.0.0.1:8000';

export const API_ENDPOINTS = {
  // Admin
  adminPromote: `${API_BASE_URL}/api/accounts/admin/promote/`,
  adminLogin: `${API_BASE_URL}/api/accounts/admin/login/`,
  
  // Contributor
  registerContributor: `${API_BASE_URL}/api/accounts/register/contributor/`,
  
  // Auth
  login: `${API_BASE_URL}/api/accounts/login/`,
  me: `${API_BASE_URL}/api/accounts/me/`,
};

// ============================================
// 2. Admin Service
// File: src/services/adminService.js
// ============================================

/**
 * Promote existing contributor to admin
 * @param {string} email - Contributor email
 * @returns {Promise} Admin data
 */
export const promoteToAdmin = async (email) => {
  const response = await fetch(API_ENDPOINTS.adminPromote, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, isAdmin: true })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to promote');
  }

  return response.json();
};

/**
 * Admin login
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise} Admin data with tokens
 */
export const adminLogin = async (email, password) => {
  const response = await fetch(API_ENDPOINTS.adminLogin, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  const data = await response.json();
  
  // Save tokens
  localStorage.setItem('accessToken', data.tokens.access);
  localStorage.setItem('refreshToken', data.tokens.refresh);
  localStorage.setItem('adminData', JSON.stringify(data.admin));
  
  return data;
};

/**
 * Logout admin
 */
export const adminLogout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('adminData');
};

/**
 * Get current admin data
 */
export const getCurrentAdmin = () => {
  const adminData = localStorage.getItem('adminData');
  return adminData ? JSON.parse(adminData) : null;
};

/**
 * Check if user is logged in as admin
 */
export const isAdminLoggedIn = () => {
  const token = localStorage.getItem('accessToken');
  const adminData = getCurrentAdmin();
  return !!(token && adminData);
};

// ============================================
// 3. React Component Examples
// ============================================

// Example 1: Admin Promotion Component
// File: src/components/AdminPromotion.jsx
import React, { useState } from 'react';
import { promoteToAdmin } from '../services/adminService';

const AdminPromotion = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await promoteToAdmin(email);
      setMessage({
        type: 'success',
        text: `✅ ${result.message}. Admin ID: ${result.admin.id}`
      });
      setEmail('');
    } catch (error) {
      setMessage({
        type: 'error',
        text: `❌ ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Promote to Admin</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Contributor Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="contributor@example.com"
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Promoting...' : 'Promote to Admin'}
        </button>
      </form>

      {message.text && (
        <div className={`mt-4 p-3 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

// Example 2: Admin Login Component
// File: src/components/AdminLogin.jsx
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
      
      // Redirect to admin dashboard
      navigate('/admin/dashboard');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 max-w-md w-full bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Admin Login</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-100 text-red-800 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {loading ? 'Logging in...' : 'Login as Admin'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Example 3: Protected Route Component
// File: src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAdminLoggedIn } from '../services/adminService';

const ProtectedRoute = ({ children }) => {
  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

// Example 4: Admin Dashboard
// File: src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { getCurrentAdmin, adminLogout } from '../services/adminService';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const adminData = getCurrentAdmin();
    setAdmin(adminData);
  }, []);

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Welcome, {admin?.email}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dashboard content */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2">Total Users</h3>
            <p className="text-3xl text-blue-600">1,234</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2">Total Admins</h3>
            <p className="text-3xl text-green-600">12</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2">Active Contributors</h3>
            <p className="text-3xl text-purple-600">456</p>
          </div>
        </div>
      </main>
    </div>
  );
};

// ============================================
// 4. React Router Setup
// File: src/App.js
// ============================================
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminPromotion from './components/AdminPromotion';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Protected Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/promote" 
          element={
            <ProtectedRoute>
              <AdminPromotion />
            </ProtectedRoute>
          } 
        />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/admin/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// ============================================
// 5. Axios Alternative (if using Axios)
// File: src/services/api.js
// ============================================
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Promote to admin using Axios
export const promoteToAdminAxios = async (email) => {
  const { data } = await api.post('/accounts/admin/promote/', {
    email,
    isAdmin: true
  });
  return data;
};

// Admin login using Axios
export const adminLoginAxios = async (email, password) => {
  const { data } = await api.post('/accounts/admin/login/', {
    email,
    password
  });
  
  localStorage.setItem('accessToken', data.tokens.access);
  localStorage.setItem('refreshToken', data.tokens.refresh);
  
  return data;
};

