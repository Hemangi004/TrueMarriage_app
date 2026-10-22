import React, { useEffect, useState } from 'react';
import { Terminal, Shield, RefreshCw } from 'lucide-react';
import { getAdminLogsApi } from '../../services/apiService';

export const AdminLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await getAdminLogsApi();
      setLogs(data.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-pink-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-950 flex items-center justify-center text-white shadow-md shadow-slate-900/20">
            <Terminal className="w-6 h-6 text-pink-400" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Security & System Audit Logs</h1>
            <p className="text-xs text-slate-500">Real-time administrative security events, authentication logs, and audit trail stream</p>
          </div>
        </div>
        <button
          onClick={fetchLogs}
          className="px-4 py-2 bg-pink-50 hover:bg-pink-100 text-[#F01472] font-bold text-xs rounded-xl flex items-center gap-2 border border-pink-200 transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Stream
        </button>
      </div>

      {/* Logs Terminal Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-mono font-bold text-slate-900">audit.log — Telemetry Stream</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-800 font-bold px-2 py-0.5 rounded bg-emerald-100 border border-emerald-300">
            LIVE STREAMING
          </span>
        </div>

        <div className="p-4 space-y-2 max-h-[550px] overflow-y-auto font-mono text-xs text-slate-700">
          {logs.map((log) => (
            <div key={log.id} className="p-3 bg-slate-50/70 hover:bg-slate-100/80 rounded-xl border border-slate-200 transition space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-[#F01472]">{log.action}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-bold">
                    {log.target_type}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">{log.created_at}</span>
              </div>
              <p className="text-[11px] text-slate-500">Target ID: {log.target_id || 'N/A'}</p>
              {log.details && (
                <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-200 font-mono overflow-x-auto">
                  {JSON.stringify(log.details)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
