import React from 'react';
import { Filter, RotateCcw, Sparkles } from 'lucide-react';
import type { TourCategory } from '../../types';
import type { TourFilterParams } from '../../services/tourService';
import { INITIAL_DESTINATIONS } from '../../data/destinations';

interface TourFiltersProps {
  filters: TourFilterParams;
  onChange: (filters: TourFilterParams) => void;
  onReset: () => void;
}

const CATEGORIES: (TourCategory | 'All')[] = [
  'All',
  'Cultural & Heritage',
  'Wildlife & Safari',
  'Hill Country & Nature',
  'Beach & Coastal',
  'Luxury & Honeymoon',
  'Active Adventure',
  'Ayurveda & Wellness'
];

export const TourFilters: React.FC<TourFiltersProps> = ({ filters, onChange, onReset }) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#176B52]" />
          <h3 className="font-serif text-lg font-bold text-[#062C22]">Filter Tours</h3>
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-[#0B3D2E] transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset All
        </button>
      </div>

      {/* Category / Travel Style */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-[#062C22] uppercase tracking-wider block">
          Travel Style / Category
        </label>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onChange({ ...filters, category: cat })}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                (filters.category || 'All') === cat
                  ? 'bg-[#0B3D2E] text-white font-bold shadow-sm'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <span>{cat}</span>
              {(filters.category || 'All') === cat && (
                <Sparkles className="w-3 h-3 text-[#39A982]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Destination Filter */}
      <div className="space-y-2 pt-2 border-t border-stone-100">
        <label className="text-xs font-bold text-[#062C22] uppercase tracking-wider block">
          Destination
        </label>
        <select
          value={filters.destination || 'All'}
          onChange={(e) => onChange({ ...filters, destination: e.target.value })}
          className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-[#062C22] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
        >
          <option value="All">All Sri Lankan Regions</option>
          {INITIAL_DESTINATIONS.map((d) => (
            <option key={d.id} value={d.name}>{d.name}</option>
          ))}
        </select>
      </div>

      {/* Duration Radio */}
      <div className="space-y-2 pt-2 border-t border-stone-100">
        <label className="text-xs font-bold text-[#062C22] uppercase tracking-wider block">
          Duration
        </label>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => onChange({ ...filters, durationMin: undefined, durationMax: undefined })}
            className={`py-2 px-3 rounded-xl border text-center font-medium transition-all ${
              filters.durationMin === undefined && filters.durationMax === undefined
                ? 'bg-[#0B3D2E] text-white border-[#0B3D2E]'
                : 'border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            Any Duration
          </button>
          <button
            onClick={() => onChange({ ...filters, durationMin: 1, durationMax: 5 })}
            className={`py-2 px-3 rounded-xl border text-center font-medium transition-all ${
              filters.durationMax === 5
                ? 'bg-[#0B3D2E] text-white border-[#0B3D2E]'
                : 'border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            1 - 5 Days
          </button>
          <button
            onClick={() => onChange({ ...filters, durationMin: 6, durationMax: 8 })}
            className={`py-2 px-3 rounded-xl border text-center font-medium transition-all ${
              filters.durationMin === 6 && filters.durationMax === 8
                ? 'bg-[#0B3D2E] text-white border-[#0B3D2E]'
                : 'border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            6 - 8 Days
          </button>
          <button
            onClick={() => onChange({ ...filters, durationMin: 9, durationMax: undefined })}
            className={`py-2 px-3 rounded-xl border text-center font-medium transition-all ${
              filters.durationMin === 9
                ? 'bg-[#0B3D2E] text-white border-[#0B3D2E]'
                : 'border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            9+ Days
          </button>
        </div>
      </div>

    </div>
  );
};
