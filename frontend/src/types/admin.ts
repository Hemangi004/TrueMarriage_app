export type UserRole = 'USER' | 'ADMIN';

export type UserStatus = 'PENDING_VERIFICATION' | 'ACTIVE' | 'DEACTIVATED' | 'BLOCKED';

export interface AdminUser {
  id: string;

  email: string;
  full_name?: string | null;
  role: UserRole;
  status: UserStatus;
  is_email_verified: boolean;
  phone?: string | null;
  is_phone_verified: boolean;
  profile_id?: string | null;
  profile_picture_url?: string | null;
  gallery_pictures?: string[] | null;
  biodata_name?: string | null;
  biodata_slug?: string | null;
  profile_data?: Record<string, any> | null;
  created_at: string;
  updated_at: string;
  last_login_at?: string | null;
}

export interface PaginationMetadata {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export interface PaginatedUserResponse {
  success: boolean;
  data: AdminUser[];
  pagination: PaginationMetadata;
}

export interface AdminUserQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  status?: UserStatus | '';
  role?: UserRole | '';
  is_email_verified?: boolean | '';
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}
