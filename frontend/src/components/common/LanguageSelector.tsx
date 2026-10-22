import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Check, Search } from 'lucide-react';
import { useI18n, type Language } from '../../context/I18nContext';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
];

export const LanguageSelector: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { lang: selectedLang, setLang } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode: Language) => {
    setLang(langCode);
    setIsOpen(false);
    setSearchQuery('');
  };

  const activeLang = LANGUAGES.find(l => l.code === selectedLang) || {
    code: selectedLang,
    name: selectedLang.toUpperCase(),
    nativeName: selectedLang.toUpperCase(),
  };

  const filteredLanguages = LANGUAGES.filter(
    l =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`relative inline-block text-left notranslate ${className}`} translate="no" ref={dropdownRef}>
      {/* Language Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-gray-700 bg-white/90 border border-gray-200 hover:border-[#F01472] hover:text-[#F01472] shadow-sm hover:shadow transition-all cursor-pointer"
        aria-expanded={isOpen}
      >
        <Globe size={15} className="text-[#F01472]" />
        <span className="font-bold">{activeLang.nativeName}</span>
        <ChevronDown size={13} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 4 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 w-56 rounded-2xl bg-white border border-pink-100 shadow-2xl shadow-pink-500/10 py-2 overflow-hidden"
          >
            {/* Search Input */}
            <div className="px-2.5 pb-2 border-b border-gray-100">
              <div className="relative flex items-center">
                <Search size={13} className="absolute left-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search language..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-7 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F01472] text-gray-800"
                  autoFocus
                />
              </div>
            </div>

            {/* Language List */}
            <div className="max-h-64 overflow-y-auto py-1">
              {filteredLanguages.map(item => {
                const isSelected = item.code === selectedLang;
                return (
                  <button
                    key={item.code}
                    onClick={() => handleLanguageChange(item.code)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-pink-50 text-[#F01472] font-bold'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-[#F01472]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{item.nativeName}</span>
                      {item.code !== 'en' && (
                        <span className="text-[10px] text-gray-400 font-normal">({item.name})</span>
                      )}
                    </div>
                    {isSelected && <Check size={14} className="text-[#F01472]" />}
                  </button>
                );
              })}

              {filteredLanguages.length === 0 && (
                <div className="px-3 py-4 text-center text-xs text-gray-400">
                  No matching language found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
