import React, { useEffect, useState } from 'react';
import { Palette, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { getAdminTemplatesApi, toggleAdminTemplateApi } from '../../services/apiService';

export const AdminTemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const data = await getAdminTemplatesApi();
      setTemplates(data.templates || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleToggle = async (id: string) => {
    try {
      await toggleAdminTemplateApi(id);
      setTemplates((prev) =>
        prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t))
      );
    } catch (err) {
      alert('Failed to toggle template status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-pink-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-pink-500/20">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Templates Governance</h1>
            <p className="text-xs text-slate-500">Manage biodata design templates, availability, and usage analytics</p>
          </div>
        </div>
        <button
          onClick={fetchTemplates}
          className="px-4 py-2 bg-pink-50 hover:bg-pink-100 text-[#F01472] font-bold text-xs rounded-xl flex items-center gap-2 border border-pink-200 transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {templates.map((tpl) => (
          <div key={tpl.id} className="bg-white rounded-2xl border border-pink-100 p-5 shadow-xs space-y-4 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                {tpl.category}
              </span>
              <span className={`text-xs font-black px-2.5 py-1 rounded-full ${tpl.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                {tpl.active ? 'ACTIVE' : 'DISABLED'}
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <span>{tpl.name}</span>
                <span className="text-xs font-semibold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md">{tpl.badge}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">ID: {tpl.id}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl text-xs">
              <div>
                <span className="text-slate-400 font-semibold block text-[10px]">TOTAL USAGE</span>
                <span className="font-black text-slate-800 text-sm">{tpl.usageCount?.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[10px]">DOWNLOADS</span>
                <span className="font-black text-slate-800 text-sm">{tpl.downloads?.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => handleToggle(tpl.id)}
              className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                tpl.active
                  ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              {tpl.active ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              {tpl.active ? 'Disable Template' : 'Enable Template'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
