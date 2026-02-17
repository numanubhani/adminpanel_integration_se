# Complete Integration Checklist: Twilio & Yoti

This document outlines everything required to complete the Twilio and Yoti integrations.

---

## 🔵 YOTI INTEGRATION

### ✅ What's Already Done:

1. ✅ **Backend Service Created**: `backend/accounts/services/yoti_service.py`
   - Session creation
   - Session result retrieval
   - Session management
   - Error handling

2. ✅ **Credentials Configured**: `backend/backend/settings.py`
   - SDK ID: `d166a758-7100-4626-8f6f-08617879079a`
   - API Key: `L8GLhGceggptE7W7X-mTqvq0JG9GaYq9w6Q4CjP8nob22bWyRpESm0t3NRA`
   - API URL: `https://age.yoti.com/api/v1`

3. ✅ **PEM File Saved**: `backend/certs/Select-Exposure-access-security.pem`
   - Note: Not required for Age Verification API, but saved for future use

4. ✅ **API Endpoints Created**:
   - `POST /api/accounts/profile/yoti/create-session/` - Create verification session
   - `GET /api/accounts/profile/yoti/session/{id}/` - Get session details
   - `GET /api/accounts/profile/yoti/session/{id}/result/` - Get verification result
   - `POST /api/accounts/profile/yoti/callback/` - Webhook callback
   - `GET /api/accounts/profile/yoti/status/` - Get verification status

5. ✅ **Frontend Component**: `src/components/YotiVerification.jsx`
   - Popup-based verification flow
   - Automatic result polling
   - Status updates

6. ✅ **Database Migrations**: Yoti fields added to Profile model
   - `yoti_session_id`
   - `yoti_verified`
   - `yoti_verification_date`
   - `yoti_verification_data`

7. ✅ **UI Integration**: Added to Profile page

### ❌ What Still Needs to Be Done:

#### 1. **Fix 401 Authentication Error** (CRITICAL)

**Current Issue**: Yoti API returning 401 Unauthorized

**Required Actions**:
- [ ] **Go to Yoti Dashboard**: https://hub.yoti.com/
- [ ] **Navigate to**: Applications → Your Application → API Keys
- [ ] **Verify**:
  - [ ] API Key `L8GLhGceggptE7W7X-mTqvq0JG9GaYq9w6Q4CjP8nob22bWyRpESm0t3NRA` is **Active** (not revoked)
  - [ ] **Age Verification API** permissions are **enabled**
  - [ ] SDK ID `d166a758-7100-4626-8f6f-08617879079a` matches your application
- [ ] **If API key is inactive/revoked**:
  - [ ] Generate new API key from dashboard
  - [ ] Update `settings.py` with new key
  - [ ] Restart Django server

#### 2. **Test Yoti Integration**

- [ ] **Start Django server**: `python manage.py runserver`
- [ ] **Start React frontend**: `npm start`
- [ ] **Login** to your account
- [ ] **Navigate** to Profile page
- [ ] **Click** "Start Verification" in Yoti section
- [ ] **Verify**:
  - [ ] Popup opens with Yoti verification page
  - [ ] Can complete verification
  - [ ] Status updates to "Verified" after completion
  - [ ] Profile shows `yoti_verified = True` in database

#### 3. **Production Configuration** (Optional but Recommended)

- [ ] **Move credentials to environment variables**:
  ```bash
  export YOTI_SDK_ID=d166a758-7100-4626-8f6f-08617879079a
  export YOTI_API_KEY=L8GLhGceggptE7W7X-mTqvq0JG9GaYq9w6Q4CjP8nob22bWyRpESm0t3NRA
  ```
- [ ] **Update settings.py** to only use environment variables (remove hardcoded values)
- [ ] **Set up webhook URL** for production callback
- [ ] **Test callback endpoint** is accessible from Yoti servers

---

## 📱 TWILIO INTEGRATION

### ✅ What's Already Done:

1. ✅ **Backend Service Created**: `backend/accounts/services/twilio_service.py`
   - SMS sending functionality
   - Phone number validation
   - Error handling
   - Account status checking

2. ✅ **Credentials Configured**: `backend/backend/settings.py`
   - Account SID: Set via `TWILIO_ACCOUNT_SID` environment variable
   - Auth Token: Set via `TWILIO_AUTH_TOKEN` environment variable
   - Phone Number: Set via `TWILIO_PHONE_NUMBER` environment variable (optional)

3. ✅ **API Endpoint**: `POST /api/accounts/smoke-signals/send/`
   - Supports both Email and SMS
   - Uses TwilioService for SMS

4. ✅ **Database Model**: `SmokeSignal` model exists
   - Tracks sent messages
   - Status tracking (Delivered/Failed/Pending)

5. ✅ **Dependencies**: Twilio library in requirements.txt

### ❌ What Still Needs to Be Done:

#### 1. **Get Twilio Phone Number** (REQUIRED)

**Current Issue**: `TWILIO_PHONE_NUMBER` is empty

**Required Actions**:
- [ ] **Go to Twilio Console**: https://console.twilio.com/
- [ ] **Login** with your Twilio account
- [ ] **Navigate to**: Phone Numbers → Manage → Buy a number
- [ ] **Select**:
  - [ ] Country (e.g., United States)
  - [ ] Capabilities: **SMS** (and Voice if needed)
- [ ] **Purchase** phone number (free trial accounts get one free)
- [ ] **Copy** the phone number (format: `+1234567890`)
- [ ] **Add to settings.py**:
  ```python
  TWILIO_PHONE_NUMBER = '+1234567890'  # Your actual Twilio number
  ```
- [ ] **Or set as environment variable**:
  ```bash
  export TWILIO_PHONE_NUMBER=+1234567890
  ```

#### 2. **Verify Twilio Account Status**

- [ ] **Check Twilio Console**: https://console.twilio.com/
- [ ] **Verify**:
  - [ ] Account is **active** (not suspended)
  - [ ] Account has **credits/balance** (for paid accounts)
  - [ ] Trial account is still **active** (if using trial)
  - [ ] Account SID and Auth Token are **correct**

#### 3. **Test SMS Sending**

- [ ] **Restart Django server** after adding phone number
- [ ] **Test via API**:
  ```bash
  curl -X POST http://127.0.0.1:8000/api/accounts/smoke-signals/send/ \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "to": "+YOUR_PHONE_NUMBER",
      "channel": "SMS",
      "message": "Test message from Select Exposure",
      "sender": "Test"
    }'
  ```
- [ ] **Verify**:
  - [ ] SMS is received on your phone
  - [ ] Response shows `status: "Delivered"`
  - [ ] No errors in Django logs

#### 4. **Integrate SMS into Application Flow** (Optional)

Decide where SMS should be used:
- [ ] **Phone Verification** during signup?
- [ ] **Two-Factor Authentication (2FA)**?
- [ ] **Notifications** for contests/wins?
- [ ] **Password Reset** via SMS?
- [ ] **Account Alerts**?

#### 5. **Production Configuration** (Optional but Recommended)

- [ ] **Set credentials as environment variables**:
  ```bash
  export TWILIO_ACCOUNT_SID=your_account_sid_here
  export TWILIO_AUTH_TOKEN=your_auth_token_here
  export TWILIO_PHONE_NUMBER=+1234567890
  ```
- [ ] **Update settings.py** to only use environment variables
- [ ] **Set up webhook URLs** for SMS status callbacks (if needed)
- [ ] **Configure phone number formatting** for international numbers

---

## 📋 COMPLETE CHECKLIST SUMMARY

### Yoti Integration:

- [ ] **CRITICAL**: Fix 401 error by activating API key in Yoti Dashboard
- [ ] Enable Age Verification API permissions
- [ ] Test verification flow end-to-end
- [ ] Verify database updates correctly
- [ ] (Optional) Move credentials to environment variables

### Twilio Integration:

- [ ] **CRITICAL**: Get Twilio phone number from Twilio Console
- [ ] Add phone number to settings.py
- [ ] Test SMS sending
- [ ] Verify messages are delivered
- [ ] (Optional) Integrate SMS into application flows
- [ ] (Optional) Move credentials to environment variables

---

## 🚀 Quick Start Commands

### Test Yoti:
```bash
# 1. Ensure API key is active in Yoti Dashboard
# 2. Start server
cd adminpanel_integration_se/backend
python manage.py runserver

# 3. Test in browser:
# - Login → Profile → Click "Start Verification"
```

### Test Twilio:
```bash
# 1. Get phone number from Twilio Console
# 2. Add to settings.py: TWILIO_PHONE_NUMBER = '+1234567890'
# 3. Restart server
python manage.py runserver

# 4. Test SMS:
curl -X POST http://127.0.0.1:8000/api/accounts/smoke-signals/send/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"to": "+1234567890", "channel": "SMS", "message": "Test"}'
```

---

## 🔒 Security Recommendations

### For Production:

1. **Never commit credentials to git**
   - ✅ Already using `.gitignore` for .pem files
   - ⚠️ **Remove hardcoded credentials** from settings.py
   - ✅ Use environment variables only

2. **Use environment variables**:
   ```bash
   # .env file (not committed to git)
   YOTI_SDK_ID=...
   YOTI_API_KEY=...
   TWILIO_ACCOUNT_SID=...
   TWILIO_AUTH_TOKEN=...
   TWILIO_PHONE_NUMBER=...
   ```

3. **Rotate credentials periodically**
   - Generate new API keys every 90 days
   - Revoke old keys after rotation

4. **Monitor usage**
   - Check Yoti dashboard for API usage
   - Check Twilio console for SMS usage and costs

---

## 📞 Support Resources

### Yoti:
- Dashboard: https://hub.yoti.com/
- Documentation: https://developers.yoti.com/
- Support: https://support.yoti.com/

### Twilio:
- Console: https://console.twilio.com/
- Documentation: https://www.twilio.com/docs
- Support: https://support.twilio.com/

---

## ✅ Completion Status

**Yoti**: 🟡 90% Complete (needs API key activation)  
**Twilio**: 🟡 85% Complete (needs phone number)

Once you complete the critical items above, both integrations will be fully functional!

