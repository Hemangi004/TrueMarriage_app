export const MOBILE_NUMBER_MAX_LENGTH = 10;

export interface PhoneValidationResult {
  isValid: boolean;
  error: string | null;
}

/**
 * Strips non-digit characters, handles optional +91 or 0 prefix,
 * and caps the string to a maximum of 10 digits.
 */
export const cleanMobileNumber = (val: string): string => {
  if (!val) return '';
  let digits = val.replace(/\D/g, '');
  // If user enters with country code 91 (e.g. 919876543210 -> 12 digits), strip leading 91
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  return digits.slice(0, MOBILE_NUMBER_MAX_LENGTH);
};

/**
 * Validates whether the given string is a valid 10-digit mobile number.
 */
export const validateMobileNumber = (phone: string): PhoneValidationResult => {
  if (!phone || !phone.trim()) {
    return { isValid: false, error: 'Please enter your mobile number.' };
  }

  const cleaned = cleanMobileNumber(phone);

  if (cleaned.length < MOBILE_NUMBER_MAX_LENGTH) {
    return {
      isValid: false,
      error: 'Please enter a valid 10-digit mobile number.',
    };
  }

  if (!/^[6-9]\d{9}$/.test(cleaned)) {
    return {
      isValid: false,
      error: 'Mobile number must start with 6, 7, 8, or 9.',
    };
  }

  return { isValid: true, error: null };
};
