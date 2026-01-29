# How to Get Yoti SDK ID and API Key

## 📍 Quick Steps

1. **Go to Yoti Hub:** https://hub.yoti.com/
2. **Login** (or create account at https://www.yoti.com/business/)
3. **Create Application** (if you don't have one)
4. **Copy SDK ID** from application overview
5. **Generate API Key** from application settings
6. **Add to your code** (see below)

## 🔍 Detailed Instructions

### Step 1: Access Yoti Platform

**Option A: Direct to Hub**
- Visit: **https://hub.yoti.com/**
- Login with your Yoti business account

**Option B: Via Business Portal**
- Visit: **https://www.yoti.com/business/**
- Click "Login" or "Get Started"
- Navigate to Hub/Dashboard

### Step 2: Create Application (If Needed)

1. Click **"Create Application"** or **"New App"** button
2. Fill in details:
   - **Name:** SelectExposure (or your app name)
   - **Product Type:** Age Verification or Identity Verification
   - **Description:** Identity verification for contributors
3. Click **"Create"** or **"Save"**

### Step 3: Find SDK ID

The **SDK ID** (also called Application ID) is usually displayed:

**Location 1: Application List**
- On main dashboard, you'll see your applications
- SDK ID is shown next to each application
- Format: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`

**Location 2: Application Details**
- Click on your application
- SDK ID is shown at the top of the page
- Usually labeled as "SDK ID" or "Application ID"

**Location 3: Integration/Settings**
- Go to Application Settings
- Look for "Integration" or "Setup" tab
- SDK ID is displayed there

### Step 4: Generate API Key

1. **Navigate to Application Settings:**
   - Click on your application
   - Go to **"Settings"** or **"Security"** tab
   - Look for **"API Keys"** or **"Credentials"** section

2. **Generate New API Key:**
   - Click **"Generate API Key"** or **"Create API Key"** button
   - You may need to confirm or enter a name for the key
   - **Important:** The API key will be shown **ONCE** - copy it immediately!

3. **Copy the API Key:**
   - It's a long string (usually 40+ characters)
   - Format varies but looks like: `your-long-secret-api-key-string`
   - **Save it securely** - you won't be able to see it again!

### Step 5: Add to Your Code

**Option A: Environment Variables (Recommended)**

Create/update `.env` file in backend directory:
```bash
YOTI_SDK_ID=a1b2c3d4-e5f6-7890-abcd-ef1234567890
YOTI_API_KEY=your-long-api-key-string-here
```

**Option B: Direct in settings.py**

Add to `backend/settings.py`:
```python
# Yoti Age Verification Configuration
YOTI_SDK_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
YOTI_API_KEY = 'your-long-api-key-string-here'
YOTI_API_URL = 'https://age.yoti.com/api/v1'
```

## ⚠️ Important Security Notes

- ❌ **NEVER** commit API keys to git
- ✅ Use `.env` file and add `.env` to `.gitignore`
- ✅ Use environment variables in production
- ✅ Keep API keys secure and private
- ✅ Rotate keys if compromised

## 🆘 Troubleshooting

### "I can't find SDK ID"
- Make sure you've created an application
- Check the application overview/dashboard page
- Look for "Application ID" or "App ID" (same thing)

### "I can't generate API Key"
- Make sure your account is verified
- Check if you have permission to create API keys
- Contact Yoti support if needed

### "API Key not working"
- Verify you copied the entire key (no spaces)
- Check if key is active in dashboard
- Ensure you're using the correct environment (sandbox vs production)

## 📞 Need Help?

- **Yoti Support:** https://www.yoti.com/support/
- **Yoti Documentation:** https://developers.yoti.com/
- **Yoti Community:** Check Yoti developer forums

## ✅ Verification Checklist

- [ ] Created Yoti account
- [ ] Created application in Yoti Hub
- [ ] Copied SDK ID
- [ ] Generated and copied API Key
- [ ] Added credentials to `.env` or `settings.py`
- [ ] Verified credentials are not in git
- [ ] Tested API connection


