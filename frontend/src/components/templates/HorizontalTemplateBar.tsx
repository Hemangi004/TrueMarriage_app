import React, { useRef } from 'react';
import { Check, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import type { TemplateItem } from '../../services/templateService';

interface HorizontalTemplateBarProps {
  templates: TemplateItem[];
  selectedTemplateId: string;
  onSelectTemplate: (template: TemplateItem) => void;
  onBrowseAll: () => void;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All Designs' },
  { id: 'traditional', label: 'Traditional' },
  { id: 'modern', label: 'Modern' },
  { id: 'luxury', label: 'Luxury' },
  { id: 'floral', label: 'Floral' },
  { id: 'royal', label: 'Royal & Heritage' },
  { id: 'minimalist', label: 'Minimalist' },
];

export const HorizontalTemplateBar: React.FC<HorizontalTemplateBarProps> = ({
  templates,
  selectedTemplateId,
  onSelectTemplate,
  onBrowseAll,
  activeCategory,
  onSelectCategory,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const distance = direction === 'left' ? -260 : 260;
      scrollRef.current.scrollBy({ left: distance, behavior: 'smooth' });
    }
  };

  const filteredTemplates = templates.filter((tpl) => {
    if (activeCategory === 'all') return true;
    return tpl.categories?.some((c) => {
      const slug = (c.slug || c.id || '').toLowerCase();
      if (activeCategory === 'minimalist') return slug === 'modern' || slug === 'minimalist';
      return slug.includes(activeCategory.toLowerCase());
    });
  });

  return (
    <div className="w-full bg-white/95 backdrop-blur-md border-b border-rose-100/80 px-3 sm:px-6 py-2.5 shadow-xs select-none">
      {/* Category Pills Row */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {CATEGORIES.map((c) => {
            const isActive = activeCategory === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectCategory(c.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-[#E11D48] text-white shadow-xs'
                    : 'bg-rose-50/60 text-slate-600 hover:bg-rose-100/70 hover:text-slate-900'
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onBrowseAll}
          className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 transition shrink-0 ml-2 cursor-pointer px-2 py-1 rounded-lg hover:bg-rose-50"
          title="Open full catalog"
        >
          <LayoutGrid size={13} />
          <span className="hidden sm:inline">Browse Catalog</span>
        </button>
      </div>

      {/* Horizontal Thumbnails Carousel */}
      <div className="relative flex items-center group">
        <button
          type="button"
          onClick={() => scroll('left')}
          className="absolute left-0 z-10 w-7 h-7 rounded-full bg-white/90 shadow-md border border-slate-200 text-slate-700 flex items-center justify-center -ml-2.5 opacity-0 group-hover:opacity-100 transition cursor-pointer hover:bg-white"
          aria-label="Scroll left"
        >
          <ChevronLeft size={16} />
        </button>

        <div
          ref={scrollRef}
          className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1 px-0.5 w-full scroll-smooth"
        >
          {filteredTemplates.map((tpl) => {
            const isSelected = tpl.id === selectedTemplateId;
            const accentColor = tpl.default_accent || '#E11D48';

            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => onSelectTemplate(tpl)}
                className={`group/card relative flex items-center gap-2.5 px-3 py-2 rounded-2xl border transition-all text-left shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-rose-50/90 border-[#E11D48] ring-2 ring-rose-500/20 shadow-sm'
                    : 'bg-white border-slate-200/90 hover:border-rose-300 hover:bg-rose-50/30'
                }`}
                style={{ minWidth: '150px' }}
              >
                {/* Mini Preview Box */}
                <div
                  className="w-8 h-11 rounded-lg border border-black/10 overflow-hidden shrink-0 flex items-center justify-center relative shadow-2xs"
                  style={{ backgroundColor: tpl.default_bg || '#FAFAF9' }}
                >
                  <div
                    className="w-full h-1.5 absolute top-0 inset-x-0"
                    style={{ backgroundColor: accentColor }}
                  />
                  <span className="text-xs opacity-70">
                    {tpl.preview_icon || '📄'}
                  </span>
                  {isSelected && (
                    <div className="absolute inset-0 bg-rose-900/15 backdrop-blur-[0.5px] flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-[#E11D48] text-white flex items-center justify-center shadow-xs">
                        <Check size={10} strokeWidth={3} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Template Info */}
                <div className="min-w-0 pr-1">
                  <span className={`block text-xs font-bold truncate ${isSelected ? 'text-rose-900' : 'text-slate-800'}`}>
                    {tpl.name}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {tpl.badge && (
                      <span className="text-[10px] text-slate-500 font-medium truncate">
                        {tpl.badge}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => scroll('right')}
          className="absolute right-0 z-10 w-7 h-7 rounded-full bg-white/90 shadow-md border border-slate-200 text-slate-700 flex items-center justify-center -mr-2.5 opacity-0 group-hover:opacity-100 transition cursor-pointer hover:bg-white"
          aria-label="Scroll right"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
