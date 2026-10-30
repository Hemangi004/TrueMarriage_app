import os
from typing import List, Optional
from pathlib import Path
from pydantic import Field, model_validator
from pydantic_settings import BaseSettings

_ROOT_DIR = Path(__file__).resolve().parent.parent.parent
_BACKEND_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    """
    Application environment configuration settings.
    Reads from environment variables and optional .env file.
    """
    APP_NAME: str = "TrueMarriage Matrimonial Biodata Backend"
    APP_ENV: str = Field(default="development", alias="APP_ENV")
    DEBUG: bool = Field(default=True, alias="DEBUG")

    # Server Network Configuration
    HOST: str = Field(default="0.0.0.0", alias="HOST")
    PORT: int = Field(default=5000, alias="PORT")
    API_V1_STR: str = "/api/v1"

    # Security Keys
    SECRET_KEY: str = Field(
        default="DEV_ONLY_INSECURE_SECRET_KEY_CHANGE_IN_PROD",
        alias="SECRET_KEY"
    )
    JWT_SECRET_KEY: str = Field(
        default="DEV_ONLY_INSECURE_JWT_SECRET_CHANGE_IN_PROD",
        alias="JWT_SECRET_KEY"
    )

    # Security & CORS Configuration
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
        "http://localhost:5176",
        "http://127.0.0.1:5176",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://truemarriage.in",
        "https://www.truemarriage.in",
        "http://truemarriage.in",
        "http://www.truemarriage.in",
    ]

    # Database Configuration
    DATABASE_URL: str = Field(
        default="sqlite:///./truemarriage.db",
        alias="DATABASE_URL"
    )
    DB_HOST: Optional[str] = Field(default=None, alias="DB_HOST")
    DB_PORT: int = Field(default=3306, alias="DB_PORT")
    DB_USER: Optional[str] = Field(default=None, alias="DB_USER")
    DB_PASSWORD: Optional[str] = Field(default=None, alias="DB_PASSWORD")
    DB_NAME: Optional[str] = Field(default=None, alias="DB_NAME")

    # Security Keys
    SECRET_KEY: str = Field(
        default="DEV_ONLY_INSECURE_SESSION_SECRET_CHANGE_IN_PROD",
        alias="SECRET_KEY"
    )
    JWT_SECRET_KEY: Optional[str] = Field(default=None, alias="JWT_SECRET_KEY")

    # Session & Cookie Configuration (Phase 6)
    SESSION_SECRET_KEY: str = Field(
        default="",
        alias="SESSION_SECRET_KEY"
    )
    SESSION_COOKIE_NAME: str = Field(default="truemarriage_session", alias="SESSION_COOKIE_NAME")
    SESSION_COOKIE_HTTPONLY: bool = True
    SESSION_COOKIE_SECURE: bool = False
    SESSION_COOKIE_SAMESITE: str = "lax"
    SESSION_EXPIRE_HOURS: int = Field(default=24, alias="SESSION_EXPIRE_HOURS")

    # OTP Security Configuration (Phase 4)
    OTP_HASH_SECRET: str = Field(
        default="",
        alias="OTP_HASH_SECRET"
    )
    OTP_EXPIRE_MINUTES: int = Field(default=10, alias="OTP_EXPIRE_MINUTES")
    OTP_EXPIRY_MINUTES: Optional[int] = Field(default=None, alias="OTP_EXPIRY_MINUTES")
    OTP_LENGTH: int = Field(default=6, alias="OTP_LENGTH")
    OTP_MAX_ATTEMPTS: int = Field(default=5, alias="OTP_MAX_ATTEMPTS")
    OTP_RESEND_COOLDOWN_SECONDS: int = Field(default=60, alias="OTP_RESEND_COOLDOWN_SECONDS")
    OTP_MAX_ATTEMPTS: int = Field(default=5, alias="OTP_MAX_ATTEMPTS")
    OTP_LENGTH: int = Field(default=6, alias="OTP_LENGTH")

    # SMTP Real Email Configuration (Phase 4)
    # Accepts both SMTP_USERNAME (from .env) and SMTP_USER (legacy)
    SMTP_HOST: str = Field(default="smtp.gmail.com", alias="SMTP_HOST")
    SMTP_PORT: int = Field(default=465, alias="SMTP_PORT")
    SMTP_USERNAME: Optional[str] = Field(default=None, alias="SMTP_USERNAME")
    SMTP_USER: Optional[str] = Field(default=None, alias="SMTP_USER")
    SMTP_PASSWORD: Optional[str] = Field(default=None, alias="SMTP_PASSWORD")
    SMTP_FROM_EMAIL: str = Field(default="no-reply@truemarriagematrimony.com", alias="SMTP_FROM_EMAIL")
    SMTP_FROM_NAME: str = Field(default="TrueMarriage Matrimony", alias="SMTP_FROM_NAME")
    # Legacy aliases (accepted but mapped to new names)
    EMAILS_FROM_EMAIL: Optional[str] = Field(default=None, alias="EMAILS_FROM_EMAIL")
    EMAILS_FROM_NAME: Optional[str] = Field(default=None, alias="EMAILS_FROM_NAME")

    # SMS Gateway Configuration (Phase 2 Postponed)
    FAST2SMS_API_KEY: Optional[str] = Field(default=None, alias="FAST2SMS_API_KEY")
    TWILIO_ACCOUNT_SID: Optional[str] = Field(default=None, alias="TWILIO_ACCOUNT_SID")
    TWILIO_AUTH_TOKEN: Optional[str] = Field(default=None, alias="TWILIO_AUTH_TOKEN")
    TWILIO_FROM_NUMBER: Optional[str] = Field(default=None, alias="TWILIO_FROM_NUMBER")

    # AI Engine Configuration (Groq / Ollama)
    GROQ_API_KEY: Optional[str] = Field(default=None, alias="GROQ_API_KEY")
    GROQ_MODEL: str = Field(default="openai/gpt-oss-120b", alias="GROQ_MODEL")

    # Google OAuth Configuration
    GOOGLE_CLIENT_ID: Optional[str] = Field(default=None, alias="GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET: Optional[str] = Field(default=None, alias="GOOGLE_CLIENT_SECRET")
    GOOGLE_REDIRECT_URI: str = Field(
        default="http://localhost:5000/api/v1/auth/google/callback",
        alias="GOOGLE_REDIRECT_URI"
    )
    GOOGLE_CLIENT_REDIRECT_URI: Optional[str] = Field(default=None, alias="GOOGLE_CLIENT_REDIRECT_URI")
    GOOGLE_ANDROID_CLIENT_ID: Optional[str] = Field(default=None, alias="GOOGLE_ANDROID_CLIENT_ID")
    FRONTEND_URL: str = Field(default="http://localhost:5173", alias="FRONTEND_URL")

    # Razorpay Gateway Configuration
    RAZORPAY_KEY_ID: str = Field(default="rzp_test_ThWrwwrKMHTFrN", alias="RAZORPAY_KEY_ID")
    RAZORPAY_KEY_SECRET: str = Field(default="kpTkv63ms7jd6lw87YmHqZq1", alias="RAZORPAY_KEY_SECRET")
    RAZORPAY_CURRENCY: str = Field(default="INR", alias="RAZORPAY_CURRENCY")

    @model_validator(mode="after")
    def resolve_aliases_and_fallbacks(self) -> "Settings":
        """Resolve legacy variable names and apply fallback defaults."""
        # Bidirectional sync between SMTP_USERNAME and SMTP_USER
        if not self.SMTP_USERNAME and self.SMTP_USER:
            self.SMTP_USERNAME = self.SMTP_USER
        elif not self.SMTP_USER and self.SMTP_USERNAME:
            self.SMTP_USER = self.SMTP_USERNAME
        # Legacy EMAILS_FROM_EMAIL/NAME as fallbacks
        if self.EMAILS_FROM_EMAIL and self.SMTP_FROM_EMAIL == "no-reply@truemarriagematrimony.com":
            self.SMTP_FROM_EMAIL = self.EMAILS_FROM_EMAIL
        if self.EMAILS_FROM_NAME and self.SMTP_FROM_NAME == "TrueMarriage Matrimony":
            self.SMTP_FROM_NAME = self.EMAILS_FROM_NAME
        # OTP_EXPIRY_MINUTES (from .env) overrides OTP_EXPIRE_MINUTES default
        if self.OTP_EXPIRY_MINUTES is not None:
            self.OTP_EXPIRE_MINUTES = self.OTP_EXPIRY_MINUTES
        # SESSION_SECRET_KEY falls back to SECRET_KEY
        if not self.SESSION_SECRET_KEY:
            self.SESSION_SECRET_KEY = self.SECRET_KEY
        # OTP_HASH_SECRET falls back to SECRET_KEY
        if not self.OTP_HASH_SECRET:
            self.OTP_HASH_SECRET = self.SECRET_KEY
        # If DB_HOST / DB_USER / DB_NAME are specified, build MySQL connection URL
        if self.DB_HOST and self.DB_USER and self.DB_NAME:
            from sqlalchemy.engine import URL
            self.DATABASE_URL = URL.create(
                drivername="mysql+pymysql",
                username=self.DB_USER,
                password=self.DB_PASSWORD or "",
                host=self.DB_HOST,
                port=self.DB_PORT or 3306,
                database=self.DB_NAME,
                query={"charset": "utf8mb4"}
            ).render_as_string(hide_password=False)

        # Automatically enable Secure cookie flag in production
        if self.APP_ENV.lower() == "production":
            self.SESSION_COOKIE_SECURE = True
        return self

    model_config = {
        "env_file": (
            str(_ROOT_DIR / ".env"),
            str(_BACKEND_DIR / ".env"),
            ".env",
            "backend/.env",
        ),
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }


settings = Settings()
