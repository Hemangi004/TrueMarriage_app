import re
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator
from backend.models.enums import OTPType, OTPPurpose
from backend.schemas.user import normalize_email


def normalize_target(value: str) -> str:
    val = str(value).strip()
    if "@" in val:
        return normalize_email(val)
    # Phone number normalization: remove non-digits
    digits = re.sub(r"\D", "", val)
    if len(digits) == 12 and digits.startswith("91"):
        digits = digits[2:]
    elif len(digits) == 11 and digits.startswith("0"):
        digits = digits[1:]

    if len(digits) != 10:
        raise ValueError("Mobile number must be exactly 10 digits.")
    if not re.match(r"^[6-9]\d{9}$", digits):
        raise ValueError("Mobile number must start with 6, 7, 8, or 9.")
    return digits


class OTPRequestInput(BaseModel):
    target: str
    purpose: OTPPurpose = OTPPurpose.REGISTRATION
    type: OTPType = OTPType.EMAIL

    @field_validator("target", mode="before")
    @classmethod
    def canonicalize_target(cls, value: str) -> str:
        return normalize_target(str(value))


class OTPVerifyInput(BaseModel):
    target: str
    code: str = Field(..., min_length=4, max_length=6, description="Verification OTP code")
    purpose: OTPPurpose = OTPPurpose.REGISTRATION

    @field_validator("target", mode="before")
    @classmethod
    def canonicalize_target(cls, value: str) -> str:
        return normalize_target(str(value))


# NEVER exposes code_hash!
class OTPResponse(BaseModel):
    success: bool
    message: str
    target: str
    purpose: OTPPurpose
    expires_at: Optional[datetime] = None

    class Config:
        from_attributes = True
