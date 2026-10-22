export interface AdminSystemStatus {
  database: 'CONNECTED' | 'UNAVAILABLE' | string;
  smtp_service: 'CONFIGURED' | 'NOT_CONFIGURED' | string;
  app_status: 'OK' | string;
}

export interface EditableAllowlistItem {
  key: string;
  type: string;
  description: string;
  value: any;
}

export interface AdminSettingsData {
  application: {
    app_name: string;
    environment: string;
    debug_mode: boolean;
    api_prefix: string;
  };
  authentication: {
    session_expire_hours: number;
    session_cookie_name: string;
    session_cookie_httponly: boolean;
    session_cookie_secure: boolean;
    session_cookie_samesite: string;
    session_secret_configured: boolean;
  };
  otp: {
    expiration_minutes: number;
    resend_cooldown_seconds: number;
    max_attempts: number;
    otp_secret_configured: boolean;
  };
  email: {
    smtp_host: string;
    smtp_port: number;
    emails_from_name: string;
    emails_from_email: string;
    smtp_configured: boolean;
    smtp_password_configured: boolean;
  };
  security: {
    cors_origins: string[];
    database_driver: string;
  };
  system_status: AdminSystemStatus;
  editable_allowlist: EditableAllowlistItem[];
}

export interface AdminAuditLogItem {
  id: string;
  admin_id: string;
  admin_email: string;
  action: string;
  target_type: string;
  target_id?: string | null;
  details: Record<string, any>;
  created_at: string;
}
