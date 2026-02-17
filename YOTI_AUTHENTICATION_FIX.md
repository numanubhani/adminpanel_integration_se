# Yoti 401 Unauthorized Error - Troubleshooting Guide

## Error Message
```
401 Client Error: Unauthorized for url: https://age.yoti.com/api/v1/sessions
Response: {"error_code":"E000401","context":"Unauthorized"}
```

## Root Cause
The Yoti API is rejecting your authentication credentials. This typically means:
1. **API Key is incorrect or not activated**
2. **API Key doesn't have Age Verification API permissions**
3. **SDK ID is incorrect**
4. **Credentials need to be regenerated**

## Solutions

### Step 1: Verify Credentials in Yoti Dashboard

1. **Login to Yoti Dashboard**: https://hub.yoti.com/
2. **Navigate to**: Applications → Your Application → API Keys
3. **Check**:
   - ✅ API Key matches: `L8GLhGceggpEt7W7X-mTqvQJG9GaYq9W6Q4CjP8nob22bwhRyPEsm0t3NRA`
   - ✅ SDK ID matches: `d166a758-7100-4626-8f6f-08617879079a`
   - ✅ API Key is **Active** (not revoked)
   - ✅ API Key has **Age Verification API** permissions enabled

### Step 2: Check API Key Permissions

In Yoti Dashboard:
1. Go to **API Keys** section
2. Click on your API Key
3. Verify **Age Verification API** is enabled
4. If not enabled, enable it and save

### Step 3: Regenerate API Key (If Needed)

If the API key is incorrect:
1. Go to Yoti Dashboard → API Keys
2. **Revoke** the old API key
3. **Generate** a new API key
4. **Copy** the new API key
5. Update `settings.py` with the new key

### Step 4: Verify Settings Configuration

Check `backend/backend/settings.py`:
```python
YOTI_SDK_ID = os.environ.get('YOTI_SDK_ID', 'd166a758-7100-4626-8f6f-08617879079a')
YOTI_API_KEY = os.environ.get('YOTI_API_KEY', 'L8GLhGceggpEt7W7X-mTqvQJG9GaYq9W6Q4CjP8nob22bwhRyPEsm0t3NRA')
```

**Important**: 
- Make sure there are **no extra spaces** in the API key
- Make sure the API key is **complete** (not truncated)
- Make sure you're using the **API Key**, not the Application ID

### Step 5: Test with cURL (Optional)

Test the API key directly:
```bash
curl -X POST https://age.yoti.com/api/v1/sessions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer L8GLhGceggpEt7W7X-mTqvQJG9GaYq9W6Q4CjP8nob22bwhRyPEsm0t3NRA" \
  -H "Yoti-Sdk-Id: d166a758-7100-4626-8f6f-08617879079a" \
  -d '{
    "type": "OVER",
    "age_estimation": {
      "allowed": true,
      "threshold": 18
    }
  }'
```

If this returns 401, the API key is definitely wrong or not activated.

### Step 6: Check Backend Logs

After restarting the server, check the logs for:
```
Yoti SDK ID configured: d166a758-7...
Yoti API Key configured: L8GLhGcegg...
```

This confirms credentials are being loaded correctly.

## Common Issues

### Issue 1: API Key Not Activated
**Solution**: Activate the API key in Yoti Dashboard

### Issue 2: Wrong API Key Type
**Solution**: Make sure you're using the **API Key** (not Application ID or SDK ID)

### Issue 3: API Key Revoked
**Solution**: Generate a new API key

### Issue 4: Missing Permissions
**Solution**: Enable Age Verification API permissions in Yoti Dashboard

## Next Steps

1. ✅ Verify credentials in Yoti Dashboard
2. ✅ Check API key permissions
3. ✅ Restart Django server after updating credentials
4. ✅ Test again - should work now!

## Still Not Working?

If you've verified everything and it's still not working:
1. Contact Yoti Support: https://support.yoti.com/
2. Provide them with:
   - Your SDK ID
   - Error code: E000401
   - That you're trying to use Age Verification API

