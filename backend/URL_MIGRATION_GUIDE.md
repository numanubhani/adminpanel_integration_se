# API URL Migration Guide

All endpoints have been converted from function-based views to ModelViewSet-based class-based views.

## 📋 URL Changes Summary

### **Authentication Endpoints** (`AuthViewSet`)

| Old URL | New URL | Method | Description |
|---------|---------|--------|-------------|
| `/api/accounts/login/` | `/api/accounts/auth/login/` | POST | User/Contributor login |
| `/api/accounts/register/user/` | `/api/accounts/auth/register/user/` | POST | Register new user |
| `/api/accounts/register/contributor/` | `/api/accounts/auth/register/contributor/` | POST | Register new contributor |
| `/api/accounts/me/` | `/api/accounts/auth/me/` | GET | Get current user profile |

---

### **Profile Endpoints** (`ProfileViewSet`)

| Old URL | New URL | Method | Description |
|---------|---------|--------|-------------|
| `/api/accounts/profile/me/` | `/api/accounts/profiles/my-profile/` | GET | Get my profile |
| `/api/accounts/profile/me/` | `/api/accounts/profiles/update-profile/` | PUT/PATCH | Update my profile |
| `/api/accounts/add-funds/` | `/api/accounts/profiles/add-funds/` | POST | Add funds to account |
| `/api/accounts/contributor-metrics/` | `/api/accounts/profiles/contributors/metrics/` | GET | Get contributor metrics |
| `/api/accounts/contributors/` | `/api/accounts/profiles/contributors/list/` | GET | List all contributors |
| *NEW* | `/api/accounts/profiles/` | GET | List all profiles (admin only) |
| *NEW* | `/api/accounts/profiles/{id}/` | GET | Get specific profile by ID |
| *NEW* | `/api/accounts/profiles/{id}/` | PUT/PATCH | Update specific profile (admin) |

---

### **Body Part Images** (`BodyPartImageViewSet`)

| Old URL | New URL | Method | Description |
|---------|---------|--------|-------------|
| `/api/accounts/body-part-images/` | `/api/accounts/body-part-images/` | GET | List user's images |
| `/api/accounts/body-part-images/` | `/api/accounts/body-part-images/` | POST | Upload new image |
| *NEW* | `/api/accounts/body-part-images/{id}/` | GET | Get specific image |
| *NEW* | `/api/accounts/body-part-images/{id}/` | PUT/PATCH | Update image |
| *NEW* | `/api/accounts/body-part-images/{id}/` | DELETE | Delete image |

---

### **Admin Endpoints** (`AdminViewSet`)

| Old URL | New URL | Method | Description |
|---------|---------|--------|-------------|
| `/api/accounts/admin/login/` | `/api/accounts/admin/login/` | POST | Admin login |
| `/api/accounts/admin/promote/` | `/api/accounts/admin/promote/` | POST | Promote contributor to admin |
| *NEW* | `/api/accounts/admin/` | GET | List all admins |
| *NEW* | `/api/accounts/admin/{id}/` | GET | Get specific admin |

---

### **Dashboard Endpoints** (`DashboardViewSet`)

| Old URL | New URL | Method | Description |
|---------|---------|--------|-------------|
| `/api/accounts/dashboard/stats/` | `/api/accounts/dashboard/stats/` | GET | Get dashboard statistics |

---

### **Contest Endpoints** (`ContestViewSet`)

| Old URL | New URL | Method | Description |
|---------|---------|--------|-------------|
| `/api/accounts/contests/` | `/api/accounts/contests/` | GET | List all contests |
| `/api/accounts/contests/` | `/api/accounts/contests/` | POST | Create contest (admin only) |
| `/api/accounts/contests/{id}/` | `/api/accounts/contests/{id}/` | GET | Get contest details |
| `/api/accounts/contests/{id}/` | `/api/accounts/contests/{id}/` | PUT/PATCH | Update contest (admin only) |
| `/api/accounts/contests/{id}/` | `/api/accounts/contests/{id}/` | DELETE | Delete contest (admin only) |
| `/api/accounts/contests/{id}/join/` | `/api/accounts/contests/{id}/join/` | POST | Join contest (contributor) |
| `/api/accounts/contests/{id}/participants/` | `/api/accounts/contests/{id}/participants/` | GET | Get contest participants |
| `/api/accounts/contests/{id}/eligible_contributors/` | `/api/accounts/contests/{id}/eligible_contributors/` | GET | Get eligible contributors |

---

### **Smoke Signals Endpoints** (`SmokeSignalViewSet`)

| Old URL | New URL | Method | Description |
|---------|---------|--------|-------------|
| `/api/accounts/smoke-signals/` | `/api/accounts/smoke-signals/` | GET | List all smoke signals |
| `/api/accounts/smoke-signals/summary/` | `/api/accounts/smoke-signals/summary/` | GET | Get summary statistics |
| `/api/accounts/smoke-signals/send/` | `/api/accounts/smoke-signals/send/` | POST | Send smoke signal |
| *NEW* | `/api/accounts/smoke-signals/` | POST | Create smoke signal record |
| *NEW* | `/api/accounts/smoke-signals/{id}/` | GET | Get specific smoke signal |
| *NEW* | `/api/accounts/smoke-signals/{id}/` | PUT/PATCH | Update smoke signal |
| *NEW* | `/api/accounts/smoke-signals/{id}/` | DELETE | Delete smoke signal |

---

## 🔑 Key Changes

### 1. **All Authentication moved to `/auth/`**
```
Before: POST /api/accounts/login/
After:  POST /api/accounts/auth/login/

Before: POST /api/accounts/register/user/
After:  POST /api/accounts/auth/register/user/

Before: GET /api/accounts/me/
After:  GET /api/accounts/auth/me/
```

### 2. **Profile Management moved to `/profiles/`**
```
Before: GET /api/accounts/contributor-metrics/
After:  GET /api/accounts/profiles/contributors/metrics/

Before: GET /api/accounts/contributors/
After:  GET /api/accounts/profiles/contributors/list/

Before: POST /api/accounts/add-funds/
After:  POST /api/accounts/profiles/add-funds/
```

### 3. **All ViewSets now support full CRUD** (where applicable)
- GET `/api/accounts/{resource}/` - List all
- POST `/api/accounts/{resource}/` - Create new
- GET `/api/accounts/{resource}/{id}/` - Retrieve one
- PUT/PATCH `/api/accounts/{resource}/{id}/` - Update
- DELETE `/api/accounts/{resource}/{id}/` - Delete

---

## 🧪 Testing Guide

### Test Authentication
```bash
# Login
curl -X POST http://localhost:8000/api/accounts/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Register User
curl -X POST http://localhost:8000/api/accounts/auth/register/user/ \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@example.com","password":"password123","screen_name":"newuser"}'

# Get Current User
curl -X GET http://localhost:8000/api/accounts/auth/me/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Test Profile Endpoints
```bash
# Get Contributor Metrics
curl -X GET http://localhost:8000/api/accounts/profiles/contributors/metrics/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get Contributors List
curl -X GET http://localhost:8000/api/accounts/profiles/contributors/list/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Add Funds
curl -X POST http://localhost:8000/api/accounts/profiles/add-funds/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"cardNumber":"1234567890123456","expiryDate":"12/2025","securityCode":"123"}'
```

### Test Dashboard
```bash
# Get Dashboard Stats
curl -X GET http://localhost:8000/api/accounts/dashboard/stats/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Test Smoke Signals
```bash
# List Smoke Signals
curl -X GET "http://localhost:8000/api/accounts/smoke-signals/?range=24h&limit=100" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get Summary
curl -X GET "http://localhost:8000/api/accounts/smoke-signals/summary/?range=7d" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Send Smoke Signal
curl -X POST http://localhost:8000/api/accounts/smoke-signals/send/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"to":"+1234567890","channel":"SMS","message":"Test message","sender":"Admin"}'
```

### Test Admin
```bash
# Admin Login
curl -X POST http://localhost:8000/api/accounts/admin/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Promote Contributor
curl -X POST http://localhost:8000/api/accounts/admin/promote/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"contributor@example.com","isAdmin":true}'
```

### Test Contests
```bash
# List Contests
curl -X GET http://localhost:8000/api/accounts/contests/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Join Contest
curl -X POST http://localhost:8000/api/accounts/contests/1/join/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📊 Benefits of ViewSet Architecture

### ✅ **Consistency**
- All endpoints follow REST conventions
- Predictable URL patterns
- Standard HTTP methods

### ✅ **Maintainability**
- Less code duplication
- Centralized logic in ViewSets
- Easier to add new features

### ✅ **Scalability**
- Built-in pagination support
- Filter backends easy to add
- Better performance with querysets

### ✅ **Documentation**
- Auto-generated API docs via DRF Spectacular
- Consistent schema generation
- Better Swagger/ReDoc integration

### ✅ **DRY Principle**
- Reusable permission classes
- Shared serializers
- Common authentication

---

## 🚨 Breaking Changes Notice

**Important**: Update your frontend/client code to use the new URLs. The old URLs will no longer work after this update.

### Quick Migration Checklist:
- [ ] Update all `/login/` to `/auth/login/`
- [ ] Update all `/me/` to `/auth/me/`
- [ ] Update all `/register/` paths to `/auth/register/`
- [ ] Update `/contributor-metrics/` to `/profiles/contributors/metrics/`
- [ ] Update `/contributors/` to `/profiles/contributors/list/`
- [ ] Update `/add-funds/` to `/profiles/add-funds/`
- [ ] Test all endpoints with authentication tokens
- [ ] Verify smoke signals functionality
- [ ] Test admin promotion workflow

---

## 📝 Notes

1. **All endpoints require authentication** unless specified (like login/register)
2. **Admin endpoints** require admin permissions
3. **ViewSets automatically provide** list, create, retrieve, update, destroy actions
4. **Custom actions** are added with `@action` decorator (e.g., `/join/`, `/summary/`)
5. **Query parameters** still work the same way (e.g., `?range=7d&limit=100`)

---

## 🔍 API Documentation

Visit these URLs when the server is running:
- Swagger UI: `http://localhost:8000/api/schema/swagger-ui/`
- ReDoc: `http://localhost:8000/api/schema/redoc/`
- OpenAPI Schema: `http://localhost:8000/api/schema/`

