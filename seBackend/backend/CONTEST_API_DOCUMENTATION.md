# 🏆 Contest Management API - Complete Documentation

## Overview

Complete backend API for Contest Management system with role-based permissions.

---

## 🔐 **Permissions**

### **Admin Role (Contributors with Admin Profile):**
- ✅ Create contests
- ✅ Edit contests  
- ✅ Delete contests
- ✅ View all contests
- ✅ View participants
- ✅ View eligible contributors

### **Contributors (Non-Admin):**
- ✅ View all contests
- ✅ Join contests (if eligible)
- ❌ Cannot create/edit/delete contests

### **Regular Users:**
- ✅ View all contests
- ❌ Cannot join contests
- ❌ Cannot create/edit/delete contests

---

## 📊 **Database Models**

### **Contest Model**
```python
{
    "id": Integer (Auto),
    "title": String (max 255),
    "category": String (max 100),
    "image": URL String (max 500),
    "attributes": JSON {
        "Gender": ["Male", "Female"],
        "Age": ["18-25"],
        "Skin Tone": ["Light", "Medium"],
        ...
    },
    "joined": Integer (default 0),
    "max_participants": Integer (default 500),
    "start_time": DateTime,
    "end_time": DateTime,
    "recurring": String ["none", "daily", "weekly", "monthly"],
    "cost": Decimal (default 0.00),
    "created_by": ForeignKey(Admin),
    "created_at": DateTime (auto),
    "updated_at": DateTime (auto),
    "is_active": Boolean (default True)
}
```

### **ContestParticipant Model**
```python
{
    "id": Integer (Auto),
    "contest": ForeignKey(Contest),
    "contributor": ForeignKey(Profile),
    "joined_at": DateTime (auto),
    "auto_entry": Boolean (default False)
}
```

---

## 🚀 **API Endpoints**

Base URL: `http://127.0.0.1:8000/api/accounts/`

### **1. List All Contests**
```http
GET /api/accounts/contests/
```

**Auth:** Required (any authenticated user)

**Query Parameters:**
- `is_active` (optional): `true` or `false`
- `category` (optional): Filter by category name

**Response:**
```json
[
    {
        "id": 1,
        "title": "Beach Body",
        "category": "Full Body",
        "image": "https://example.com/image.jpg",
        "attributes": {
            "Gender": ["Male"],
            "Age": ["18-25"],
            "Skin Tone": ["Fair"],
            "Body Type": ["Slim"],
            "Hair Color": ["Brunette"]
        },
        "joined": 75,
        "max_participants": 500,
        "start_time": "2025-06-01T08:00:00Z",
        "end_time": "2025-06-03T08:00:00Z",
        "recurring": "none",
        "cost": "0.00",
        "is_active": true,
        "created_by": 1,
        "created_by_name": "admin_user",
        "created_at": "2025-01-01T10:00:00Z",
        "updated_at": "2025-01-01T10:00:00Z"
    }
]
```

---

### **2. Get Contest Details**
```http
GET /api/accounts/contests/{id}/
```

**Auth:** Required (any authenticated user)

**Response:**
```json
{
    "id": 1,
    "title": "Beach Body",
    "category": "Full Body",
    "image": "https://example.com/image.jpg",
    "attributes": { ... },
    "joined": 75,
    "max_participants": 500,
    "start_time": "2025-06-01T08:00:00Z",
    "end_time": "2025-06-03T08:00:00Z",
    "recurring": "none",
    "cost": "0.00",
    "is_active": true,
    "created_by": 1,
    "created_by_name": "admin_user",
    "created_at": "2025-01-01T10:00:00Z",
    "updated_at": "2025-01-01T10:00:00Z",
    "participants_list": [
        {
            "id": 1,
            "contest": 1,
            "contest_title": "Beach Body",
            "contributor": 5,
            "contributor_name": "john_doe",
            "contributor_email": "john@example.com",
            "joined_at": "2025-01-02T10:00:00Z",
            "auto_entry": false
        }
    ],
    "participants_count": 75
}
```

---

### **3. Create Contest (Admin Only)**
```http
POST /api/accounts/contests/
```

**Auth:** Required (Admin role only)

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
    "title": "Beach Body Contest",
    "category": "Full Body",
    "image": "https://example.com/contest-image.jpg",
    "attributes": {
        "Gender": ["Male", "Female"],
        "Age": ["18-25", "26-29"],
        "Skin Tone": ["All"],
        "Body Type": ["Athletic/Average"],
        "Hair Color": ["All"]
    },
    "max_participants": 500,
    "start_time": "2025-06-01T08:00:00Z",
    "end_time": "2025-06-03T08:00:00Z",
    "recurring": "none",
    "cost": "0.00",
    "is_active": true
}
```

**Response:** `201 Created`
```json
{
    "id": 1,
    "title": "Beach Body Contest",
    "category": "Full Body",
    ...
    "created_by": 1,
    "created_by_name": "admin_user"
}
```

**Errors:**
- `403 Forbidden` - Not an admin
- `400 Bad Request` - Invalid data

---

### **4. Update Contest (Admin Only)**
```http
PUT /api/accounts/contests/{id}/
PATCH /api/accounts/contests/{id}/
```

**Auth:** Required (Admin role only)

**Request Body:** (same as create, all fields for PUT, partial for PATCH)

**Response:** `200 OK`

---

### **5. Delete Contest (Admin Only)**
```http
DELETE /api/accounts/contests/{id}/
```

**Auth:** Required (Admin role only)

**Response:** `204 No Content`

---

### **6. Join Contest (Contributors Only)**
```http
POST /api/accounts/contests/{id}/join/
```

**Auth:** Required (Contributor role only)

**Response:** `201 Created`
```json
{
    "message": "Successfully joined the contest",
    "participant": {
        "id": 1,
        "contest": 1,
        "contest_title": "Beach Body",
        "contributor": 5,
        "contributor_name": "john_doe",
        "contributor_email": "john@example.com",
        "joined_at": "2025-01-02T10:00:00Z",
        "auto_entry": false
    }
}
```

**Errors:**
- `403 Forbidden` - Not a contributor
- `400 Bad Request` - Contest full / Already joined / Not eligible
- `404 Not Found` - Contest not found

---

### **7. Get Contest Participants**
```http
GET /api/accounts/contests/{id}/participants/
```

**Auth:** Required (any authenticated user)

**Response:**
```json
[
    {
        "id": 1,
        "contest": 1,
        "contest_title": "Beach Body",
        "contributor": 5,
        "contributor_name": "john_doe",
        "contributor_email": "john@example.com",
        "joined_at": "2025-01-02T10:00:00Z",
        "auto_entry": false
    }
]
```

---

### **8. Get Eligible Contributors (Admin Only)**
```http
GET /api/accounts/contests/{id}/eligible_contributors/
```

**Auth:** Required (Admin role only)

**Description:** Returns all contributors who match the contest's attribute requirements.

**Response:**
```json
[
    {
        "id": 5,
        "email": "john@example.com",
        "screen_name": "john_doe",
        "role": "contributor",
        "gender": "Male",
        "age": 25,
        "skin_tone": "Fair",
        "body_type": "Athletic/Average",
        "hair_color": "Brown",
        ...
    }
]
```

---

## 🧪 **Testing Guide**

### **Step 1: Create Admin**

1. Register a contributor:
```bash
POST /api/accounts/register/contributor/
{
  "email": "admin@example.com",
  "password": "Admin@123",
  "screenName": "admin_user",
  "firstName": "Admin",
  "lastName": "User"
}
```

2. Promote to admin:
```bash
POST /api/accounts/admin/promote/
{
  "email": "admin@example.com",
  "isAdmin": true
}
```

3. Login as admin:
```bash
POST /api/accounts/admin/login/
{
  "email": "admin@example.com",
  "password": "Admin@123"
}
```

Save the `access` token from response.

---

### **Step 2: Create Contest**

```bash
POST /api/accounts/contests/
Authorization: Bearer {access_token}

{
    "title": "Summer Beach Body",
    "category": "Full Body",
    "image": "https://example.com/beach.jpg",
    "attributes": {
        "Gender": ["Male"],
        "Age": ["18-25"],
        "Skin Tone": ["All"],
        "Body Type": ["Athletic/Average"],
        "Hair Color": ["All"]
    },
    "max_participants": 100,
    "start_time": "2025-06-01T08:00:00Z",
    "end_time": "2025-06-10T08:00:00Z",
    "recurring": "none",
    "cost": "0.00",
    "is_active": true
}
```

---

### **Step 3: Register Contributor**

```bash
POST /api/accounts/register/contributor/
{
  "email": "contributor@example.com",
  "password": "Test@123",
  "screenName": "john_athlete",
  "gender": "Male",
  "age": 22,
  "skinTone": "Medium",
  "bodyType": "Athletic/Average",
  "hairColor": "Brown"
}
```

---

### **Step 4: Join Contest as Contributor**

1. Login as contributor:
```bash
POST /api/accounts/login/
{
  "email": "contributor@example.com",
  "password": "Test@123"
}
```

2. Join contest:
```bash
POST /api/accounts/contests/1/join/
Authorization: Bearer {contributor_access_token}
```

---

### **Step 5: View Contests (Any User)**

```bash
GET /api/accounts/contests/
Authorization: Bearer {any_access_token}
```

---

## 📋 **Eligibility Checking**

The system automatically checks if a contributor is eligible for a contest based on their profile attributes.

### **How it Works:**

1. Contest has required attributes:
```json
{
    "Gender": ["Male"],
    "Age": ["18-25"],
    "Body Type": ["Athletic/Average"]
}
```

2. Contributor profile is checked:
```json
{
    "gender": "Male",  ✅ Matches
    "age": 22,         ✅ In range (needs "18-25")
    "body_type": "Athletic/Average"  ✅ Matches
}
```

3. If **all** attributes match, contributor can join.

### **Special Cases:**

- `"All"` value = Accept any value for that attribute
- Empty array `[]` = No requirement for that attribute
- Multiple values `["Male", "Female"]` = Accept either

---

## 🔧 **Frontend Integration**

### **React Service Example:**

```javascript
// services/contestService.js
const API_BASE_URL = 'http://127.0.0.1:8000';

export const getAllContests = async () => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${API_BASE_URL}/api/accounts/contests/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};

export const createContest = async (contestData) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${API_BASE_URL}/api/accounts/contests/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(contestData)
  });
  return response.json();
};

export const updateContest = async (id, contestData) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${API_BASE_URL}/api/accounts/contests/${id}/`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(contestData)
  });
  return response.json();
};

export const deleteContest = async (id) => {
  const token = localStorage.getItem('accessToken');
  await fetch(`${API_BASE_URL}/api/accounts/contests/${id}/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const joinContest = async (id) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${API_BASE_URL}/api/accounts/contests/${id}/join/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

---

## 🎯 **Next Steps**

1. **Run Migrations:**
```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

2. **Restart Backend:**
```bash
python manage.py runserver
```

3. **Test in Swagger:**
```
http://127.0.0.1:8000/api/docs/
```

4. **Integrate with Frontend:**
- Update ContestManagement.jsx to use API instead of dummy data
- Add loading states
- Add error handling
- Add success messages

---

## ✅ **Summary**

**Models:** ✅ Contest, ContestParticipant  
**Serializers:** ✅ ContestSerializer, ContestDetailSerializer, ContestParticipantSerializer  
**Views:** ✅ ContestViewSet with full CRUD + join + participants  
**Permissions:** ✅ IsAdminOrReadOnly (custom)  
**URLs:** ✅ /api/accounts/contests/  
**Admin:** ✅ Contest and ContestParticipant registered  

**Only admins can create/edit/delete contests!** ✅  
**Contributors can view and join contests!** ✅  
**Users can view contests!** ✅

