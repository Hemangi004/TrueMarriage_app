import React, { useEffect, useState } from 'react';
import {
  Bell,
  Send,
  Radio,
  Clock,
  RefreshCw,
  AlertTriangle,
  Users,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';
import { getAdminNotificationsApi, broadcastAdminNotificationApi } from '../../services/apiService';

export const AdminNotificationsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('SYSTEM');
  const [broadcasting, setBroadcasting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState<string | null>(null);
  const [broadcastError, setBroadcastError] = useState<string | null>(null);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await getAdminNotificationsApi();
      setAnnouncements(data.announcements || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setBroadcastSuccess(null);
    setBroadcastError(null);
    if (!title.trim() || !message.trim()) return;
    setShowConfirmModal(true);
  };

  const handleConfirmBroadcast = async () => {
    setBroadcasting(true);
    setBroadcastError(null);
    try {
      const res = await broadcastAdminNotificationApi({ title, message, type });
      if (res.success) {
        setBroadcastSuccess(`Broadcast successfully sent to ${res.sent_count || 'all'} registered users!`);
        setTitle('');
        setMessage('');
        setShowConfirmModal(false);
        fetchAnnouncements();
      } else {
        setBroadcastError('Failed to broadcast notification.');
      }
    } catch (err: any) {
      setBroadcastError(err?.response?.data?.detail || err?.message || 'Broadcast failed. Please try again.');
    } finally {
      setBroadcasting(false);
    }
  };

  const getCategoryBadge = (catType: string) => {
    switch (catType) {
      case 'PROMOTION':
        return { label: 'Promotional Offer', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'FEATURE':
        return { label: 'New Feature Alert', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      default:
        return { label: 'System Announcement', bg: 'bg-rose-50 text-[#F01472] border-rose-200' };
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      {/* Success Notification Alert */}
      {broadcastSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-emerald-800 text-xs font-bold animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{broadcastSuccess}</span>
          </div>
          <button
            onClick={() => setBroadcastSuccess(null)}
            className="text-emerald-600 hover:text-emerald-900 cursor-pointer text-sm font-black p-1"
          >
            ×
          </button>
        </div>
      )}

      {/* Error Alert */}
      {broadcastError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-rose-800 text-xs font-bold animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{broadcastError}</span>
          </div>
          <button
            onClick={() => setBroadcastError(null)}
            className="text-rose-600 hover:text-rose-900 cursor-pointer text-sm font-black p-1"
          >
            ×
          </button>
        </div>
      )}

      {/* Broadcast Composer Form */}
      <form onSubmit={handleOpenConfirm} className="bg-white p-6 sm:p-7 rounded-2xl border border-pink-100 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-pink-50 pb-3">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#F01472] animate-pulse" /> Compose Platform Broadcast
          </h3>
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-400" /> Target: All Active Accounts
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Announcement Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Platform Maintenance Scheduled for Tonight"
              className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Notification Category</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none bg-white transition cursor-pointer"
            >
              <option value="SYSTEM">System Announcement</option>
              <option value="PROMOTION">Promotional Offer</option>
              <option value="FEATURE">New Feature Alert</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">Announcement Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Type the announcement message here. This will be delivered directly to the notification center of every registered user..."
            className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition leading-relaxed"
            required
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
            A confirmation prompt will appear before the message is sent.
          </p>
          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-[#F01472] to-[#ec4899] hover:from-[#d01060] hover:to-[#db2777] text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-pink-500/20 hover:shadow-lg transition cursor-pointer"
          >
            <Send className="w-4 h-4" /> Send Notification to All Users
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-pink-100 space-y-5 animate-scaleUp">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-xs">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Confirm Broadcast Dispatch</h3>
                  <p className="text-xs text-slate-500 font-medium">Verify announcement details before sending</p>
                </div>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={broadcasting}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Warning Callout Box */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-amber-800">
                <Users className="w-4 h-4 text-amber-600" /> Platform-Wide Broadcast Warning
              </p>
              <p className="leading-relaxed">
                This notification will be dispatched immediately to <strong className="font-extrabold text-amber-950">ALL active registered users</strong>. Once delivered, this action cannot be undone.
              </p>
            </div>

            {/* Notification Preview Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${getCategoryBadge(type).bg}`}>
                  {getCategoryBadge(type).label}
                </span>
                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#F01472]" /> Real-Time Push
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">{title}</h4>
              <p className="text-xs text-slate-600 font-medium whitespace-pre-wrap leading-relaxed">{message}</p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={broadcasting}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition cursor-pointer"
              >
                Cancel / Edit
              </button>
              <button
                type="button"
                onClick={handleConfirmBroadcast}
                disabled={broadcasting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F01472] to-[#ec4899] hover:from-[#d01060] hover:to-[#db2777] text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-pink-500/25 transition cursor-pointer disabled:opacity-60"
              >
                {broadcasting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Broadcasting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Yes, Send Broadcast Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast History */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Broadcast History</h3>
          <span className="text-xs font-semibold text-slate-400">{announcements.length} Dispatched</span>
        </div>

        {announcements.length === 0 && !loading && (
          <div className="bg-white p-8 rounded-2xl border border-dashed border-pink-200 text-center space-y-2">
            <Bell className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-600">No platform broadcast announcements dispatched yet</p>
            <p className="text-[11px] text-slate-400">Use the form above to compose and broadcast the first platform announcement.</p>
          </div>
        )}

        {announcements.map((a) => {
          const badge = getCategoryBadge(a.type);
          return (
            <div key={a.id} className="bg-white p-5 rounded-2xl border border-pink-100 shadow-xs space-y-2 hover:border-pink-200 transition">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${badge.bg}`}>
                  {badge.label}
                </span>
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {a.date}
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">{a.title}</h4>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">{a.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
