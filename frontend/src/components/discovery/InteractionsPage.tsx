import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Send, BookmarkCheck, Inbox, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AppFooter } from '../common/AppFooter';

type TabKey = 'received' | 'sent' | 'shortlisted';

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'received', label: 'Received', icon: <Inbox className="w-4 h-4" /> },
  { key: 'sent', label: 'Sent', icon: <Send className="w-4 h-4" /> },
  { key: 'shortlisted', label: 'Shortlisted', icon: <BookmarkCheck className="w-4 h-4" /> },
];

export const InteractionsPage: React.FC = () => {
  const { isAuthenticated, isLoading, openLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      sessionStorage.setItem('tm_post_login_redirect', '/interactions');
      openLogin();
      navigate('/', { replace: true });
    }
  }, [isLoading, isAuthenticated, openLogin, navigate]);

  if (!isAuthenticated && !isLoading) {
    return null;
  }

  const [activeTab, setActiveTab] = useState<TabKey>('received');

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/40 via-white to-purple-50/30 flex flex-col">
      {/* Page Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-slate-200/60 sticky top-16 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#F01472] to-[#C80E5A] flex items-center justify-center shadow-md shadow-rose-500/20">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900">My Interactions</h1>
              <p className="text-xs text-slate-500 font-medium">Manage your interests and shortlisted profiles</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === tab.key
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Coming Soon Notice */}
          <div className="mt-3.5 px-4 py-3 bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 border border-pink-200/70 rounded-2xl flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5 text-xs font-bold text-rose-950">
              <Sparkles className="w-4 h-4 text-[#F01472] shrink-0" />
              <span>Interactions are coming soon! Full real-time requests, messaging, and connection management are in active development.</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-[#F01472] to-[#ec4899] text-white text-[10px] font-black uppercase tracking-wider shadow-xs shrink-0">
              Coming Soon
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1" />

      <AppFooter />
    </div>
  );
};
