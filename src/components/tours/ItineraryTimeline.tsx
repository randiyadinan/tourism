import React, { useState } from 'react';
import { ChevronDown, Utensils, Hotel, Check, MapPin } from 'lucide-react';
import type { ItineraryDay } from '../../types';

interface ItineraryTimelineProps {
  days: ItineraryDay[];
}

const DESTINATION_IMAGES: Record<string, string> = {
  sigiriya: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80',
  kandy: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
  'nuwara eliya': 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80',
  ella: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80',
  yala: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
  galle: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
  colombo: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80',
  bentota: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  mirissa: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  dambulla: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80',
  habarana: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80'
};

const getDestinationImage = (destName: string): string => {
  const clean = destName.toLowerCase().split('/')[0].trim();
  for (const [key, url] of Object.entries(DESTINATION_IMAGES)) {
    if (clean.includes(key) || key.includes(clean)) return url;
  }
  return 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80';
};

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({ days }) => {
  const [openDays, setOpenDays] = useState<number[]>(days.map(d => d.day)); // Open by default

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
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#062C22]">Day-by-Day Fixed Itinerary</h3>
          <p className="text-xs text-[#68736E] mt-0.5">Explore the destinations, photos and activities included each day.</p>
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold text-[#0B3D2E]">
          <button onClick={expandAll} className="hover:underline hover:text-[#176B52]">
            Expand All
          </button>
          <span>•</span>
          <button onClick={collapseAll} className="hover:underline hover:text-[#176B52]">
            Collapse All
          </button>
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-6">
        {days.map((day) => {
          const isOpen = openDays.includes(day.day);
          const destPhoto = getDestinationImage(day.destination);

          return (
            <div key={day.day} className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
              
              {/* Day Header Button */}
              <button
                onClick={() => toggleDay(day.day)}
                className="w-full p-5 sm:p-6 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F8F7F2] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#0B3D2E] text-white flex items-center justify-center font-serif text-sm font-bold shrink-0 shadow-xs">
                    {day.day}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-[#176B52] uppercase tracking-wider flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#39A982]" />
                        {day.destination}
                      </span>
                      {day.driveTime && (
                        <span className="text-[11px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md font-medium">
                          Drive: {day.driveTime}
                        </span>
                      )}
                    </div>
                    <h4 className="font-serif text-lg sm:text-xl font-bold text-[#062C22]">{day.title}</h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="text-xs text-[#68736E] font-medium hidden sm:inline">
                    {isOpen ? 'Hide Details' : 'View Day Details'}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-stone-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#0B3D2E]' : ''}`} />
                </div>
              </button>

              {/* Day Content with Destination Photo */}
              {isOpen && (
                <div className="px-5 pb-6 pt-2 space-y-5 border-t border-stone-100 animate-fadeIn">
                  
                  {/* Photo & Description Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-2">
                    <div className="md:col-span-4 h-48 rounded-2xl overflow-hidden shadow-xs border border-stone-200">
                      <img
                        src={destPhoto}
                        alt={day.destination}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    
                    <div className="md:col-span-8 space-y-3 flex flex-col justify-center">
                      <span className="text-xs font-bold text-[#176B52] uppercase tracking-wider">
                        Destination Overview
                      </span>
                      <p className="text-sm text-stone-700 leading-relaxed">
                        {day.description}
                      </p>
                    </div>
                  </div>

                  {/* Highlights */}
                  {day.highlights && day.highlights.length > 0 && (
                    <div className="bg-[#F8F7F2] p-4 sm:p-5 rounded-2xl space-y-2.5 border border-stone-200/70">
                      <span className="text-xs font-bold text-[#062C22] uppercase tracking-wider block">
                        Included Activities & Highlights
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {day.highlights.map((h, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-stone-700">
                            <Check className="w-4 h-4 text-[#39A982] shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Accommodation & Meals */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-start gap-2.5 bg-stone-50 p-3.5 rounded-2xl border border-stone-200/60">
                      <Hotel className="w-4 h-4 text-[#176B52] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#062C22] block">Overnight Stay:</span>
                        <span className="text-stone-600">{day.accommodation}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 bg-stone-50 p-3.5 rounded-2xl border border-stone-200/60">
                      <Utensils className="w-4 h-4 text-[#176B52] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#062C22] block">Meals Included:</span>
                        <span className="text-stone-600">
                          {day.mealsIncluded && day.mealsIncluded.length > 0
                            ? day.mealsIncluded.join(', ')
                            : 'Breakfast included'}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
