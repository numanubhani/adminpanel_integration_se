# Certificates Directory

This directory is for storing sensitive certificate and key files.

## Yoti Private Key

Save your Yoti `.pem` file here with the following name:

**File name:** `yoti-private-key.pem`

**Full path:** `backend/certs/yoti-private-key.pem`

## Security Notes

- ⚠️ **DO NOT commit .pem files to git** - They are automatically ignored
- 🔒 Keep these files secure and never share them publicly
- 📝 For production, consider using environment variables or a secure key management service
- 🔐 Set appropriate file permissions (chmod 600 on Linux/Mac)

## Alternative Configuration

You can also set the path via environment variable:

```bash
export YOTI_PEM_FILE_PATH=/path/to/your/yoti-private-key.pem
```

Or in your `.env` file:

```
YOTI_PEM_FILE_PATH=/path/to/your/yoti-private-key.pem
```

