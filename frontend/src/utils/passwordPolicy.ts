export interface PasswordValidationResult {
  isValid: boolean;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  errorMessage?: string;
}

/**
 * Enforces strong password policy:
 * - At least 8 characters
 * - At least one uppercase letter (A–Z)
 * - At least one lowercase letter (a–z)
 * - At least one number (0–9)
 * - At least one special character (!@#$%^&* etc.)
 */
export const validatePasswordStrength = (password: string): PasswordValidationResult => {
  const p = password || '';
  const hasMinLength = p.length >= 8;
  const hasUppercase = /[A-Z]/.test(p);
  const hasLowercase = /[a-z]/.test(p);
  const hasNumber = /\d/.test(p);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(p);

  const isValid = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;

  let errorMessage: string | undefined;
  if (!hasMinLength) {
    errorMessage = 'Password must be at least 8 characters long.';
  } else if (!hasUppercase) {
    errorMessage = 'Password must contain at least one uppercase letter (A–Z).';
  } else if (!hasLowercase) {
    errorMessage = 'Password must contain at least one lowercase letter (a–z).';
  } else if (!hasNumber) {
    errorMessage = 'Password must contain at least one number (0–9).';
  } else if (!hasSpecialChar) {
    errorMessage = 'Password must contain at least one special character (e.g., @, #, $, %).';
  }

  return {
    isValid,
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
    errorMessage,
  };
};

export const PASSWORD_REQUIREMENTS_HINT =
  'Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters (e.g. Pass@123).';
