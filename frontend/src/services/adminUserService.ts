import type {
  AdminUser,
  AdminUserQueryParams,
  PaginatedUserResponse,
} from '../types/admin';


import { API_V1_BASE_URL as API_BASE_URL } from '../config/api';

export const getUsersApi = async (
  params: AdminUserQueryParams = {}
): Promise<PaginatedUserResponse> => {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page.toString());
  if (params.page_size) query.append('page_size', params.page_size.toString());
  if (params.search && params.search.trim()) query.append('search', params.search.trim());
  if (params.status) query.append('status', params.status);
  if (params.role) query.append('role', params.role);
  if (params.is_email_verified !== undefined && params.is_email_verified !== '') {
    query.append('is_email_verified', params.is_email_verified.toString());
  }
  if (params.sort_by) query.append('sort_by', params.sort_by);
  if (params.sort_order) query.append('sort_order', params.sort_order);

  const response = await fetch(`${API_BASE_URL}/admin/users?${query.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  const data = await response.json();
  if (!response.ok) {
    const errorDetail = data?.detail?.message || data?.message || 'Failed to fetch users';
    throw new Error(errorDetail);
  }
  return data;
};

export const getUserDetailApi = async (userId: string): Promise<AdminUser> => {
  const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  const data = await response.json();
  if (!response.ok) {
    const errorDetail = data?.detail?.message || data?.message || 'User not found';
    throw new Error(errorDetail);
  }
  return data;
};

export const blockUserApi = async (userId: string): Promise<{ success: boolean; message: string; data: AdminUser }> => {
  const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/block`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  const data = await response.json();
  if (!response.ok) {
    const errorDetail = data?.detail?.message || data?.message || 'Failed to block user';
    throw new Error(errorDetail);
  }
  return data;
};

export const unblockUserApi = async (userId: string): Promise<{ success: boolean; message: string; data: AdminUser }> => {
  const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/unblock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  const data = await response.json();
  if (!response.ok) {
    const errorDetail = data?.detail?.message || data?.message || 'Failed to unblock user';
    throw new Error(errorDetail);
  }
  return data;
};

export const activateUserApi = async (userId: string): Promise<{ success: boolean; message: string; data: AdminUser }> => {
  const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/activate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  const data = await response.json();
  if (!response.ok) {
    const errorDetail = data?.detail?.message || data?.message || 'Failed to activate user';
    throw new Error(errorDetail);
  }
  return data;
};

export const deactivateUserApi = async (userId: string): Promise<{ success: boolean; message: string; data: AdminUser }> => {
  const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/deactivate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  const data = await response.json();
  if (!response.ok) {
    const errorDetail = data?.detail?.message || data?.message || 'Failed to deactivate user';
    throw new Error(errorDetail);
  }
  return data;
};

export const adminDeleteUserApi = async (userId: string): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  const data = await response.json();
  if (!response.ok) {
    const errorDetail = data?.detail?.message || data?.message || 'Failed to delete user account';
    throw new Error(errorDetail);
  }
  return data;
};

