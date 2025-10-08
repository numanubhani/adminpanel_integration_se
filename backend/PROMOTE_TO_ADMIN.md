# 🚀 Promote Contributor to Admin

## Overview
Instead of creating a new admin from scratch, you can **promote an existing contributor** to admin status. This is much simpler - just provide the contributor's email and set `isAdmin: true`.

---

## 🎯 API Endpoint

### **POST** `/api/accounts/admin/promote/`

**Description:** Promotes an existing contributor to admin by creating an Admin record linked to their existing profile.

---

## 📋 Request Format

### **Simple Request:**
```json
{
  "email": "contributor@example.com",
  "isAdmin": true
}
```

### **Fields:**
- `email` *(required)* - Email of the existing contributor
- `isAdmin` *(optional)* - Admin flag (default: true)

---

## ✅ Response Format

### **Success (201 Created):**
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

## ❌ Error Responses

### **User Not Found (404):**
```json
{
  "error": "User with this email not found"
}
```

### **Profile Not Found (404):**
```json
{
  "error": "User profile not found"
}
```

### **Already Admin (400):**
```json
{
  "error": "User is already an admin"
}
```

### **Email Required (400):**
```json
{
  "error": "Email is required"
}
```

---

## 🧪 Testing in Swagger

1. **Open Swagger UI:**  
   Visit: `http://127.0.0.1:8000/api/docs/`

2. **Navigate to:**  
   `POST /api/accounts/admin/promote/`

3. **Click:** "Try it out"

4. **Enter Request:**
   ```json
   {
     "email": "contributor@example.com",
     "isAdmin": true
   }
   ```

5. **Click:** "Execute"

6. **Expected Result:**  
   - Status: `201 Created`
   - Contributor is now an admin

---

## 🔄 Complete Workflow

### **Step 1: Register a Contributor**
First, register a user as a contributor:

```bash
POST /api/accounts/register/contributor/
```

```json
{
  "email": "john@example.com",
  "password": "password123",
  "screenName": "john_doe",
  // ... other contributor fields
}
```

### **Step 2: Promote to Admin**
Then promote them to admin:

```bash
POST /api/accounts/admin/promote/
```

```json
{
  "email": "john@example.com",
  "isAdmin": true
}
```

### **Step 3: Admin Can Now Login**
The contributor can now login as admin:

```bash
POST /api/accounts/admin/login/
```

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

## 💡 Key Benefits

✅ **No Duplicate Data** - Uses existing contributor profile  
✅ **Simple Process** - Just provide email  
✅ **Preserves History** - All contributor data remains intact  
✅ **Quick Promotion** - Single API call  
✅ **Flexible** - Can promote any existing contributor  

---

## 🔐 Frontend Integration

### React Example:

```javascript
const promoteToAdmin = async (contributorEmail) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/accounts/admin/promote/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add auth token if needed
        // 'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        email: contributorEmail,
        isAdmin: true
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('Promoted successfully:', data.admin);
      return data.admin;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Promotion failed:', error);
    throw error;
  }
};

// Usage
promoteToAdmin('contributor@example.com')
  .then(admin => {
    alert(`${admin.email} is now an admin!`);
  })
  .catch(error => {
    alert(`Failed to promote: ${error.message}`);
  });
```

---

## 📊 What Happens Behind the Scenes

When you promote a contributor:

1. **Finds User** by email
2. **Finds Profile** linked to that user
3. **Checks** if already an admin
4. **Creates Admin Record** with `is_admin=true`
5. **Links** Admin → Profile (OneToOne)

**Database Structure:**
```
User (already exists)
  ↓ OneToOne
Profile (already exists with all contributor data)
  ↓ OneToOne
Admin (newly created)
```

---

## 🆚 Comparison: Full Registration vs. Promotion

### **Full Registration** (`/admin/register/`)
- ✅ Creates new User, Profile, and Admin
- ✅ Requires all contributor fields
- ✅ Good for: New admins without existing account

### **Promotion** (`/admin/promote/`)
- ✅ Uses existing User and Profile
- ✅ Only requires email
- ✅ Good for: Promoting existing contributors

---

## 📝 Use Cases

### **Scenario 1: Promote Top Contributor**
A contributor has been active and you want to give them admin privileges:

```json
{
  "email": "topcontributor@example.com",
  "isAdmin": true
}
```

### **Scenario 2: Emergency Admin Access**
Need to quickly give someone admin access:

```json
{
  "email": "emergency@example.com",
  "isAdmin": true
}
```

### **Scenario 3: Role Upgrade**
A user started as contributor, now needs admin role:

```json
{
  "email": "upgraded@example.com",
  "isAdmin": true
}
```

---

## ⚠️ Important Notes

- **Email must exist:** The user must already be registered
- **Profile required:** User must have a profile (contributor role)
- **No duplicates:** Can't promote if already an admin
- **Case insensitive:** Email is converted to lowercase
- **Preserves data:** All contributor fields remain unchanged

---

## 🧹 Reversing Admin Status

To remove admin status, you would need to:
1. Delete the Admin record (keep Profile intact)
2. Or implement a "demote" endpoint

Example demote logic (optional):
```python
admin = Admin.objects.get(profile__user__email=email)
admin.delete()  # Removes admin status, keeps profile
```

---

## ✅ Summary

**Endpoint:** `POST /api/accounts/admin/promote/`

**Request:**
```json
{
  "email": "contributor@example.com",
  "isAdmin": true
}
```

**Benefits:**
- ✅ Simple and fast
- ✅ No data duplication
- ✅ Preserves contributor history
- ✅ Single API call

**Perfect for:** Promoting existing users to admin without re-entering all their information!

---

**Server:** Running on `http://127.0.0.1:8000/`  
**Swagger:** `http://127.0.0.1:8000/api/docs/`  
**Status:** ✅ Ready to use

