import React, { useEffect, useState } from 'react';
import { Languages, CheckCircle2, RefreshCw } from 'lucide-react';
import { getAdminLanguagesApi } from '../../services/apiService';

export const AdminLanguagesPage: React.FC = () => {
  const [languages, setLanguages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLanguages = async () => {
    setLoading(true);
    try {
      const data = await getAdminLanguagesApi();
      setLanguages(data.languages || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-pink-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <Languages className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Language Localization Governance</h1>
            <p className="text-xs text-slate-500">Regional Indian language translations, multi-lingual status, and dictionary metrics</p>
          </div>
        </div>
        <button
          onClick={fetchLanguages}
          className="px-4 py-2 bg-pink-50 hover:bg-pink-100 text-[#F01472] font-bold text-xs rounded-xl flex items-center gap-2 border border-pink-200 transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {languages.map((lang) => (
          <div key={lang.code} className="bg-white p-5 rounded-2xl border border-pink-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200 uppercase">
                {lang.code}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Active
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-base text-slate-900">{lang.name}</h3>
              <p className="text-xs text-slate-400 font-semibold">{lang.nativeName}</p>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-500">
                <span>TRANSLATION</span>
                <span>{lang.completionPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  style={{ width: `${lang.completionPercent}%` }}
                  className="bg-gradient-to-r from-cyan-500 to-teal-500 h-full rounded-full"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
