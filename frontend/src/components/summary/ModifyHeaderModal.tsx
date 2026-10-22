import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Check, RotateCcw, Upload, Trash2, Ban } from 'lucide-react';

export interface HeaderMotifOption {
  id: string;
  icon: string;
  label: string;
  subtitle: string;
  category?: string;
}

export const PRESET_SYMBOLS: HeaderMotifOption[] = [
  // Row 1
  { id: 'ganesha_classic', icon: '/symbols/ganesha_classic.png', label: 'Lord Ganesha', subtitle: 'Classic Lotus', category: 'Ganesha' },
  { id: 'ganesha_golden', icon: '/symbols/ganesha_golden.png', label: 'Lord Ganesha', subtitle: 'Golden Idol', category: 'Ganesha' },
  { id: 'ganesha_modern', icon: '/symbols/ganesha_modern.png', label: 'Lord Ganesha', subtitle: 'Modern Silhouette', category: 'Ganesha' },
  { id: 'ganesha_bal', icon: '/symbols/ganesha_bal.png', label: 'Bal Ganesha', subtitle: 'Auspicious Child Form', category: 'Ganesha' },
  { id: 'ganesha_marble', icon: '/symbols/ganesha_marble.png', label: 'Lord Ganesha', subtitle: 'White Marble Murti', category: 'Ganesha' },
  { id: 'ganesha_mandala', icon: '/symbols/ganesha_mandala.png', label: 'Lord Ganesha', subtitle: 'Sun Mandala', category: 'Ganesha' },
  { id: 'vitthal', icon: '/symbols/vitthal.png', label: 'Lord Vitthal', subtitle: 'Pandharpur Vithoba', category: 'Deity' },
  { id: 'shiva', icon: '/symbols/shiva.png', label: 'Lord Shiva', subtitle: 'Mahadev & Trishul', category: 'Deity' },

  // Row 2
  { id: 'ram', icon: '/symbols/ram.png', label: 'Lord Shri Ram', subtitle: 'Kodanda Rama', category: 'Deity' },
  { id: 'krishna', icon: '/symbols/krishna.png', label: 'Lord Krishna', subtitle: 'Muralidhar Flute', category: 'Deity' },
  { id: 'khandoba', icon: '/symbols/khandoba.png', label: 'Lord Khandoba', subtitle: 'Jejuri Malhar', category: 'Deity' },
  { id: 'jyotiba', icon: '/symbols/jyotiba.png', label: 'Shri Jyotiba', subtitle: 'Kolhapur Changbhala', category: 'Deity' },
  { id: 'mahalaxmi', icon: '/symbols/mahalaxmi.png', label: 'Goddess Mahalaxmi', subtitle: 'Kolhapur Ambabai', category: 'Deity' },
  { id: 'balaji', icon: '/symbols/balaji.png', label: 'Tirupati Balaji', subtitle: 'Venkateshwara Swamy', category: 'Deity' },
  { id: 'swami_samarth_seated', icon: '/symbols/swami_samarth_seated.png', label: 'Swami Samarth', subtitle: 'Akkalkot (Seated)', category: 'Guru' },
  { id: 'swami_samarth_round', icon: '/symbols/swami_samarth_round.png', label: 'Swami Samarth', subtitle: 'Portrait Emblem', category: 'Guru' },

  // Row 3
  { id: 'sai_baba', icon: '/symbols/sai_baba.png', label: 'Shirdi Sai Baba', subtitle: 'Shraddha & Saburi', category: 'Guru' },
  { id: 'om_sun', icon: '/symbols/om_sun.png', label: 'Om', subtitle: 'Surya Seal', category: 'Sacred' },
  { id: 'om_mandala', icon: '/symbols/om_mandala.png', label: 'Om', subtitle: 'Mandala Seal', category: 'Sacred' },
  { id: 'shree_red', icon: '/symbols/shree_red.png', label: 'Shree (श्री)', subtitle: 'Red Auspicious Seal', category: 'Sacred' },
  { id: 'shree_lotus', icon: '/symbols/shree_lotus.png', label: 'Shree (श्री)', subtitle: 'Lotus Emblem', category: 'Sacred' },
  { id: 'swastik_classic', icon: '/symbols/swastik_classic.png', label: 'Swastik', subtitle: 'Traditional Auspicious', category: 'Sacred' },
  { id: 'swastik_gold', icon: '/symbols/swastik_gold.png', label: 'Swastik', subtitle: 'Golden Garland', category: 'Sacred' },
  { id: 'shivaji_maharaj', icon: '/symbols/shivaji_maharaj.png', label: 'Shivaji Maharaj', subtitle: 'Chhatrapati Rajmudra', category: 'Inspiration' },

  // Row 4
  { id: 'buddha_gold', icon: '/symbols/buddha_gold.png', label: 'Lord Buddha', subtitle: 'Golden Bust', category: 'Sacred' },
  { id: 'buddha_lotus', icon: '/symbols/buddha_lotus.png', label: 'Lord Buddha', subtitle: 'Meditation Lotus', category: 'Sacred' },
  { id: 'ambedkar_round', icon: '/symbols/ambedkar_round.png', label: 'Dr. B. R. Ambedkar', subtitle: 'Round Emblem', category: 'Inspiration' },
  { id: 'ambedkar', icon: '/symbols/ambedkar.png', label: 'Dr. B. R. Ambedkar', subtitle: 'Babasaheb', category: 'Inspiration' },
  { id: 'jain_symbol', icon: '/symbols/jain_symbol.png', label: 'Jain Ahimsa Emblem', subtitle: 'Parasparopagraho Jivanam', category: 'Sacred' },
  { id: 'mahavira', icon: '/symbols/mahavira.png', label: 'Lord Mahavira', subtitle: 'Jain Tirthankara', category: 'Sacred' },
  { id: 'islamic_crescent', icon: '/symbols/islamic_crescent.png', label: 'Crescent & Star', subtitle: 'Islamic Symbol', category: 'Sacred' },
  { id: 'islamic_mosque', icon: '/symbols/islamic_mosque.png', label: 'Mosque & Crescent', subtitle: 'Islamic Minarets', category: 'Sacred' },
];

export const PRESET_SHLOKAS: { label: string; text: string; category?: string }[] = [
  { label: 'Ganesh (Default)', text: '|| Shri Ganeshay Namah: ||' },
  { label: 'Shree Ganeshaya', text: '|| Shree Ganeshaya Namah ||' },
  { label: 'श्री गणेशाय नमः', text: '|| श्री गणेशाय नमः ||' },
  { label: 'Shiva', text: '|| Om Namah Shivaya ||' },
  { label: 'ॐ नमः शिवाय', text: '|| ॐ नमः शिवाय ||' },
  { label: 'Lord Vitthal', text: '|| Jai Hari Vitthal ||' },
  { label: 'Radha Krishna', text: '|| Shri Radhe Krishna ||' },
  { label: 'Shri Ram', text: '|| Jai Shree Ram ||' },
  { label: 'Swami Samarth', text: '|| Shri Swami Samarth ||' },
  { label: 'Sai Baba', text: '|| Om Sai Ram ||' },
  { label: 'Khandoba / Malhar', text: '|| Yelkot Yelkot Jai Malhar ||' },
  { label: 'Jyotiba', text: '|| Shri Jyotiba Prasanna ||' },
  { label: 'Mahalaxmi', text: '|| Shri Mahalaxmi Prasanna ||' },
  { label: 'Tirupati Balaji', text: '|| Om Namo Venkateshaya ||' },
  { label: 'Shivaji Maharaj', text: '|| Jai Bhavani Jai Shivaji ||' },
  { label: 'Lord Buddha', text: '|| Buddham Saranam Gacchami ||' },
  { label: 'Jai Jinendra (Jain)', text: '|| Jai Jinendra ||' },
  { label: 'Bismillah (Islamic)', text: '|| Bismillah-ir-Rahman-ir-Rahim ||' },
  { label: 'Ek Onkar (Sikh)', text: '|| Ek Onkar Satnam ||' },
  { label: 'Mata Di', text: '|| Jai Mata Di ||' },
  { label: 'Vakratunda Shloka', text: '|| Vakratunda Mahakaya Suryakoti Samaprabha ||' },
  { label: 'Shubh Vivah', text: '|| Shubh Vivah ||' },
  { label: 'Universal (English)', text: '|| In the Name of God ||' },
];

export const isImageSymbol = (val?: string): boolean => {
  if (!val) return false;
  return (
    val.startsWith('data:image') ||
    val.startsWith('http://') ||
    val.startsWith('https://') ||
    val.startsWith('/') ||
    val.startsWith('blob:')
  );
};

export const DEFAULT_SYMBOL = '/symbols/ganesha_golden.png';

interface ModifyHeaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSymbol?: string;
  initialShloka?: string;
  onApply: (symbol: string, shloka: string) => void;
}

export const ModifyHeaderModal: React.FC<ModifyHeaderModalProps> = ({
  isOpen,
  onClose,
  initialSymbol = DEFAULT_SYMBOL,
  initialShloka = '|| Shri Ganeshay Namah: ||',
  onApply,
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>(initialSymbol || DEFAULT_SYMBOL);
  const [shlokaText, setShlokaText] = useState<string>(initialShloka || '|| Shri Ganeshay Namah: ||');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      let sym = initialSymbol || DEFAULT_SYMBOL;
      if (sym === '🙏' || sym === 'dYT?' || sym === 'ganesha') {
        sym = DEFAULT_SYMBOL;
      }
      setSelectedSymbol(sym);
      setShlokaText(initialShloka || '|| Shri Ganeshay Namah: ||');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isOpen, initialSymbol, initialShloka]);

  if (!isOpen) return null;

  const isNone = selectedSymbol === 'none' || selectedSymbol === '🚫' || !selectedSymbol;
  const isCustomUploaded =
    !isNone &&
    (selectedSymbol.startsWith('data:') ||
      selectedSymbol.startsWith('blob:') ||
      (!selectedSymbol.startsWith('/symbols/') && !PRESET_SYMBOLS.some((s) => s.icon === selectedSymbol)));

  const matchedPreset = PRESET_SYMBOLS.find(
    (s) => s.icon === selectedSymbol || s.id === selectedSymbol
  );

  const handleSelectSymbol = (symbolValue: string) => {
    setSelectedSymbol(symbolValue);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size exceeds 5MB. Please upload a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target?.result as string;
      if (dataUrl) {
        setSelectedSymbol(dataUrl);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveCustomImage = () => {
    setSelectedSymbol(DEFAULT_SYMBOL);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleResetToDefault = () => {
    setSelectedSymbol(DEFAULT_SYMBOL);
    setShlokaText('|| Shri Ganeshay Namah: ||');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    const finalSymbol = isNone ? '' : selectedSymbol;
    onApply(finalSymbol, shlokaText.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-pink-200 flex flex-col my-auto max-h-[92vh]">
        {/* Brand Header Gradient: #F01472 to #C80E5A */}
        <div className="bg-gradient-to-r from-[#F01472] to-[#C80E5A] px-6 py-4 flex items-center justify-between text-white shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-lg shadow-xs text-white">
              <Sparkles size={18} className="text-white drop-shadow-xs" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Modify Sacred Header & Symbol
              </h2>
              <p className="text-xs text-pink-100 font-medium">
                Choose the auspicious motif symbol and blessing shloka for your biodata
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 bg-gradient-to-b from-pink-50/20 via-white to-pink-50/15">
          {/* Live Preview Box */}
          <div className="bg-gradient-to-r from-pink-50/80 via-rose-50/60 to-pink-50/80 border border-pink-200/80 rounded-2xl p-4 text-center shadow-xs">
            <span className="text-[11px] font-bold text-[#F01472] uppercase tracking-widest block mb-2 opacity-90">
              Live Preview (As displayed on Biodata)
            </span>

            <div className="flex items-center justify-center gap-3 flex-wrap min-h-11">
              {!isNone && (
                <div className="w-10 h-10 flex items-center justify-center shrink-0">
                  {isImageSymbol(selectedSymbol) ? (
                    <img
                      src={selectedSymbol}
                      alt="Sacred Symbol"
                      className="max-h-full max-w-full object-contain filter drop-shadow-xs transition-transform transform hover:scale-110 inline-block"
                    />
                  ) : (
                    <span className="text-2xl filter drop-shadow-xs transition-transform transform hover:scale-110">
                      {selectedSymbol}
                    </span>
                  )}
                </div>
              )}
              <span
                className="font-serif font-bold text-base md:text-lg tracking-wide text-[#9E0B46] drop-shadow-xs"
                style={{ fontFamily: 'Cinzel, Georgia, serif' }}
              >
                {shlokaText || '|| Shri Ganeshay Namah: ||'}
              </span>
            </div>
          </div>

          {/* Step 1: Sacred Symbol Grid */}
          <div>
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-pink-100 text-[#F01472] text-xs font-bold inline-flex items-center justify-center border border-pink-200">
                  1
                </span>
                Select Sacred Symbol
              </label>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 flex items-center gap-1.5">
                  Selected:{' '}
                  {isNone ? (
                    <span className="font-bold text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-md border border-gray-200 text-xs">
                      None (Text Only)
                    </span>
                  ) : isCustomUploaded ? (
                    <span className="inline-flex items-center gap-1.5 font-bold text-[#F01472] bg-pink-50 px-2.5 py-0.5 rounded-md border border-pink-200 text-xs shadow-2xs">
                      <img src={selectedSymbol} alt="Custom Symbol" className="w-4 h-4 object-contain rounded-xs inline-block" />
                      Custom Image
                    </span>
                  ) : matchedPreset ? (
                    <span className="inline-flex items-center gap-1.5 font-bold text-[#F01472] bg-pink-50 px-2.5 py-0.5 rounded-md border border-pink-200 text-xs shadow-2xs">
                      <img src={matchedPreset.icon} alt={matchedPreset.label} className="w-4 h-4 object-contain rounded-xs inline-block" />
                      {matchedPreset.label}
                    </span>
                  ) : (
                    <strong className="text-[#F01472]">{selectedSymbol}</strong>
                  )}
                </span>

                <button
                  type="button"
                  onClick={() => handleSelectSymbol('none')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isNone
                      ? 'bg-gradient-to-r from-[#F01472] to-[#C80E5A] text-white border-transparent shadow-xs font-bold'
                      : 'bg-pink-50/50 text-gray-700 border-pink-200 hover:bg-pink-100 hover:text-[#F01472]'
                  }`}
                  title="Remove symbol (Display shloka text only)"
                >
                  <Ban size={12} className={isNone ? 'text-white' : 'text-[#F01472]'} />
                  <span>No Symbol</span>
                </button>
              </div>
            </div>

            {/* 32 Symbols Grid matching Image 2 */}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 p-2.5 bg-pink-50/30 rounded-xl border border-pink-200/70 shadow-2xs">
              {PRESET_SYMBOLS.map((s) => {
                const isSelected = !isNone && (selectedSymbol === s.icon || selectedSymbol === s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectSymbol(s.icon)}
                    title={`${s.label} (${s.subtitle})`}
                    aria-label={s.label}
                    className={`group relative aspect-square rounded-lg flex items-center justify-center p-1.5 bg-white transition-all cursor-pointer ${
                      isSelected
                        ? 'border-2 border-[#F01472] bg-pink-50/60 shadow-md ring-2 ring-[#F01472]/25 scale-[1.03]'
                        : 'border border-gray-200 hover:border-[#F01472] hover:shadow-xs hover:bg-pink-50/20'
                    }`}
                  >
                    <img
                      src={s.icon}
                      alt={s.label}
                      className="w-full h-full object-contain filter drop-shadow-2xs select-none pointer-events-none transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                    {isSelected && (
                      <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-gradient-to-r from-[#F01472] to-[#C80E5A] text-white rounded-full flex items-center justify-center shadow-xs">
                        <Check size={9} strokeWidth={3.5} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom Symbol Image Upload */}
            <div className="mt-3 bg-white p-3 rounded-xl border border-pink-200/80 flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap shadow-2xs">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="hidden"
              />
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-xs font-semibold text-gray-700 shrink-0">Upload Custom Image:</span>
                <p className="text-[11px] text-gray-500 truncate">
                  Upload any custom deity photo or family emblem (PNG, JPG, SVG, WebP)
                </p>
              </div>

              {isCustomUploaded ? (
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-9 h-9 rounded-lg border border-pink-200 bg-pink-50/60 p-1 flex items-center justify-center shadow-2xs">
                    <img
                      src={selectedSymbol}
                      alt="Uploaded symbol"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#F01472] bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-lg transition-all cursor-pointer"
                  >
                    <Upload size={13} />
                    <span>Change</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveCustomImage}
                    className="p-1.5 text-gray-400 hover:text-[#F01472] hover:bg-pink-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove custom uploaded image"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#F01472] bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-xl transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 shrink-0"
                >
                  <Upload size={13} />
                  <span>Upload Image</span>
                </button>
              )}
            </div>
          </div>

          {/* Step 2: Deity / Shloka Text Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-pink-100 text-[#F01472] text-xs font-bold inline-flex items-center justify-center border border-pink-200">
                  2
                </span>
                Select or Edit Shloka Text
              </label>
              <span className="text-xs text-gray-400">Click any preset or type below</span>
            </div>

            {/* Presets Pills */}
            <div className="flex flex-wrap gap-1.5 mb-3 max-h-36 overflow-y-auto p-1.5 bg-white rounded-xl border border-pink-200/70 shadow-2xs">
              {PRESET_SHLOKAS.map((item, idx) => {
                const isSelected = shlokaText.trim() === item.text.trim();
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setShlokaText(item.text)}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#F01472] to-[#C80E5A] text-white border-transparent shadow-xs font-bold'
                        : 'bg-pink-50/30 text-gray-700 border-pink-100 hover:bg-pink-50 hover:text-[#F01472] hover:border-pink-200'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Custom Input for Shloka */}
            <div>
              <div className="relative">
                <input
                  type="text"
                  value={shlokaText}
                  onChange={(e) => setShlokaText(e.target.value)}
                  placeholder="Enter shloka or heading text"
                  className="w-full text-sm font-semibold border-2 border-pink-200 focus:border-[#F01472] focus:ring-2 focus:ring-[#F01472]/20 rounded-xl px-3.5 py-2.5 bg-white shadow-inner focus:outline-none transition-all text-gray-800"
                />
                {shlokaText && (
                  <button
                    type="button"
                    onClick={() => setShlokaText('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 hover:text-[#F01472] text-xs font-semibold"
                    title="Clear text"
                  >
                    Clear
                  </button>
                )}
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                You can write in English, Devanagari Hindi/Marathi (श्री गणेशाय नमः), Gujarati, or any language.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-pink-50/30 border-t border-pink-200/80 flex items-center justify-between shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-[#F01472] hover:bg-pink-50 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset to Default</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-pink-50 hover:text-[#F01472] rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white rounded-full bg-gradient-to-r from-[#F01472] to-[#C80E5A] hover:from-rose-600 hover:to-rose-700 shadow-md shadow-pink-500/25 transition-all cursor-pointer active:scale-95"
            >
              <Check size={14} strokeWidth={2.5} />
              <span>Apply Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
