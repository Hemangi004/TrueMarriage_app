import React, { useEffect, useState } from 'react';
import { MessageSquare, Star, RefreshCw } from 'lucide-react';
import { getAdminTestimonialsApi, toggleAdminTestimonialFeaturedApi } from '../../services/apiService';

export const AdminTestimonialsPage: React.FC = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const data = await getAdminTestimonialsApi();
      setTestimonials(data.testimonials || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleToggle = async (id: string) => {
    try {
      await toggleAdminTestimonialFeaturedApi(id);
      setTestimonials((prev) =>
        prev.map((t) => (t.id === id ? { ...t, featured: !t.featured } : t))
      );
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-pink-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Customer Testimonials Moderation</h1>
            <p className="text-xs text-slate-500">Approve, edit, and feature user success stories on the landing page</p>
          </div>
        </div>
        <button
          onClick={fetchTestimonials}
          className="px-4 py-2 bg-pink-50 hover:bg-pink-100 text-[#F01472] font-bold text-xs rounded-xl flex items-center gap-2 border border-pink-200 transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white p-5 rounded-2xl border border-pink-100 shadow-xs space-y-4 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${t.featured ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-500'}`}>
                {t.featured ? 'FEATURED ON LANDING' : 'NORMAL'}
              </span>
            </div>

            <p className="text-xs text-slate-600 font-medium italic">"{t.text}"</p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <h4 className="font-extrabold text-xs text-slate-900">{t.name}</h4>
                <p className="text-[10px] text-slate-400 font-semibold">{t.location}</p>
              </div>

              <button
                onClick={() => handleToggle(t.id)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  t.featured
                    ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                {t.featured ? 'Unfeature Review' : 'Feature on Landing'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
