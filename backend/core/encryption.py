"""
AES-256-GCM Field-Level Encryption Module for Sensitive Data at Rest.
Uses standard AES-256-GCM (Authenticated Encryption with Associated Data).
Key is derived from SECRET_KEY using HKDF/SHA-256.
Format: base64( 12-byte nonce + ciphertext_with_16_byte_tag )
"""
import os
import base64
import logging
from typing import Optional
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives import hashes
from backend.core.config import settings

logger = logging.getLogger(__name__)

# Derive a 256-bit (32-byte) AES key from the application SECRET_KEY using HKDF
_derived_key: Optional[bytes] = None


def _get_encryption_key() -> bytes:
    global _derived_key
    if _derived_key is None:
        secret_bytes = settings.SECRET_KEY.encode('utf-8')
        hkdf = HKDF(
            algorithm=hashes.SHA256(),
            length=32,
            salt=b"truemarriage_field_encryption_salt",
            info=b"aes256_gcm_field_key",
        )
        _derived_key = hkdf.derive(secret_bytes)
    return _derived_key


def encrypt_field(plaintext: Optional[str]) -> Optional[str]:
    """
    Encrypts a plaintext string using AES-256-GCM.
    Returns URL-safe Base64 string containing (12-byte nonce + ciphertext + 16-byte tag).
    Returns None if input is None or empty.
    """
    if not plaintext:
        return plaintext
    try:
        key = _get_encryption_key()
        aesgcm = AESGCM(key)
        nonce = os.urandom(12)  # Standard 96-bit random nonce
        ciphertext = aesgcm.encrypt(nonce, plaintext.encode('utf-8'), None)
        combined = nonce + ciphertext
        return base64.urlsafe_b64encode(combined).decode('utf-8')
    except Exception as e:
        logger.error(f"Field encryption failure: {e}")
        raise RuntimeError("Cryptographic operation failed during field encryption.")


def decrypt_field(ciphertext_b64: Optional[str]) -> Optional[str]:
    """
    Decrypts an AES-256-GCM encrypted Base64 string.
    Returns original plaintext string.
    Returns None if input is None or empty.
    """
    if not ciphertext_b64:
        return ciphertext_b64
    try:
        key = _get_encryption_key()
        aesgcm = AESGCM(key)
        combined = base64.urlsafe_b64decode(ciphertext_b64.encode('utf-8'))
        if len(combined) < 28:  # 12-byte nonce + 16-byte minimum tag
            raise ValueError("Ciphertext payload too short")
        nonce = combined[:12]
        ciphertext = combined[12:]
        decrypted_bytes = aesgcm.decrypt(nonce, ciphertext, None)
        return decrypted_bytes.decode('utf-8')
    except Exception as e:
        logger.error(f"Field decryption failure: {e}")
        return "[ENCRYPTED_DATA_DECRYPTION_ERROR]"
