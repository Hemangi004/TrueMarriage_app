import type { PaginatedNotificationResponse } from '../types/notifications';
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

/** Get the current user's notifications. */
export async function getNotificationsApi(page = 1, pageSize = 20): Promise<PaginatedNotificationResponse> {
  return apiFetch(`/notifications?page=${page}&page_size=${pageSize}`);
}

/** Mark a single notification as read. */
export async function markNotificationReadApi(notificationId: string): Promise<void> {
  await apiFetch(`/notifications/${notificationId}/read`, { method: 'PATCH' });
}

/** Mark all notifications as read. */
export async function markAllNotificationsReadApi(): Promise<void> {
  await apiFetch('/notifications/read-all', { method: 'POST' });
}

/** Get unread count only (lightweight poll). */
export async function getUnreadCountApi(): Promise<number> {
  try {
    const res = await getNotificationsApi(1, 1);
    return res.unread_count ?? 0;
  } catch {
    return 0;
  }
}
