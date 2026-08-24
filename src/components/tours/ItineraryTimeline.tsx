import React, { useState } from 'react';
import { ChevronDown,  Utensils, Hotel,  Check } from 'lucide-react';
import type { ItineraryDay } from '../../types';

interface ItineraryTimelineProps {
  days: ItineraryDay[];
}

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({ days }) => {
  const [openDays, setOpenDays] = useState<number[]>([1]); // Day 1 open by default

  const toggleDay = (dayNum: number) => {
    if (openDays.includes(dayNum)) {
      setOpenDays(openDays.filter(d => d !== dayNum));
    } else {
      setOpenDays([...openDays, dayNum]);
    }
  };

  const expandAll = () => {
    setOpenDays(days.map(d => d.day));
  };

  const collapseAll = () => {
    setOpenDays([]);
  };

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-2xl font-bold text-[#082F24]">Day-by-Day Itinerary</h3>
        <div className="flex items-center gap-3 text-xs font-semibold text-[#0D3B2E]">
          <button onClick={expandAll} className="hover:underline hover:text-[#C5A059]">
            Expand All Days
          </button>
          <span>•</span>
          <button onClick={collapseAll} className="hover:underline hover:text-[#C5A059]">
            Collapse All
          </button>
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-4 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-[#C5A059]/30">
        {days.map((day) => {
          const isOpen = openDays.includes(day.day);
          return (
            <div key={day.day} className="relative pl-12">
              {/* Day Number Bullet */}
              <div 
                onClick={() => toggleDay(day.day)}
                className={`absolute left-0 top-3 w-10 h-10 rounded-full flex items-center justify-center font-serif text-sm font-bold cursor-pointer transition-all shadow-md z-10 ${
                  isOpen 
                    ? 'bg-[#0D3B2E] text-[#E5C378] ring-4 ring-[#C5A059]/20' 
                    : 'bg-white text-stone-700 border-2 border-[#C5A059]'
                }`}
              >
                {day.day}
              </div>

              {/* Day Card */}
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm transition-all">
                <button
                  onClick={() => toggleDay(day.day)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-[#FAF8F5] transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#8C6D2B] uppercase tracking-wider">
                        Day {day.day} • {day.destination}
                      </span>
                      {day.driveTime && (
                        <span className="text-[11px] text-stone-400 bg-stone-100 px-2 py-0.5 rounded-md">
                          Drive: {day.driveTime}
                        </span>
                      )}
                    </div>
                    <h4 className="font-serif text-lg font-bold text-[#082F24]">{day.title}</h4>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-stone-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#0D3B2E]' : ''}`} />
                </button>

                {/* Collapsible Content */}
                {isOpen && (
                  <div className="px-5 pb-6 pt-2 space-y-4 border-t border-stone-100 text-sm text-stone-600 animate-fadeIn">
                    <p className="leading-relaxed">{day.description}</p>

                    {/* Highlights */}
                    {day.highlights && day.highlights.length > 0 && (
                      <div className="bg-[#FAF8F5] p-4 rounded-xl space-y-2 border border-stone-200/60">
                        <span className="text-xs font-bold text-[#082F24] uppercase tracking-wider block">
                          Day Highlights
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {day.highlights.map((h, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-stone-700">
                              <Check className="w-3.5 h-3.5 text-[#0D3B2E] shrink-0" />
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Accommodation & Meals */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                      <div className="flex items-start gap-2 bg-stone-50 p-3 rounded-xl border border-stone-200/50">
                        <Hotel className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-[#082F24] block">Overnight Stay:</span>
                          <span className="text-stone-600">{day.accommodation}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 bg-stone-50 p-3 rounded-xl border border-stone-200/50">
                        <Utensils className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-[#082F24] block">Meals Included:</span>
                          <span className="text-stone-600">
                            {day.mealsIncluded && day.mealsIncluded.length > 0
                              ? day.mealsIncluded.join(', ')
                              : 'None (Room Only)'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
