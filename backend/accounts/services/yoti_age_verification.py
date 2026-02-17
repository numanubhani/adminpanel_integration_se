"""
Yoti Age Verification Service
Handles age verification using Yoti Age Verification API with RSA signing (.pem file)
"""
import os
import json
import base64
import hashlib
import time
import requests
from django.conf import settings
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.backends import default_backend
import logging

logger = logging.getLogger(__name__)


class YotiAgeVerificationService:
    """
    Service for verifying user age using Yoti Age Verification API.
    Uses RSA signing with .pem file for authentication.
    """
    
    BASE_URL = "https://age.yoti.com/api/v1"
    AGE_VERIFICATION_WEB_URL = "https://age.yoti.com/age-verification"
    
    def __init__(self):
        self.sdk_id = getattr(settings, 'YOTI_SDK_ID', os.environ.get('YOTI_SDK_ID', ''))
        self.api_key = getattr(settings, 'YOTI_API_KEY', os.environ.get('YOTI_API_KEY', ''))
        self.pem_file_path = getattr(
            settings, 
            'YOTI_PEM_FILE_PATH', 
            os.environ.get('YOTI_PEM_FILE_PATH', os.path.join(settings.BASE_DIR, 'certs', 'Select-Exposure-access-security.pem'))
        )
        
        # Trim whitespace from credentials
        if self.sdk_id:
            self.sdk_id = str(self.sdk_id).strip()
        if self.api_key:
            self.api_key = str(self.api_key).strip()
        
        # Load private key from PEM file
        self.private_key = self._load_private_key()
        
        if not self.sdk_id or not self.api_key:
            logger.warning("Yoti credentials not configured. Set YOTI_SDK_ID and YOTI_API_KEY in settings.")
        if not self.private_key:
            logger.warning(f"Yoti PEM file not found at: {self.pem_file_path}")
        else:
            logger.info(f"Yoti service initialized - SDK ID: {self.sdk_id}, PEM file loaded: {bool(self.private_key)}")
    
    def _load_private_key(self):
        """Load RSA private key from PEM file"""
        try:
            if not os.path.exists(self.pem_file_path):
                logger.error(f"PEM file not found: {self.pem_file_path}")
                return None
            
            with open(self.pem_file_path, 'rb') as pem_file:
                private_key = serialization.load_pem_private_key(
                    pem_file.read(),
                    password=None,
                    backend=default_backend()
                )
            logger.info(f"Successfully loaded Yoti private key from: {self.pem_file_path}")
            return private_key
        except Exception as e:
            logger.error(f"Failed to load Yoti private key: {str(e)}")
            return None
    
    def _sign_request(self, method, path, headers=None, body=None):
        """
        Sign request using RSA private key (Yoti SDK method)
        Creates a signature for the request using the private key
        """
        if not self.private_key:
            raise ValueError("Private key not loaded. Cannot sign request.")
        
        if headers is None:
            headers = {}
        
        # Create string to sign
        timestamp = str(int(time.time() * 1000))
        nonce = os.urandom(16).hex()
        
        # Build signature string: method + path + timestamp + nonce + body_hash
        signature_string = f"{method}\n{path}\n{timestamp}\n{nonce}"
        
        if body:
            if isinstance(body, dict):
                body_json = json.dumps(body, separators=(',', ':'))
            else:
                body_json = str(body)
            body_hash = hashlib.sha256(body_json.encode('utf-8')).hexdigest()
            signature_string += f"\n{body_hash}"
        
        # Sign with RSA private key
        signature_bytes = self.private_key.sign(
            signature_string.encode('utf-8'),
            padding.PKCS1v15(),
            hashes.SHA256()
        )
        
        # Base64 encode signature
        signature = base64.b64encode(signature_bytes).decode('utf-8')
        
        # Add headers
        headers['X-Yoti-Auth-Key'] = self.api_key
        headers['X-Yoti-SDK-Version'] = '1.0'
        headers['X-Yoti-SDK-Id'] = self.sdk_id
        headers['X-Yoti-Timestamp'] = timestamp
        headers['X-Yoti-Nonce'] = nonce
        headers['X-Yoti-Signature'] = signature
        headers['Content-Type'] = 'application/json'
        headers['Accept'] = 'application/json'
        
        return headers
    
    def create_session(self, callback_url=None, reference_id=None, age_threshold=18):
        """
        Create a Yoti Age Verification session
        
        Args:
            callback_url: URL to redirect user after verification (optional)
            reference_id: Reference ID for tracking (optional)
            age_threshold: Age threshold to verify (default: 18)
            
        Returns:
            dict: {
                'success': bool,
                'session_id': str or None,
                'status': str or None,
                'expires_at': str or None,
                'verification_url': str or None,
                'error': str or None
            }
        """
        if not self.sdk_id or not self.api_key:
            return {
                'success': False,
                'session_id': None,
                'status': None,
                'expires_at': None,
                'verification_url': None,
                'error': 'Yoti credentials not configured'
            }
        
        if not self.private_key:
            return {
                'success': False,
                'session_id': None,
                'status': None,
                'expires_at': None,
                'verification_url': None,
                'error': 'Yoti private key not loaded'
            }
        
        try:
            # Prepare session creation request according to Yoti API docs
            session_data = {
                "type": "OVER",  # Check if user is OVER age threshold
                "ttl": 900,  # 15 minutes session validity
                "age_estimation": {
                    "allowed": True,
                    "threshold": age_threshold,
                    "level": "PASSIVE",
                    "retry_limit": 1
                },
                "digital_id": {
                    "allowed": True,
                    "threshold": age_threshold,
                    "age_estimation_allowed": True,
                    "age_estimation_threshold": age_threshold,
                    "level": "NONE",
                    "retry_limit": 1
                },
                "doc_scan": {
                    "allowed": True,
                    "threshold": age_threshold,
                    "authenticity": "AUTO",
                    "level": "PASSIVE",
                    "retry_limit": 1
                },
                "credit_card": {
                    "allowed": False,
                    "threshold": age_threshold,
                    "level": "NONE",
                    "retry_limit": 1
                },
                "mobile": {
                    "allowed": False,
                    "level": "NONE",
                    "retry_limit": 1
                },
                "retry_enabled": False,
                "resume_enabled": False,
                "synchronous_checks": True
            }
            
            # Add optional parameters
            if reference_id:
                session_data["reference_id"] = reference_id
            
            if callback_url:
                session_data["callback"] = {
                    "auto": True,
                    "url": callback_url
                }
            
            # Sign the request
            path = "/api/v1/sessions"
            method = "POST"
            headers = self._sign_request(method, path, body=session_data)
            
            # Make API call to create session
            url = f"{self.BASE_URL}/sessions"
            response = requests.post(
                url,
                headers=headers,
                json=session_data,
                timeout=30
            )
            
            logger.info(f"Yoti create session response status: {response.status_code}")
            logger.debug(f"Yoti create session request URL: {url}")
            logger.debug(f"Yoti create session response: {response.text}")
            
            # Handle 401 specifically (Missing or unknown SDK ID)
            if response.status_code == 401:
                error_msg = "401 Unauthorized - Missing or unknown SDK ID. Please verify your YOTI_SDK_ID matches your API key in the Yoti dashboard."
                logger.error(error_msg)
                logger.error(f"SDK ID being used: {self.sdk_id}")
                try:
                    error_data = response.json()
                    logger.error(f"Yoti API error details: {error_data}")
                except:
                    logger.error(f"Yoti API error response: {response.text}")
                return {
                    'success': False,
                    'session_id': None,
                    'status': None,
                    'expires_at': None,
                    'verification_url': None,
                    'error': error_msg
                }
            
            # Handle 403 specifically (Incorrect API key or signature)
            if response.status_code == 403:
                error_msg = "403 Forbidden - Incorrect API key or signature. Please verify your YOTI_API_KEY and PEM file in the Yoti dashboard."
                logger.error(error_msg)
                try:
                    error_data = response.json()
                    logger.error(f"Yoti API error details: {error_data}")
                except:
                    logger.error(f"Yoti API error response: {response.text}")
                return {
                    'success': False,
                    'session_id': None,
                    'status': None,
                    'expires_at': None,
                    'verification_url': None,
                    'error': error_msg
                }
            
            if response.status_code == 200:
                data = response.json()
                
                session_id = data.get('id')
                status = data.get('status')
                expires_at = data.get('expires_at')
                
                # Build verification URL - Yoti uses session ID in the URL
                if session_id:
                    verification_url = f"{self.AGE_VERIFICATION_WEB_URL}?sessionId={session_id}"
                else:
                    verification_url = None
                
                return {
                    'success': True,
                    'session_id': session_id,
                    'status': status,
                    'expires_at': expires_at,
                    'verification_url': verification_url,
                    'error': None,
                    'raw_response': data
                }
            else:
                error_msg = f"Yoti API error: {response.status_code}"
                try:
                    error_data = response.json()
                    error_msg = error_data.get('error', error_data.get('message', error_msg))
                except:
                    error_msg = response.text or error_msg
                
                logger.error(f"Yoti create session error: {error_msg}")
                return {
                    'success': False,
                    'session_id': None,
                    'status': None,
                    'expires_at': None,
                    'verification_url': None,
                    'error': error_msg
                }
                
        except ValueError as e:
            logger.error(f"Yoti signing error: {str(e)}")
            return {
                'success': False,
                'session_id': None,
                'status': None,
                'expires_at': None,
                'verification_url': None,
                'error': f'Signing error: {str(e)}'
            }
        except requests.exceptions.Timeout:
            logger.error("Yoti API request timeout")
            return {
                'success': False,
                'session_id': None,
                'status': None,
                'expires_at': None,
                'verification_url': None,
                'error': 'Request timeout'
            }
        except requests.exceptions.RequestException as e:
            logger.error(f"Yoti API request failed: {str(e)}")
            return {
                'success': False,
                'session_id': None,
                'status': None,
                'expires_at': None,
                'verification_url': None,
                'error': f'Request failed: {str(e)}'
            }
        except Exception as e:
            logger.error(f"Unexpected error in Yoti session creation: {str(e)}")
            import traceback
            traceback.print_exc()
            return {
                'success': False,
                'session_id': None,
                'status': None,
                'expires_at': None,
                'verification_url': None,
                'error': f'Unexpected error: {str(e)}'
            }
    
    def get_session_result(self, session_id):
        """
        Get the result of a Yoti Age Verification session
        
        Args:
            session_id: The session ID from create_session
            
        Returns:
            dict: {
                'success': bool,
                'age': int or None,
                'is_over_18': bool,
                'date_of_birth': str or None,
                'status': str or None,
                'error': str or None
            }
        """
        if not self.sdk_id or not self.api_key:
            return {
                'success': False,
                'age': None,
                'is_over_18': False,
                'date_of_birth': None,
                'status': None,
                'error': 'Yoti credentials not configured'
            }
        
        if not self.private_key:
            return {
                'success': False,
                'age': None,
                'is_over_18': False,
                'date_of_birth': None,
                'status': None,
                'error': 'Yoti private key not loaded'
            }
        
        if not session_id:
            return {
                'success': False,
                'age': None,
                'is_over_18': False,
                'date_of_birth': None,
                'status': None,
                'error': 'Session ID is required'
            }
        
        try:
            # Sign the request
            path = f"/api/v1/sessions/{session_id}/result"
            method = "GET"
            headers = self._sign_request(method, path)
            
            # Make API call to get session result
            url = f"{self.BASE_URL}/sessions/{session_id}/result"
            response = requests.get(
                url,
                headers=headers,
                timeout=30
            )
            
            logger.info(f"Yoti get session result response status: {response.status_code}")
            logger.debug(f"Yoti get session result response: {response.text}")
            
            if response.status_code == 200:
                data = response.json()
                
                # Parse response based on Yoti API format
                status = data.get('status')  # PENDING, IN PROGRESS, COMPLETE, FAIL, ERROR, CANCELLED, EXPIRED
                
                # Extract age information from the result
                # The structure may vary based on which method was used
                age = None
                date_of_birth = None
                
                # Check different possible locations for age data
                if 'age_estimation' in data:
                    age_data = data.get('age_estimation', {})
                    age = age_data.get('age')
                
                if 'digital_id' in data:
                    digital_id_data = data.get('digital_id', {})
                    if not age:
                        age = digital_id_data.get('age')
                    if not date_of_birth:
                        date_of_birth = digital_id_data.get('date_of_birth')
                
                if 'doc_scan' in data:
                    doc_scan_data = data.get('doc_scan', {})
                    if not age:
                        age = doc_scan_data.get('age')
                    if not date_of_birth:
                        date_of_birth = doc_scan_data.get('date_of_birth')
                
                # Calculate age if date_of_birth provided but age not
                if not age and date_of_birth:
                    from datetime import datetime
                    try:
                        dob = datetime.strptime(date_of_birth, '%Y-%m-%d')
                        today = datetime.now()
                        age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
                    except Exception as e:
                        logger.error(f"Failed to calculate age from date_of_birth: {e}")
                
                # Determine if over 18 based on status
                # COMPLETE means user passed the threshold
                # FAIL means user didn't meet threshold
                is_over_18 = status == 'COMPLETE'
                
                # If we have age, use it to determine
                if age is not None:
                    is_over_18 = age >= 18
                
                return {
                    'success': status == 'COMPLETE',
                    'age': age,
                    'is_over_18': is_over_18,
                    'date_of_birth': date_of_birth,
                    'status': status,
                    'error': None if status == 'COMPLETE' else f'Session status: {status}',
                    'raw_response': data
                }
            else:
                error_msg = f"Yoti API error: {response.status_code}"
                try:
                    error_data = response.json()
                    error_msg = error_data.get('error', error_data.get('message', error_msg))
                except:
                    error_msg = response.text or error_msg
                
                logger.error(f"Yoti get session result error: {error_msg}")
                return {
                    'success': False,
                    'age': None,
                    'is_over_18': False,
                    'date_of_birth': None,
                    'status': None,
                    'error': error_msg
                }
                
        except ValueError as e:
            logger.error(f"Yoti signing error: {str(e)}")
            return {
                'success': False,
                'age': None,
                'is_over_18': False,
                'date_of_birth': None,
                'status': None,
                'error': f'Signing error: {str(e)}'
            }
        except requests.exceptions.Timeout:
            logger.error("Yoti API request timeout")
            return {
                'success': False,
                'age': None,
                'is_over_18': False,
                'date_of_birth': None,
                'status': None,
                'error': 'Request timeout'
            }
        except requests.exceptions.RequestException as e:
            logger.error(f"Yoti API request failed: {str(e)}")
            return {
                'success': False,
                'age': None,
                'is_over_18': False,
                'date_of_birth': None,
                'status': None,
                'error': f'Request failed: {str(e)}'
            }
        except Exception as e:
            logger.error(f"Unexpected error in Yoti get session result: {str(e)}")
            import traceback
            traceback.print_exc()
            return {
                'success': False,
                'age': None,
                'is_over_18': False,
                'date_of_birth': None,
                'status': None,
                'error': f'Unexpected error: {str(e)}'
            }
