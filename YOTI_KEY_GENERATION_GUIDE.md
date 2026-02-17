# Yoti Dashboard: Keys / Security → Generate Key

## Do You Need to Generate a New Key?

### Short Answer:
**Maybe** - It depends on whether your current API key is working.

### Current Situation:
- ✅ You have an **API Key**: `L8GLhGceggptE7W7X-mTqvq0JG9GaYq9w6Q4CjP8nob22bWyRpESm0t3NRA`
- ✅ You have a **SDK ID**: `d166a758-7100-4626-8f6f-08617879079a`
- ✅ You have a **.pem file**: `Select-Exposure-access-security.pem`
- ❌ Getting **401 Unauthorized** errors

## What "Keys / Security → Generate Key" Does:

This option in Yoti Dashboard can generate:
1. **New API Key** - If your current one is revoked/invalid
2. **RSA Key Pair** - For signing requests (you already have this in .pem file)

## When to Generate a New Key:

### ✅ Generate a NEW API Key if:
- Your current API key is **revoked** or **expired**
- Your current API key is **not active** in the dashboard
- You want to **rotate** credentials for security
- The API key doesn't have **Age Verification API** permissions

### ❌ Don't Generate if:
- Your current API key is **active** and has permissions
- You just need to **activate** the existing key
- The issue is with **permissions**, not the key itself

## Steps to Check First:

1. **Go to Yoti Dashboard**: https://hub.yoti.com/
2. **Navigate to**: Applications → Your Application → **API Keys**
3. **Check your current API key**:
   - Is it **Active**? (not revoked)
   - Does it have **Age Verification API** permissions enabled?
   - Is it the same key: `L8GLhGceggptE7W7X-mTqvq0JG9GaYq9w6Q4CjP8nob22bWyRpESm0t3NRA`?

## If Your API Key is Active:

**Don't generate a new one yet!** Instead:
1. Make sure **Age Verification API** permissions are enabled
2. Verify the SDK ID matches your application
3. Try the API call again

## If Your API Key is NOT Active or Revoked:

**Then YES, generate a new one:**
1. Go to **Keys / Security → Generate Key**
2. Select **API Key** (not RSA key pair)
3. Copy the new API key
4. Update `settings.py` with the new key
5. Restart Django server

## About the .pem File:

The `.pem` file you have (`Select-Exposure-access-security.pem`) is for **RSA signing**, which is:
- ✅ Used for some Yoti services (main SDK)
- ❌ **NOT used** for Age Verification API (uses Bearer token)

So the .pem file won't fix the 401 error - that's an API key issue.

## Recommendation:

**Check your current API key status first** before generating a new one. If it's active but missing permissions, enable them. Only generate a new key if the current one is revoked or invalid.

