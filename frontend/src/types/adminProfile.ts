export type ProfileModerationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'CHANGES_REQUESTED';

export interface AdminProfileListItem {
  id: string;
  user_id: string;
  user_full_name?: string | null;
  user_email: string;
  moderation_status: ProfileModerationStatus;
  submitted_at?: string | null;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
  rejection_reason?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminProfileDetail extends AdminProfileListItem {
  profile_data: Record<string, any>;
  reviewer_email?: string | null;
  published_at?: string | null;
}

export interface PaginatedProfileResponse {
  success: boolean;
  data: AdminProfileListItem[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

export interface AdminProfileQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  status?: ProfileModerationStatus | '';
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}
