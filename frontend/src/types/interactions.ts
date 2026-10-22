// Types for matrimonial interaction module (Phase 12)
// Privacy: No email, phone, password, or session data exposed

export interface PublicProfileSummary {
  id: string;
  slug?: string | null;
  user_id?: string | null;
  display_name: string;
  gender?: string | null;
  age?: number | null;
  city?: string | null;
  state?: string | null;
  education?: string | null;
  occupation?: string | null;
  profile_picture_url?: string | null;
}

export type InterestStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'WITHDRAWN' | 'MATCHED';

export interface Interest {
  id: string;
  status: InterestStatus;
  created_at: string;
  updated_at: string;
  responded_at?: string | null;
  sender_user_id?: string | null;
  receiver_user_id?: string | null;
  sender_profile_id?: string | null;
  receiver_profile_id?: string | null;
  profile?: PublicProfileSummary | null;
}

export interface PaginatedInterestResponse {
  success: boolean;
  data: Interest[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ShortlistEntry {
  id: string;
  profile_id: string;
  created_at: string;
  profile?: PublicProfileSummary | null;
}

export interface PaginatedShortlistResponse {
  success: boolean;
  data: ShortlistEntry[];
  total: number;
}
