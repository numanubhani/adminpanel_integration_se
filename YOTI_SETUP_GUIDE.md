# Yoti Integration Setup Guide

## ✅ What's Already Done

1. ✅ Backend Yoti service (`accounts/services/yoti_service.py`)
2. ✅ Backend API endpoints for Yoti
3. ✅ Database fields added to Profile model
4. ✅ Migration file created (`0026_add_yoti_fields.py`)
5. ✅ Frontend component created (`YotiVerification.jsx`)
6. ✅ Yoti Web SDK script added to `index.html`

## 🔧 What You Need to Do

### 1. Run Database Migration

```bash
cd C:\Users\Numan\Desktop\adminpanel_integration_se\backend
python manage.py migrate accounts
```

### 2. Install Python Dependencies

```bash
pip install requests
# Or if using requirements.txt:
pip install -r requirements.txt
```

### 3. Configure Yoti Credentials

Add these to your `.env` file or Django settings:

```bash
# In your .env file or environment variables
YOTI_SDK_ID=your_yoti_sdk_id_here
YOTI_API_KEY=your_yoti_api_key_here
```

Or add directly to `backend/settings.py`:

```python
# Yoti Age Verification Configuration
YOTI_SDK_ID = 'your_yoti_sdk_id_here'
YOTI_API_KEY = 'your_yoti_api_key_here'
YOTI_API_URL = 'https://age.yoti.com/api/v1'  # Optional, defaults to this
```

**Where to get credentials:**

### Step-by-Step Guide to Get Yoti Credentials:

1. **Create/Login to Yoti Account:**
   - Go to: https://www.yoti.com/business/
   - Click "Sign Up" or "Log In"
   - Complete registration if new account

2. **Access Yoti Hub (Developer Portal):**
   - After logging in, go to: https://hub.yoti.com/
   - Or navigate to: https://www.yoti.com/dashboard
   - This is your developer dashboard

3. **Create a New Application:**
   - Click "Create Application" or "New App"
   - Fill in:
     - Application Name: "SelectExposure" (or your app name)
     - Description: "Identity verification for contributors"
     - Select "Age Verification" or "Identity Verification" as the product
   - Save/Create the application

4. **Get SDK ID:**
   - Once application is created, you'll see your **SDK ID** (also called Application ID)
   - It looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`
   - Copy this value - this is your `YOTI_SDK_ID`

5. **Generate API Key:**
   - In your application settings, look for "API Keys" or "Credentials" section
   - Click "Generate API Key" or "Create API Key"
   - You'll get an **API Key** (also called Secret Key)
   - It looks like: `your-long-api-key-string-here`
   - **Important:** Copy this immediately - you won't be able to see it again!
   - This is your `YOTI_API_KEY`

6. **Alternative Locations:**
   - **SDK ID:** Usually found in:
     - Application Overview page
     - Application Settings
     - Integration/Setup page
   - **API Key:** Usually found in:
     - Security/Credentials section
     - API Keys tab
     - Integration settings

### Visual Guide:

**After logging into Yoti Hub, you'll typically see:**

1. **Dashboard/Applications Page:**
   ```
   ┌─────────────────────────────────┐
   │ Your Applications               │
   ├─────────────────────────────────┤
   │ [SelectExposure]                │
   │ SDK ID: a1b2c3d4-e5f6-7890... │ ← Copy this
   │ Status: Active                  │
   │ [View Details] [Settings]      │
   └─────────────────────────────────┘
   ```

2. **Application Settings Page:**
   ```
   ┌─────────────────────────────────┐
   │ Application Settings             │
   ├─────────────────────────────────┤
   │ SDK ID: a1b2c3d4-e5f6-7890... │ ← Copy this
   │                                 │
   │ API Keys:                       │
   │ [Generate New API Key]          │ ← Click here
   │                                 │
   │ Your API Key:                   │
   │ ******************************** │ ← Copy this (shown once)
   └─────────────────────────────────┘
   ```

### Quick Links:
- **Yoti Business Portal:** https://www.yoti.com/business/
- **Yoti Hub (Dashboard):** https://hub.yoti.com/
- **Yoti Documentation:** https://developers.yoti.com/
- **Age Verification Docs:** https://developers.yoti.com/age-verification/
- **Support/Contact:** https://www.yoti.com/support/ (if you need help)

### Important Notes:
- ⚠️ Keep your API Key secret - never commit it to git
- ⚠️ Use environment variables for production
- ⚠️ You may need to verify your business account before getting full access
- ⚠️ Some features may require approval from Yoti support

### 4. Update Frontend Component (if needed)

The component is already set up, but verify:
- ✅ Yoti SDK script is loaded in `index.html`
- ✅ Component uses `client_session_token` from session creation
- ✅ Verification container div exists (`yoti-verification-container`)

### 5. Integrate Component into Pages

Add the YotiVerification component to your pages:

**In Signup.jsx:**
```jsx
import YotiVerification from "../components/YotiVerification";

// Add in your form:
<YotiVerification 
  onCompletion={() => {
    // Handle completion
    console.log('Yoti verification completed');
  }}
  showModal={false}
/>
```

**In Profile.jsx:**
```jsx
import YotiVerification from "../components/YotiVerification";

// Add in profile page:
<YotiVerification 
  onCompletion={fetchYotiStatus}
  showModal={false}
/>
```

### 6. Test the Integration

1. Start Django server: `python manage.py runserver`
2. Start React app: `npm start`
3. Navigate to a page with YotiVerification component
4. Click "Start Verification"
5. Complete the Yoti verification flow
6. Verify status updates automatically

## 📋 API Endpoints Available

- `POST /api/accounts/profile/yoti/create-session/` - Create verification session
- `GET /api/accounts/profile/yoti/session/{session_id}/` - Get session details
- `GET /api/accounts/profile/yoti/session/{session_id}/result/` - Get verification result
- `DELETE /api/accounts/profile/yoti/session/{session_id}/` - Delete session
- `POST /api/accounts/profile/yoti/callback/` - Webhook callback (for Yoti)
- `GET /api/accounts/profile/yoti/status/` - Get verification status

## 🔍 Troubleshooting

### Issue: "Yoti SDK not loaded"
**Solution:** Make sure the script tag is in `index.html`:
```html
<script src="https://sdk.yoti.com/clients/browser.umd.js"></script>
```

### Issue: "Yoti API key not configured"
**Solution:** Add `YOTI_API_KEY` and `YOTI_SDK_ID` to your environment variables or settings.py

### Issue: "ModuleNotFoundError: No module named 'requests'"
**Solution:** Run `pip install requests`

### Issue: "Migration not applied"
**Solution:** Run `python manage.py migrate accounts`

### Issue: Verification doesn't complete
**Solution:** 
- Check browser console for errors
- Verify Yoti credentials are correct
- Check network tab for API call failures
- Ensure callback URL is accessible

## 📚 Additional Resources

- Yoti Documentation: https://developers.yoti.com/
- Yoti Age Verification API: https://developers.yoti.com/age-verification/
- Yoti Web SDK: https://github.com/getyoti/yoti-node-sdk

## 🎯 Next Steps After Setup

1. Test the verification flow end-to-end
2. Add Yoti verification requirement to signup flow
3. Add verification status checks before allowing certain actions
4. Set up webhook callbacks for production
5. Configure Yoti rules and thresholds in Yoti Dashboard

