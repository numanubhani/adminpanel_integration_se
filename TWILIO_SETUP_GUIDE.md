# Twilio Integration Setup Guide

## ✅ What's Been Configured

1. **Twilio Credentials Added to Settings**:
   - Account SID: `ACa1388f21d29a10993c979d411dd03da2`
   - Auth Token: `f11d32406cdfed890417889a9feebc47`
   - Phone Number: (needs to be set)

2. **TwilioService Created**: `backend/accounts/services/twilio_service.py`
   - Handles SMS sending
   - Validates phone numbers
   - Provides error handling

3. **Updated Views**: SMS sending now uses the TwilioService

## ⚠️ Important: You Need a Twilio Phone Number

To send SMS, you need a **Twilio Phone Number**. Here's how to get one:

### Step 1: Get a Twilio Phone Number

1. **Go to Twilio Console**: https://console.twilio.com/
2. **Navigate to**: Phone Numbers → Manage → Buy a number
3. **Select**:
   - Country (e.g., United States)
   - Capabilities: SMS (and Voice if needed)
4. **Purchase** a phone number (free trial accounts get one free)
5. **Copy** the phone number (format: +1234567890)

### Step 2: Add Phone Number to Settings

Update `backend/backend/settings.py`:

```python
TWILIO_PHONE_NUMBER = os.environ.get('TWILIO_PHONE_NUMBER', '+1234567890')  # Your Twilio number
```

Or set it as an environment variable:
```bash
export TWILIO_PHONE_NUMBER=+1234567890
```

## 📱 How to Use Twilio SMS

### Option 1: Via Smoke Signals API

**Endpoint**: `POST /api/accounts/smoke-signals/send/`

**Request**:
```json
{
  "to": "+1234567890",
  "channel": "SMS",
  "message": "Hello from Select Exposure!",
  "sender": "System"
}
```

**cURL Example**:
```bash
curl -X POST http://127.0.0.1:8000/api/accounts/smoke-signals/send/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+1234567890",
    "channel": "SMS",
    "message": "Test message",
    "sender": "System"
  }'
```

### Option 2: Direct Service Usage

```python
from accounts.services.twilio_service import TwilioService

twilio_service = TwilioService()
result = twilio_service.send_sms(
    to="+1234567890",
    message="Hello from Select Exposure!"
)
print(f"Message SID: {result['sid']}")
```

## 🔧 Features

### TwilioService Methods:

1. **`send_sms(to, message, from_number=None)`**
   - Sends SMS to a phone number
   - Returns message details (SID, status, etc.)

2. **`verify_phone_number(phone_number)`**
   - Validates phone number format (E.164)

3. **`get_balance()`**
   - Gets account status information

## 📝 Phone Number Format

Twilio requires **E.164 format**:
- ✅ Correct: `+1234567890` (US)
- ✅ Correct: `+441234567890` (UK)
- ❌ Wrong: `1234567890` (missing +)
- ❌ Wrong: `(123) 456-7890` (wrong format)

## 🧪 Testing

### Test SMS Sending

1. **Get your Twilio phone number** from Twilio Console
2. **Add it to settings.py**:
   ```python
   TWILIO_PHONE_NUMBER = '+1234567890'  # Your actual number
   ```
3. **Restart Django server**
4. **Send a test SMS**:
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

## ⚙️ Configuration

### Environment Variables (Recommended for Production)

```bash
export TWILIO_ACCOUNT_SID=ACa1388f21d29a10993c979d411dd03da2
export TWILIO_AUTH_TOKEN=f11d32406cdfed890417889a9feebc47
export TWILIO_PHONE_NUMBER=+1234567890
```

### Settings.py (Development)

Currently configured in `backend/backend/settings.py`:
```python
TWILIO_ACCOUNT_SID = 'ACa1388f21d29a10993c979d411dd03da2'
TWILIO_AUTH_TOKEN = 'f11d32406cdfed890417889a9feebc47'
TWILIO_PHONE_NUMBER = ''  # Add your Twilio phone number here
```

## 🚨 Common Issues

### Issue 1: "Twilio phone number not configured"
**Solution**: Add `TWILIO_PHONE_NUMBER` to settings or provide `from_number` parameter

### Issue 2: "Invalid phone number format"
**Solution**: Use E.164 format: `+1234567890` (include country code with +)

### Issue 3: "Twilio library not installed"
**Solution**: 
```bash
pip install twilio
```

### Issue 4: "Authentication failed"
**Solution**: Verify Account SID and Auth Token are correct in Twilio Console

## 📚 Next Steps

1. ✅ Get a Twilio phone number from Twilio Console
2. ✅ Add it to `settings.py` or environment variable
3. ✅ Restart Django server
4. ✅ Test SMS sending via API
5. ✅ (Optional) Integrate SMS into your signup/verification flow

## 🔗 Useful Links

- Twilio Console: https://console.twilio.com/
- Twilio Docs: https://www.twilio.com/docs
- Phone Number Format: https://www.twilio.com/docs/glossary/what-e164

