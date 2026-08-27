import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Search, X, Globe } from 'lucide-react';
import { type Country, searchCountries, findCountry } from '../../data/countries';

export interface CountrySelectProps {
  value: string;
  onChange: (countryName: string, country?: Country) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
  id?: string;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Select country...',
  required = false,
  disabled = false,
  className = '',
  error,
  id
}) => {
  const generatedId = useId();
  const selectId = id || generatedId;
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedCountry = findCountry(value) || (value ? { code: '', name: value, flag: '🌐', dialCode: '' } : null);
  const filteredCountries = searchCountries(search);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (country: Country) => {
    onChange(country.name, country);
    setIsOpen(false);
    setSearch('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearch('');
    } else if (e.key === 'ArrowDown' && !isOpen) {
      setIsOpen(true);
    }
  };

  return (
    <div className={`space-y-1 relative ${className}`} ref={containerRef}>
      {label && (
        <label htmlFor={selectId} className="block text-xs font-bold text-stone-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          id={selectId}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={label || 'Select country'}
          className={`w-full flex items-center justify-between pl-3 pr-3.5 py-2.5 bg-[#F8F7F2] border rounded-xl text-xs sm:text-sm font-medium transition-all text-left ${
            error
              ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/20'
              : isOpen
              ? 'border-[#176B52] ring-2 ring-[#176B52]/20 bg-white'
              : 'border-stone-300 hover:border-stone-400'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="flex items-center gap-2.5 min-w-0 truncate">
            {selectedCountry ? (
              <>
                <span className="text-base shrink-0 select-none">{selectedCountry.flag}</span>
                <span className="text-[#062C22] truncate">{selectedCountry.name}</span>
                {selectedCountry.dialCode && (
                  <span className="text-[11px] text-stone-400 shrink-0 font-normal">({selectedCountry.dialCode})</span>
                )}
              </>
            ) : (
              <span className="text-stone-400 flex items-center gap-2 truncate">
                <Globe className="w-4 h-4 shrink-0 text-stone-400" />
                <span>{placeholder}</span>
              </span>
            )}
          </div>

          <ChevronDown
            className={`w-4 h-4 text-stone-500 shrink-0 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180 text-[#176B52]' : ''
            }`}
          />
        </button>

        {/* Dropdown Popover */}
        {isOpen && (
          <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white rounded-2xl border border-stone-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Search Input */}
            <div className="p-2 border-b border-stone-100 bg-[#F8F7F2]/80">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search countries..."
                  className="w-full pl-8 pr-7 py-1.5 bg-white border border-stone-200 rounded-xl text-xs text-[#062C22] focus:outline-none focus:border-[#176B52] focus:ring-1 focus:ring-[#176B52]"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
                    aria-label="Clear search"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Countries List */}
            <ul
              role="listbox"
              aria-label="Country list"
              className="max-h-56 overflow-y-auto p-1.5 space-y-0.5 text-xs focus:outline-none scrollbar-thin scrollbar-thumb-stone-200"
            >
              {filteredCountries.length === 0 ? (
                <li className="p-4 text-center text-xs text-stone-400 font-medium">
                  No countries found matching "{search}"
                </li>
              ) : (
                filteredCountries.map((c) => {
                  const isSelected = selectedCountry?.name === c.name || selectedCountry?.code === c.code;
                  return (
                    <li
                      key={c.code}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(c)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#DDEFE8] text-[#0B3D2E] font-bold'
                          : 'hover:bg-[#F8F7F2] text-[#17231F]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="text-base select-none shrink-0">{c.flag}</span>
                        <span className="truncate">{c.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <span className="text-[10px] uppercase text-stone-400 font-mono">{c.code}</span>
                        <span className="text-[11px] text-[#176B52] font-semibold">{c.dialCode}</span>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
    </div>
  );
};
