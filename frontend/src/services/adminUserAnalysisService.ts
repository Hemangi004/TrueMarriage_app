import { API_V1_BASE_URL as API_BASE_URL } from '../config/api';

export interface PremiumClickEvent {
  id: string;
  user_id: string;
  user_email: string | null;
  user_full_name: string | null;
  event_type: string;
  created_at: string | null;
}

export interface UserAnalysisData {
  success: boolean;
  total_registered_users: number;
  unique_users_clicked_premium: number;
  registered_premium_clicks: number;
  unregistered_premium_clicks: number;
  total_premium_clicks: number;
  unique_users_clicked_free?: number;
  registered_free_clicks?: number;
  unregistered_free_clicks?: number;
  total_free_clicks?: number;
  premium_interest_percentage: number;
  recent_events: PremiumClickEvent[];
}

export const getUserAnalysisApi = async (): Promise<UserAnalysisData> => {
  const response = await fetch(`${API_BASE_URL}/admin/user-analysis`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  const data = await response.json();
  if (!response.ok) {
    const errorDetail = data?.detail?.message || data?.message || 'Failed to fetch user analysis stats';
    throw new Error(errorDetail);
  }
  return data;
};

export const recordPremiumClickApi = async (): Promise<{ success: boolean; message: string; requires_login?: boolean }> => {
  const response = await fetch(`${API_BASE_URL}/analytics/premium-click`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  const data = await response.json();
  if (!response.ok) {
    const errorDetail = data?.detail?.message || data?.message || 'Failed to record premium click';
    throw new Error(errorDetail);
  }
  return data;
};

export const recordFreeClickApi = async (): Promise<{ success: boolean; message: string; requires_login?: boolean }> => {
  const response = await fetch(`${API_BASE_URL}/analytics/free-click`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  const data = await response.json();
  if (!response.ok) {
    const errorDetail = data?.detail?.message || data?.message || 'Failed to record free click';
    throw new Error(errorDetail);
  }
  return data;
};
