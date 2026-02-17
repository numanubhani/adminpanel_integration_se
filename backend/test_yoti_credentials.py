"""
Test Yoti API Credentials
Run this script to verify your Yoti credentials are working correctly.
"""
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.conf import settings
import requests

def test_yoti_credentials():
    """Test Yoti API credentials"""
    print("=" * 60)
    print("Yoti Credentials Test")
    print("=" * 60)
    
    # Get credentials
    sdk_id = getattr(settings, 'YOTI_SDK_ID', '')
    api_key = getattr(settings, 'YOTI_API_KEY', '')
    api_url = getattr(settings, 'YOTI_API_URL', 'https://age.yoti.com/api/v1')
    
    print(f"\n1. SDK ID: {sdk_id}")
    print(f"   Length: {len(sdk_id)} characters")
    print(f"   Expected format: UUID (36 chars)")
    
    print(f"\n2. API Key: {api_key[:20]}... (showing first 20 chars)")
    print(f"   Length: {len(api_key)} characters")
    print(f"   Expected: ~64+ characters")
    
    print(f"\n3. API URL: {api_url}")
    
    # Check for common issues
    issues = []
    if not sdk_id:
        issues.append("❌ SDK ID is empty")
    elif len(sdk_id) != 36:
        issues.append(f"⚠️  SDK ID length is {len(sdk_id)}, expected 36 (UUID format)")
    
    if not api_key:
        issues.append("❌ API Key is empty")
    elif len(api_key) < 50:
        issues.append(f"⚠️  API Key seems too short ({len(api_key)} chars)")
    
    # Check for whitespace
    if api_key and api_key != api_key.strip():
        issues.append("⚠️  API Key has leading/trailing whitespace")
    if sdk_id and sdk_id != sdk_id.strip():
        issues.append("⚠️  SDK ID has leading/trailing whitespace")
    
    if issues:
        print("\nWARNING: Issues Found:")
        for issue in issues:
            print(f"   {issue}")
    else:
        print("\nOK: Credential format looks good")
    
    # Test API call
    print("\n" + "=" * 60)
    print("Testing API Call...")
    print("=" * 60)
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {api_key.strip()}',
        'Yoti-Sdk-Id': sdk_id.strip(),
    }
    
    # Minimal test payload
    test_payload = {
        "type": "OVER",
        "age_estimation": {
            "allowed": True,
            "threshold": 18
        }
    }
    
    try:
        print(f"\nMaking request to: {api_url}/sessions")
        print(f"Headers: Authorization=Bearer {api_key[:15]}..., Yoti-Sdk-Id={sdk_id}")
        
        response = requests.post(
            f"{api_url}/sessions",
            headers=headers,
            json=test_payload,
            timeout=10
        )
        
        print(f"\nResponse Status: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200 or response.status_code == 201:
            print("\nSUCCESS! Credentials are working!")
            print(f"Response: {response.json()}")
        elif response.status_code == 401:
            print("\nAUTHENTICATION FAILED (401)")
            print(f"Response: {response.text}")
            print("\nPossible causes:")
            print("  1. API Key is incorrect or not activated")
            print("  2. API Key doesn't have Age Verification API permissions")
            print("  3. SDK ID doesn't match the API Key")
            print("  4. API Key has been revoked")
            print("\nNext steps:")
            print("  1. Go to https://hub.yoti.com/")
            print("  2. Check your API Key is active")
            print("  3. Verify Age Verification API permissions are enabled")
            print("  4. Regenerate API Key if needed")
        else:
            print(f"\n⚠️  Unexpected status code: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"\n❌ Request failed: {str(e)}")
        print("Check your internet connection and Yoti API endpoint")
    
    print("\n" + "=" * 60)

if __name__ == '__main__':
    test_yoti_credentials()

