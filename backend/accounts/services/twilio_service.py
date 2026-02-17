"""
Twilio SMS Service
Handles SMS sending via Twilio API
"""
import os
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

try:
    from twilio.rest import Client
    TWILIO_AVAILABLE = True
except ImportError:
    TWILIO_AVAILABLE = False
    logger.warning("Twilio library not installed. Install with: pip install twilio")


class TwilioService:
    """Service for sending SMS via Twilio"""
    
    def __init__(self):
        self.account_sid = getattr(settings, 'TWILIO_ACCOUNT_SID', os.environ.get('TWILIO_ACCOUNT_SID', ''))
        self.auth_token = getattr(settings, 'TWILIO_AUTH_TOKEN', os.environ.get('TWILIO_AUTH_TOKEN', ''))
        self.phone_number = getattr(settings, 'TWILIO_PHONE_NUMBER', os.environ.get('TWILIO_PHONE_NUMBER', ''))
        
        # Strip any whitespace
        if self.account_sid:
            self.account_sid = self.account_sid.strip()
        if self.auth_token:
            self.auth_token = self.auth_token.strip()
        if self.phone_number:
            self.phone_number = self.phone_number.strip()
        
        if not TWILIO_AVAILABLE:
            logger.warning("Twilio library not installed. SMS functionality will not work.")
        elif not self.account_sid or not self.auth_token:
            logger.warning("Twilio credentials not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in settings.")
        else:
            logger.info(f"Twilio Account SID configured: {self.account_sid[:10]}...")
            logger.info(f"Twilio Auth Token configured: {self.auth_token[:10]}...")
            if self.phone_number:
                logger.info(f"Twilio Phone Number: {self.phone_number}")
            else:
                logger.warning("TWILIO_PHONE_NUMBER not set. You'll need to provide it when sending SMS.")
    
    def send_sms(self, to, message, from_number=None):
        """
        Send an SMS message via Twilio
        
        Args:
            to: Recipient phone number (E.164 format, e.g., +1234567890)
            message: Message content (max 1600 characters)
            from_number: Sender phone number (optional, uses TWILIO_PHONE_NUMBER if not provided)
        
        Returns:
            dict: Message details including SID, status, etc.
        
        Raises:
            ValueError: If credentials are missing or invalid
            RuntimeError: If Twilio library is not installed
        """
        if not TWILIO_AVAILABLE:
            raise RuntimeError("Twilio library not installed. Install with: pip install twilio")
        
        if not self.account_sid or not self.auth_token:
            raise ValueError("Twilio credentials not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in settings.")
        
        # Use provided from_number or default from settings
        from_phone = from_number or self.phone_number
        if not from_phone:
            raise ValueError("Twilio phone number not configured. Set TWILIO_PHONE_NUMBER in settings or provide from_number parameter.")
        
        try:
            client = Client(self.account_sid, self.auth_token)
            
            # Validate phone number format (should be E.164)
            if not to.startswith('+'):
                logger.warning(f"Phone number '{to}' doesn't start with '+'. Twilio requires E.164 format (e.g., +1234567890)")
            
            # Send message
            message_obj = client.messages.create(
                body=message,
                from_=from_phone,
                to=to
            )
            
            logger.info(f"SMS sent successfully. SID: {message_obj.sid}, Status: {message_obj.status}")
            
            return {
                'sid': message_obj.sid,
                'status': message_obj.status,
                'to': message_obj.to,
                'from': message_obj.from_,
                'date_created': message_obj.date_created.isoformat() if message_obj.date_created else None,
                'error_code': message_obj.error_code,
                'error_message': message_obj.error_message,
            }
            
        except Exception as e:
            logger.error(f"Failed to send SMS: {str(e)}")
            raise
    
    def verify_phone_number(self, phone_number):
        """
        Verify a phone number format (basic validation)
        
        Args:
            phone_number: Phone number to verify
        
        Returns:
            bool: True if format looks valid
        """
        # Basic E.164 format check
        if not phone_number:
            return False
        if not phone_number.startswith('+'):
            return False
        if len(phone_number) < 10 or len(phone_number) > 15:
            return False
        return True
    
    def get_balance(self):
        """
        Get Twilio account balance (if API supports it)
        
        Returns:
            dict: Account balance information
        """
        if not TWILIO_AVAILABLE:
            raise RuntimeError("Twilio library not installed")
        
        if not self.account_sid or not self.auth_token:
            raise ValueError("Twilio credentials not configured")
        
        try:
            client = Client(self.account_sid, self.auth_token)
            # Note: Twilio doesn't have a direct balance API, but we can check account status
            account = client.api.accounts(self.account_sid).fetch()
            return {
                'status': account.status,
                'type': account.type,
            }
        except Exception as e:
            logger.error(f"Failed to get account info: {str(e)}")
            raise

