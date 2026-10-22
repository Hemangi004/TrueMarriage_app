import React, { useEffect, useState, useCallback } from 'react';
import type { AdminSettingsData, AdminAuditLogItem } from '../../types/adminSettings';
import {
  getAdminSettingsApi,
  updateAdminSettingsApi,
  getAdminAuditLogsApi,
} from '../../services/adminSettingsService';
import {
  Settings,
  Shield,
  CheckCircle2,
  AlertCircle,
  Server,
  Save,
  Key,
  Database,
  History,
  Mail,
  Clock,
  RefreshCw,
  Loader2,
} from 'lucide-react';



export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<AdminSettingsData | null>(null);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form State for Editable Allowlist Settings
  const [formState, setFormState] = useState<{
    session_expire_hours: number;
    otp_expire_minutes: number;
    otp_resend_cooldown_seconds: number;
    emails_from_name: string;
    emails_from_email: string;
  }>({
    session_expire_hours: 24,
    otp_expire_minutes: 10,
    otp_resend_cooldown_seconds: 60,
    emails_from_name: 'TrueMarriage Matrimony',
    emails_from_email: 'no-reply@truemarriagematrimony.com',
  });

  const [saving, setSaving] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchSettingsAndAudit = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [settingsRes, logsRes] = await Promise.all([
        getAdminSettingsApi(),
        getAdminAuditLogsApi(),
      ]);

      setSettings(settingsRes.data);
      setAuditLogs(logsRes.data);

      // Populate Form State with backend values
      if (settingsRes.data) {
        setFormState({
          session_expire_hours: settingsRes.data.authentication.session_expire_hours || 24,
          otp_expire_minutes: settingsRes.data.otp.expiration_minutes || 10,
          otp_resend_cooldown_seconds: settingsRes.data.otp.resend_cooldown_seconds || 60,
          emails_from_name: settingsRes.data.email.emails_from_name || 'TrueMarriage Matrimony',
          emails_from_email: settingsRes.data.email.emails_from_email || 'no-reply@truemarriagematrimony.com',
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load system configuration');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettingsAndAudit();
  }, [fetchSettingsAndAudit]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateAdminSettingsApi(formState);
      setSettings(res.data);
      showToast(res.message || 'Application settings updated successfully.');
      // Refresh audit logs
      const logsRes = await getAdminAuditLogsApi();
      setAuditLogs(logsRes.data);
    } catch (err: any) {
      showToast(err.message || 'Failed to update settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Toast Banner */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl shadow-slate-900/10 border backdrop-blur-md flex items-center gap-2.5 text-xs font-semibold animate-toast-bottom-right pointer-events-none ${
            toast.type === 'success'
              ? 'bg-white/95 text-emerald-900 border-emerald-200'
              : 'bg-white/95 text-rose-900 border-rose-200'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Settings & Configuration</h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage application-level configuration, security policies, and inspect system health status.
          </p>
        </div>
        <button
          onClick={() => fetchSettingsAndAudit()}
          disabled={loading}
          className="self-start sm:self-auto px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Status
        </button>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-500 space-y-3 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto" />
          <p className="text-xs font-bold">Loading application configuration & health indicators...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center space-y-3 bg-white rounded-2xl border border-slate-200">
          <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
          <p className="text-sm font-bold text-slate-800">{error}</p>
          <button
            onClick={() => fetchSettingsAndAudit()}
            className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : settings ? (
        <>
          {/* Section 1: Real System Status Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Database Status */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Database Health</h4>
                  <p className="text-sm font-black text-slate-900 mt-0.5">
                    {settings.system_status.database}
                  </p>
                </div>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                  settings.system_status.database === 'CONNECTED'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-rose-100 text-rose-800 border-rose-300'
                }`}
              >
                {settings.system_status.database === 'CONNECTED' ? 'VERIFIED' : 'ERROR'}
              </span>
            </div>

            {/* Email / SMTP Status */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Email SMTP Service</h4>
                  <p className="text-sm font-black text-slate-900 mt-0.5">
                    {settings.system_status.smtp_service}
                  </p>
                </div>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                  settings.system_status.smtp_service === 'CONFIGURED'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}
              >
                {settings.system_status.smtp_service === 'CONFIGURED' ? 'ACTIVE' : 'NOT SET'}
              </span>
            </div>

            {/* Application Engine Status */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Engine Status</h4>
                  <p className="text-sm font-black text-slate-900 mt-0.5">
                    {settings.application.environment.toUpperCase()} ({settings.system_status.app_status})
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                RUNNING
              </span>
            </div>
          </div>

          {/* Section 2: Editable Settings Form (Backed by Allowlist) */}
          <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-600" />
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Configurable Platform Settings</h3>
                  <p className="text-xs text-slate-500">
                    Modify supported non-secret parameters. All updates are logged for security auditing.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-600/20 flex items-center gap-1.5 transition cursor-pointer"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Session Lifetime */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Session Expiration Lifetime (Hours)</span>
                  <span className="text-[11px] font-mono text-purple-600">Range: 1 - 168 hrs</span>
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="number"
                    min={1}
                    max={168}
                    value={formState.session_expire_hours}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        session_expire_hours: parseInt(e.target.value) || 24,
                      }))
                    }
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white"
                  />
                </div>
                <p className="text-[11px] text-slate-500">Duration before an idle user session token automatically expires.</p>
              </div>

              {/* OTP Expiration Minutes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>OTP Expiration Period (Minutes)</span>
                  <span className="text-[11px] font-mono text-purple-600">Range: 1 - 60 mins</span>
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={formState.otp_expire_minutes}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        otp_expire_minutes: parseInt(e.target.value) || 10,
                      }))
                    }
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white"
                  />
                </div>
                <p className="text-[11px] text-slate-500">Validity duration in minutes for generated email verification OTP codes.</p>
              </div>

              {/* OTP Resend Cooldown Seconds */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>OTP Resend Cooldown (Seconds)</span>
                  <span className="text-[11px] font-mono text-purple-600">Range: 10 - 300 secs</span>
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="number"
                    min={10}
                    max={300}
                    value={formState.otp_resend_cooldown_seconds}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        otp_resend_cooldown_seconds: parseInt(e.target.value) || 60,
                      }))
                    }
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white"
                  />
                </div>
                <p className="text-[11px] text-slate-500">Required delay before a user can request another OTP code dispatch.</p>
              </div>

              {/* Email Sender Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Email Display Sender Name</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    maxLength={100}
                    value={formState.emails_from_name}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        emails_from_name: e.target.value,
                      }))
                    }
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white"
                  />
                </div>
                <p className="text-[11px] text-slate-500">Header sender name shown on outgoing transactional email notifications.</p>
              </div>
            </div>
          </form>

          {/* Section 3: Read-Only System Infrastructure & Credentials Audit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Infrastructure Configuration */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Server className="w-4 h-4 text-indigo-600" /> Infrastructure Parameters (Read-Only)
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Application Name:</span>
                  <span className="font-bold text-slate-800">{settings.application.app_name}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">API Prefix:</span>
                  <span className="font-mono font-bold text-purple-700">{settings.application.api_prefix}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">CORS Origins Whitelist:</span>
                  <span className="font-mono font-bold text-slate-800">{settings.security.cors_origins.join(', ')}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Session Cookie:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {settings.authentication.session_cookie_name} (HttpOnly: {settings.authentication.session_cookie_httponly ? 'True' : 'False'})
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500 font-medium">SMTP Server Host:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {settings.email.smtp_host}:{settings.email.smtp_port}
                  </span>
                </div>
              </div>
            </div>

            {/* Secret Credentials Security Audit (Zero Secrets Exposed!) */}
            <div className="bg-slate-50 text-slate-800 rounded-2xl p-6 space-y-4 border border-slate-200">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="font-extrabold text-sm tracking-wide text-slate-900">Secrets Security Audit</h3>
                  <p className="text-[11px] text-slate-500">All secret values are strictly redacted from API payloads.</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">SMTP Password Credential:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                    {settings.email.smtp_password_configured ? 'CONFIGURED (HIDDEN)' : 'NOT CONFIGURED'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">OTP HMAC Secret Key:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                    CONFIGURED (HIDDEN)
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">Session HMAC Secret Key:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                    CONFIGURED (HIDDEN)
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-600 font-medium">Database Credentials:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold border border-slate-300 font-mono">
                    REDACTED ({settings.security.database_driver.toUpperCase()})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Security Audit Logs Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs overflow-hidden">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-purple-600" />
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Recent Security Audit Logs</h3>
                <p className="text-xs text-slate-500">
                  Historical log of administrative configuration updates and sensitive operations.
                </p>
              </div>
            </div>

            {auditLogs.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No administrative audit logs recorded yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Log ID / Timestamp</th>
                      <th className="py-3 px-4">Administrator</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Target Setting</th>
                      <th className="py-3 px-4">Old Value</th>
                      <th className="py-3 px-4">New Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4">
                          <p className="font-mono font-bold text-slate-900">{log.id}</p>
                          <p className="text-[10px] text-slate-500">{log.created_at ? new Date(log.created_at).toLocaleString() : 'N/A'}</p>
                        </td>
                        <td className="py-3 px-4 text-purple-700 font-bold">{log.admin_email}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-extrabold border border-slate-200">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-800">{log.target_id || log.target_type}</td>
                        <td className="py-3 px-4 text-slate-500 font-mono truncate max-w-[150px]">
                          {log.details?.old_value !== undefined ? String(log.details.old_value) : '-'}
                        </td>
                        <td className="py-3 px-4 text-emerald-700 font-mono font-bold truncate max-w-[150px]">
                          {log.details?.new_value !== undefined ? String(log.details.new_value) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};
