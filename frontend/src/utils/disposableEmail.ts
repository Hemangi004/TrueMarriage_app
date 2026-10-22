/**
 * Common Email Domains Validator.
 * Whitelists trusted email providers (Google, Microsoft, Yahoo, Apple, Rediffmail, Zoho, etc.)
 * and rejects unverified/disposable domains.
 */

export const COMMON_EMAIL_DOMAINS = new Set([
  // Google
  'gmail.com',
  'googlemail.com',

  // Microsoft
  'outlook.com',
  'hotmail.com',
  'live.com',
  'msn.com',

  // Yahoo
  'yahoo.com',
  'yahoo.co.in',
  'yahoo.co.uk',
  'yahoo.in',
  'ymail.com',
  'rocketmail.com',

  // Apple
  'icloud.com',
  'me.com',
  'mac.com',

  // Regional & Popular
  'rediffmail.com',
  'zoho.com',
  'zohomail.in',
  'zohomail.com',
  'proton.me',
  'protonmail.com',
  'aol.com',

  // Platform & Dev / test fixtures
  'truemarriage.com',
  'truemarriage.in',
  'example.com',
]);

export const COMMON_EMAIL_ERROR_MSG =
  'Only standard email providers are allowed (e.g. Gmail, Outlook, Yahoo, Hotmail, iCloud, Rediffmail, Zoho).';

export function isCommonEmail(email: string): boolean {
  if (!email || !email.includes('@')) return false;
  const parts = email.trim().toLowerCase().split('@');
  if (parts.length !== 2) return false;
  const domain = parts[1].trim();
  return COMMON_EMAIL_DOMAINS.has(domain);
}

// Alias for backward compatibility
export const isDisposableEmail = (email: string) => !isCommonEmail(email);
