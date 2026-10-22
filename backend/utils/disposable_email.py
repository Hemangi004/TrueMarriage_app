"""
Common Email Domains Validator.
Restricts registration and user email fields to trusted, standard email providers (Gmail, Outlook, Yahoo, Hotmail, etc.)
and blocks temporary/unverified domain providers.
"""
from typing import Set

COMMON_EMAIL_DOMAINS: Set[str] = {
    # Google
    "gmail.com",
    "googlemail.com",

    # Microsoft
    "outlook.com",
    "hotmail.com",
    "live.com",
    "msn.com",

    # Yahoo
    "yahoo.com",
    "yahoo.co.in",
    "yahoo.co.uk",
    "yahoo.in",
    "ymail.com",
    "rocketmail.com",

    # Apple
    "icloud.com",
    "me.com",
    "mac.com",

    # Regional & Popular
    "rediffmail.com",
    "zoho.com",
    "zohomail.in",
    "zohomail.com",
    "proton.me",
    "protonmail.com",
    "aol.com",

    # Test / Development fixture domain (RFC 2606)
    "example.com",
}

COMMON_EMAIL_ERROR_MSG = (
    "Only standard email providers are allowed (e.g. Gmail, Outlook, Yahoo, Hotmail, iCloud, Rediffmail, Zoho)."
)


def is_common_email(email: str) -> bool:
    """
    Returns True if the email belongs to an allowed standard/common domain.
    """
    if not email or "@" not in email:
        return False
    parts = email.strip().lower().split("@")
    if len(parts) != 2:
        return False
    domain = parts[1].strip()
    return domain in COMMON_EMAIL_DOMAINS


def is_disposable_email(email: str) -> bool:
    """
    Returns True if email is NOT from a common/allowed provider.
    """
    return not is_common_email(email)
