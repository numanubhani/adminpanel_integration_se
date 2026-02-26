"""
Yoti Age Verification Service
Handles age verification using Yoti Age Verification API with Bearer token authentication
"""
import os
import json
import requests
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


class YotiAgeVerificationService:
    """
    Service for verifying user age using Yoti Age Verification API.
    Uses Bearer token authentication (OAuth 2.0 style).
    """
    
    BASE_URL = "https://age.yoti.com/api/v1"
    AGE_VERIFICATION_WEB_URL = "https://age.yoti.com/age-verification"
    
    def __init__(self):
        self.sdk_id = getattr(settings, 'YOTI_SDK_ID', os.environ.get('YOTI_SDK_ID', ''))
        self.api_key = getattr(settings, 'YOTI_API_KEY', os.environ.get('YOTI_API_KEY', ''))
        
        # Trim whitespace from credentials
        if self.sdk_id:
            self.sdk_id = str(self.sdk_id).strip()
        if self.api_key:
            self.api_key = str(self.api_key).strip()
        
        if not self.sdk_id or not self.api_key:
            logger.warning("Yoti credentials not configured. Set YOTI_SDK_ID and YOTI_API_KEY in settings.")
        else:
            logger.info(f"Yoti service initialized - SDK ID: {self.sdk_id}")
    
    def _get_headers(self):
        """
        Get headers for Yoti API requests using Bearer token authentication.
        
        Returns:
            dict: Headers with Authorization (Bearer token) and Yoti-SDK-Id
        """
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json',
            'Yoti-SDK-Id': self.sdk_id
        }
        return headers
    
    def create_session(self, callback_url=None, reference_id=None, age_threshold=18):
        """
        Create a Yoti Age Verification session
        
        Args:
            callback_url: URL to redirect user after verification (required)
            reference_id: Reference ID for tracking (optional)
            age_threshold: Age threshold to verify (default: 18, must be between 13-100)
            
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
        # Validate and convert age threshold to integer (Yoti requires integers, not strings)
        try:
            age_threshold_int = int(age_threshold)
            if age_threshold_int < 13 or age_threshold_int > 100:
                return {
                    'success': False,
                    'session_id': None,
                    'status': None,
                    'expires_at': None,
                    'verification_url': None,
                    'error': f'Age threshold must be between 13 and 100, got: {age_threshold_int}'
                }
        except (ValueError, TypeError):
            return {
                'success': False,
                'session_id': None,
                'status': None,
                'expires_at': None,
                'verification_url': None,
                'error': f'Age threshold must be a valid integer, got: {age_threshold}'
            }
        
        if not self.sdk_id or not self.api_key:
            return {
                'success': False,
                'session_id': None,
                'status': None,
                'expires_at': None,
                'verification_url': None,
                'error': 'Yoti credentials not configured'
            }
        
        try:
            # Prepare session creation request according to Yoti Age Verification API
            # CORRECT STRUCTURE: Use "checks" array with allowed_methods
            # Threshold must be an integer inside checks[].config.threshold
            # MUST include allowed_methods or Yoti will reject with E000007
            session_data = {
                "type": "OVER",  # Check if user is OVER age threshold
                "ttl": 900,  # 15 minutes session validity
                "checks": [
                    {
                        "type": "AGE_VERIFICATION",
                        "config": {
                            "threshold": age_threshold_int,  # Must be integer, not string
                            "allowed_methods": [
                                "AGE_ESTIMATION",  # Face scan (fastest)
                                "DOC_SCAN",        # Document scan
                                "DIGITAL_ID"       # Digital ID verification
                            ]
                        }
                    }
                ]
            }
            
            # Add optional parameters
            if reference_id:
                session_data["reference_id"] = reference_id
            
            # Yoti REQUIRES a callback URL - it must be HTTPS
            # Always include callback since Yoti requires it
            if not callback_url:
                raise ValueError("Callback URL is required by Yoti API")
            
            session_data["callback"] = {
                "auto": True,
                "url": callback_url
            }
            
            # Get headers with Bearer token authentication
            headers = self._get_headers()
            
            # Verify threshold is integer (critical for Yoti API)
            threshold_value = session_data["checks"][0]["config"]["threshold"]
            if not isinstance(threshold_value, int):
                logger.error(f"Threshold is not int: {type(threshold_value)}, converting...")
                session_data["checks"][0]["config"]["threshold"] = int(threshold_value)
            
            logger.info(f"Yoti threshold type: {type(session_data['checks'][0]['config']['threshold']).__name__}, value: {session_data['checks'][0]['config']['threshold']}")
            
            # Log the exact request we're sending (for debugging)
            # json.dumps will show integers without quotes (e.g., 18 not "18")
            request_body_json = json.dumps(session_data, indent=2)
            logger.info(f"Yoti create session - Request body: {request_body_json}")
            logger.info(f"Yoti create session - Age threshold: {age_threshold_int} (type: {type(age_threshold_int).__name__})")
            logger.info(f"Yoti create session - Using checks array structure with AGE_VERIFICATION type")
            
            # Make API call to create session
            # Using json= parameter ensures proper JSON serialization with integer types preserved
            url = f"{self.BASE_URL}/sessions"
            response = requests.post(
                url,
                headers=headers,
                json=session_data,  # This will serialize with integers preserved
                timeout=30
            )
            
            logger.info(f"Yoti create session response status: {response.status_code}")
            logger.debug(f"Yoti create session request URL: {url}")
            logger.debug(f"Yoti create session request headers: {headers}")
            logger.debug(f"Yoti create session request body: {request_body_json}")
            logger.debug(f"Yoti create session response: {response.text}")
            
            # Handle 400 specifically (Bad Request - validation errors)
            if response.status_code == 400:
                error_msg = "400 Bad Request - Invalid request parameters"
                error_details = None
                logger.error(error_msg)
                try:
                    error_data = response.json()
                    logger.error(f"Yoti API error details: {error_data}")
                    error_details = error_data
                    # Try to extract a more specific error message
                    if isinstance(error_data, dict):
                        # Check for different error formats
                        if 'message' in error_data:
                            error_msg = error_data.get('message')
                        elif 'error' in error_data:
                            error_msg = error_data.get('error')
                        elif 'code' in error_data:
                            error_msg = f"{error_data.get('code', 'VALIDATION_ERROR')}"
                        
                        # Add errors array if present
                        if 'errors' in error_data:
                            errors_list = error_data['errors']
                            if isinstance(errors_list, list) and len(errors_list) > 0:
                                error_messages = []
                                for err in errors_list:
                                    if isinstance(err, dict):
                                        prop = err.get('property', '')
                                        msg = err.get('message', '')
                                        error_messages.append(f"{prop}: {msg}" if prop else msg)
                                    else:
                                        error_messages.append(str(err))
                                error_msg += f" - {'; '.join(error_messages)}"
                except Exception as e:
                    logger.error(f"Yoti API error response (non-JSON): {response.text}")
                    logger.error(f"Error parsing response: {str(e)}")
                    error_msg = f"400 Bad Request: {response.text[:500]}"
                    error_details = {'raw_response': response.text}
                return {
                    'success': False,
                    'session_id': None,
                    'status': None,
                    'expires_at': None,
                    'verification_url': None,
                    'error': error_msg,
                    'error_details': error_details,
                    'raw_response': response.text if error_details is None else None
                }
            
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
            
            # Handle 403 specifically (Incorrect API key)
            if response.status_code == 403:
                error_msg = "403 Forbidden - Incorrect API key. Please verify your YOTI_API_KEY in the Yoti dashboard."
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
            # Get headers with Bearer token authentication
            headers = self._get_headers()
            
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
