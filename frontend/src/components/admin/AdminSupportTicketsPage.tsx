import React, { useEffect, useState } from 'react';
import { LifeBuoy, RefreshCw } from 'lucide-react';
import { getAdminTicketsApi, updateAdminTicketStatusApi } from '../../services/apiService';

export const AdminSupportTicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await getAdminTicketsApi();
      setTickets(data.tickets || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateAdminTicketStatusApi(id, status);
      setTickets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status } : t))
      );
    } catch (err) {
      alert('Failed to update ticket status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-pink-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <LifeBuoy className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Customer Support Tickets Portal</h1>
            <p className="text-xs text-slate-500">Manage user inquiries, technical support tickets, and resolution workflows</p>
          </div>
        </div>
        <button
          onClick={fetchTickets}
          className="px-4 py-2 bg-pink-50 hover:bg-pink-100 text-[#F01472] font-bold text-xs rounded-xl flex items-center gap-2 border border-pink-200 transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {tickets.map((t) => (
          <div key={t.id} className="bg-white p-5 rounded-2xl border border-pink-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-slate-900">{t.id}</span>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    t.priority === 'URGENT'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : t.priority === 'HIGH'
                      ? 'bg-orange-50 text-orange-700 border border-orange-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}
                >
                  {t.priority}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">• {t.createdAt}</span>
              </div>
              <h3 className="font-extrabold text-base text-slate-900">{t.subject}</h3>
              <p className="text-xs text-slate-500 font-medium">User: {t.user} ({t.email})</p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => handleUpdateStatus(t.id, 'IN_PROGRESS')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs border transition cursor-pointer ${
                  t.status === 'IN_PROGRESS'
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-slate-50 text-slate-600 hover:bg-amber-50 border-slate-200'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => handleUpdateStatus(t.id, 'RESOLVED')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs border transition cursor-pointer ${
                  t.status === 'RESOLVED'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-slate-50 text-slate-600 hover:bg-emerald-50 border-slate-200'
                }`}
              >
                Mark Resolved
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
