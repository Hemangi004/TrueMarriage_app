import type {
  PublicProfileDetail,
  DiscoveryQueryParams,
  PaginatedDiscoveryResponse,
} from '../types/discovery';

import { API_V1_BASE_URL as API_BASE_URL } from '../config/api';

const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = typeof window !== 'undefined' ? (localStorage.getItem('auth_token') || localStorage.getItem('access_token') || localStorage.getItem('token')) : null;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

let defaultFeedCache: { data: PaginatedDiscoveryResponse; timestamp: number } | null = null;
let defaultFeedInFlight: Promise<PaginatedDiscoveryResponse> | null = null;
const CACHE_TTL_MS = 60 * 1000; // 60s cache

export const getDiscoverableProfilesApi = async (
  params: DiscoveryQueryParams = {},
  options?: { forceFresh?: boolean }
): Promise<PaginatedDiscoveryResponse> => {
  const isDefaultQuery = Object.keys(params).length === 0;

  if (isDefaultQuery && !options?.forceFresh) {
    if (defaultFeedCache && Date.now() - defaultFeedCache.timestamp < CACHE_TTL_MS) {
      return defaultFeedCache.data;
    }
    if (defaultFeedInFlight) {
      return defaultFeedInFlight;
    }
  }

  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page.toString());
  if (params.page_size) query.append('page_size', params.page_size.toString());
  if (params.search && params.search.trim()) query.append('search', params.search.trim());
  if (params.gender && params.gender.trim()) query.append('gender', params.gender.trim());
  if (params.min_age) query.append('min_age', params.min_age.toString());
  if (params.max_age) query.append('max_age', params.max_age.toString());
  if (params.location && params.location.trim()) query.append('location', params.location.trim());
  if (params.education && params.education.trim()) query.append('education', params.education.trim());
  if (params.occupation && params.occupation.trim()) query.append('occupation', params.occupation.trim());
  if (params.sort_by) query.append('sort_by', params.sort_by);
  if (params.sort_order) query.append('sort_order', params.sort_order);

  const fetchPromise = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/discovery/profiles?${query.toString()}`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) {
        const errorDetail = data?.detail?.message || data?.message || 'Failed to fetch profiles';
        throw new Error(errorDetail);
      }

      if (isDefaultQuery) {
        defaultFeedCache = { data, timestamp: Date.now() };
      }
      return data;
    } finally {
      if (isDefaultQuery) {
        defaultFeedInFlight = null;
      }
    }
  })();

  if (isDefaultQuery) {
    defaultFeedInFlight = fetchPromise;
  }

  return fetchPromise;
};

export const getPublicProfileDetailApi = async (profileId: string): Promise<PublicProfileDetail> => {
  const response = await fetch(`${API_BASE_URL}/discovery/profiles/${profileId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
    credentials: 'include',
  });

  const data = await response.json();
  if (!response.ok) {
    const errorDetail = data?.detail?.message || data?.message || 'Profile not found or not publicly accessible.';
    throw new Error(errorDetail);
  }
  return data;
};

export interface CompatibilityInsightData {
  headline: string;
  reasons: string[];
  source?: string;
  cached?: boolean;
}

export const getCompatibilityInsightApi = async (profileId: string): Promise<CompatibilityInsightData | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/discovery/profiles/${encodeURIComponent(profileId)}/compatibility`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!response.ok) return null;
    const json = await response.json();
    if (json?.success && json?.data) {
      return json.data as CompatibilityInsightData;
    }
  } catch (err) {
    console.error('Failed to fetch AI compatibility insight:', err);
  }
  return null;
};
