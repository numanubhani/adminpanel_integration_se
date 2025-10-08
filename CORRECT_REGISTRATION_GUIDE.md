# ✅ Correct Registration Guide - Field Names Fixed!

## Problem Identified

The Swagger example was using **snake_case** field names (`screen_name`, `first_name`) but the backend API expects **camelCase** (`screenName`, `firstName`).

---

## ✅ Fixed!

Updated Swagger example to use correct camelCase field names that match the serializer.

---

## 📋 Correct Field Names (Request)

### **Use These Field Names in Swagger/API:**

| Field | Correct Name (camelCase) | ❌ Wrong (snake_case) |
|-------|-------------------------|---------------------|
| Screen Name | `screenName` | ~~screen_name~~ |
| First Name | `firstName` | ~~first_name~~ |
| Last Name | `lastName` | ~~last_name~~ |
| Phone Number | `phoneNumber` | ~~phone_number~~ |
| Zip Code | `zipCode` | ~~zip_code~~ |
| Country Residence | `countryResidence` | ~~country_residence~~ |
| Name Visibility | `nameVisibility` | ~~name_visibility~~ |
| Is Over 18 | `isOver18` | ~~is_over_18~~ |
| Date of Birth | `dateOfBirth` | ~~date_of_birth~~ |
| Shoe Size | `shoeSize` | ~~shoe_size~~ |
| Skin Tone | `skinTone` | ~~skin_tone~~ |
| Hair Color | `hairColor` | ~~hair_color~~ |
| Body Type | `bodyType` | ~~body_type~~ |
| Penis Length | `penisLength` | ~~penis_length~~ |
| Female Body Type | `femaleBodyType` | ~~female_body_type~~ |
| Bust Size | `bustSize` | ~~bust_size~~ |
| Creator Pathway | `creatorPathway` | ~~creator_pathway~~ |
| Legal Full Name | `legalFullName` | ~~legal_full_name~~ |

---

## 🚀 Correct Registration (Swagger)

### **Open:** http://127.0.0.1:8000/api/docs/

### **POST /api/accounts/register/contributor/**

**Use This Correct Payload:**

```json
{
  "email": "newuser@gmail.com",
  "password": "Test@123456",
  "screenName": "newuser",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "United States",
  "countryResidence": "United States",
  "nationality": "American",
  "occupation": "Developer",
  "nameVisibility": "public",
  "isOver18": true,
  "bio": "Test bio",
  "dateOfBirth": "1990-01-01",
  "age": 35,
  "gender": "Male",
  "height": "6'0\"",
  "weight": "180",
  "shoeSize": "10",
  "skinTone": "Fair",
  "hairColor": "Brown",
  "bodyType": "Athletic",
  "penisLength": "6-7.5"
}
```

**Click "Execute"**

---

## ✅ Expected Response

```json
{
  "access": "eyJ0eXAiOiJKV1Qi...",
  "refresh": "eyJ0eXAiOiJKV1Qi...",
  "profile": {
    "id": 48,
    "email": "newuser@gmail.com",
    "screen_name": "newuser",      ← Should have value!
    "role": "contributor",
    "legal_full_name": "",
    "first_name": "John",          ← Should have value!
    "last_name": "Doe",            ← Should have value!
    "phone_number": "+1234567890", ← Should have value!
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip_code": "10001",
    "country": "United States",
    "country_residence": "United States",
    "nationality": "American",
    "occupation": "Developer",
    "gender": "Male",
    "height": "6'0\"",
    "weight": "180",
    "shoe_size": "10",
    "skin_tone": "Fair",
    "hair_color": "Brown",
    "body_type": "Athletic",
    "penis_length": "6-7.5",
    // ... all fields should be populated!
  }
}
```

---

## 🔄 Complete Test Flow

### **Step 1: Register with Correct Field Names**

```json
POST /api/accounts/register/contributor/

{
  "email": "test@gmail.com",
  "password": "Test@123456",
  "screenName": "testuser",     ← camelCase!
  "firstName": "Test",           ← camelCase!
  "lastName": "User"             ← camelCase!
}

Expected: All fields saved to database ✅
```

---

### **Step 2: Verify Data Saved**

```
GET /api/accounts/me/
(Use Bearer token from registration response)

Expected Response:
{
  "screen_name": "testuser",   ← Should have value!
  "first_name": "Test",        ← Should have value!
  "last_name": "User",         ← Should have value!
  "email": "test@gmail.com"
}
```

---

### **Step 3: Promote to Admin**

```json
POST /api/accounts/admin/promote/

{
  "email": "test@gmail.com",
  "isAdmin": true
}

Expected Response:
{
  "admin": {
    "screen_name": "testuser",  ← Should show from profile!
    "email": "test@gmail.com",
    "is_admin": true
  }
}
```

---

### **Step 4: Admin Login**

```json
POST /api/accounts/admin/login/

{
  "email": "test@gmail.com",
  "password": "Test@123456"
}

Expected Response:
{
  "admin": {
    "screen_name": "testuser",  ← Should be here!
    "email": "test@gmail.com",
    "is_admin": true
  },
  "tokens": { ... }
}
```

---

### **Step 5: Test in React**

Login at: http://localhost:3000/login

```
Email: test@gmail.com
Password: Test@123456
Role: Admin

Check Console:
✅ Backend admin response: {screen_name: "testuser", ...}
✅ Topbar - Display Name: "testuser"

Check Topbar:
✅ Shows: "testuser"
✅ NOT: "test@gmail.com"
✅ NOT: "Admin User"
```

---

## 🔍 Why Your Data Was Empty

Looking at your `/me/` response:
```json
{
  "screen_name": "",        ← Empty!
  "first_name": "",         ← Empty!
  "last_name": "",          ← Empty!
  "shoe_size": "",          ← Empty!
  // But these had values:
  "address": "123 Main St",
  "city": "NYC",
  "occupation": "Photographer"
}
```

**Reason:** The Swagger example was using **snake_case** field names, which don't match the serializer's field mappings!

The serializer expects:
- `screenName` → converts to `screen_name`
- `firstName` → converts to `first_name`

But you used:
- `screen_name` → not recognized, ignored!
- `first_name` → not recognized, ignored!

---

## ✅ Solution

### **Use the Updated Swagger Example:**

1. **Refresh Swagger:** http://127.0.0.1:8000/api/docs/
2. **Go to:** POST /api/accounts/register/contributor/
3. **Click:** "Try it out"
4. **The example now shows correct camelCase fields!**

### **Or Use This Correct Payload:**

```json
{
  "email": "correct@gmail.com",
  "password": "Test@123456",
  "screenName": "correct",
  "firstName": "First",
  "lastName": "Last",
  "phoneNumber": "+1234567890",
  "shoeSize": "10",
  "skinTone": "Fair",
  "hairColor": "Brown",
  "bodyType": "Athletic",
  "penisLength": "6-7.5",
  "isOver18": true,
  "dateOfBirth": "1990-01-01",
  "age": 35
}
```

**All fields will be saved!** ✅

---

## 🧪 Quick Test

### **Register New User with Correct Fields:**

```bash
POST /api/accounts/register/contributor/

{
  "email": "properly@gmail.com",
  "password": "Test@123456",
  "screenName": "properly",
  "firstName": "Proper",
  "lastName": "User",
  "gender": "Male",
  "height": "6'0\"",
  "weight": "180",
  "shoeSize": "10",
  "skinTone": "Fair",
  "hairColor": "Brown"
}

Then check GET /me/ - all fields should have values!
```

---

## 📊 Field Name Reference

**Always use camelCase in API requests:**

```javascript
// Core
email, password, screenName, legalFullName

// Basic Info
firstName, lastName, phoneNumber, address, city, state, 
zipCode, country, countryResidence, nationality, occupation

// Visibility
nameVisibility, isOver18, bio, dateOfBirth, age

// Physical
gender, height, weight, shoeSize, skinTone, hairColor

// Male
bodyType, penisLength

// Female
femaleBodyType, bustSize, milf

// Other
creatorPathway, allowNameInSearch, idDocument
```

---

## ✅ Summary

**Issue:** Swagger example used snake_case  
**Fix:** Updated to camelCase  
**Result:** All fields now save correctly  

**Register a new user with the updated example and all data will be saved!** 🎉

