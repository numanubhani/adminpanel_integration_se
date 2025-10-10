# API Endpoints Quick Reference

## 🔐 Authentication Endpoints
**Base**: `/api/accounts/auth/`

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/auth/login/` | POST | ❌ | User/Contributor login |
| `/auth/register/user/` | POST | ❌ | Register new user |
| `/auth/register/contributor/` | POST | ❌ | Register new contributor |
| `/auth/me/` | GET | ✅ | Get current user profile |

---

## 👤 Profile Endpoints
**Base**: `/api/accounts/profiles/`

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/profiles/` | GET | ✅ | List all profiles (admin only) |
| `/profiles/{id}/` | GET | ✅ | Get profile by ID |
| `/profiles/{id}/` | PUT/PATCH | ✅ | Update profile (admin) |
| `/profiles/my-profile/` | GET | ✅ | Get my profile |
| `/profiles/update-profile/` | PUT/PATCH | ✅ | Update my profile |
| `/profiles/add-funds/` | POST | ✅ | Add funds to account |
| `/profiles/contributors/metrics/` | GET | ✅ | Get contributor statistics |
| `/profiles/contributors/list/` | GET | ✅ | List all contributors |

---

## 🖼️ Body Part Images
**Base**: `/api/accounts/body-part-images/`

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/body-part-images/` | GET | ✅ | List my images |
| `/body-part-images/` | POST | ✅ | Upload new image |
| `/body-part-images/{id}/` | GET | ✅ | Get specific image |
| `/body-part-images/{id}/` | PUT/PATCH | ✅ | Update image |
| `/body-part-images/{id}/` | DELETE | ✅ | Delete image |

---

## 👨‍💼 Admin Endpoints
**Base**: `/api/accounts/admin/`

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/admin/` | GET | ✅ | List all admins |
| `/admin/{id}/` | GET | ✅ | Get specific admin |
| `/admin/login/` | POST | ❌ | Admin login |
| `/admin/promote/` | POST | ✅ | Promote contributor to admin |

---

## 📊 Dashboard Endpoints
**Base**: `/api/accounts/dashboard/`

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/dashboard/stats/` | GET | ✅ | Get dashboard statistics |

---

## 🏆 Contest Endpoints
**Base**: `/api/accounts/contests/`

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/contests/` | GET | ✅ | List all contests |
| `/contests/` | POST | ✅ | Create contest (admin only) |
| `/contests/{id}/` | GET | ✅ | Get contest details |
| `/contests/{id}/` | PUT/PATCH | ✅ | Update contest (admin only) |
| `/contests/{id}/` | DELETE | ✅ | Delete contest (admin only) |
| `/contests/{id}/join/` | POST | ✅ | Join contest (contributor) |
| `/contests/{id}/participants/` | GET | ✅ | Get participants |
| `/contests/{id}/eligible_contributors/` | GET | ✅ | Get eligible contributors |

**Query Parameters**:
- `?is_active=true/false` - Filter by active status
- `?category=value` - Filter by category

---

## 💨 Smoke Signals Endpoints
**Base**: `/api/accounts/smoke-signals/`

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/smoke-signals/` | GET | ✅ | List all smoke signals |
| `/smoke-signals/` | POST | ✅ | Create smoke signal record |
| `/smoke-signals/{id}/` | GET | ✅ | Get specific signal |
| `/smoke-signals/{id}/` | PUT/PATCH | ✅ | Update signal |
| `/smoke-signals/{id}/` | DELETE | ✅ | Delete signal |
| `/smoke-signals/summary/` | GET | ✅ | Get summary statistics |
| `/smoke-signals/send/` | POST | ✅ | Send notification |

**Query Parameters**:
- `?range=24h/7d` - Time range filter (default: 24h)
- `?limit=100` - Maximum results (default: 1000)

---

## 📝 Request/Response Examples

### Login
```bash
POST /api/accounts/auth/login/
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGci...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGci...",
  "profile": {
    "email": "user@example.com",
    "role": "user",
    "screen_name": "username"
  }
}
```

### Register User
```bash
POST /api/accounts/auth/register/user/
{
  "email": "newuser@example.com",
  "password": "password123",
  "screen_name": "newuser"
}
```

### Register Contributor
```bash
POST /api/accounts/auth/register/contributor/
{
  "email": "contributor@example.com",
  "password": "password123",
  "screenName": "creator1",
  "firstName": "John",
  "lastName": "Doe",
  "age": 25,
  "gender": "Male",
  "isOver18": true,
  ...
}
```

### Get Dashboard Stats
```bash
GET /api/accounts/dashboard/stats/

Response:
{
  "total_contributors": 150,
  "total_users": 500,
  "total_wallet_deposits": 5000.00,
  "total_payments": 200,
  "recent_contributors": 25,
  "recent_users": 50,
  "active_contests": 5
}
```

### Get Contributor Metrics
```bash
GET /api/accounts/profiles/contributors/metrics/

Response:
{
  "total_contributors": 150,
  "total_females": 80,
  "female_22_25": 30,
  "light_skin_females": 40,
  "blonde_females": 20,
  "petite_females": 15,
  "c_cup_contributors": 25,
  "tall_slender": 10,
  "male_contributors": 65,
  "other_contributors": 5
}
```

### List Contributors
```bash
GET /api/accounts/profiles/contributors/list/

Response:
{
  "count": 150,
  "contributors": [
    {
      "id": 1,
      "name": "creator1",
      "email": "creator@example.com",
      "gender": "Female",
      "age": 25,
      "skinTone": "Light",
      "hairColor": "Blonde",
      "bodyType": "Petite",
      "height": "5'6\"",
      "weight": "120",
      "cupSize": "C",
      "earnings": 0,
      "contestsWon": 0,
      "engagement": 0
    },
    ...
  ]
}
```

### Send Smoke Signal (SMS)
```bash
POST /api/accounts/smoke-signals/send/
{
  "to": "+1234567890",
  "channel": "SMS",
  "message": "Your contest is starting soon!",
  "sender": "Admin"
}

Response:
{
  "id": 1,
  "sender": "Admin",
  "channel": "SMS",
  "status": "Delivered",
  "message": "Your contest is starting soon!",
  "timestamp": "2025-10-10T12:00:00Z"
}
```

### Send Smoke Signal (Email)
```bash
POST /api/accounts/smoke-signals/send/
{
  "to": "user@example.com",
  "channel": "Email",
  "message": "Password reset link sent",
  "sender": "System"
}
```

### Get Smoke Signals Summary
```bash
GET /api/accounts/smoke-signals/summary/?range=7d

Response:
{
  "total": 150,
  "delivered": 140,
  "failed": 5,
  "pending": 5,
  "email_total": 100,
  "sms_total": 50,
  "unique_senders": 3,
  "message_frequency": [
    {"message": "Welcome!", "count": 50},
    {"message": "Contest starting", "count": 30},
    ...
  ]
}
```

### Add Funds
```bash
POST /api/accounts/profiles/add-funds/
{
  "cardNumber": "1234567890123456",
  "expiryDate": "12/2025",
  "securityCode": "123"
}

Response:
{
  "message": "Funds added successfully",
  "payment_id": 1,
  "status": "completed"
}
```

### Admin Login
```bash
POST /api/accounts/admin/login/
{
  "email": "admin@example.com",
  "password": "admin123"
}

Response:
{
  "message": "Login successful",
  "admin": {
    "id": 1,
    "email": "admin@example.com",
    "screen_name": "admin",
    "is_admin": true
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGci...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGci..."
  }
}
```

### Promote Contributor to Admin
```bash
POST /api/accounts/admin/promote/
{
  "email": "contributor@example.com",
  "isAdmin": true
}

Response:
{
  "message": "Contributor promoted to admin successfully",
  "admin": {
    "id": 2,
    "email": "contributor@example.com",
    "is_admin": true
  }
}
```

### Create Contest (Admin Only)
```bash
POST /api/accounts/contests/
{
  "title": "Best Photo Contest",
  "description": "Submit your best photo",
  "category": "photography",
  "prize": 1000.00,
  "max_participants": 50,
  "is_active": true,
  "attributes": {
    "Gender": ["Female"],
    "Age": ["22-25"],
    "Skin Tone": ["Light"]
  }
}
```

### Join Contest (Contributor Only)
```bash
POST /api/accounts/contests/1/join/

Response:
{
  "message": "Successfully joined the contest",
  "participant": {
    "id": 1,
    "contest": 1,
    "contributor": 5,
    "joined_at": "2025-10-10T12:00:00Z",
    "auto_entry": false
  }
}
```

### List Contests
```bash
GET /api/accounts/contests/?is_active=true&category=photography

Response:
[
  {
    "id": 1,
    "title": "Best Photo Contest",
    "description": "Submit your best photo",
    "category": "photography",
    "prize": 1000.00,
    "max_participants": 50,
    "joined": 10,
    "is_active": true,
    "created_at": "2025-10-01T00:00:00Z"
  },
  ...
]
```

---

## 🔑 Authentication

All protected endpoints require JWT token in header:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

### Get Token
1. Login via `/api/accounts/auth/login/`
2. Receive `access` and `refresh` tokens
3. Use `access` token in Authorization header
4. Refresh token when expired

---

## 🌐 Base URL

Development: `http://localhost:8000`  
Production: `https://your-domain.com`

---

## 📚 API Documentation

- **Swagger UI**: `/api/schema/swagger-ui/`
- **ReDoc**: `/api/schema/redoc/`
- **OpenAPI Schema**: `/api/schema/`

---

## 🎯 HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (no permission) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## 💡 Tips

1. **Always include `Content-Type: application/json`** for POST/PUT/PATCH requests
2. **Use proper HTTP methods** - GET for read, POST for create, PUT/PATCH for update, DELETE for delete
3. **Check permissions** - Some endpoints are admin-only, some contributor-only
4. **Use query parameters** for filtering and pagination
5. **Handle token expiration** - Implement refresh token logic
6. **Test with Swagger** - Interactive API documentation available

---

## 🚀 Quick Start Testing

```bash
# 1. Start server
python manage.py runserver

# 2. Register a user
curl -X POST http://localhost:8000/api/accounts/auth/register/user/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","screen_name":"tester"}'

# 3. Login
curl -X POST http://localhost:8000/api/accounts/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# 4. Get profile (use token from step 3)
curl -X GET http://localhost:8000/api/accounts/auth/me/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

