# Yoti Age Verification Setup Instructions

## 📋 Overview

This guide will help you set up Yoti Age Verification in your Django REST API project.

## 🔑 Credentials

- **SDK ID**: `d166a758-7100-4626-8f6f-08617879079a`
- **API Key**: `L8GLhGceggptE7W7X-mTqvq0JGGaYq9w6Q4CjP8nob22bbwyRpESm0t3NRA-`
- **PEM File**: Place your `.pem` private key file in `backend/certs/yoti-private-key.pem`

## 📦 Step 1: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

The following packages are required (already in requirements.txt):
- `cryptography` - For RSA signing with .pem file
- `requests` - For API calls
- `python-dotenv` - For environment variables

## 📁 Step 2: Add PEM File

1. Place your Yoti `.pem` private key file in:
   ```
   backend/certs/yoti-private-key.pem
   ```

2. **Important**: Make sure the `.pem` file is NOT committed to git (already in `.gitignore`)

## ⚙️ Step 3: Configure Environment Variables (Optional)

Create a `.env` file in the `backend` directory (optional, defaults are already set):

```bash
# .env file
YOTI_SDK_ID=d166a758-7100-4626-8f6f-08617879079a
YOTI_API_KEY=L8GLhGceggptE7W7X-mTqvq0JGGaYq9w6Q4CjP8nob22bbwyRpESm0t3NRA-
YOTI_PEM_FILE_PATH=backend/certs/yoti-private-key.pem
```

**Note**: The credentials are already configured in `settings.py` with defaults. You can override them with environment variables if needed.

## 🗄️ Step 4: Run Migrations

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

This will create the `AgeVerification` model in your database.

## 🚀 Step 5: Test the API

### Endpoint: `POST /api/accounts/verify-age/`

**Request:**
```bash
curl -X POST http://127.0.0.1:8000/api/accounts/verify-age/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "yoti_verification_token_from_frontend"
  }'
```

**Response (Success):**
```json
{
  "success": true,
  "age": 23,
  "is_over_18": true,
  "date_of_birth": "2001-01-15"
}
```

**Response (Error):**
```json
{
  "success": false,
  "age": null,
  "is_over_18": false,
  "error": "Token is required"
}
```

## 📚 Available Endpoints

### 1. Verify Age
- **POST** `/api/accounts/verify-age/`
- **Auth**: Required (JWT Token)
- **Body**: `{ "token": "yoti_token" }`

### 2. Get Verification History
- **GET** `/api/accounts/verify-age/history/`
- **Auth**: Required (JWT Token)
- Returns all verification attempts for the user

### 3. Get Latest Verification
- **GET** `/api/accounts/verify-age/latest/`
- **Auth**: Required (JWT Token)
- Returns the latest successful verification

## 🔍 How It Works

1. **Frontend** sends Yoti verification token to backend
2. **Backend** signs the request using RSA private key (.pem file)
3. **Backend** calls Yoti API to verify age
4. **Backend** saves result to `AgeVerification` model
5. **Backend** updates user's profile age if verification successful
6. **Backend** returns age and verification status

## 🗃️ Database Model

The `AgeVerification` model stores:
- User reference
- Yoti token
- Age
- Date of birth
- Is over 18 flag
- Verification status
- Full API response
- Error messages
- Timestamps

## 🔒 Security Notes

1. **Never commit** `.pem` files to git
2. **Never commit** API keys to git
3. Use environment variables in production
4. The `.pem` file is already in `.gitignore`

## 🐛 Troubleshooting

### Error: "PEM file not found"
- Check that the `.pem` file exists at `backend/certs/yoti-private-key.pem`
- Or set `YOTI_PEM_FILE_PATH` environment variable

### Error: "Private key not loaded"
- Verify the `.pem` file is valid
- Check file permissions

### Error: "Yoti credentials not configured"
- Check that `YOTI_SDK_ID` and `YOTI_API_KEY` are set in settings.py or environment

### Error: "Request timeout"
- Check your internet connection
- Yoti API might be slow, timeout is set to 30 seconds

## 📝 Example Frontend Integration

```javascript
// After user completes Yoti verification in frontend
const yotiToken = "token_from_yoti_sdk";

// Send to backend
const response = await fetch('http://localhost:8000/api/accounts/verify-age/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${userToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ token: yotiToken })
});

const data = await response.json();

if (data.success && data.is_over_18) {
  console.log('User verified! Age:', data.age);
} else {
  console.error('Verification failed:', data.error);
}
```

## ✅ Verification Checklist

- [ ] PEM file placed in `backend/certs/yoti-private-key.pem`
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] Migrations run (`python manage.py migrate`)
- [ ] Server started (`python manage.py runserver`)
- [ ] Test endpoint with valid token
- [ ] Check database for `AgeVerification` records

## 📞 Support

For Yoti API issues, check:
- Yoti Documentation: https://developers.yoti.com/
- Yoti Dashboard: https://hub.yoti.com/

