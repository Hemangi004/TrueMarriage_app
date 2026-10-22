from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator
from backend.models.enums import UserRole, UserStatus, AuthProvider


def normalize_email(email: str) -> str:
    if not email:
        return ""
    return email.strip().lower()


# --- User Registration Schemas (Input) ---
class UserRegisterInput(BaseModel):
    name: str = Field(..., min_length=3, max_length=50, description="User full name")
    email: EmailStr
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters long")
    password_confirmation: str = Field(..., description="Must match password")

    @field_validator("name", mode="before")
    @classmethod
    def sanitize_name(cls, value: str) -> str:
        if not value or not str(value).strip():
            raise ValueError("Please enter your full name.")
        cleaned = str(value).strip()
        if len(cleaned) < 3:
            raise ValueError("Full Name must be at least 3 characters long.")
        if len(cleaned) > 50:
            raise ValueError("Full Name cannot exceed 50 characters.")
        import re
        if not re.match(r"^[a-zA-Z\s.'-]+$", cleaned):
            raise ValueError("Full Name can only contain alphabetic characters and spaces.")
        letters_only = re.sub(r"[^a-zA-Z]", "", cleaned)
        if len(letters_only) < 3:
            raise ValueError("Full Name must contain at least 3 letters.")
        return cleaned

    @field_validator("email", mode="before")
    @classmethod
    def canonicalize_email(cls, value: str) -> str:
        normalized = normalize_email(str(value))
        from backend.utils.disposable_email import is_common_email, COMMON_EMAIL_ERROR_MSG
        if not is_common_email(normalized):
            raise ValueError(COMMON_EMAIL_ERROR_MSG)
        return normalized

    @field_validator("password", mode="before")
    @classmethod
    def validate_strong_password(cls, value: str) -> str:
        if not value or len(str(value)) < 8:
            raise ValueError("Password must be at least 8 characters long")
        import re
        val = str(value)
        if not re.search(r"[A-Z]", val):
            raise ValueError("Password must contain at least one uppercase letter (A–Z)")
        if not re.search(r"[a-z]", val):
            raise ValueError("Password must contain at least one lowercase letter (a–z)")
        if not re.search(r"\d", val):
            raise ValueError("Password must contain at least one number (0–9)")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>_+\-=\[\]\\;'/`~]", val):
            raise ValueError("Password must contain at least one special character (e.g., @, #, $, %)")
        return val

    @model_validator(mode="after")
    def validate_password_match(self) -> "UserRegisterInput":
        if self.password != self.password_confirmation:
            raise ValueError("Password confirmation does not match password")
        return self


class UserLoginInput(BaseModel):
    email: EmailStr
    password: str

    @field_validator("email", mode="before")
    @classmethod
    def canonicalize_email(cls, value: str) -> str:
        return normalize_email(str(value))


class ForgotPasswordInput(BaseModel):
    email: EmailStr

    @field_validator("email", mode="before")
    @classmethod
    def canonicalize_email(cls, value: str) -> str:
        return normalize_email(str(value))


class PasswordResetInput(BaseModel):
    email: EmailStr
    code: str = Field(..., min_length=6, max_length=6, description="6-digit OTP code")
    new_password: str = Field(..., min_length=8, description="Password must be at least 8 characters long")
    password_confirmation: str = Field(..., description="Must match new password")

    @field_validator("email", mode="before")
    @classmethod
    def canonicalize_email(cls, value: str) -> str:
        return normalize_email(str(value))

    @field_validator("new_password", mode="before")
    @classmethod
    def validate_strong_new_password(cls, value: str) -> str:
        if not value or len(str(value)) < 8:
            raise ValueError("Password must be at least 8 characters long")
        import re
        val = str(value)
        if not re.search(r"[A-Z]", val):
            raise ValueError("Password must contain at least one uppercase letter (A–Z)")
        if not re.search(r"[a-z]", val):
            raise ValueError("Password must contain at least one lowercase letter (a–z)")
        if not re.search(r"\d", val):
            raise ValueError("Password must contain at least one number (0–9)")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>_+\-=\[\]\\;'/`~]", val):
            raise ValueError("Password must contain at least one special character (e.g., @, #, $, %)")
        return val

    @model_validator(mode="after")
    def validate_password_match(self) -> "PasswordResetInput":
        if self.new_password != self.password_confirmation:
            raise ValueError("Password confirmation does not match new password")
        return self



# --- Auth Identity Schema (Output) ---
class AuthIdentityOutput(BaseModel):
    id: str
    provider: AuthProvider
    provider_user_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# --- Registration Response Schema ---
class RegistrationResponse(BaseModel):
    success: bool
    message: str
    email: str
    status: UserStatus
    requires_otp: bool = True


# --- User Profile Schemas (Output) ---
# NEVER exposes password_hash!
class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: Optional[str] = None
    role: UserRole
    status: UserStatus
    is_email_verified: bool
    phone: Optional[str] = None
    is_phone_verified: bool = False
    created_at: datetime
    updated_at: datetime
    last_login_at: Optional[datetime] = None
    token: Optional[str] = None
    access_token: Optional[str] = None
    has_profile: bool = False
    is_profile_completed: bool = False
    profile_id: Optional[str] = None
    identities: List[AuthIdentityOutput] = []

    class Config:
        from_attributes = True


class DisableAccountInput(BaseModel):
    password: Optional[str] = None
    confirmation: bool = True
    reason: Optional[str] = None


class DeleteAccountInput(BaseModel):
    password: Optional[str] = None
    confirmation: bool = True
    confirm_text: Optional[str] = None
    reason: Optional[str] = None
