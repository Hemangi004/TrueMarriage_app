import type {
  AdminProfileDetail,
  AdminProfileQueryParams,
  PaginatedProfileResponse,
} from '../types/adminProfile';

import { API_V1_BASE_URL as API_BASE_URL } from '../config/api';

export const getProfilesApi = async (
  params: AdminProfileQueryParams = {}
): Promise<PaginatedProfileResponse> => {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page.toString());
  if (params.page_size) query.append('page_size', params.page_size.toString());
  if (params.search && params.search.trim()) query.append('search', params.search.trim());
  if (params.status) query.append('status', params.status);
  if (params.sort_by) query.append('sort_by', params.sort_by);
  if (params.sort_order) query.append('sort_order', params.sort_order);

  const response = await fetch(`${API_BASE_URL}/admin/profiles?${query.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  const data = await response.json();
  if (!response.ok) {
    const errorDetail = data?.detail?.message || data?.message || 'Failed to fetch profiles';
    throw new Error(errorDetail);
  }
  return data;
};

export const getProfileDetailApi = async (profileId: string): Promise<AdminProfileDetail> => {
  const response = await fetch(`${API_BASE_URL}/admin/profiles/${profileId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  const data = await response.json();
  if (!response.ok) {
    const errorDetail = data?.detail?.message || data?.message || 'Profile not found';
    throw new Error(errorDetail);
  }
  return data;
};

export const approveProfileApi = async (
  profileId: string
): Promise<{ success: boolean; message: string; data: AdminProfileDetail }> => {
  const response = await fetch(`${API_BASE_URL}/admin/profiles/${profileId}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  const data = await response.json();
  if (!response.ok) {
    const errorDetail = data?.detail?.message || data?.message || 'Failed to approve profile';
    throw new Error(errorDetail);
  }
  return data;
};

export const rejectProfileApi = async (
  profileId: string,
  reason: string
): Promise<{ success: boolean; message: string; data: AdminProfileDetail }> => {
  const response = await fetch(`${API_BASE_URL}/admin/profiles/${profileId}/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ reason: reason.trim() }),
  });

  const data = await response.json();
  if (!response.ok) {
    const errorDetail = data?.detail?.message || data?.message || 'Failed to reject profile';
    throw new Error(errorDetail);
  }
  return data;
};

export const requestProfileChangesApi = async (
  profileId: string,
  reason: string
): Promise<{ success: boolean; message: string; data: AdminProfileDetail }> => {
  const response = await fetch(`${API_BASE_URL}/admin/profiles/${profileId}/request-changes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ reason: reason.trim() }),
  });

  const data = await response.json();
  if (!response.ok) {
    const errorDetail = data?.detail?.message || data?.message || 'Failed to request changes';
    throw new Error(errorDetail);
  }
  return data;
};

/** Permanently hard-deletes a biodata profile by ID. Admin only. Irreversible. */
export const adminDeleteProfileApi = async (profileId: string): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/admin/profiles/${profileId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  const data = await response.json();
  if (!response.ok) {
    const errorDetail = data?.detail?.message || data?.message || 'Failed to delete profile';
    throw new Error(errorDetail);
  }
  return data;
};
