import type {
  Interest,
  PaginatedInterestResponse,
  InterestStatus,
} from '../types/interactions';

import { API_V1_BASE_URL as API_BASE } from '../config/api';

async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    let msg = json?.detail?.message || json?.message;
    if (!msg && Array.isArray(json?.detail) && json.detail[0]?.msg) {
      msg = json.detail[0].msg;
    } else if (typeof json?.detail === 'string') {
      msg = json.detail;
    }
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return json;
}

/** Send interest to an approved profile. */
export async function sendInterestApi(profileId: string): Promise<{ success: boolean; data: Interest; message: string }> {
  return apiFetch('/interests', {
    method: 'POST',
    body: JSON.stringify({ profile_id: profileId }),
  });
}

/** Withdraw a PENDING interest (sender only). */
export async function withdrawInterestApi(interestId: string): Promise<{ success: boolean; data: Interest }> {
  return apiFetch(`/interests/${interestId}/withdraw`, { method: 'POST' });
}

/** Accept a PENDING interest (receiver only). */
export async function acceptInterestApi(interestId: string): Promise<{ success: boolean; data: Interest }> {
  return apiFetch(`/interests/${interestId}/accept`, { method: 'POST' });
}

/** Decline a PENDING interest (receiver only). */
export async function declineInterestApi(interestId: string): Promise<{ success: boolean; data: Interest }> {
  return apiFetch(`/interests/${interestId}/decline`, { method: 'POST' });
}

/** List sent interests. */
export async function getSentInterestsApi(
  page = 1,
  pageSize = 20,
  status?: InterestStatus
): Promise<PaginatedInterestResponse> {
  const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
  if (status) params.set('status', status);
  return apiFetch(`/interests/sent?${params}`);
}

/** List received interests. */
export async function getReceivedInterestsApi(
  page = 1,
  pageSize = 20,
  status?: InterestStatus
): Promise<PaginatedInterestResponse> {
  const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
  if (status) params.set('status', status);
  return apiFetch(`/interests/received?${params}`);
}

/** Get interest status for a specific profile (by checking sent interests). */
export async function getInterestStatusForProfile(
  profileId: string
): Promise<InterestStatus | null> {
  try {
    const result = await getSentInterestsApi(1, 100);
    const found = result.data.find(
      (i) =>
        i.profile?.id === profileId ||
        i.profile?.slug === profileId ||
        i.profile?.user_id === profileId ||
        i.receiver_profile_id === profileId ||
        i.receiver_user_id === profileId
    );
    return found ? found.status : null;
  } catch {
    return null;
  }
}
