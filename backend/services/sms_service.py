import logging
import requests
from typing import Tuple, Optional
from backend.core.config import settings

logger = logging.getLogger("uvicorn")


def normalize_phone_for_msg91(phone_number: str) -> str:
    """
    Normalizes phone number for MSG91 integration.
    For 10-digit Indian numbers, prepends '91' country code.
    For international / already formatted numbers, returns clean digits without '+'.
    """
    clean_phone = "".join(c for c in phone_number if c.isdigit())
    if len(clean_phone) == 10:
        return f"91{clean_phone}"
    return clean_phone


def mask_phone_number(phone_number: str) -> str:
    """Masks phone number for secure logging (e.g. 9198******10)."""
    digits = "".join(c for c in phone_number if c.isdigit())
    if len(digits) > 4:
        return digits[:3] + "*" * (len(digits) - 5) + digits[-2:]
    return "****"


def send_otp_sms(phone_number: str, otp_code: str) -> Tuple[bool, str, Optional[str]]:
    """
    Dispatches 6-digit OTP code to physical mobile phone using MSG91 as primary provider.
    
    Security & Privacy Rules:
    - Never log the OTP code in application logs.
    - Never log the MSG91 API key in application logs.
    - Never expose the OTP code in API responses.
    - Handle provider errors gracefully without crashing.
    
    Returns (success: bool, user_message: str, dev_otp_code: Optional[str]).
    """
    masked = mask_phone_number(phone_number)
    normalized_phone = normalize_phone_for_msg91(phone_number)

    # 1. MSG91 Integration (Primary SMS Gateway)
    if settings.MSG91_AUTH_KEY and settings.MSG91_TEMPLATE_ID:
        try:
            # Try MSG91 Flow API first
            url = "https://control.msg91.com/api/v5/flow/"
            headers = {
                "authkey": settings.MSG91_AUTH_KEY,
                "Content-Type": "application/json"
            }
            payload = {
                "template_id": settings.MSG91_TEMPLATE_ID,
                "sender": settings.MSG91_SENDER_ID,
                "short_url": "0",
                "recipients": [
                    {
                        "mobiles": normalized_phone,
                        "otp": otp_code,
                        "OTP": otp_code,
                        "variables": {
                            "otp": otp_code,
                            "OTP": otp_code
                        }
                    }
                ]
            }
            response = requests.post(url, json=payload, headers=headers, timeout=10)
            res_data = response.json() if response.headers.get("content-type", "").startswith("application/json") else {}

            if response.status_code == 200 and (res_data.get("type") == "success" or res_data.get("return") is True or "success" in str(res_data).lower()):
                logger.info(f"MSG91 SMS OTP dispatched successfully to target ending in ...{normalized_phone[-4:]}")
                return True, f"Verification code sent via SMS to {phone_number}.", None
            
            # Secondary check: MSG91 OTP API fallback if Flow API returns non-success
            otp_url = "https://api.msg91.com/api/v5/otp"
            otp_payload = {
                "template_id": settings.MSG91_TEMPLATE_ID,
                "mobile": normalized_phone,
                "otp": otp_code
            }
            otp_res = requests.post(otp_url, json=otp_payload, headers=headers, timeout=10)
            otp_data = otp_res.json() if otp_res.headers.get("content-type", "").startswith("application/json") else {}

            if otp_res.status_code == 200 and (otp_data.get("type") == "success" or "success" in str(otp_data).lower()):
                logger.info(f"MSG91 OTP API dispatched successfully to target ending in ...{normalized_phone[-4:]}")
                return True, f"Verification code sent via SMS to {phone_number}.", None

            logger.error(f"MSG91 SMS dispatch failed for target {masked}: HTTP {response.status_code}")
            return False, "Failed to deliver SMS verification code through MSG91. Please try again.", None

        except requests.exceptions.Timeout:
            logger.error(f"MSG91 SMS request timed out for target {masked}")
            return False, "SMS provider timed out. Please try again.", None
        except Exception as e:
            logger.error(f"MSG91 SMS exception for target {masked}: {str(e)}")
            return False, "SMS service error occurred. Please try again later.", None

    # 2. Twilio Integration Fallback
    if settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN and settings.TWILIO_FROM_NUMBER:
        try:
            formatted_phone = f"+{normalized_phone}" if not phone_number.startswith("+") else phone_number
            url = f"https://api.twilio.com/2010-04-01/Accounts/{settings.TWILIO_ACCOUNT_SID}/Messages.json"
            data = {
                "From": settings.TWILIO_FROM_NUMBER,
                "To": formatted_phone,
                "Body": f"Your TrueMarriage Matrimony verification code is: {otp_code}. Valid for {settings.OTP_EXPIRE_MINUTES} minutes."
            }
            response = requests.post(
                url,
                data=data,
                auth=(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN),
                timeout=10
            )
            if response.status_code in (200, 201):
                logger.info(f"Twilio SMS OTP sent successfully to target {masked}")
                return True, f"Verification code sent via SMS to {phone_number}.", None
            else:
                logger.error(f"Twilio SMS Error for target {masked}: HTTP {response.status_code}")
                return False, "Failed to deliver SMS via Twilio provider.", None
        except Exception as e:
            logger.error(f"Twilio exception for target {masked}: {str(e)}")
            return False, "SMS provider error occurred.", None

    # 3. Fast2SMS Integration Fallback
    if settings.FAST2SMS_API_KEY:
        try:
            url = "https://www.fast2sms.com/dev/bulkV2"
            headers = {
                "authorization": settings.FAST2SMS_API_KEY,
                "Content-Type": "application/json"
            }
            payload = {
                "variables_values": otp_code,
                "route": "otp",
                "numbers": normalized_phone[-10:]
            }
            response = requests.post(url, json=payload, headers=headers, timeout=10)
            res_data = response.json() if response.headers.get("content-type", "").startswith("application/json") else {}
            if response.status_code == 200 and res_data.get("return") is True:
                logger.info(f"Fast2SMS OTP sent successfully to target {masked}")
                return True, f"Verification code sent via SMS to {phone_number}.", None
            else:
                logger.error(f"Fast2SMS API Error for target {masked}: HTTP {response.status_code}")
                return False, "Failed to deliver SMS via Fast2SMS provider.", None
        except Exception as e:
            logger.error(f"Fast2SMS exception for target {masked}: {str(e)}")
            return False, "SMS provider error occurred.", None

    # Missing Provider Configuration Handling
    logger.warning(f"SMS Provider configuration missing in environment. Cannot dispatch SMS to target {masked}.")
    return False, "SMS provider credentials not configured on backend. Please configure MSG91_AUTH_KEY and MSG91_TEMPLATE_ID.", None
