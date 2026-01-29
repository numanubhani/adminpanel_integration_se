# Yoti Integration - Complete Setup Checklist

## ✅ Backend Setup

### 1. Run Database Migration
```bash
cd C:\Users\Numan\Desktop\adminpanel_integration_se\backend
python manage.py migrate accounts 0026_add_yoti_fields
```

### 2. Install Python Dependencies
```bash
pip install requests
# Or
pip install -r requirements.txt
```

### 3. Configure Yoti Credentials

**Option A: Environment Variables (Recommended)**
Create/update `.env` file in backend directory:
```bash
YOTI_SDK_ID=your_sdk_id_here
YOTI_API_KEY=your_api_key_here
```

**Option B: Direct in settings.py**
Add to `backend/settings.py`:
```python
YOTI_SDK_ID = 'your_sdk_id_here'
YOTI_API_KEY = 'your_api_key_here'
```

**Where to get credentials:**
1. Go to https://www.yoti.com/dashboard
2. Log in to your account
3. Navigate to your application
4. Copy SDK ID and API Key

### 4. Verify Backend Endpoints
Test that endpoints are accessible:
- `POST /api/accounts/profile/yoti/create-session/` (requires auth)
- `GET /api/accounts/profile/yoti/status/` (requires auth)

## ✅ Frontend Setup

### 1. Verify Yoti SDK Script
Check `public/index.html` - should have:
```html
<script src="https://sdk.yoti.com/clients/browser.umd.js"></script>
```
✅ Already added!

### 2. Component Integration
The `YotiVerification.jsx` component is ready. Add it to your pages:

**Example in Profile.jsx:**
```jsx
import YotiVerification from "../components/YotiVerification";

// Add in render:
<YotiVerification 
  onCompletion={() => {
    // Refresh profile or handle completion
    window.location.reload();
  }}
/>
```

**Example in Signup.jsx:**
```jsx
import YotiVerification from "../components/YotiVerification";

// Add in verification step:
<YotiVerification 
  onCompletion={handleYotiComplete}
  showModal={false}
/>
```

## 🔧 Testing Steps

1. **Start Backend:**
   ```bash
   cd C:\Users\Numan\Desktop\adminpanel_integration_se\backend
   python manage.py runserver
   ```

2. **Start Frontend:**
   ```bash
   cd D:\sefrontend\SE
   npm start
   ```

3. **Test Flow:**
   - Log in to your app
   - Navigate to profile or signup page
   - Click "Start Verification"
   - Complete Yoti verification
   - Verify status updates

## ⚠️ Common Issues & Solutions

### Issue 1: "Yoti API key not configured"
**Error:** `ValueError: Yoti API key not configured`
**Solution:** Add `YOTI_API_KEY` to environment variables or settings.py

### Issue 2: "Yoti SDK not loaded"
**Error:** `Yoti SDK not available`
**Solution:** 
- Check `index.html` has the script tag
- Hard refresh browser (Ctrl+Shift+R)
- Check browser console for script loading errors

### Issue 3: "Migration not applied"
**Error:** `AttributeError: 'Profile' object has no attribute 'yoti_session_id'`
**Solution:** Run `python manage.py migrate accounts`

### Issue 4: "401 Unauthorized"
**Error:** API returns 401
**Solution:** 
- Ensure user is logged in
- Check access token is valid
- Verify Authorization header is sent

### Issue 5: Verification doesn't complete
**Solution:**
- Check browser console for errors
- Verify Yoti credentials are correct
- Check network tab for failed API calls
- Ensure callback URL is accessible

## 📝 Verification Flow

1. User clicks "Start Verification"
2. Frontend calls `POST /api/accounts/profile/yoti/create-session/`
3. Backend creates Yoti session and returns `client_session_token`
4. Frontend initializes Yoti SDK with `client_session_token`
5. Yoti verification UI appears in `yoti-verification-container` div
6. User completes verification
7. Yoti SDK fires `complete` event
8. Frontend polls for result or receives callback
9. Backend updates profile with verification status
10. Frontend updates UI to show verified status

## 🎯 Next Steps

1. ✅ Run migration
2. ✅ Configure Yoti credentials
3. ✅ Test session creation
4. ✅ Test verification flow
5. ✅ Integrate into signup/profile pages
6. ✅ Set up webhook callbacks (for production)
7. ✅ Configure Yoti rules in dashboard

## 📚 Files Modified/Created

**Backend:**
- ✅ `accounts/services/yoti_service.py` - Yoti API service
- ✅ `accounts/models.py` - Added Yoti fields
- ✅ `accounts/views.py` - Added Yoti endpoints
- ✅ `accounts/urls.py` - Added Yoti routes
- ✅ `accounts/serializers.py` - Added Yoti fields
- ✅ `accounts/migrations/0026_add_yoti_fields.py` - Migration
- ✅ `backend/settings.py` - Added Yoti config
- ✅ `requirements.txt` - Added requests

**Frontend:**
- ✅ `src/components/YotiVerification.jsx` - Yoti component
- ✅ `public/index.html` - Added Yoti SDK script

## 🔐 Security Notes

- Never commit Yoti credentials to git
- Use environment variables for production
- Keep API keys secure
- Use HTTPS in production for callbacks
- Validate webhook signatures (if Yoti provides them)


