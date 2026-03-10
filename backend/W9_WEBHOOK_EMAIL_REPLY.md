# W-9 Webhook – Email Reply & API Minimum JSON

---

## Email reply (copy below)

**Subject:** W-9 webhook integration – URL, format, and minimum payload

Hi Ravi,

Here are the details for integrating with our W-9 callback endpoint.

### Webhook URL (POST, no authentication)

- **Sandbox / testing:** `http://108.61.229.67:8000/api/accounts/profile/w9/callback/`
- **Production:** Replace with our production base URL when we go live (same path: `/api/accounts/profile/w9/callback/`).

No API key or authentication is required; you can POST directly to this URL.

### Request format

- **Preferred:** JSON with header `Content-Type: application/json`
- **Also supported:** Form-encoded body (`application/x-www-form-urlencoded`)
- **Not supported:** Multipart form data

### Minimum JSON payload (required for our API)

Only two fields are required for us to accept and process the callback:

```json
{
  "form_w9_id": "your-unique-form-or-payee-reference",
  "status": "Completed"
}
```

- **`form_w9_id`** (string): Your unique identifier for this W-9 submission (e.g. form ID, payee reference, or the same value you use in the form URL). We use this to match the callback to the correct user/profile.
- **`status`** (string): W-9 status, e.g. `"Pending"` or `"Completed"`. We set the user’s W-9 completion state from this.

### Recommended JSON (for reliable user matching)

If you don’t send a `form_w9_id` we already have on file, we can match by email. Including `email_address` is recommended:

```json
{
  "form_w9_id": "unique-id-from-your-system",
  "status": "Completed",
  "email_address": "contributor@example.com"
}
```

### Optional fields we accept (all optional)

You may include any of these; we store the full payload for reference:

- `email_address`, `email`, `payeeEmail`, `payerEmail`
- `name`
- `filer_id`, `tin_type`, `tin_value`
- `uniqueid`, `unique_id`, `payeeRef`, `payee_ref`
- Any other fields your system sends; we persist them in `w9_data`.

### Response from our API

- **Success (200):**
  ```json
  {
    "status": "success",
    "message": "W-9 status recorded",
    "form_w9_id": "<value we used>",
    "webhook_status": "Completed",
    "w9_completed": true
  }
  ```
- **Missing required field (400):**  
  `{"error": "form_w9_id (or uniqueid/payeeRef) is required in webhook payload"}`
- **Invalid/empty body (400):**  
  `{"error": "Invalid or empty body. Send JSON (Content-Type: application/json) with e.g. ... or use form data."}`
- **Profile not found (404):**  
  `{"error": "Profile not found for form_w9_id; include email_address in webhook to match by email."}`

### Example request (curl)

```bash
curl -X POST "http://108.61.229.67:8000/api/accounts/profile/w9/callback/" \
  -H "Content-Type: application/json" \
  -d '{"form_w9_id":"test-w9-001","status":"Completed","email_address":"contributor@example.com"}'
```

If you have a preferred field name for the unique W-9 reference (e.g. `payeeRef` instead of `form_w9_id`), we support that too—just let us know and we can confirm mapping.

Best regards

---

## Minimum JSON for the API (quick reference)

**Strict minimum (2 fields):**

```json
{
  "form_w9_id": "your-unique-id",
  "status": "Completed"
}
```

**Recommended minimum (3 fields, for reliable matching):**

```json
{
  "form_w9_id": "your-unique-id",
  "status": "Completed",
  "email_address": "user@example.com"
}
```

Use `"status": "Pending"` when the W-9 is submitted but not yet completed; use `"Completed"` when it’s done.
