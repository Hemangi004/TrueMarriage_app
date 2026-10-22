import { API_V1_BASE_URL as API_BASE_URL } from '../config/api';

export interface ContactDetails {
  phone?: string;
  email?: string;
  contact_person?: string;
  relation?: string;
}

export interface PublicProfileDetail {
  id: string;
  slug?: string;
  display_name: string;
  gender?: string;
  age?: number;
  dob?: string;
  height?: string;
  weight?: string | number;
  blood_group?: string;
  complexion?: string;
  religion?: string;
  caste?: string;
  sub_caste?: string;
  gotra?: string;
  manglik?: string;
  mother_tongue?: string;
  marital_status?: string;
  education?: string;
  occupation?: string;
  company?: string;
  annual_income?: string;
  city?: string;
  current_city?: string;
  state?: string;
  native_place?: string;
  father_name?: string;
  father_occupation?: string;
  mother_name?: string;
  mother_occupation?: string;
  brothers?: string | number;
  sisters?: string | number;
  about_me?: string;
  professional_summary?: string;
  partner_expectations?: string;
  other_preferences?: string;
  contact_number?: string;
  email?: string;
  profile_picture_url?: string;
  published_at?: string;
  is_password_protected?: boolean;
  hide_contact_details?: boolean;
  is_locked?: boolean;
  contact_details?: ContactDetails;
}

export interface VisitorLogItem {
  id: string;
  visitor_name?: string;
  source: string;
  visited_at: string;
  ip_address?: string;
}

export interface ProfileAnalyticsData {
  success: boolean;
  profile_id: string;
  slug?: string;
  total_views: number;
  unique_visitors: number;
  qr_scans: number;
  direct_views: number;
  search_views: number;
  recent_visitors: VisitorLogItem[];
}

export const getPublicProfileBySlugApi = async (identifier: string, passcode?: string): Promise<PublicProfileDetail> => {
  const url = new URL(`${API_BASE_URL}/public/profiles/${encodeURIComponent(identifier)}`);
  if (passcode) {
    url.searchParams.append('passcode', passcode);
  }

  const token = localStorage.getItem('token') || localStorage.getItem('access_token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers,
    credentials: 'include',
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.detail?.message || data?.message || 'Failed to load profile.');
  }

  return data;
};

export const verifyPasscodeApi = async (identifier: string, passcode: string): Promise<PublicProfileDetail> => {
  const token = localStorage.getItem('token') || localStorage.getItem('access_token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/public/profiles/${encodeURIComponent(identifier)}/verify-passcode`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify({ passcode }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.detail?.message || data?.message || 'Incorrect passcode. Access denied.');
  }

  return data;
};

export const trackProfileViewApi = async (identifier: string, source: string = 'direct') => {
  try {
    await fetch(`${API_BASE_URL}/public/profiles/${encodeURIComponent(identifier)}/track-view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ source }),
    });
  } catch (e) {
    // Non-blocking analytics logger
  }
};

export const getMyProfileAnalyticsApi = async (): Promise<ProfileAnalyticsData> => {
  const res = await fetch(`${API_BASE_URL}/public/profiles/user/my-analytics`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.detail?.message || data?.message || 'Failed to fetch analytics.');
  }

  return data;
};

export const updateMyProfileSettingsApi = async (payload: {
  slug?: string;
  is_password_protected?: boolean;
  passcode?: string;
  hide_contact_details?: boolean;
}) => {
  const res = await fetch(`${API_BASE_URL}/public/profiles/user/my-privacy-settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.detail?.message || data?.message || 'Failed to update settings.');
  }

  return data;
};
