import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Terminal,
  Search,
  Activity,
  AlertTriangle,
  Lock,
  UserCheck,
  Globe,
  Database,
  Eye,
  X
} from 'lucide-react';
import { getAdminSecurityTelemetryApi, getAdminSecurityLogsApi } from '../../services/apiService';

export const AdminSecurityPage: React.FC = () => {
  const [telemetry, setTelemetry] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [totalLogs, setTotalLogs] = useState(0);
  
  // Filters
  const [severityFilter, setSeverityFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Detail Inspector Modal
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  const fetchTelemetryAndLogs = async () => {
    try {
      const [telemetryData, logsData] = await Promise.all([
        getAdminSecurityTelemetryApi(),
        getAdminSecurityLogsApi(severityFilter, undefined, searchQuery, 50, 0)
      ]);
      if (telemetryData.success) {
        setTelemetry(telemetryData);
      }
      if (logsData.success) {
        setLogs(logsData.logs || []);
        setTotalLogs(logsData.total || 0);
      }
    } catch (err) {
      console.error('Failed to load SOC telemetry:', err);
    }
  };

  useEffect(() => {
    fetchTelemetryAndLogs();
  }, [severityFilter, searchQuery]);

  // Auto-refresh interval (10s)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTelemetryAndLogs();
    }, 10000);
    return () => clearInterval(interval);
  }, [severityFilter, searchQuery]);

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'HIGH':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'WARNING':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 text-slate-900">


      {/* KPI Telemetry Cards */}
      {telemetry && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-purple-600">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Active Sessions</span>
              <Activity className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-slate-900 font-mono">{telemetry.metrics.active_sessions}</p>
            <p className="text-[10px] text-slate-500">Live Server Sessions</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-pink-600">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Security Events (24h)</span>
              <Terminal className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-slate-900 font-mono">{telemetry.metrics.total_security_events_24h}</p>
            <p className="text-[10px] text-slate-500">Logged Telemetry Records</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-amber-600">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Failed Auths (24h)</span>
              <AlertTriangle className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-slate-900 font-mono">{telemetry.metrics.failed_auths_24h}</p>
            <p className="text-[10px] text-slate-500">Invalid Login Attempts</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-rose-600">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">CSRF Violations</span>
              <Lock className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-slate-900 font-mono">{telemetry.metrics.csrf_violations_24h}</p>
            <p className="text-[10px] text-slate-500">Untrusted Origin Blocks</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-emerald-600">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">GDPR Actions (24h)</span>
              <UserCheck className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-slate-900 font-mono">{telemetry.metrics.gdpr_requests_24h}</p>
            <p className="text-[10px] text-slate-500">Exports & Account Erasures</p>
          </div>
        </div>
      )}

      {/* Top Suspicious IPs Table & Severity Breakdown */}
      {telemetry && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Suspicious IPs */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-pink-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-pink-50 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#F01472]" />
                <h3 className="font-bold text-sm text-slate-900">Top Suspicious IP Addresses</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Database Aggregated</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase">
                    <th className="pb-2">IP Address</th>
                    <th className="pb-2 text-center">Event Count</th>
                    <th className="pb-2 text-center">Max Risk Score</th>
                    <th className="pb-2 text-right">Last Seen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-mono text-slate-700">
                  {telemetry.suspicious_ips.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-400 italic font-sans text-xs">
                        No suspicious IP activity recorded. System clean.
                      </td>
                    </tr>
                  ) : (
                    telemetry.suspicious_ips.map((ipObj: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50 transition">
                        <td className="py-2.5 font-bold text-slate-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-rose-500" />
                          <span>{ipObj.ip_address}</span>
                        </td>
                        <td className="py-2.5 text-center font-bold text-[#F01472]">{ipObj.event_count}</td>
                        <td className="py-2.5 text-center">
                          <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                            {ipObj.highest_risk_score}/100
                          </span>
                        </td>
                        <td className="py-2.5 text-right text-[11px] text-slate-400">
                          {ipObj.last_seen ? new Date(ipObj.last_seen).toLocaleTimeString() : 'N/A'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Severity Breakdown */}
          <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-pink-50 pb-3">
              <Database className="w-4 h-4 text-purple-600" />
              <h3 className="font-bold text-sm text-slate-900">Event Severity Breakdown</h3>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-600">INFO</span>
                <span className="font-bold text-slate-900 px-2 py-0.5 bg-white rounded border border-slate-200">
                  {telemetry.severity_breakdown.INFO}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-purple-50 rounded-xl border border-purple-100">
                <span className="font-bold text-purple-700">WARNING</span>
                <span className="font-bold text-purple-900 px-2 py-0.5 bg-white rounded border border-purple-200">
                  {telemetry.severity_breakdown.WARNING}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-amber-50 rounded-xl border border-amber-100">
                <span className="font-bold text-amber-700">HIGH</span>
                <span className="font-bold text-amber-900 px-2 py-0.5 bg-white rounded border border-amber-200">
                  {telemetry.severity_breakdown.HIGH}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-rose-50 rounded-xl border border-rose-100">
                <span className="font-bold text-rose-700">CRITICAL</span>
                <span className="font-bold text-rose-900 px-2 py-0.5 bg-white rounded border border-rose-200">
                  {telemetry.severity_breakdown.CRITICAL}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Security Log Telemetry Stream */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-slate-800">
        {/* Terminal Header Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-xs font-mono font-bold text-slate-900 tracking-wider">security_logs — Live Database Telemetry Stream</h2>
              <p className="text-[10px] text-slate-500">Total matching records in database: {totalLogs}</p>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search IP / Endpoint / Event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-pink-500 font-mono"
              />
            </div>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-mono focus:outline-none focus:border-pink-500"
            >
              <option value="">All Severities</option>
              <option value="INFO">INFO</option>
              <option value="WARNING">WARNING</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>
        </div>

        {/* Terminal Stream List */}
        <div className="p-4 space-y-2.5 max-h-[600px] overflow-y-auto font-mono text-xs">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 italic">
              No security log events found matching the criteria.
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 bg-slate-50/70 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 transition space-y-2 group"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[#F01472]">{log.event_type}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${getSeverityBadge(log.severity)}`}>
                      {log.severity}
                    </span>
                    <span className="text-[10px] text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                      Risk: {log.risk_score}/100
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span>{log.created_at ? new Date(log.created_at).toLocaleString() : 'N/A'}</span>
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="p-1 px-2 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                      title="Inspect JSON Details"
                    >
                      <Eye className="w-3 h-3 text-[#F01472]" /> Details
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                  {log.request_id && <span><strong className="text-slate-700">ReqID:</strong> {log.request_id}</span>}
                  {log.ip_address && <span><strong className="text-slate-700">IP:</strong> {log.ip_address}</span>}
                  {log.endpoint && <span><strong className="text-slate-700">Target:</strong> {log.method || ''} {log.endpoint}</span>}
                  {log.status_code && <span><strong className="text-slate-700">Status:</strong> {log.status_code}</span>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* JSON Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col text-slate-800 shadow-2xl">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#F01472]" />
                <h3 className="font-mono text-xs font-bold text-slate-900">Log Inspector — {selectedLog.id}</h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 font-mono text-xs">
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div><span className="text-slate-500">Event Type:</span> <strong className="text-[#F01472]">{selectedLog.event_type}</strong></div>
                <div><span className="text-slate-500">Severity:</span> <strong className="text-amber-600">{selectedLog.severity}</strong></div>
                <div><span className="text-slate-500">Risk Score:</span> {selectedLog.risk_score}/100</div>
                <div><span className="text-slate-500">IP Address:</span> {selectedLog.ip_address || 'N/A'}</div>
                <div><span className="text-slate-500">User ID:</span> {selectedLog.user_id || 'N/A'}</div>
                <div><span className="text-slate-500">Request ID:</span> {selectedLog.request_id || 'N/A'}</div>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] text-slate-600 font-bold">Sanitized Payload Details (No Credentials):</p>
                <pre className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-800 overflow-x-auto">
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
