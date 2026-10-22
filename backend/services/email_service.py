import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Tuple, Optional
from backend.core.config import settings

logger = logging.getLogger(__name__)


def send_otp_email(
    target_email: str,
    otp_code: str,
    purpose_label: str = "Account Registration",
    expire_minutes: int = 10
) -> Tuple[bool, Optional[str]]:
    """
    Sends an OTP verification email via SMTP (supports Gmail SMTP, SendGrid, custom SMTP).
    Returns (True, None) on successful delivery, or (False, error_message) on failure.
    Does NOT log or leak the OTP code in server logs.
    """
    if not settings.SMTP_USERNAME or not settings.SMTP_PASSWORD:
        logger.warning(
            f"SMTP_USERNAME or SMTP_PASSWORD not configured in environment. "
            f"Cannot dispatch real email to {target_email}."
        )
        return False, "SMTP email server configuration is missing"

    subject = f"Your {settings.SMTP_FROM_NAME} Verification Code: {otp_code}"

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }}
            .container {{ max-width: 550px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }}
            .header {{ text-align: center; padding-bottom: 24px; border-bottom: 1px solid #f1f5f9; }}
            .logo {{ font-size: 24px; font-weight: 800; color: #4f46e5; letter-spacing: -0.5px; }}
            .content {{ padding: 24px 0; text-align: center; }}
            .title {{ font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }}
            .subtitle {{ font-size: 14px; color: #64748b; margin-bottom: 24px; line-height: 1.5; }}
            .otp-box {{ background: #f1f5f9; border-radius: 8px; padding: 16px 24px; font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #4f46e5; display: inline-block; margin: 12px 0 24px 0; border: 2px dashed #cbd5e1; }}
            .warning {{ font-size: 12px; color: #94a3b8; line-height: 1.5; margin-top: 16px; }}
            .footer {{ text-align: center; padding-top: 24px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">💍 {settings.SMTP_FROM_NAME}</div>
            </div>
            <div class="content">
                <div class="title">Verify Your Email Address</div>
                <div class="subtitle">Please use the verification code below to complete your {purpose_label}. This code is valid for <strong>{expire_minutes} minutes</strong>.</div>
                <div class="otp-box">{otp_code}</div>
                <div class="warning">🔒 If you did not request this verification code, please ignore this email. Never share your OTP with anyone.</div>
            </div>
            <div class="footer">
                &copy; {settings.SMTP_FROM_NAME}. All rights reserved.<br>
                This is an automated security message; please do not reply.
            </div>
        </div>
    </body>
    </html>
    """

    text_content = f"""
{settings.SMTP_FROM_NAME} - {purpose_label}

Your verification code is: {otp_code}

This code will expire in {expire_minutes} minutes.
If you did not request this email, please ignore it.
    """

    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
    message["To"] = target_email

    message.attach(MIMEText(text_content, "plain"))
    message.attach(MIMEText(html_content, "html"))

    ports_to_try = [settings.SMTP_PORT]
    # Fallback to alternate standard port if primary port is blocked or times out
    fallback_port = 587 if settings.SMTP_PORT == 465 else 465
    if fallback_port not in ports_to_try:
        ports_to_try.append(fallback_port)

    last_error: Optional[Exception] = None

    for port in ports_to_try:
        try:
            logger.info(f"Attempting to dispatch OTP email to {target_email} via {settings.SMTP_HOST}:{port}...")
            if port == 465:
                server = smtplib.SMTP_SSL(settings.SMTP_HOST, port, timeout=15)
            else:
                server = smtplib.SMTP(settings.SMTP_HOST, port, timeout=15)
                server.starttls()

            server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_FROM_EMAIL, [target_email], message.as_string())
            server.quit()
            logger.info(f"Successfully sent OTP email to {target_email} via port {port}")
            return True, None
        except smtplib.SMTPAuthenticationError as e:
            logger.error(f"SMTP Authentication failed for host {settings.SMTP_HOST}:{port}: {e}")
            return False, "Email service authentication failed. Please contact support."
        except smtplib.SMTPRecipientsRefused as e:
            logger.error(f"Recipient address refused by mail server for {target_email}: {e}")
            return False, "Recipient email address was rejected by the mail server. Please check the email address."
        except smtplib.SMTPSenderRefused as e:
            logger.error(f"Sender address refused by mail server: {e}")
            return False, "Sender email configuration was rejected by mail server."
        except Exception as e:
            last_error = e
            logger.warning(f"SMTP delivery attempt via {settings.SMTP_HOST}:{port} failed: {type(e).__name__}: {e}")

    logger.exception(f"All SMTP delivery attempts failed for {target_email}: {last_error}")
    return False, "Unable to send verification email due to a temporary mail server connection issue. Please try again in a few moments."

