import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Search,
  Check,
  Download,
  Palette,
  AlertCircle,
} from 'lucide-react';
import {
  searchTemplatesApi,
  type TemplateItem,
} from '../../services/templateService';
import { BiodataRenderer, DEFAULT_FEMALE_SAMPLE } from '../rendering/BiodataRenderer';
import { useBiodata } from '../../context/BiodataContext';

interface ChooseTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: TemplateItem) => void;
  lastUsedTemplateId?: string | null;
  alertNotice?: string | null;
}

export const ChooseTemplateModal: React.FC<ChooseTemplateModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  lastUsedTemplateId,
  alertNotice,
}) => {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'FREE' | 'PREMIUM'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { formData } = useBiodata();

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);

    searchTemplatesApi({ include_layout: true })
      .then((data) => {
        if (isMounted) {
          setTemplates(data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load templates in ChooseTemplateModal:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const catNames = (t.categories || []).map((c) => c.name.toLowerCase()).join(' ');
      const matchesSearch =
        !searchQuery.trim() ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        catNames.includes(searchQuery.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const isPremium = t.pricing_type === 'PREMIUM' || t.is_luxury;
      const matchesPrice =
        filterType === 'ALL' ||
        (filterType === 'FREE' && !isPremium) ||
        (filterType === 'PREMIUM' && isPremium);

      const matchesCategory =
        selectedCategory === 'all' ||
        (t.categories || []).some((c) => c.name.toLowerCase() === selectedCategory.toLowerCase());

      return matchesSearch && matchesPrice && matchesCategory;
    });
  }, [templates, searchQuery, filterType, selectedCategory]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    templates.forEach((t) => {
      (t.categories || []).forEach((c) => {
        if (c.name) set.add(c.name);
      });
    });
    return Array.from(set);
  }, [templates]);

  if (!isOpen) return null;

  const content = (
    <div
      className="fixed inset-0 z-[100050] flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[92vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-rose-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="px-5 sm:px-8 py-4 sm:py-5 border-b border-rose-100 bg-gradient-to-r from-rose-50/70 via-white to-pink-50/50 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#F01472] to-[#FF4B8B] text-white flex items-center justify-center shadow-md shadow-pink-500/25">
              <Palette size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                Choose Biodata Template
                <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200/80 px-2.5 py-0.5 rounded-full">
                  {templates.length} Designs
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Select any design below to immediately generate and download your personalized A4 PDF biodata.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-600 transition flex items-center justify-center cursor-pointer shrink-0"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Notice alert if redirected from 'Last Used Template' check */}
        {alertNotice && (
          <div className="mx-5 sm:mx-8 mt-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold flex items-center gap-2.5 shadow-2xs">
            <AlertCircle size={16} className="text-amber-600 shrink-0" />
            <span>{alertNotice}</span>
          </div>
        )}

        {/* Search & Filter Controls */}
        <div className="px-5 sm:px-8 py-3.5 border-b border-slate-100 bg-slate-50/60 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[220px]">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by template name, style, community..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F01472]/20 focus:border-[#F01472]"
            />
          </div>

          {/* Pricing Filters */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                filterType === 'ALL'
                  ? 'bg-[#F01472] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilterType('FREE')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                filterType === 'FREE'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Free
            </button>
            <button
              type="button"
              onClick={() => setFilterType('PREMIUM')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                filterType === 'PREMIUM'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pro
            </button>
          </div>

          {/* Category Chips (if categories exist) */}
          {categories.length > 0 && (
            <div className="hidden md:flex items-center gap-1.5 overflow-x-auto">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer capitalize whitespace-nowrap ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Template Cards Grid (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 border-3 border-[#F01472] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs font-bold text-slate-500">Loading templates...</p>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="py-16 text-center max-w-sm mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Search size={22} />
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-1">No templates found</h3>
              <p className="text-xs text-slate-500">
                Try adjusting your search query or switching filters to see other designs.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTemplates.map((tpl) => {
                const isLastUsed = Boolean(lastUsedTemplateId && lastUsedTemplateId === tpl.id);
                const isPro = tpl.pricing_type === 'PREMIUM' || tpl.is_luxury;
                const primaryCat = tpl.categories && tpl.categories.length > 0 ? tpl.categories[0].name : null;

                return (
                  <div
                    key={tpl.id}
                    onClick={() => onSelectTemplate(tpl)}
                    className={`group relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col cursor-pointer shadow-xs hover:shadow-xl hover:-translate-y-1 ${
                      isLastUsed
                        ? 'border-2 border-[#F01472] ring-4 ring-rose-500/10'
                        : 'border-slate-200 hover:border-rose-300'
                    }`}
                  >
                    {/* Thumbnail Preview Area */}
                    <div
                      className="relative h-56 bg-slate-100 overflow-hidden flex items-center justify-center"
                      style={{ backgroundColor: tpl.default_bg || '#FFFFFF' }}
                    >
                      {tpl.thumbnail_url ? (
                        <div className="w-full h-full flex items-center justify-center p-2">
                          <img
                            src={tpl.thumbnail_url}
                            alt={tpl.name}
                            loading="lazy"
                            className="max-w-full max-h-full object-contain rounded shadow-sm transition duration-300 group-hover:scale-105"
                          />
                        </div>
                      ) : tpl.layout_json ? (
                        <div className="w-full h-full flex items-center justify-center overflow-hidden pointer-events-none select-none p-1.5">
                          <div className="shadow-sm rounded ring-1 ring-black/5 overflow-hidden flex items-center justify-center">
                            <BiodataRenderer
                              data={formData?.name ? formData : DEFAULT_FEMALE_SAMPLE}
                              layoutJson={tpl.layout_json}
                              scale={0.185}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="text-3xl opacity-30 select-none">
                          {tpl.preview_icon || '📄'}
                        </div>
                      )}

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase shadow-xs ${
                            isPro ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
                          }`}
                        >
                          {isPro ? 'PRO' : 'FREE'}
                        </span>
                        {isLastUsed && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#F01472] text-white shadow-xs flex items-center gap-1">
                            <Check size={10} strokeWidth={3} /> Last Used
                          </span>
                        )}
                      </div>

                      {/* Overlay On Hover */}
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-4">
                        <span className="px-4 py-2 rounded-full bg-white text-slate-900 text-xs font-black shadow-lg flex items-center gap-1.5 transform translate-y-1 group-hover:translate-y-0 transition duration-200">
                          <Download size={14} className="text-[#F01472]" />
                          Download with this Template
                        </span>
                      </div>
                    </div>

                    {/* Card Info & Footer */}
                    <div className="p-3.5 flex flex-col justify-between flex-1 bg-white">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {tpl.name}
                          </h4>
                          {primaryCat && (
                            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider shrink-0">
                              {primaryCat}
                            </span>
                          )}
                        </div>
                        {tpl.description && (
                          <p className="text-[11px] text-slate-500 line-clamp-1 mb-3">
                            {tpl.description}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTemplate(tpl);
                        }}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                          isLastUsed
                            ? 'bg-rose-50 text-[#F01472] border border-rose-200 hover:bg-[#F01472] hover:text-white'
                            : 'bg-slate-900 hover:bg-[#F01472] text-white'
                        }`}
                      >
                        <Download size={13} />
                        <span>Select & Download</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Bottom Sticky Footer */}
        <div className="px-5 sm:px-8 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <p className="text-xs text-slate-500 font-medium">
            Selected template will be automatically saved as your default for instant 1-click downloads.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition cursor-pointer shadow-xs"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(content, document.body) : null;
};
