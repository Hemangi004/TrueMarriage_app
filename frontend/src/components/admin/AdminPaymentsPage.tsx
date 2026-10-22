import React, { useEffect, useState } from 'react';
import { CreditCard, CheckCircle2, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { getAdminPaymentsApi } from '../../services/apiService';

export const AdminPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [gateways, setGateways] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await getAdminPaymentsApi();
      setPayments(data.payments || []);
      setGateways(data.gatewayHealth || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-pink-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Payment Gateways & Transactions</h1>
            <p className="text-xs text-slate-500">Live payment gateway status, transaction logs, and provider health</p>
          </div>
        </div>
        <button
          onClick={fetchPayments}
          className="px-4 py-2 bg-pink-50 hover:bg-pink-100 text-[#F01472] font-bold text-xs rounded-xl flex items-center gap-2 border border-pink-200 transition cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Gateway Health */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {gateways.map((g) => (
          <div key={g.name} className="bg-white p-4 rounded-2xl border border-pink-100 shadow-xs flex items-center justify-between">
            <div>
              <h4 className="font-bold text-xs text-slate-900">{g.name}</h4>
              <p className="text-[11px] text-slate-400 font-medium">{g.successRate}% Success Rate</p>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {g.status}
            </span>
          </div>
        ))}
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-pink-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-pink-100 text-[10px] uppercase font-bold text-slate-400">
              <tr>
                <th className="p-4">Txn ID</th>
                <th className="p-4">Order ID</th>
                <th className="p-4">Gateway</th>
                <th className="p-4">Method</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-pink-50/40 transition">
                  <td className="p-4 font-extrabold text-slate-900">{p.id}</td>
                  <td className="p-4 font-semibold text-purple-700">{p.orderId}</td>
                  <td className="p-4 font-bold text-slate-900">{p.gateway}</td>
                  <td className="p-4 text-slate-600 font-medium">{p.method}</td>
                  <td className="p-4 font-black text-slate-900">₹{p.amount}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        p.status === 'SUCCESS'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : p.status === 'PENDING'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {p.status === 'SUCCESS' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      {p.status === 'PENDING' && <Clock className="w-3 h-3 text-amber-600" />}
                      {p.status === 'FAILED' && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 font-medium">{p.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
