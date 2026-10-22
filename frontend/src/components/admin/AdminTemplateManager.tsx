import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Search,
  Edit,
  Copy,
  Trash2,
  Crown,
  RefreshCw,
} from 'lucide-react';
import {
  adminListTemplatesApi,
  adminCreateTemplateApi,
  adminDuplicateTemplateApi,
  adminDeleteTemplateApi,
  adminUpdateTemplateApi,
  getTemplateDetailApi,
  DEFAULT_MARATHI_BIODATA_ELEMENTS,
  type TemplateItem,
} from '../../services/templateService';
import { getAssetUrl } from '../../config/api';
import { TemplateBuilder } from './TemplateBuilder';
import { TemplatePreviewModal } from '../templates/TemplatePreviewModal';
import { BiodataRenderer, DEFAULT_FEMALE_SAMPLE } from '../rendering/BiodataRenderer';
import { TEN_DUMMY_PROFILES } from '../../utils/dummyBiodataProfiles';
import { Eye } from 'lucide-react';

export const AdminTemplateManager: React.FC = () => {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTemplate, setEditingTemplate] = useState<TemplateItem | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateItem | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async (forceRefresh = false) => {
    setLoading(true);
    const data = await adminListTemplatesApi(forceRefresh);
    setTemplates(data);
    setLoading(false);
  };

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('New Royal Biodata');
  const [newTemplateCategory, setNewTemplateCategory] = useState('traditional');
  const [newTemplatePricing, setNewTemplatePricing] = useState<'FREE' | 'PREMIUM'>('FREE');
  const [selectedBgItem, setSelectedBgItem] = useState<string>('/templates/gold_parchment_mandala.png');
  const [customBgUpload, setCustomBgUpload] = useState<string>('');

  const handleCreateFromBackground = async () => {
    const bgUrl = customBgUpload || selectedBgItem;
    const newTpl = await adminCreateTemplateApi({
      name: newTemplateName || 'New Biodata Template',
      status: 'DRAFT',
      pricing_type: newTemplatePricing,
      font_family: 'Playfair Display',
      default_accent: '#B45309',
      default_bg: '#FFFFFF',
      thumbnail_url: bgUrl || undefined,
      layout_json: {
        page: {
          width: 794,
          height: 1123,
          background: '#FFFFFF',
          backgroundType: bgUrl ? 'image' : 'color',
          backgroundImage: bgUrl || undefined,
          backgroundFit: 'cover',
          backgroundLocked: true,
          padding: 40,
          safeArea: { top: 55, right: 40, bottom: 55, left: 40 },
          fontFamily: 'Playfair Display',
          selectedDummyIndex: 0,
          sampleData: TEN_DUMMY_PROFILES[0].data,
        },
        elements: DEFAULT_MARATHI_BIODATA_ELEMENTS,
      },
    });

    if (newTpl) {
      setTemplates([newTpl, ...templates]);
      setIsCreateModalOpen(false);
      setEditingTemplate(newTpl);
    } else {
      alert('Failed to create new template');
    }
  };

  const handleDuplicate = async (id: string) => {
    const duplicated = await adminDuplicateTemplateApi(id);
    if (duplicated) {
      setTemplates([duplicated, ...templates]);
    } else {
      alert('Failed to duplicate template');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete template '${name}'?`)) return;
    const ok = await adminDeleteTemplateApi(id);
    if (ok) {
      setTemplates(templates.filter((t) => t.id !== id));
    } else {
      alert('Failed to delete template');
    }
  };

  const handleOpenPreview = async (tpl: TemplateItem) => {
    if (!tpl.layout_json) {
      const full = await getTemplateDetailApi(tpl.id);
      setPreviewTemplate(full || tpl);
    } else {
      setPreviewTemplate(tpl);
    }
  };

  const handleOpenBuilder = async (tpl: TemplateItem) => {
    if (!tpl.layout_json) {
      const full = await getTemplateDetailApi(tpl.id);
      setEditingTemplate(full || tpl);
    } else {
      setEditingTemplate(tpl);
    }
  };

  const handleToggleStatus = async (tpl: TemplateItem) => {
    const nextStatus = tpl.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    const updated = await adminUpdateTemplateApi(tpl.id, { status: nextStatus });
    if (updated) {
      setTemplates(templates.map((t) => (t.id === tpl.id ? { ...t, status: nextStatus } : t)));
    }
  };

  const filteredTemplates = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Render Full Screen Builder view if editing
  if (editingTemplate) {
    return (
      <TemplateBuilder
        template={editingTemplate}
        onBack={() => {
          setEditingTemplate(null);
          loadTemplates();
        }}
        onSaved={(updated) => {
          setEditingTemplate(updated);
          loadTemplates();
        }}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="text-[#F01472]" size={22} />
            <span>Template Management & Visual Builder</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Design, edit, and publish drag-and-drop matrimonial biodata templates with dynamic placeholder bindings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadTemplates(true)}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            title="Refresh templates list"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#F01472] to-purple-600 text-white font-bold text-xs shadow-lg shadow-pink-500/25 hover:opacity-95 transition flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} />
            <span>Create From Background</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Filter admin templates by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-slate-200 text-xs font-medium text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50"
        />
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50/80 rounded-2xl animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-14 bg-slate-200 rounded-lg shrink-0" />
                  <div className="space-y-1.5">
                    <div className="w-36 h-3.5 bg-slate-200 rounded" />
                    <div className="w-24 h-2.5 bg-slate-200 rounded" />
                  </div>
                </div>
                <div className="w-16 h-6 bg-slate-200 rounded-full" />
                <div className="w-20 h-6 bg-slate-200 rounded-full" />
                <div className="w-8 h-4 bg-slate-200 rounded" />
                <div className="w-24 h-8 bg-slate-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium text-xs">
            No templates found.
            <button
              onClick={() => loadTemplates(true)}
              className="ml-2 text-pink-600 font-bold underline cursor-pointer"
            >
              Refresh List
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Template</th>
                  <th className="py-4 px-6">Pricing</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Version</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredTemplates.map((tpl) => (
                  <tr key={tpl.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-6 flex items-center gap-3">
                      {tpl.layout_json ? (
                        <div className="w-9 h-12 rounded-lg border border-slate-200 shadow-2xs shrink-0 overflow-hidden bg-white flex items-start justify-center select-none pointer-events-none">
                          <BiodataRenderer
                            layoutJson={tpl.layout_json}
                            data={(tpl.layout_json?.page as any)?.sampleData || (tpl.layout_json as any)?.sampleData || DEFAULT_FEMALE_SAMPLE}
                            scale={36 / 794}
                          />
                        </div>
                      ) : tpl.thumbnail_url ? (
                        <img
                          src={getAssetUrl(tpl.thumbnail_url)}
                          alt={tpl.name}
                          loading="lazy"
                          className="w-9 h-12 object-cover rounded-lg border border-slate-200 shadow-2xs shrink-0 bg-slate-100"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-9 h-12 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center text-lg shrink-0">
                          {tpl.preview_icon || '📄'}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>{tpl.name}</span>
                          {tpl.badge && (
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-extrabold">
                              {tpl.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">{tpl.id}</div>
                        {(() => {
                          const sIdx = (tpl.layout_json?.page as any)?.selectedDummyIndex;
                          const sName = (tpl.layout_json?.page as any)?.sampleData?.personalDetails?.fullName ||
                            (typeof sIdx === 'number' && TEN_DUMMY_PROFILES[sIdx] ? TEN_DUMMY_PROFILES[sIdx].data.personalDetails.fullName : null);
                          if (!sName) return null;
                          return (
                            <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-[#F01472] bg-pink-50 border border-pink-200/80 px-2 py-0.5 rounded-md w-fit">
                              <Eye size={10} />
                              <span>Live: {sName}</span>
                            </div>
                          );
                        })()}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      {tpl.pricing_type === 'PREMIUM' ? (
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-extrabold text-[10px] flex items-center gap-1 w-fit">
                          <Crown size={11} /> PREMIUM
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] w-fit">
                          FREE
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleStatus(tpl)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase transition cursor-pointer ${
                          tpl.status === 'PUBLISHED'
                            ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        {tpl.status}
                      </button>
                    </td>

                    <td className="py-4 px-6 font-mono text-slate-500">v{tpl.version}</td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenPreview(tpl)}
                          className="px-2.5 py-1.5 rounded-xl border border-pink-200 text-pink-600 bg-pink-50/70 hover:bg-pink-100 font-bold transition flex items-center gap-1 cursor-pointer"
                          title="Preview Live Biodata Template"
                        >
                          <Eye size={13} />
                          <span>Preview</span>
                        </button>
                        <button
                          onClick={() => handleOpenBuilder(tpl)}
                          className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition flex items-center gap-1 cursor-pointer"
                          title="Open Visual Builder Editor"
                        >
                          <Edit size={13} />
                          <span>Builder</span>
                        </button>
                        <button
                          onClick={() => handleDuplicate(tpl.id)}
                          className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                          title="Duplicate Template"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(tpl.id, tpl.name)}
                          className="p-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Delete Template"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Template From Background Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-pink-100 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Create Template From Background</h3>
                <p className="text-xs text-slate-500">Pick a background pattern or upload custom artwork. The layout fields remain independent.</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Template Name</label>
                <input
                  type="text"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="e.g. Royal Golden Heritage"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Pricing Model</label>
                  <select
                    value={newTemplatePricing}
                    onChange={(e) => setNewTemplatePricing(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="FREE">Free Tier</option>
                    <option value="PREMIUM">👑 Pro / Premium</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newTemplateCategory}
                    onChange={(e) => setNewTemplateCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="traditional">Traditional</option>
                    <option value="royal">Royal</option>
                    <option value="floral">Floral</option>
                    <option value="luxury">Luxury</option>
                    <option value="modern">Modern</option>
                    <option value="cultural">Cultural</option>
                    <option value="wedding">Wedding</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Select Background Artwork</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 max-h-48 overflow-y-auto p-1 border border-slate-100 rounded-2xl bg-slate-50">
                  {[
                    { name: 'Traditional Gold', src: '/templates/gold_parchment_mandala.png' },
                    { name: 'Royal Red', src: '/templates/red_mandala.png' },
                    { name: 'Floral Ganesha', src: '/templates/floral_ganesha.jpg' },
                    { name: 'Pink Lotus', src: '/templates/pink_vintage_lotus.png' },
                    { name: 'Shiv Parvati', src: '/templates/shiv_parvati_lotus.png' },
                    { name: 'Plain White', src: '' },
                  ].map((bg, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedBgItem(bg.src);
                        setCustomBgUpload('');
                      }}
                      className={`p-2 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                        selectedBgItem === bg.src && !customBgUpload
                          ? 'border-pink-500 bg-pink-50 text-pink-700 font-bold ring-2 ring-pink-400/40'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <div className="w-12 h-16 rounded bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center">
                        {bg.src ? (
                          <img src={bg.src} alt={bg.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-slate-400 font-mono">None</span>
                        )}
                      </div>
                      <span className="text-[10px] truncate max-w-[80px]">{bg.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Or Upload Custom Background Image (PNG/JPG/WebP/SVG)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (evt) => {
                        if (evt.target?.result) {
                          setCustomBgUpload(evt.target.result as string);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateFromBackground}
                className="px-5 py-2 rounded-xl bg-[#F01472] hover:bg-[#C80E5A] text-white text-xs font-bold shadow-md shadow-pink-500/25 transition cursor-pointer flex items-center gap-1.5"
              >
                <Plus size={14} /> Create & Open Builder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template Preview Modal */}
      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          isOpen={Boolean(previewTemplate)}
          onClose={() => setPreviewTemplate(null)}
          onSelectTemplate={() => {
            setEditingTemplate(previewTemplate);
            setPreviewTemplate(null);
          }}
        />
      )}
    </div>
  );
};
