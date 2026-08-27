import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { 
  type Country, 
  searchCountries, 
  findCountry, 
  splitPhoneNumber, 
  formatInternationalPhone 
} from '../../data/countries';

export interface PhoneInputProps {
  value: string;
  onChange: (fullPhone: string) => void;
  country?: string;
  onCountryChange?: (countryName: string, country?: Country) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
  id?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  country: countryProp,
  onCountryChange,
  label,
  placeholder = '77 123 4567',
  required = false,
  disabled = false,
  className = '',
  error,
  id
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  // Split initial value
  const parsed = splitPhoneNumber(value, countryProp || 'Sri Lanka');
  
  const [selectedCountry, setSelectedCountry] = useState<Country>(() => {
    if (countryProp) {
      const found = findCountry(countryProp);
      if (found) return found;
    }
    return parsed.country;
  });

  const [nationalNumber, setNationalNumber] = useState<string>(parsed.nationalNumber);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync with countryProp whenever parent changes country (e.g. Country dropdown changed)
  useEffect(() => {
    if (countryProp) {
      const matched = findCountry(countryProp);
      if (matched && matched.name !== selectedCountry.name) {
        setSelectedCountry(matched);
        if (nationalNumber) {
          onChange(formatInternationalPhone(matched.dialCode, nationalNumber));
        }
      }
    }
  }, [countryProp]);

  // Sync internal nationalNumber with incoming external value if updated from outside
  useEffect(() => {
    const fresh = splitPhoneNumber(value, selectedCountry.name);
    if (fresh.nationalNumber !== nationalNumber) {
      setNationalNumber(fresh.nationalNumber);
    }
    if (fresh.country && fresh.country.name !== selectedCountry.name && !countryProp) {
      setSelectedCountry(fresh.country);
    }
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setSearch('');
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isDropdownOpen]);

  const handleCountrySelect = (c: Country) => {
    setSelectedCountry(c);
    setIsDropdownOpen(false);
    setSearch('');
    onCountryChange?.(c.name, c);
    onChange(formatInternationalPhone(c.dialCode, nationalNumber));
  };

  const handleNationalNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Keep numbers, spaces, and hyphens
    const raw = e.target.value.replace(/[^0-9\s-]/g, '');
    // Strip leading 0 if user enters 077...
    const sanitized = raw.startsWith('0') ? raw.slice(1) : raw;
    setNationalNumber(sanitized);
    onChange(formatInternationalPhone(selectedCountry.dialCode, sanitized));
  };

  const filteredCountries = searchCountries(search);

  return (
    <div className={`space-y-1 relative ${className}`} ref={dropdownRef}>
      {label && (
        <label htmlFor={inputId} className="block text-xs font-bold text-stone-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {/* Country Code Selector Trigger */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsDropdownOpen(!isDropdownOpen)}
          aria-haspopup="listbox"
          aria-expanded={isDropdownOpen}
          aria-label={`Select phone country code. Current: ${selectedCountry.name} ${selectedCountry.dialCode}`}
          className={`h-full flex items-center gap-1.5 px-2.5 py-2.5 bg-[#EAE8DE] hover:bg-[#DDEFE8] border-y border-l rounded-l-xl transition-all font-semibold text-xs text-[#062C22] shrink-0 ${
            error ? 'border-rose-400' : isDropdownOpen ? 'border-[#176B52] bg-[#DDEFE8]' : 'border-stone-300'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span className="text-base select-none">{selectedCountry.flag}</span>
          <span className="font-mono text-[11px] text-[#176B52] font-bold">{selectedCountry.dialCode}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-stone-500 transition-transform duration-200 ${
              isDropdownOpen ? 'transform rotate-180 text-[#176B52]' : ''
            }`}
          />
        </button>

        {/* National Number Input */}
        <div className="relative flex-1">
          <input
            id={inputId}
            type="tel"
            required={required}
            disabled={disabled}
            value={nationalNumber}
            onChange={handleNationalNumberChange}
            placeholder={placeholder}
            className={`w-full px-3 py-2.5 bg-[#F8F7F2] border rounded-r-xl text-xs sm:text-sm font-medium text-[#062C22] placeholder:text-stone-400 focus:outline-none transition-all ${
              error
                ? 'border-rose-400 focus:ring-2 focus:ring-rose-400 bg-rose-50/20'
                : 'border-stone-300 focus:border-[#176B52] focus:ring-2 focus:ring-[#176B52]/20'
            } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
          />
        </div>

        {/* Dial Code Selector Popover */}
        {isDropdownOpen && (
          <div className="absolute z-50 left-0 top-full mt-1.5 w-72 bg-white rounded-2xl border border-stone-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Search Input */}
            <div className="p-2 border-b border-stone-100 bg-[#F8F7F2]/80">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by country or code..."
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
              aria-label="Phone country codes"
              className="max-h-56 overflow-y-auto p-1.5 space-y-0.5 text-xs focus:outline-none scrollbar-thin scrollbar-thumb-stone-200"
            >
              {filteredCountries.length === 0 ? (
                <li className="p-4 text-center text-xs text-stone-400 font-medium">
                  No country codes matching "{search}"
                </li>
              ) : (
                filteredCountries.map((c) => {
                  const isSelected = selectedCountry.code === c.code;
                  return (
                    <li
                      key={c.code}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleCountrySelect(c)}
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
                      <span className="text-xs font-mono font-bold text-[#176B52] shrink-0 ml-2">
                        {c.dialCode}
                      </span>
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
