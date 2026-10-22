import type { AdminSettingsData, AdminAuditLogItem } from '../types/adminSettings';
import { API_V1_BASE_URL as API_BASE_URL } from '../config/api';

export const getAdminSettingsApi = async (): Promise<{ success: boolean; data: AdminSettingsData }> => {
  const response = await fetch(`${API_BASE_URL}/admin/settings`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  const data = await response.json();
  if (!response.ok) {
    const errorDetail = data?.detail?.message || data?.message || 'Failed to fetch admin settings';
    throw new Error(errorDetail);
  }
  return data;
};

export const updateAdminSettingsApi = async (
  updates: Record<string, any>
): Promise<{ success: boolean; message: string; data: AdminSettingsData }> => {
  const response = await fetch(`${API_BASE_URL}/admin/settings`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(updates),
  });

  const data = await response.json();
  if (!response.ok) {
    const errorDetail = data?.detail?.message || data?.message || 'Failed to update admin settings';
    throw new Error(errorDetail);
  }
  return data;
};

export const getAdminAuditLogsApi = async (): Promise<{ success: boolean; data: AdminAuditLogItem[] }> => {
  const response = await fetch(`${API_BASE_URL}/admin/settings/audit-logs`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  const data = await response.json();
  if (!response.ok) {
    const errorDetail = data?.detail?.message || data?.message || 'Failed to fetch audit logs';
    throw new Error(errorDetail);
  }
  return data;
};
