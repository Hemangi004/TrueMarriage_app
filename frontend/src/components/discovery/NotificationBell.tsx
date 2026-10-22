import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Bell, X, Check, Clock, Heart, Loader2, Radio, Sparkles, Zap, Megaphone, ArrowLeft } from 'lucide-react';
import type { Notification } from '../../types/notifications';
import { getNotificationsApi, markNotificationReadApi, markAllNotificationsReadApi, getUnreadCountApi } from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';

const notificationIcon: Record<string, React.ReactNode> = {
  INTEREST_RECEIVED: <Heart className="w-4 h-4 text-rose-500" />,
  INTEREST_ACCEPTED: <Check className="w-4 h-4 text-emerald-500" />,
  INTEREST_DECLINED: <X className="w-4 h-4 text-slate-400" />,
  INTEREST_WITHDRAWN: <X className="w-4 h-4 text-amber-400" />,
  MUTUAL_INTEREST: <Heart className="w-4 h-4 text-rose-600 fill-rose-500" />,
  ADMIN_BROADCAST: <Radio className="w-4 h-4 text-[#F01472]" />,
  SYSTEM: <Megaphone className="w-4 h-4 text-blue-500" />,
  PROMOTION: <Sparkles className="w-4 h-4 text-amber-500" />,
  FEATURE: <Zap className="w-4 h-4 text-purple-500" />,
};

const formatRelativeTime = (dateStr: string): string => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

interface NotificationBellProps {
  onOpenInteractions?: () => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ onOpenInteractions }) => {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUnread = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const count = await getUnreadCountApi();
      setUnreadCount(count);
    } catch {
      // silently fail — user might not be logged in
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);

    const onVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        fetchUnread();
      }
    };
    const onInterestEvent = () => {
      fetchUnread();
    };

    window.addEventListener('visibilitychange', onVisibilityOrFocus);
    window.addEventListener('focus', onVisibilityOrFocus);
    window.addEventListener('interest:sent', onInterestEvent);

    return () => {
      clearInterval(interval);
      window.removeEventListener('visibilitychange', onVisibilityOrFocus);
      window.removeEventListener('focus', onVisibilityOrFocus);
      window.removeEventListener('interest:sent', onInterestEvent);
    };
  }, [fetchUnread]);

  // Lock body scroll on mobile screens when panel is open
  useEffect(() => {
    if (open && typeof window !== 'undefined' && window.innerWidth < 768) {
      const origOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = origOverflow;
      };
    }
  }, [open]);

  // Handle Escape key to close
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const openDropdown = async () => {
    setOpen(true);
    setLoading(true);
    try {
      const res = await getNotificationsApi(1, 10);
      setNotifications(res.data);
      setUnreadCount(res.unread_count);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    await markNotificationReadApi(id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsReadApi();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch {
      // silently fail
    }
  };

  const handleNotificationClick = async (n: Notification) => {
    if (!n.is_read) {
      await handleMarkRead(n.id);
    }
    if (n.type.startsWith('INTEREST_') || n.type === 'MUTUAL_INTEREST') {
      if (onOpenInteractions) {
        setOpen(false);
        onOpenInteractions();
      }
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative">
      <button
        id="notification-bell-btn"
        onClick={() => open ? setOpen(false) : openDropdown()}
        className="relative p-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
        title="Notifications"
        aria-label="Open notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* MOBILE: Full Screen Notification Panel via Portal */}
      {open && typeof document !== 'undefined' && createPortal(
        <div
          id="mobile-notification-panel"
          className="md:hidden fixed inset-0 z-[100000] bg-white flex flex-col w-full h-[100dvh] overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Notifications"
        >
          {/* Mobile Header Bar */}
          <div className="h-16 px-4 bg-white border-b border-rose-100 flex items-center justify-between shrink-0 shadow-xs z-10 pt-[env(safe-area-inset-top,0px)]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 -ml-2 rounded-full text-slate-700 hover:bg-rose-50 hover:text-[#F01472] active:scale-95 transition cursor-pointer"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-gray-900 tracking-tight">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#F01472] text-white text-[11px] font-black leading-none shadow-xs">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-xs font-bold text-[#F01472] hover:text-[#C80E5A] px-2.5 py-1 rounded-full bg-rose-50 hover:bg-rose-100 active:scale-95 transition cursor-pointer"
                >
                  Mark all read
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 -mr-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full active:scale-95 transition cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Notification List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 bg-white overscroll-contain pb-safe">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center gap-3 p-8 text-slate-400">
                <Loader2 className="w-7 h-7 animate-spin text-[#F01472]" />
                <span className="text-xs font-semibold text-slate-500">Loading notifications...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-rose-50 text-[#F01472] flex items-center justify-center mx-auto shadow-xs border border-rose-100">
                  <Bell className="w-7 h-7 opacity-80" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-extrabold text-gray-900">No notifications yet</p>
                  <p className="text-xs text-gray-400 font-medium max-w-[240px] mx-auto leading-relaxed">
                    You're all caught up! New interactions, profile updates, and matches will appear here.
                  </p>
                </div>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`px-4 py-3.5 transition flex items-start gap-3.5 cursor-pointer active:bg-rose-50/70 ${
                    !n.is_read
                      ? 'bg-rose-50/50 border-l-4 border-l-[#F01472]'
                      : 'bg-white hover:bg-slate-50/80'
                  }`}
                >
                  <div className="mt-0.5 w-10 h-10 rounded-full overflow-hidden bg-rose-50 border border-rose-100 shadow-2xs flex items-center justify-center shrink-0">
                    {n.image_url ? (
                      <img
                        src={n.image_url}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      notificationIcon[n.type] || <Bell className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-xs leading-snug ${!n.is_read ? 'font-black text-gray-900' : 'font-bold text-gray-700'}`}>
                        {n.title}
                      </p>
                      {!n.is_read && (
                        <span className="shrink-0 w-2 h-2 rounded-full bg-[#F01472] shadow-xs" title="Unread" />
                      )}
                    </div>
                    <p className="text-[11px] text-gray-600 leading-snug mt-1 line-clamp-2">
                      {n.message}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium mt-1.5 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span>{formatRelativeTime(n.created_at)}</span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>,
        document.body
      )}

      {/* DESKTOP: Dropdown Panel */}
      {open && (
        <>
          {/* Backdrop to dismiss on click outside (desktop only) */}
          <div
            className="hidden md:block fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px]"
            onClick={() => setOpen(false)}
          />

          {/* Dropdown Panel positioned downward below bell */}
          <div className="hidden md:block absolute right-0 top-full mt-2.5 z-50 w-80 sm:w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl shadow-slate-900/20 border border-rose-100 overflow-hidden animate-scaleUp origin-top-right ring-1 ring-black/5">
            {unreadCount > 0 && (
              <div className="px-3.5 py-2 bg-rose-50/50 border-b border-rose-100 flex items-center justify-between text-xs">
                <span className="font-bold text-gray-700 text-[11px]">
                  {unreadCount} unread
                </span>
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-[11px] font-bold text-[#F01472] hover:underline cursor-pointer"
                >
                  Mark all read
                </button>
              </div>
            )}

            {/* Body List */}
            <div className="max-h-84 overflow-y-auto divide-y divide-gray-100 bg-white scrollbar-thin">
              {loading ? (
                <div className="p-8 flex flex-col items-center justify-center gap-2.5 text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin text-[#F01472]" />
                  <span className="text-xs font-semibold text-gray-500">Loading notifications...</span>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center space-y-2 bg-white">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#F01472] flex items-center justify-center mx-auto shadow-2xs">
                    <Bell className="w-6 h-6 opacity-80" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-gray-800">No notifications yet</p>
                    <p className="text-[11px] text-gray-400 font-medium max-w-[220px] mx-auto mt-0.5">
                      You're all caught up! New interactions and profile updates will appear here.
                    </p>
                  </div>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`px-4 py-3.5 transition flex items-start gap-3 cursor-pointer ${
                      !n.is_read
                        ? 'bg-rose-50/50 hover:bg-rose-50/80 border-l-3 border-l-[#F01472]'
                        : 'bg-white hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="mt-0.5 w-9 h-9 rounded-full overflow-hidden bg-rose-50 border border-rose-100 shadow-2xs flex items-center justify-center shrink-0">
                      {n.image_url ? (
                        <img
                          src={n.image_url}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        notificationIcon[n.type] || <Bell className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs leading-snug ${!n.is_read ? 'font-black text-gray-900' : 'font-bold text-gray-700'}`}>
                        {n.title}
                      </p>
                      <p className="text-[11px] text-gray-600 leading-snug mt-0.5 line-clamp-2">
                        {n.message}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium mt-1.5 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span>{formatRelativeTime(n.created_at)}</span>
                      </p>
                    </div>
                    {!n.is_read && (
                      <span
                        className="shrink-0 mt-1.5 w-2 h-2 rounded-full bg-[#F01472] shadow-xs"
                        title="Unread notification"
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

