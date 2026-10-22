import React, { useEffect, useState } from 'react';
import {
  Users,
  MousePointerClick,
  TrendingUp,
  PieChart,
  Clock,
  AlertCircle,
  UserX,
  UserCheck,
  Crown,
  Sparkles,
} from 'lucide-react';
import { getUserAnalysisApi, type UserAnalysisData } from '../../services/adminUserAnalysisService';

export const AdminUserAnalysisPage: React.FC = () => {
  const [data, setData] = useState<UserAnalysisData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysisData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUserAnalysisApi();
      setData(res);
    } catch (err: any) {
      setError(err?.message || 'Failed to load user analysis metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysisData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-pink-200 border-t-[#F01472] rounded-full animate-spin" />
        <p className="text-sm font-bold text-slate-600">Loading User Analysis Metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl flex items-center gap-4 text-rose-800">
          <AlertCircle className="w-8 h-8 shrink-0 text-rose-600" />
          <div className="flex-1">
            <h4 className="font-extrabold text-base">Failed to Load User Analysis</h4>
            <p className="text-xs text-rose-600 mt-1">{error}</p>
          </div>
          <button
            onClick={fetchAnalysisData}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition shadow-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const totalUsers = data?.total_registered_users || 0;
  const uniqueUsers = data?.unique_users_clicked_premium || 0;
  const registeredClicks = data?.registered_premium_clicks || 0;
  const unregisteredClicks = data?.unregistered_premium_clicks || 0;
  const totalClicks = data?.total_premium_clicks || 0;
  const totalFreeClicks = data?.total_free_clicks || 0;
  const uniqueFreeUsers = data?.unique_users_clicked_free || 0;
  const percentage = data?.premium_interest_percentage || 0;
  const totalDecisions = totalClicks + totalFreeClicks;
  const premiumIntentShare = totalDecisions > 0 ? Math.round((totalClicks / totalDecisions) * 100) : 0;
  const nonInterestedUsers = Math.max(0, totalUsers - uniqueUsers);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* KPI Cards: Unified Telemetry & Core Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Card 1: Total Registered Users */}
        <div className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/40 to-blue-100/70 p-4 sm:p-5 rounded-2xl border border-blue-200/70 shadow-xs hover:shadow-md transition space-y-1.5 group">
          <Users className="absolute -right-5 -bottom-3 w-24 h-24 text-blue-600/[0.12] pointer-events-none transition-transform duration-500 group-hover:scale-110" />
          <div className="relative z-10">
            <span className="text-[11px] font-black text-slate-500 tracking-wider uppercase block">Total Users</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{totalUsers.toLocaleString()}</p>
            <p className="text-[11px] font-semibold text-slate-500 mt-1">Registered accounts</p>
          </div>
        </div>

        {/* Card 2: Clicked Premium Button */}
        <div className="relative overflow-hidden bg-gradient-to-br from-white via-pink-50/40 to-pink-100/70 p-4 sm:p-5 rounded-2xl border border-pink-200/70 shadow-xs hover:shadow-md transition space-y-1.5 group">
          <Crown className="absolute -right-5 -bottom-3 w-24 h-24 text-[#F01472]/[0.14] pointer-events-none transition-transform duration-500 group-hover:scale-110" />
          <div className="relative z-10">
            <span className="text-[11px] font-black text-[#F01472] tracking-wider uppercase block">Clicked Premium</span>
            <p className="text-2xl font-black text-[#F01472] mt-1">{totalClicks.toLocaleString()}</p>
            <p className="text-[11px] font-semibold text-pink-700/80 mt-1">{uniqueUsers} members ({percentage}%)</p>
          </div>
        </div>

        {/* Card 3: Clicked Free Button */}
        <div className="relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/40 to-emerald-100/70 p-4 sm:p-5 rounded-2xl border border-emerald-200/70 shadow-xs hover:shadow-md transition space-y-1.5 group">
          <Sparkles className="absolute -right-5 -bottom-3 w-24 h-24 text-emerald-600/[0.14] pointer-events-none transition-transform duration-500 group-hover:scale-110" />
          <div className="relative z-10">
            <span className="text-[11px] font-black text-emerald-800 tracking-wider uppercase block">Clicked Free</span>
            <p className="text-2xl font-black text-emerald-700 mt-1">{totalFreeClicks.toLocaleString()}</p>
            <p className="text-[11px] font-semibold text-emerald-800/80 mt-1">{uniqueFreeUsers} members</p>
          </div>
        </div>

        {/* Card 4: Premium Intent Ratio */}
        <div className="relative overflow-hidden bg-gradient-to-br from-white via-purple-50/40 to-purple-100/70 p-4 sm:p-5 rounded-2xl border border-purple-200/70 shadow-xs hover:shadow-md transition space-y-1.5 group">
          <TrendingUp className="absolute -right-5 -bottom-3 w-24 h-24 text-purple-600/[0.14] pointer-events-none transition-transform duration-500 group-hover:scale-110" />
          <div className="relative z-10">
            <span className="text-[11px] font-black text-purple-800 tracking-wider uppercase block">Intent Ratio</span>
            <p className="text-2xl font-black text-purple-700 mt-1">{premiumIntentShare}%</p>
            <p className="text-[11px] font-semibold text-purple-800/80 mt-1">Want Premium</p>
          </div>
        </div>

        {/* Card 5: Member Clicks */}
        <div className="relative overflow-hidden bg-gradient-to-br from-white via-indigo-50/40 to-indigo-100/70 p-4 sm:p-5 rounded-2xl border border-indigo-200/70 shadow-xs hover:shadow-md transition space-y-1.5 group">
          <UserCheck className="absolute -right-5 -bottom-3 w-24 h-24 text-indigo-600/[0.14] pointer-events-none transition-transform duration-500 group-hover:scale-110" />
          <div className="relative z-10">
            <span className="text-[11px] font-black text-slate-500 tracking-wider uppercase block">Member Clicks</span>
            <p className="text-2xl font-black text-indigo-700 mt-1">{registeredClicks.toLocaleString()}</p>
            <p className="text-[11px] font-semibold text-slate-500 mt-1">Log-in user clicks</p>
          </div>
        </div>

        {/* Card 6: Guest Clicks */}
        <div className="relative overflow-hidden bg-gradient-to-br from-white via-amber-50/40 to-amber-100/70 p-4 sm:p-5 rounded-2xl border border-amber-200/70 shadow-xs hover:shadow-md transition space-y-1.5 group">
          <UserX className="absolute -right-5 -bottom-3 w-24 h-24 text-amber-600/[0.18] pointer-events-none transition-transform duration-500 group-hover:scale-110" />
          <div className="relative z-10">
            <span className="text-[11px] font-black text-amber-800 tracking-wider uppercase block">Guest Clicks</span>
            <p className="text-2xl font-black text-amber-900 mt-1">{unregisteredClicks.toLocaleString()}</p>
            <p className="text-[11px] font-semibold text-amber-800/80 mt-1">Unregistered clicks</p>
          </div>
        </div>
      </div>

      {/* Visual User Comparison Chart Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-[#F01472]" /> Registered Users vs. Premium Interest Ratio
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Visual breakdown of unique user interactions against total registered user accounts.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-gradient-to-r from-[#F01472] to-purple-600" />
              <span className="text-slate-700">Registered Interested ({uniqueUsers})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-amber-800">Unregistered Guest Clicks ({unregisteredClicks})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-200" />
              <span className="text-slate-500">Other Users ({nonInterestedUsers})</span>
            </div>
          </div>
        </div>

        {/* Progress Bar Visualization */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Interest Conversion: {percentage}%</span>
            <span>{uniqueUsers} of {totalUsers} Registered Users</span>
          </div>

          <div className="w-full h-8 bg-slate-100 rounded-2xl overflow-hidden p-1 border border-slate-200 flex">
            <div
              style={{ width: `${Math.max(percentage, totalUsers > 0 && uniqueUsers > 0 ? 5 : 0)}%` }}
              className="h-full bg-gradient-to-r from-[#F01472] via-purple-600 to-indigo-600 rounded-xl transition-all duration-1000 shadow-md flex items-center justify-end px-2 text-[10px] font-black text-white"
            >
              {percentage > 10 ? `${percentage}%` : ''}
            </div>
            <div
              style={{ width: `${100 - (totalUsers > 0 ? (uniqueUsers / totalUsers) * 100 : 0)}%` }}
              className="h-full bg-slate-100 rounded-xl transition-all duration-1000 flex items-center justify-center text-[10px] font-extrabold text-slate-400"
            >
              {percentage <= 10 && percentage > 0 ? `${percentage}%` : ''}
            </div>
          </div>
        </div>

        {/* Distribution Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-50/70 to-purple-50/70 border border-pink-100 space-y-1">
            <p className="text-xs font-bold text-slate-500">Registered Interested Users</p>
            <p className="text-xl font-black text-[#F01472]">{uniqueUsers} Users ({percentage}%)</p>
            <p className="text-[11px] text-slate-500">{registeredClicks} total member clicks recorded.</p>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/80 to-orange-50/80 border border-amber-200 space-y-1">
            <p className="text-xs font-bold text-amber-800">Unregistered Guest Clicks</p>
            <p className="text-xl font-black text-amber-900">{unregisteredClicks} Clicks</p>
            <p className="text-[11px] text-amber-700 font-medium">Clicks recorded before prompting for login.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <p className="text-xs font-bold text-slate-500">Standard / Non-Clicked Users</p>
            <p className="text-xl font-black text-slate-700">{nonInterestedUsers} Users ({(100 - percentage).toFixed(2)}%)</p>
            <p className="text-[11px] text-slate-500">Users who have not clicked Premium buttons.</p>
          </div>
        </div>
      </div>

      {/* Recent Premium Click Events Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" /> Recent Premium Click Activity Log
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Live audit trail of user and guest actions recording interest in Premium features.
            </p>
          </div>
          <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-bold">
            {data?.recent_events?.length || 0} Recent Events
          </span>
        </div>

        {!data?.recent_events || data.recent_events.length === 0 ? (
          <div className="p-8 text-center text-slate-400 font-semibold text-xs space-y-2">
            <MousePointerClick className="w-8 h-8 mx-auto text-slate-300" />
            <p>No Premium click events recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-3 px-4">User Type</th>
                  <th className="py-3 px-4">User / Email</th>
                  <th className="py-3 px-4">Event Type</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {data.recent_events.map((evt) => (
                  <tr key={evt.id} className="hover:bg-pink-50/30 transition">
                    <td className="py-3.5 px-4 font-bold">
                      {evt.user_id ? (
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold">
                          Registered Member
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-extrabold">
                          Unregistered Guest
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {evt.user_full_name} ({evt.user_email})
                    </td>
                    <td className="py-3.5 px-4 font-extrabold">
                      {evt.event_type === "FREE_CLICK" ? (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold">
                          FREE_CLICK
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-pink-50 border border-pink-200 text-[#F01472] text-[10px] font-extrabold">
                          PREMIUM_CLICK
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-medium">
                      {evt.created_at ? new Date(evt.created_at).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
