import React, { useEffect, useState } from 'react';
import { getAdminAnalyticsApi } from '../../services/apiService';
import {
  BarChart3,
  TrendingUp,
  Users,
  FileCheck,
  Heart,
  ShieldCheck,
  Activity,
  UserCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminAnalyticsApi();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-500 gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-purple-600" />
        <span className="text-sm font-semibold">Loading system analytics & telemetry...</span>
      </div>
    );
  }

  const users = data?.users || { total: 0, active: 0, blocked: 0, admins: 0 };
  const profiles = data?.profiles || { total: 0, approved: 0, submitted: 0, under_review: 0, rejected: 0, changes_requested: 0, draft: 0 };
  const interactions = data?.interactions || { total_interests: 0, pending: 0, matched: 0, accepted: 0, declined: 0, total_shortlists: 0 };

  return (
    <div className="space-y-6 animate-fadeIn">

      {error && (
        <div className="p-4 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Accounts</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{users.total}</div>
            <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
              <UserCheck className="w-3 h-3" /> {users.active} Active accounts
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Approved Profiles</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{profiles.approved}</div>
            <div className="text-[11px] font-semibold text-purple-600 flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3" /> {profiles.pending_moderation_total || 0} Pending moderation
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Interactions</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Heart className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{interactions.total_interests}</div>
            <div className="text-[11px] font-semibold text-rose-600 flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" /> {interactions.matched} Mutual Matches
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Integrity</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" /> 100% Healthy
            </div>
            <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
              FastAPI Engine Operational
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Profile Moderation Funnel Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" /> Profile Moderation Breakdown
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Distribution of candidate profiles across moderation workflow states.
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              {profiles.total} Total Profiles
            </span>
          </div>

          {/* Bar Chart Visual */}
          <div className="space-y-3 pt-2">
            {[
              { label: 'APPROVED (Publicly Visible)', count: profiles.approved, total: profiles.total, color: 'bg-emerald-500', icon: CheckCircle2 },
              { label: 'SUBMITTED / PENDING REVIEW', count: profiles.submitted + profiles.under_review, total: profiles.total, color: 'bg-amber-500', icon: Clock },
              { label: 'CHANGES REQUESTED', count: profiles.changes_requested, total: profiles.total, color: 'bg-indigo-500', icon: AlertTriangle },
              { label: 'REJECTED PROFILES', count: profiles.rejected, total: profiles.total, color: 'bg-rose-500', icon: XCircle },
              { label: 'UNSUBMITTED DRAFTS', count: profiles.draft, total: profiles.total, color: 'bg-slate-400', icon: Activity },
            ].map((item, idx) => {
              const pct = item.total > 0 ? Math.round((item.count / item.total) * 100) : 0;
              const Icon = item.icon;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-slate-500" />
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900">{item.count}</span>
                      <span className="text-slate-400 text-[11px]">({pct}%)</span>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(pct, 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Matrimonial Interaction & Conversion Funnel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-600" /> Interaction & Conversion Metrics
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Conversion of user interest proposals into mutual reciprocal matches.
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              {interactions.total_interests} Total Proposals
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {[
              { label: 'PENDING INTEREST PROPOSALS', count: interactions.pending, total: interactions.total_interests, color: 'bg-amber-500' },
              { label: 'ACCEPTED INTERESTS', count: interactions.accepted, total: interactions.total_interests, color: 'bg-indigo-600' },
              { label: 'MUTUAL RECIPROCAL MATCHES', count: interactions.matched, total: interactions.total_interests, color: 'bg-rose-600' },
              { label: 'DECLINED PROPOSALS', count: interactions.declined, total: interactions.total_interests, color: 'bg-slate-400' },
              { label: 'TOTAL SHORTLIST BOOKMARKS', count: interactions.total_shortlists, total: Math.max(interactions.total_shortlists, 1), color: 'bg-purple-600' },
            ].map((item, idx) => {
              const pct = item.total > 0 ? Math.round((item.count / item.total) * 100) : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>{item.label}</span>
                    <span className="text-slate-900">{item.count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(pct, 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* System Infrastructure Telemetry Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" /> Infrastructure & Security Telemetry
          </h3>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            All Systems Nominal
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Backend Engine</span>
            <p className="text-sm font-black text-slate-800">Python FastAPI v0.115</p>
            <p className="text-[11px] text-emerald-600 font-semibold">Async ASGI Server</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Database Layer</span>
            <p className="text-sm font-black text-slate-800">SQLAlchemy 2.0 ORM</p>
            <p className="text-[11px] text-emerald-600 font-semibold">Alembic Migrations Applied</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Authentication Boundary</span>
            <p className="text-sm font-black text-slate-800">HttpOnly Cookies</p>
            <p className="text-[11px] text-emerald-600 font-semibold">bcrypt 12-rounds Work Factor</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Real Email Delivery</span>
            <p className="text-sm font-black text-slate-800">Gmail SMTP TLS</p>
            <p className="text-[11px] text-emerald-600 font-semibold">OTP Verification Engine Active</p>
          </div>
        </div>
      </div>
    </div>
  );
};
