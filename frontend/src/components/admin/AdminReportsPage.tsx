import React, { useState } from 'react';
import { FileSpreadsheet, Download, CheckCircle2, RefreshCw } from 'lucide-react';
import { generateAdminReportApi } from '../../services/apiService';

export const AdminReportsPage: React.FC = () => {
  const [generating, setGenerating] = useState<string | null>(null);
  const [activeReport, setActiveReport] = useState<any | null>(null);

  const handleGenerate = async (type: string) => {
    setGenerating(type);
    try {
      const res = await generateAdminReportApi(type);
      if (res.success) {
        setActiveReport(res.report);
      }
    } catch (err) {
      alert('Failed to generate report');
    } finally {
      setGenerating(null);
    }
  };

  const handleDownloadJSON = () => {
    if (!activeReport) return;
    const blob = new Blob([JSON.stringify(activeReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `truemarriage_report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-pink-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">System Reports Generator</h1>
            <p className="text-xs text-slate-500">Generate structured telemetry reports, financial exports, and user growth audits</p>
          </div>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-xs space-y-4 hover:shadow-md transition">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            01
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900">User Growth & Retention Report</h3>
            <p className="text-xs text-slate-500 mt-1">User registrations, retention rates, and demographic breakdowns</p>
          </div>
          <button
            onClick={() => handleGenerate('user_growth')}
            disabled={generating === 'user_growth'}
            className="w-full py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-extrabold text-xs flex items-center justify-center gap-2 border border-purple-200 cursor-pointer transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${generating === 'user_growth' ? 'animate-spin' : ''}`} />
            {generating === 'user_growth' ? 'Generating...' : 'Generate User Report'}
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-xs space-y-4 hover:shadow-md transition">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            02
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Revenue & Package Financial Report</h3>
            <p className="text-xs text-slate-500 mt-1">Gross revenue, transaction logs, package performance & margins</p>
          </div>
          <button
            onClick={() => handleGenerate('revenue_summary')}
            disabled={generating === 'revenue_summary'}
            className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold text-xs flex items-center justify-center gap-2 border border-emerald-200 cursor-pointer transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${generating === 'revenue_summary' ? 'animate-spin' : ''}`} />
            {generating === 'revenue_summary' ? 'Generating...' : 'Generate Financial Report'}
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-xs space-y-4 hover:shadow-md transition">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#F01472] flex items-center justify-center font-bold">
            03
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Moderation & Quality Telemetry Report</h3>
            <p className="text-xs text-slate-500 mt-1">Profile review speeds, rejection reasons, and admin workload</p>
          </div>
          <button
            onClick={() => handleGenerate('moderation_telemetry')}
            disabled={generating === 'moderation_telemetry'}
            className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-[#F01472] font-extrabold text-xs flex items-center justify-center gap-2 border border-rose-200 cursor-pointer transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${generating === 'moderation_telemetry' ? 'animate-spin' : ''}`} />
            {generating === 'moderation_telemetry' ? 'Generating...' : 'Generate Moderation Report'}
          </button>
        </div>
      </div>

      {/* Generated Preview */}
      {activeReport && (
        <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>{activeReport.title}</span>
            </div>
            <button
              onClick={handleDownloadJSON}
              className="px-4 py-2 bg-[#F01472] hover:bg-pink-600 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-md transition cursor-pointer"
            >
              <Download className="w-4 h-4" /> Export Report (JSON)
            </button>
          </div>

          <pre className="bg-slate-50 text-slate-800 p-4 rounded-xl text-xs overflow-x-auto max-h-72 font-mono border border-slate-200">
            {JSON.stringify(activeReport, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
