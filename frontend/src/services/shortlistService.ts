import type { ShortlistEntry, PaginatedShortlistResponse } from '../types/interactions';
import { API_V1_BASE_URL as API_BASE } from '../config/api';

async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.detail?.message || json?.message || `HTTP ${res.status}`);
  }
  return json;
}

/** Add a profile to the user's shortlist. */
export async function addToShortlistApi(profileId: string): Promise<{ success: boolean; data: ShortlistEntry; message: string }> {
  return apiFetch('/shortlists', {
    method: 'POST',
    body: JSON.stringify({ profile_id: profileId }),
  });
}

/** Remove a profile from the user's shortlist. */
export async function removeFromShortlistApi(profileId: string): Promise<{ success: boolean; message: string }> {
  return apiFetch(`/shortlists/${profileId}`, { method: 'DELETE' });
}

/** Get all shortlisted profiles. */
export async function getShortlistApi(page = 1, pageSize = 20): Promise<PaginatedShortlistResponse> {
  return apiFetch(`/shortlists?page=${page}&page_size=${pageSize}`);
}

/** Get all shortlisted profile IDs (for hydrating UI state). */
export async function getShortlistedIdsApi(): Promise<string[]> {
  try {
    const res = await apiFetch('/shortlists/ids');
    return res.data || [];
  } catch {
    return [];
  }
}
