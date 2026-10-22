import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Check, AlertCircle, X, ChevronDown, Loader2, Plus } from 'lucide-react';
import { searchCities, searchCitiesLive, getCanonicalCity, formatCustomPlace, INDIAN_STATES, type CityItem } from '../../data/indianCities';

interface CityAutocompleteProps {
  value: string;
  onChange: (cityWithState: string) => void;
  onSelect?: (item: CityItem) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  icon?: React.ReactNode;
  error?: string | null;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  autoFocus?: boolean;
}

export const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  value,
  onChange,
  onSelect,
  placeholder = 'Type to search city, town, village or pincode...',
  className = '',
  inputClassName = '',
  icon,
  error: externalError,
  required = false,
  disabled = false,
  id,
  name,
  autoFocus = false,
}) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [suggestions, setSuggestions] = useState<CityItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [openUpward, setOpenUpward] = useState(false);
  const [isLiveLoading, setIsLiveLoading] = useState(false);

  // Custom Village/Town entry state
  const [isCustomFormOpen, setIsCustomFormOpen] = useState(false);
  const [customVillageName, setCustomVillageName] = useState('');
  const [customState, setCustomState] = useState('Maharashtra');
  const [customFormError, setCustomFormError] = useState<string | null>(null);
  const customInputRef = useRef<HTMLInputElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const blurTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Clean up debounce timer and abort controller on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  // Measure available vertical space below input to flip upward if viewport bottom is close
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // If less than 260px below and there's more space above, open upwards
      if (spaceBelow < 260 && rect.top > spaceBelow) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }
    }
  }, [isOpen, suggestions.length, isCustomFormOpen]);

  // Sync internal input value when external value changes
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  // Focus custom input when form opens
  useEffect(() => {
    if (isCustomFormOpen) {
      setTimeout(() => {
        customInputRef.current?.focus();
      }, 50);
    }
  }, [isCustomFormOpen]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (isOpen) {
          setIsOpen(false);
          setIsCustomFormOpen(false);
          validateAndCommit();
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, inputValue, isCustomFormOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputValue(text);
    setInternalError(null);
    setIsCustomFormOpen(false);

    // Cancel previous live lookup timer and in-flight request
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    const trimmed = text.trim();
    if (trimmed.length > 0) {
      // 1. Instant 0ms Local Results from top Indian cities/talukas
      const localResults = searchCities(trimmed, 10);
      setSuggestions(localResults);
      setIsOpen(true);
      setHighlightedIndex(-1);

      // 2. Free API Live Lookup if 2+ letters typed (debounced 250ms)
      if (trimmed.length >= 2) {
        setIsLiveLoading(true);
        debounceTimerRef.current = setTimeout(async () => {
          const controller = new AbortController();
          abortControllerRef.current = controller;
          try {
            const liveResults = await searchCitiesLive(trimmed, 16, controller.signal);
            if (!controller.signal.aborted) {
              setSuggestions(liveResults);
              if (liveResults.length > 0) {
                setIsOpen(true);
              }
            }
          } catch {
            // Keep localResults on error
          } finally {
            setIsLiveLoading(false);
          }
        }, 250);
      } else {
        setIsLiveLoading(false);
      }
    } else {
      setIsLiveLoading(false);
      setSuggestions([]);
      setIsOpen(false);
      onChange('');
    }
  };

  const selectCity = (cityItem: CityItem) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (abortControllerRef.current) abortControllerRef.current.abort();
    setIsLiveLoading(false);

    const chosen = cityItem.displayName;
    setInputValue(chosen);
    setIsOpen(false);
    setIsCustomFormOpen(false);
    setSuggestions([]);
    setInternalError(null);
    onChange(chosen);
    if (onSelect) onSelect(cityItem);
  };

  const openCustomForm = (prefill = '') => {
    const cleanLetters = prefill.replace(/[0-9]/g, '').trim().slice(0, 50);
    const parts = cleanLetters.split(',').map((s) => s.trim());
    if (parts.length >= 2) {
      setCustomVillageName(parts[0]);
      const matchedState = INDIAN_STATES.find(
        (st) => st.toLowerCase() === parts[parts.length - 1].toLowerCase()
      );
      if (matchedState) setCustomState(matchedState);
    } else {
      setCustomVillageName(cleanLetters);
    }
    setCustomFormError(null);
    setIsCustomFormOpen(true);
  };

  const handleConfirmCustomVillage = () => {
    const trimmed = customVillageName.trim();
    if (!trimmed || trimmed.length < 2) {
      setCustomFormError('Village or town name must have at least 2 letters');
      return;
    }
    if (trimmed.length > 50) {
      setCustomFormError('Village or town name cannot exceed 50 characters');
      return;
    }
    if (/\d/.test(trimmed)) {
      setCustomFormError('Numbers are not allowed in village or town names');
      return;
    }

    const formattedCity = formatCustomPlace(trimmed);
    const displayName = customState ? `${formattedCity}, ${customState}` : formattedCity;
    const item: CityItem = {
      city: formattedCity,
      state: customState || '',
      country: 'India',
      displayName,
    };

    setInputValue(displayName);
    setIsOpen(false);
    setIsCustomFormOpen(false);
    setSuggestions([]);
    setInternalError(null);
    onChange(displayName);
    if (onSelect) onSelect(item);
  };

  const handleSaveCustomValue = (rawInput?: string) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (abortControllerRef.current) abortControllerRef.current.abort();
    setIsLiveLoading(false);

    const text = (rawInput !== undefined ? rawInput : inputValue).trim();
    if (!text) {
      setInternalError(null);
      onChange('');
      setIsOpen(false);
      return;
    }

    if (/^\d+$/.test(text)) {
      setInternalError('Please select a village/city from the suggestions or enter a valid name (numbers are not allowed)');
      return;
    }

    if (/\d/.test(text)) {
      setInternalError('Numbers are not allowed in village or city names');
      return;
    }

    if (text.length < 2) {
      setInternalError('Place name must have at least 2 letters');
      return;
    }

    if (text.length > 50) {
      setInternalError('Place name cannot exceed 50 characters');
      return;
    }

    const formatted = formatCustomPlace(text);
    const parts = formatted.split(',').map((s) => s.trim());
    const city = parts[0] || formatted;
    const state = parts[1] || '';

    const item: CityItem = {
      city,
      state,
      country: 'India',
      displayName: formatted,
    };

    setInputValue(formatted);
    setIsOpen(false);
    setIsCustomFormOpen(false);
    setSuggestions([]);
    setInternalError(null);
    onChange(formatted);
    if (onSelect) onSelect(item);
  };

  const validateAndCommit = () => {
    if (isCustomFormOpen) return; // Do not auto-commit if user is using the custom village form

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (abortControllerRef.current) abortControllerRef.current.abort();
    setIsLiveLoading(false);

    const trimmed = inputValue.trim();
    if (!trimmed) {
      setInternalError(null);
      onChange('');
      return;
    }

    // Pure numbers (like pincodes) cannot be committed as a city name
    if (/^\d+$/.test(trimmed)) {
      setInternalError('Please select a village/city from the suggestions or enter a valid name (numbers are not allowed)');
      return;
    }

    if (/\d/.test(trimmed)) {
      setInternalError('Numbers are not allowed in village or city names');
      return;
    }

    if (trimmed.length < 2) {
      setInternalError('Place name must have at least 2 letters');
      return;
    }

    if (trimmed.length > 50) {
      setInternalError('Place name cannot exceed 50 characters');
      return;
    }

    const canonical = getCanonicalCity(trimmed);
    if (canonical) {
      setInputValue(canonical);
      setInternalError(null);
      onChange(canonical);
    } else {
      const letters = trimmed.match(/[a-zA-Z\u0900-\u0D7F]/g);
      if (letters && letters.length >= 2) {
        const formatted = formatCustomPlace(trimmed);
        setInputValue(formatted);
        setInternalError(null);
        onChange(formatted);
      } else {
        setInternalError('Please enter a valid place name (letters only)');
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isCustomFormOpen) return;

    const trimmed = inputValue.trim();
    const hasCustomOption = trimmed.length >= 2;
    const maxIndex = suggestions.length + (hasCustomOption ? 1 : 0);

    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'ArrowDown') {
        const results = searchCities(inputValue || '', 8);
        if (results.length > 0) {
          setSuggestions(results);
          setIsOpen(true);
        }
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < maxIndex - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : maxIndex - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          selectCity(suggestions[highlightedIndex]);
        } else if (hasCustomOption) {
          handleSaveCustomValue(inputValue);
        } else {
          validateAndCommit();
          setIsOpen(false);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      case 'Tab':
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          selectCity(suggestions[highlightedIndex]);
        } else {
          setIsOpen(false);
          validateAndCommit();
        }
        break;
    }
  };

  const handleFocus = () => {
    if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
    if (inputValue.trim().length > 0) {
      const results = searchCities(inputValue, 8);
      setSuggestions(results);
      setIsOpen(true);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputValue('');
    setSuggestions([]);
    setIsOpen(false);
    setIsCustomFormOpen(false);
    setInternalError(null);
    onChange('');
    inputRef.current?.focus();
  };

  const displayError = externalError || internalError;

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative flex items-center">
        {/* Left Icon */}
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 z-10 flex items-center justify-center">
          {icon || <MapPin size={18} className={displayError ? 'text-rose-500' : 'text-rose-400'} />}
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="text"
          autoComplete="off"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoFocus={autoFocus}
          className={`w-full pl-10 pr-9 py-2.5 rounded-xl border text-xs font-semibold text-slate-900 transition-all outline-none ${
            displayError
              ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-400/20'
              : 'border-slate-200 bg-white hover:border-pink-300 focus:border-[#F01472] focus:ring-2 focus:ring-pink-500/15'
          } ${disabled ? 'opacity-60 bg-slate-50 cursor-not-allowed' : ''} ${inputClassName}`}
        />

        {/* Right Action (Clear, Loading Spinner, or Dropdown arrow) */}
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10">
          {isLiveLoading && (
            <span title="Searching live maps...">
              <Loader2 size={13} className="text-[#F01472] animate-spin shrink-0" />
            </span>
          )}
          {inputValue && !disabled ? (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              title="Clear city"
            >
              <X size={13} />
            </button>
          ) : (
            <ChevronDown size={14} className="text-slate-300 pointer-events-none" />
          )}
        </div>
      </div>

      {/* Floating Autocomplete Dropdown */}
      {isOpen && (
        <div className={`absolute left-0 right-0 ${
          openUpward ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
        } bg-white rounded-2xl shadow-2xl border border-pink-200/80 overflow-hidden z-[80] animate-fadeIn max-h-80 sm:max-h-96 overflow-y-auto ring-1 ring-black/5`}>
          {isCustomFormOpen ? (
            /* Custom Village / Town Form with No-Numeric & Length Constraints */
            <div className="p-3.5 bg-white space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-pink-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <MapPin size={14} className="text-[#F01472]" />
                  <span>Enter Custom Village or Town</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCustomFormOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition cursor-pointer"
                  title="Back"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Village/Town Name Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <label className="font-semibold text-slate-700">
                    Village / Town Name <span className="text-rose-500">*</span>
                  </label>
                  <span className={`text-[10px] font-medium ${customVillageName.length >= 45 ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                    {customVillageName.length} / 50
                  </span>
                </div>
                <input
                  ref={customInputRef}
                  type="text"
                  maxLength={50}
                  value={customVillageName}
                  onChange={(e) => {
                    // Strictly strip any numeric digits (0-9)
                    const filtered = e.target.value.replace(/[0-9]/g, '');
                    setCustomVillageName(filtered);
                    if (customFormError) setCustomFormError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleConfirmCustomVillage();
                    } else if (e.key === 'Escape') {
                      e.preventDefault();
                      setIsCustomFormOpen(false);
                    }
                  }}
                  placeholder="e.g. Adyal, Sihora, Pimpalgaon"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:border-[#F01472] focus:ring-2 focus:ring-pink-500/15 outline-none"
                />
                <p className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Letters only (no numbers allowed)</span>
                  <span>Min 2 - Max 50 chars</span>
                </p>
              </div>

              {/* State Selector */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-700">
                  State / Region <span className="text-rose-500">*</span>
                </label>
                <select
                  value={customState}
                  onChange={(e) => setCustomState(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:border-[#F01472] focus:ring-2 focus:ring-pink-500/15 outline-none bg-white cursor-pointer"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {customFormError && (
                <div className="flex items-center gap-1.5 text-rose-500 text-[11px] font-semibold bg-rose-50 p-2 rounded-lg">
                  <AlertCircle size={13} className="shrink-0" />
                  <span>{customFormError}</span>
                </div>
              )}

              {/* Form Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCustomFormOpen(false)}
                  className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={customVillageName.trim().length < 2}
                  onClick={handleConfirmCustomVillage}
                  className={`flex-1 py-2 px-3 rounded-xl text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md ${
                    customVillageName.trim().length >= 2
                      ? 'bg-gradient-to-r from-[#F01472] to-rose-600 shadow-rose-200 hover:opacity-95 cursor-pointer'
                      : 'bg-slate-300 shadow-none cursor-not-allowed'
                  }`}
                >
                  <Check size={14} />
                  <span>Add & Select</span>
                </button>
              </div>
            </div>
          ) : (
            /* Normal Suggestions list or Empty State */
            <>
              {suggestions.length > 0 && (
                <>
                  <div className="px-3 py-1.5 bg-pink-50/50 border-b border-pink-100/60 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span>City Recommendations</span>
                      {isLiveLoading && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-medium text-[#F01472] normal-case bg-pink-100/80 px-1.5 py-0.5 rounded-full">
                          <Loader2 size={9} className="animate-spin" />
                          Live search...
                        </span>
                      )}
                    </span>
                    <span>Select from list</span>
                  </div>
                  <div className="py-1">
                    {suggestions.map((item, index) => {
                      const isHighlighted = index === highlightedIndex;
                      const isSelected = value?.toLowerCase() === item.displayName.toLowerCase();

                      return (
                        <button
                          key={`${item.displayName}-${index}`}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            selectCity(item);
                          }}
                          onMouseEnter={() => setHighlightedIndex(index)}
                          className={`w-full px-3.5 py-2 text-left flex items-center justify-between gap-2 transition cursor-pointer ${
                            isHighlighted ? 'bg-pink-50 text-[#F01472]' : 'hover:bg-pink-50/50 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition ${
                                isHighlighted || isSelected
                                  ? 'bg-rose-500 text-white shadow-xs'
                                  : 'bg-rose-50 text-[#F01472]'
                              }`}
                            >
                              <MapPin size={13} />
                            </div>
                            <div className="truncate">
                              <p className="text-xs font-bold text-slate-900 truncate">
                                {item.city}
                              </p>
                              <p className="text-[10px] text-slate-400 font-medium truncate">
                                {item.state} • {item.country}
                              </p>
                            </div>
                          </div>

                          {isSelected && (
                            <span className="shrink-0 text-emerald-600 bg-emerald-50 p-1 rounded-full">
                              <Check size={12} />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Action Button at Bottom or Empty State: Add Custom Village */}
              {inputValue.trim().length >= 2 && (
                <div className={`p-2 bg-gradient-to-r from-pink-50/60 to-rose-50/40 ${suggestions.length > 0 ? 'border-t border-pink-100' : ''}`}>
                  {suggestions.length === 0 && (
                    <div className="px-2 py-1.5 mb-1.5 text-center">
                      {isLiveLoading ? (
                        <div className="flex items-center justify-center gap-2 text-slate-600">
                          <Loader2 size={15} className="text-[#F01472] animate-spin shrink-0" />
                          <p className="text-xs font-semibold text-slate-700">Searching live maps across India...</p>
                        </div>
                      ) : (
                        <p className="text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5">
                          <MapPin size={13} className="text-[#F01472]" />
                          <span>Village / Town not in standard list?</span>
                        </p>
                      )}
                    </div>
                  )}

                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSaveCustomValue(inputValue);
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSaveCustomValue(inputValue);
                    }}
                    onMouseEnter={() => setHighlightedIndex(suggestions.length)}
                    className={`w-full px-3 py-2.5 text-left flex items-center justify-between gap-2 rounded-xl transition cursor-pointer ${
                      highlightedIndex === suggestions.length
                        ? 'bg-pink-100 text-[#F01472]'
                        : 'hover:bg-pink-100/70 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[#F01472]/15 text-[#F01472] flex items-center justify-center shrink-0">
                        <Plus size={15} className="stroke-[2.5]" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {/\d/.test(inputValue.trim())
                            ? 'Enter Custom Village or Town Name'
                            : `Add "${formatCustomPlace(inputValue.trim()).slice(0, 30)}" as Custom Village`}
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium">
                          Letters only (no numbers allowed) • Click to save what you wrote
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 text-[10px] font-bold text-white bg-gradient-to-r from-[#F01472] to-rose-600 px-3 py-1 rounded-full shadow-xs hover:opacity-95 flex items-center gap-1">
                      <Check size={11} className="stroke-[3]" />
                      <span>Use "{formatCustomPlace(inputValue.trim()).slice(0, 15)}"</span>
                    </span>
                  </button>

                  <div className="flex items-center justify-between px-1 pt-1.5 text-[11px] text-slate-400 border-t border-pink-100/60 mt-1">
                    <span>Need to pick state from a list?</span>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openCustomForm(inputValue);
                      }}
                      className="text-[#F01472] font-bold hover:underline cursor-pointer"
                    >
                      Choose State Dropdown
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Error Message */}
      {displayError && (
        <div className="flex items-center gap-1.5 text-rose-500 text-[11px] font-semibold mt-1.5 pl-1 animate-fadeIn">
          <AlertCircle size={13} className="shrink-0" />
          <span>{displayError}</span>
        </div>
      )}
    </div>
  );
};
