"""
Yoti Age Verification Service
Handles Yoti API integration for identity verification
"""
import requests
import os
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


class YotiService:
    """Service for interacting with Yoti Age Verification API"""
    
    BASE_URL = "https://age.yoti.com/api/v1"
    
    def __init__(self):
        self.sdk_id = getattr(settings, 'YOTI_SDK_ID', os.environ.get('YOTI_SDK_ID'))
        self.api_key = getattr(settings, 'YOTI_API_KEY', os.environ.get('YOTI_API_KEY'))
        self.api_url = getattr(settings, 'YOTI_API_URL', self.BASE_URL)
        
        if not self.sdk_id or not self.api_key:
            logger.warning("Yoti credentials not configured. Set YOTI_SDK_ID and YOTI_API_KEY in settings.")
    
    def _get_headers(self, include_sdk_id=False):
        """Get headers for Yoti API requests"""
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.api_key}',
        }
        if include_sdk_id and self.sdk_id:
            headers['Yoti-Sdk-Id'] = self.sdk_id
        return headers
    
    def create_session(self, user_email=None, reference_id=None, callback_url=None, notification_url=None, cancel_url=None, **kwargs):
        """
        Create a Yoti verification session
        
        Args:
            user_email: User's email address
            reference_id: Your reference ID for this session
            callback_url: URL to receive callback when verification completes
            notification_url: URL to receive notifications
            cancel_url: URL to redirect if user cancels
            **kwargs: Additional session configuration options
        
        Returns:
            dict: Session data including session_id and client_session_token_ttl
        """
        if not self.api_key:
            raise ValueError("Yoti API key not configured")
        
        # Default session configuration
        session_data = {
            "type": kwargs.get("type", "OVER"),
            "age_estimation": {
                "allowed": kwargs.get("age_estimation_allowed", True),
                "threshold": kwargs.get("age_threshold", 18),
                "level": kwargs.get("age_level", "PASSIVE"),
                "retry_limit": kwargs.get("age_retry_limit", 3)
            },
            "doc_scan": {
                "allowed": kwargs.get("doc_scan_allowed", True),
                "threshold": kwargs.get("doc_threshold", 18),
                "level": kwargs.get("doc_level", "PASSIVE"),
                "authenticity": kwargs.get("doc_authenticity", "AUTO"),
                "preset_issuing_country": kwargs.get("preset_issuing_country", "GBR"),
                "retry_limit": kwargs.get("doc_retry_limit", 3)
            },
            "digital_id": {
                "allowed": kwargs.get("digital_id_allowed", True),
                "threshold": kwargs.get("digital_id_threshold", 18),
                "age_estimation_allowed": kwargs.get("digital_age_estimation_allowed", True),
                "age_estimation_threshold": kwargs.get("digital_age_threshold", 21),
                "retry_limit": kwargs.get("digital_id_retry_limit", 3)
            },
            "credit_card": {
                "allowed": kwargs.get("credit_card_allowed", True),
                "retry_limit": kwargs.get("credit_card_retry_limit", 3)
            },
            "mobile": {
                "allowed": kwargs.get("mobile_allowed", True),
                "retry_limit": kwargs.get("mobile_retry_limit", 3)
            },
            "electronic_id": {
                "allowed": kwargs.get("electronic_id_allowed", True),
                "threshold": kwargs.get("electronic_id_threshold", 18),
                "sub_methods": kwargs.get("electronic_id_sub_methods", ["MIT_ID", "SWEDISH_BANK_ID", "FTN"]),
                "retry_limit": kwargs.get("electronic_id_retry_limit", 3)
            },
            "la_wallet": {
                "allowed": kwargs.get("la_wallet_allowed", True),
                "retry_limit": kwargs.get("la_wallet_retry_limit", 3),
                "threshold": kwargs.get("la_wallet_threshold", 18)
            },
            "age_key": {
                "allowed": kwargs.get("age_key_allowed", True),
                "authentication": kwargs.get("age_key_authentication", True)
            },
            "ttl": kwargs.get("ttl", 900),
            "retry_enabled": kwargs.get("retry_enabled", True),
            "resume_enabled": kwargs.get("resume_enabled", False),
            "synchronous_checks": kwargs.get("synchronous_checks", True),
            "double_blind": kwargs.get("double_blind", False),
            "block_biometric_consent": kwargs.get("block_biometric_consent", False),
        }
        
        # Add email if provided
        if user_email:
            session_data["email"] = {
                "data": {
                    "verified_email": user_email,
                    "country_code": kwargs.get("country_code", "gb")
                }
            }
        
        # Add reference ID if provided
        if reference_id:
            session_data["reference_id"] = reference_id
        
        # Add callback URLs if provided
        if callback_url:
            session_data["callback"] = {
                "url": callback_url,
                "auto": kwargs.get("callback_auto", True)
            }
        
        if notification_url:
            session_data["notification_url"] = notification_url
        
        if cancel_url:
            session_data["cancel_url"] = cancel_url
        
        # Add rule_id if provided
        if kwargs.get("rule_id"):
            session_data["rule_id"] = kwargs["rule_id"]
        
        try:
            response = requests.post(
                f"{self.api_url}/sessions",
                headers=self._get_headers(include_sdk_id=True),
                json=session_data,
                timeout=30
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Yoti session creation failed: {str(e)}")
            if hasattr(e.response, 'text'):
                logger.error(f"Response: {e.response.text}")
            raise
    
    def get_session(self, session_id):
        """
        Get session details
        
        Args:
            session_id: Yoti session ID
        
        Returns:
            dict: Session data
        """
        if not self.api_key:
            raise ValueError("Yoti API key not configured")
        
        try:
            response = requests.get(
                f"{self.api_url}/sessions/{session_id}",
                headers=self._get_headers(include_sdk_id=True),
                timeout=30
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Yoti get session failed: {str(e)}")
            if hasattr(e.response, 'text'):
                logger.error(f"Response: {e.response.text}")
            raise
    
    def get_session_result(self, session_id):
        """
        Get session verification result
        
        Args:
            session_id: Yoti session ID
        
        Returns:
            dict: Verification result data
        """
        if not self.api_key:
            raise ValueError("Yoti API key not configured")
        
        try:
            response = requests.get(
                f"{self.api_url}/sessions/{session_id}/result",
                headers=self._get_headers(include_sdk_id=True),
                timeout=30
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Yoti get session result failed: {str(e)}")
            if hasattr(e.response, 'text'):
                logger.error(f"Response: {e.response.text}")
            raise
    
    def delete_session(self, session_id):
        """
        Delete a session
        
        Args:
            session_id: Yoti session ID
        
        Returns:
            bool: True if successful
        """
        if not self.api_key:
            raise ValueError("Yoti API key not configured")
        
        try:
            response = requests.delete(
                f"{self.api_url}/sessions/{session_id}",
                headers=self._get_headers(),
                timeout=30
            )
            response.raise_for_status()
            return True
        except requests.exceptions.RequestException as e:
            logger.error(f"Yoti delete session failed: {str(e)}")
            if hasattr(e.response, 'text'):
                logger.error(f"Response: {e.response.text}")
            raise

