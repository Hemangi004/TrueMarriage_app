/**
 * Centralized API configuration.
 * Configured to connect the local mobile frontend to the production TrueMarriage backend.
 */

const getEffectiveApiBaseUrl = (): string => {
  const configured = (import.meta.env.VITE_API_URL as string | undefined)?.trim().replace(/\/+$/, '');
  if (configured) {
    return configured;
  }

  if (typeof window !== 'undefined') {
    const { hostname, origin } = window.location;

    // Local mobile development: defaults directly to the live TrueMarriage backend
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'https://truemarriage.in';
    }

    // In production web environment:
    return origin;
  }

  return 'https://truemarriage.in';
};

const RAW_BASE_URL = getEffectiveApiBaseUrl();

// Normalize base root by stripping any trailing /api or /api/v1
const normalizedRoot = RAW_BASE_URL
  .replace(/\/api\/v1$/, '')
  .replace(/\/api$/, '');

export const API_ROOT_URL = normalizedRoot;
export const API_BASE_URL = `${normalizedRoot}/api`;
export const API_V1_BASE_URL = `${normalizedRoot}/api/v1`;

export const getAssetUrl = (path?: string | null): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  if (path.startsWith('/')) {
    return `${API_ROOT_URL}${path}`;
  }
  return `${API_ROOT_URL}/${path}`;
};
