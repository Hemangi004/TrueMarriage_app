import React, { useEffect, useState } from 'react';
import { ShoppingBag, RefreshCw, CheckCircle, Clock, XCircle } from 'lucide-react';
import { getAdminOrdersApi } from '../../services/apiService';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalSales, setTotalSales] = useState(0);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAdminOrdersApi();
      setOrders(data.orders || []);
      setTotalSales(data.totalSales || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-pink-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Orders & Package Purchases</h1>
            <p className="text-xs text-slate-500">Track user package upgrades, premium template downloads, and transactions</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Gross Revenue</span>
            <p className="text-lg font-black text-emerald-600">₹{totalSales.toLocaleString()}</p>
          </div>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-pink-50 hover:bg-pink-100 text-[#F01472] font-bold text-xs rounded-xl flex items-center gap-2 border border-pink-200 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-pink-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-pink-100 text-[10px] uppercase font-bold text-slate-400">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Package Plan</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-pink-50/40 transition">
                  <td className="p-4 font-extrabold text-slate-900">{ord.id}</td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{ord.customer}</div>
                    <div className="text-[11px] text-slate-400">{ord.email}</div>
                  </td>
                  <td className="p-4 font-semibold text-purple-700">{ord.plan}</td>
                  <td className="p-4 font-black text-slate-900">₹{ord.amount}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        ord.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : ord.status === 'PROCESSING'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {ord.status === 'COMPLETED' && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                      {ord.status === 'PROCESSING' && <Clock className="w-3 h-3 text-amber-600" />}
                      {ord.status === 'FAILED' && <XCircle className="w-3 h-3 text-rose-600" />}
                      {ord.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 font-medium">{ord.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
