import React, { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, Users, Award, RefreshCw } from 'lucide-react';
import { getAdminRevenueApi } from '../../services/apiService';

export const AdminRevenuePage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchRevenue = async () => {
    setLoading(true);
    try {
      const res = await getAdminRevenueApi();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-pink-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Revenue Analytics</h1>
            <p className="text-xs text-slate-500">Financial performance, MRR/ARR metrics, and growth distribution</p>
          </div>
        </div>
        <button
          onClick={fetchRevenue}
          className="px-4 py-2 bg-pink-50 hover:bg-pink-100 text-[#F01472] font-bold text-xs rounded-xl flex items-center gap-2 border border-pink-200 transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">MONTHLY RECURRING (MRR)</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">₹{(data?.mrr || 0).toLocaleString()}</p>
          <span className="text-[11px] font-bold text-emerald-600">+{data?.growthRatePercentage || 0}% vs last month</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">ANNUAL RUN RATE (ARR)</span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">₹{(data?.arr || 0).toLocaleString()}</p>
          <span className="text-[11px] font-semibold text-slate-400">Projected annualized</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">AVG REVENUE / USER</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">₹{data?.arpu || 0}</p>
          <span className="text-[11px] font-semibold text-slate-400">ARPU benchmark</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">PAYMENT MARGIN</span>
            <TrendingUp className="w-4 h-4 text-teal-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">94.8%</p>
          <span className="text-[11px] font-bold text-emerald-600">Net provider margin</span>
        </div>
      </div>

      {/* Monthly Chart Bars */}
      <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-xs space-y-4">
        <h3 className="text-sm font-black text-slate-900">Monthly Revenue Growth</h3>
        <div className="grid grid-cols-6 gap-3 items-end h-48 pt-6">
          {(data?.monthlyData || []).map((m: any) => (
            <div key={m.month} className="flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-[10px] font-bold text-slate-600">₹{(m.revenue / 1000).toFixed(0)}k</span>
              <div
                style={{ height: `${Math.min(100, (m.revenue / 450000) * 100)}%` }}
                className="w-full bg-gradient-to-t from-[#F01472] to-purple-500 rounded-t-xl transition-all"
              />
              <span className="text-[10px] font-bold text-slate-400">{m.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
