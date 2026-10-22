// Types for the notification system (Phase 12)

export type NotificationType =
  | 'INTEREST_RECEIVED'
  | 'INTEREST_ACCEPTED'
  | 'INTEREST_DECLINED'
  | 'INTEREST_WITHDRAWN'
  | 'MUTUAL_INTEREST'
  | 'ADMIN_BROADCAST'
  | 'SYSTEM'
  | 'PROMOTION'
  | 'FEATURE';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  related_entity_id?: string | null;
  image_url?: string | null;
  is_read: boolean;
  created_at: string;
}

export interface PaginatedNotificationResponse {
  success: boolean;
  data: Notification[];
  total: number;
  unread_count: number;
  page: number;
  page_size: number;
  total_pages: number;
}
