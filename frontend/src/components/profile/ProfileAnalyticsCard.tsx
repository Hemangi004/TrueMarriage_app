import React, { useEffect, useState } from 'react';
import {
  getMyProfileAnalyticsApi,
  updateMyProfileSettingsApi,
  type ProfileAnalyticsData,
} from '../../services/publicProfileService';
import {
  Eye,
  QrCode,
  Users,
  Lock,
  EyeOff,
  Link,
  Settings,
  Loader2,
  CheckCircle2,
  Clock,
  Globe,
} from 'lucide-react';

interface ProfileAnalyticsCardProps {
  onOpenQR: (slugOrId: string) => void;
}

export const ProfileAnalyticsCard: React.FC<ProfileAnalyticsCardProps> = ({ onOpenQR }) => {
  const [data, setData] = useState<ProfileAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Settings state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [slugInput, setSlugInput] = useState('');
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [hideContactDetails, setHideContactDetails] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMyProfileAnalyticsApi();
      setData(res);
      if (res.slug) setSlugInput(res.slug);
    } catch (e: any) {
      setError(e.message || 'Could not load profile analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsMessage(null);
    try {
      await updateMyProfileSettingsApi({
        slug: slugInput,
        is_password_protected: isPasswordProtected,
        passcode: passcodeInput ? passcodeInput : undefined,
        hide_contact_details: hideContactDetails,
      });
      setSettingsMessage('Settings saved successfully!');
      fetchAnalytics();
      setTimeout(() => {
        setSettingsOpen(false);
        setSettingsMessage(null);
      }, 1200);
    } catch (err: any) {
      setSettingsMessage(err.message || 'Failed to save settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#F01472] mx-auto" />
        <p className="text-xs font-bold text-slate-500">Loading Visitor Analytics & Profile Metrics...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 text-center space-y-2 text-xs text-slate-600">
        <p className="font-bold">{error || 'No active profile found for analytics.'}</p>
      </div>
    );
  }

  const activeSlugOrId = data.slug || data.profile_id;
  const publicUrl = `${window.location.origin}/profile/${activeSlugOrId}`;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-indigo-900/50 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-indigo-800/40 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-black tracking-wider uppercase border border-rose-500/30">
              Live Metrics
            </span>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              Visitor Analytics & Public Link
            </h3>
          </div>
          <p className="text-xs text-indigo-200/70 font-medium pt-1 flex items-center gap-1.5 truncate max-w-md">
            <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline font-mono text-[11px] text-indigo-300 truncate"
            >
              {publicUrl}
            </a>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onOpenQR(activeSlugOrId)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#F01472] to-[#C80E5A] hover:from-rose-600 hover:to-rose-700 text-white text-xs font-black shadow-md shadow-rose-500/25 transition flex items-center gap-1.5 cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5" /> Generate QR
          </button>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="p-2 rounded-xl bg-indigo-900/60 hover:bg-indigo-800 border border-indigo-700/50 text-indigo-200 transition cursor-pointer"
            title="Configure SEO Slug & Privacy Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-indigo-900/40 border border-indigo-800/50 space-y-1">
          <div className="flex items-center justify-between text-indigo-300">
            <span className="text-[11px] font-bold">Total Views</span>
            <Eye className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-black text-white">{data.total_views}</p>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-900/40 border border-indigo-800/50 space-y-1">
          <div className="flex items-center justify-between text-indigo-300">
            <span className="text-[11px] font-bold">QR Code Scans</span>
            <QrCode className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-white">{data.qr_scans}</p>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-900/40 border border-indigo-800/50 space-y-1">
          <div className="flex items-center justify-between text-indigo-300">
            <span className="text-[11px] font-bold">Unique Visitors</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">{data.unique_visitors}</p>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-900/40 border border-indigo-800/50 space-y-1">
          <div className="flex items-center justify-between text-indigo-300">
            <span className="text-[11px] font-bold">Direct Links</span>
            <Link className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">{data.direct_views}</p>
        </div>
      </div>

      {/* Recent Visitors Log */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-indigo-400" /> Recent Profile Visitors
        </h4>

        {data.recent_visitors.length === 0 ? (
          <div className="p-4 text-center text-xs text-indigo-300/60 bg-indigo-950/40 rounded-2xl border border-indigo-900/40">
            No profile visits recorded yet. Share your QR Code to start tracking visitors!
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {data.recent_visitors.map((v) => (
              <div
                key={v.id}
                className="p-3 rounded-xl bg-indigo-950/50 border border-indigo-900/60 flex items-center justify-between text-xs text-indigo-200"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-white">{v.visitor_name || 'Anonymous Visitor'}</span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-900/80 text-[10px] text-indigo-300 font-mono">
                    {v.source === 'qr_scan' ? '📱 QR Scan' : '🔗 Direct View'}
                  </span>
                </div>
                <span className="text-[11px] text-indigo-400 font-medium">
                  {new Date(v.visited_at).toLocaleString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white text-slate-900 max-w-md w-full rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#F01472]" /> Public Profile & Privacy Settings
              </h3>
              <button
                onClick={() => setSettingsOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="p-6 space-y-4 text-xs">
              {/* Custom SEO Slug */}
              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-700 block">Custom SEO URL Slug</label>
                <div className="flex items-center rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 notranslate" translate="no">
                  <span className="text-slate-400 font-mono text-[11px] notranslate" translate="no">website.com/profile/</span>
                  <input
                    type="text"
                    value={slugInput}
                    onChange={(e) => setSlugInput(e.target.value)}
                    placeholder="virendra-patil"
                    className="font-bold text-slate-800 bg-transparent outline-none flex-1 font-mono text-[11px] pl-1 notranslate"
                    translate="no"
                  />
                </div>
                <p className="text-[10px] text-slate-400">Example: website.com/profile/virendra-patil</p>
              </div>

              {/* Password Protection */}
              <div className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-slate-800 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#F01472]" /> Password Protect Profile
                  </label>
                  <input
                    type="checkbox"
                    checked={isPasswordProtected}
                    onChange={(e) => setIsPasswordProtected(e.target.checked)}
                    className="w-4 h-4 accent-[#F01472] cursor-pointer"
                  />
                </div>

                {isPasswordProtected && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Access PIN / Passcode</label>
                    <input
                      type="password"
                      value={passcodeInput}
                      onChange={(e) => setPasscodeInput(e.target.value)}
                      placeholder="Enter 4 to 8 digit PIN"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold text-slate-800 text-xs outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Hide Contact Details */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <label className="font-extrabold text-slate-800 flex items-center gap-1.5">
                    <EyeOff className="w-3.5 h-3.5 text-purple-600" /> Hide Contact Details
                  </label>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Mask phone, email & family contact from public visitors
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={hideContactDetails}
                  onChange={(e) => setHideContactDetails(e.target.checked)}
                  className="w-4 h-4 accent-purple-600 cursor-pointer"
                />
              </div>

              {settingsMessage && (
                <div className="p-3 rounded-xl bg-slate-900 text-white font-bold text-[11px] text-center">
                  {settingsMessage}
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSettingsOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#F01472] to-[#C80E5A] text-white font-extrabold shadow-md shadow-rose-500/20 hover:from-rose-600 hover:to-rose-700 transition cursor-pointer flex items-center gap-1.5"
                >
                  {savingSettings ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
