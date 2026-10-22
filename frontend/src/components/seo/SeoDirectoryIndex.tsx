import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Search,
} from 'lucide-react';
import { SEO_LANDING_PAGES } from '../../data/seoLandingPages';
import { AppFooter } from '../common/AppFooter';

export const SeoDirectoryIndex: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const allPages = Object.values(SEO_LANDING_PAGES);

  const categories = [
    { id: 'all', label: 'All 24 Formats & Guides' },
    { id: 'maker', label: 'Maker Tools' },
    { id: 'format', label: 'Formats & PDFs' },
    { id: 'language', label: 'Regional Languages' },
    { id: 'religion', label: 'Faiths & Communities' },
    { id: 'guide', label: 'Step-by-Step Guides' },
  ];

  const filteredPages = allPages.filter((page) => {
    const matchesCategory = selectedCategory === 'all' || page.category === selectedCategory;
    const matchesSearch =
      page.primaryKeyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.h1.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FFFBFD] text-slate-900 flex flex-col selection:bg-rose-100 selection:text-[#C80E5A]">
      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-10 pb-12 sm:pb-16 bg-gradient-to-b from-[#FFF0F6] via-[#FFF8FB] to-[#FFFBFD] border-b border-pink-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100 text-[#C80E5A] text-xs font-bold border border-pink-200">
            <Sparkles size={14} className="text-[#F01472]" />
            <span>Comprehensive SEO & Formats Directory</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
            Marriage Biodata Formats & Maker Hub
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Choose from 24+ specialized matrimonial formats, regional Indian language makers, faith-tailored templates, and comprehensive guides.
          </p>

          {/* Search Bar */}
          <div className="pt-4 max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search formats (e.g. Hindi, Muslim, Boy & Girl, Free PDF)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 focus:border-[#F01472] focus:ring-2 focus:ring-pink-100 text-sm shadow-sm outline-none transition-all"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 flex-wrap pt-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#F01472] text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-pink-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Formats Grid ─────────────────────────────────────────── */}
      <section className="py-12 flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Showing {filteredPages.length} Dedicated Matrimonial Guides
            </h2>
            <button
              type="button"
              onClick={() => navigate('/templates')}
              className="text-xs font-bold text-[#F01472] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Launch Live Template Studio</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPages.map((page) => (
              <Link
                key={page.slug}
                to={`/biodata/${page.slug}`}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-pink-300 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-pink-50 text-[#F01472] text-[10px] font-bold border border-pink-100">
                      {page.badge}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 capitalize">
                      {page.category}
                    </span>
                  </div>

                  {page.nativeScript && (
                    <div className="text-xs font-semibold text-pink-700 font-serif">
                      {page.nativeScript}
                    </div>
                  )}

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#F01472] transition-colors line-clamp-2">
                    {page.primaryKeyword}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {page.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#F01472]">
                  <span>Explore Guide & Format</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          {filteredPages.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">No formats match your search</h3>
              <p className="text-xs text-slate-400 mt-1">Try searching for keywords like "Hindi", "Marathi", "PDF", or "Boy".</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Global Footer ────────────────────────────────────────── */}
      <AppFooter />
    </div>
  );
};
