import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, RefreshCw, X } from 'lucide-react';
import { DESTINATION_DISTANCES, type DestinationDistance, type AirportOption } from '../../data/destinationDistances';

interface TransferMapViewerProps {
  selectedAirport: AirportOption;
  selectedDestination: DestinationDistance;
  onSelectDestination: (dest: DestinationDistance) => void;
}

export const TransferMapViewer: React.FC<TransferMapViewerProps> = ({
  selectedDestination,
  onSelectDestination
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DestinationDistance[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Filter destination suggestions as customer types
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    const q = searchQuery.toLowerCase();
    const matches = DESTINATION_DISTANCES.filter(d => 
      d.name.toLowerCase().includes(q) ||
      d.shortName.toLowerCase().includes(q) ||
      d.region.toLowerCase().includes(q) ||
      d.popularFor.toLowerCase().includes(q)
    );

    setSearchResults(matches);
    setShowSuggestions(true);
  }, [searchQuery]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectResult = (dest: DestinationDistance) => {
    onSelectDestination(dest);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  // Map coordinates in SVG viewBox (Sri Lanka geographic bound: 0 to 500 width, 0 to 650 height)
  // Katunayake CMB Airport coordinates ~ (155, 360)
  const airportCoords = { x: 155, y: 360 };

  // Map of Sri Lanka destination projected positions
  const destinationCoords: Record<string, { x: number; y: number }> = {
    'dest-colombo': { x: 155, y: 395 },
    'dest-negombo': { x: 155, y: 345 },
    'dest-kandy': { x: 235, y: 345 },
    'dest-sigiriya': { x: 235, y: 220 },
    'dest-galle': { x: 185, y: 530 },
    'dest-bentota': { x: 165, y: 450 },
    'dest-mirissa': { x: 230, y: 545 },
    'dest-nuwara-eliya': { x: 250, y: 390 },
    'dest-ella': { x: 285, y: 400 },
    'dest-yala': { x: 340, y: 495 },
    'dest-trincomalee': { x: 320, y: 165 },
    'dest-arugam-bay': { x: 380, y: 410 },
    'dest-jaffna': { x: 180, y: 65 }
  };

  const destPoint = destinationCoords[selectedDestination.id] || { x: 235, y: 220 };

  // Generate curved smooth road SVG path from airport to destination
  const midX = (airportCoords.x + destPoint.x) / 2 + (destPoint.x > airportCoords.x ? 15 : -15);
  const midY = (airportCoords.y + destPoint.y) / 2;
  const routeSvgPath = `M ${airportCoords.x} ${airportCoords.y} Q ${midX} ${midY} ${destPoint.x} ${destPoint.y}`;

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-[0_8px_30px_-8px_rgba(6,44,34,0.08)] overflow-hidden space-y-0">
      
      {/* 1. Map Search Field Bar */}
      <div className="p-4 sm:p-5 bg-white border-b border-stone-100 relative z-30" ref={searchContainerRef}>
        <div className="relative">
          <Search className="w-4 h-4 text-[#176B52] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchQuery.trim()) setShowSuggestions(true);
            }}
            placeholder="Search destination (e.g. Sigiriya, Kandy, Galle, Ella, Mirissa)..."
            className="w-full pl-11 pr-10 py-3 bg-[#F8F7F2] border border-stone-300 rounded-2xl text-xs sm:text-sm font-semibold text-[#17231F] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#176B52]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Autocomplete Search Suggestions Dropdown in Liquid Glass */}
        {showSuggestions && (
          <div className="absolute left-4 right-4 mt-2 bg-white/95 backdrop-blur-2xl border border-stone-200 rounded-2xl shadow-2xl py-2 max-h-72 overflow-y-auto animate-fadeIn">
            {searchResults.length === 0 ? (
              <div className="p-4 text-center text-xs text-[#68736E]">
                No specific destination found for "{searchQuery}". Try selecting from the destinations on the map below.
              </div>
            ) : (
              searchResults.map((dest) => (
                <div
                  key={dest.id}
                  onClick={() => handleSelectResult(dest)}
                  className="px-4 py-3 hover:bg-[#DDEFE8]/60 cursor-pointer flex items-center justify-between transition-colors border-b border-stone-100/60 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-[#176B52] shrink-0" />
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-[#17231F] block">{dest.name}</span>
                      <span className="text-[11px] text-[#68736E]">{dest.popularFor} &bull; {dest.region}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-[#0B3D2E] block">{dest.distanceKm} km</span>
                    <span className="text-[10px] text-[#68736E]">{dest.estimatedHours}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* 2. Interactive Map Container (Desktop: 450px, Mobile: 360px) */}
      <div className="relative w-full h-[360px] sm:h-[450px] bg-[#EAF2ED] overflow-hidden select-none">
        
        {/* SVG Sri Lanka Geographic Outline & Road Network */}
        <svg 
          viewBox="0 0 500 650" 
          className="w-full h-full object-contain filter drop-shadow-sm"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Island Landmass Silhouette (Sri Lanka Stylized Contour) */}
          <path
            d="M 180 40 
               C 210 30, 240 60, 260 100 
               C 300 140, 360 170, 360 220 
               C 390 280, 420 370, 380 440 
               C 360 500, 300 580, 240 590 
               C 180 590, 140 530, 140 450 
               C 130 380, 140 280, 160 180 
               C 165 110, 150 70, 180 40 Z"
            fill="#D5E6DC"
            stroke="#BDD7C7"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Central Mountain Massif Background Shading */}
          <ellipse cx="240" cy="380" rx="60" ry="70" fill="#C5DDCF" opacity="0.6" />
          <ellipse cx="240" cy="220" rx="35" ry="30" fill="#C5DDCF" opacity="0.5" />

          {/* Secondary Major Road Network Lines */}
          <path d="M 155 360 L 235 345 L 250 390 L 285 400 L 340 495" fill="none" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.7" strokeDasharray="3 3" />
          <path d="M 155 360 L 235 220 L 320 165" fill="none" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.7" strokeDasharray="3 3" />
          <path d="M 155 395 L 165 450 L 185 530 L 230 545 L 340 495" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.8" />
          <path d="M 155 345 L 180 65" fill="none" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.6" strokeDasharray="4 4" />

          {/* Active Highlighted Road Route Line (Airport -> Selected Destination) */}
          <path
            d={routeSvgPath}
            fill="none"
            stroke="#176B52"
            strokeWidth="5"
            strokeLinecap="round"
            className="filter drop-shadow-md"
          />

          {/* Animated Flow Line Along Route */}
          <path
            d={routeSvgPath}
            fill="none"
            stroke="#39A982"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="8 8"
            className="animate-pulse"
          />

          {/* Destination Map Pin Nodes */}
          {DESTINATION_DISTANCES.map((d) => {
            const pt = destinationCoords[d.id] || { x: 235, y: 220 };
            const isSelected = d.id === selectedDestination.id;

            return (
              <g 
                key={d.id} 
                className="cursor-pointer group"
                onClick={() => onSelectDestination(d)}
              >
                {/* Node Target Ring */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isSelected ? 10 : 5}
                  fill={isSelected ? '#176B52' : '#FFFFFF'}
                  stroke={isSelected ? '#39A982' : '#0B3D2E'}
                  strokeWidth={isSelected ? 3 : 1.5}
                  className="transition-all"
                />
                
                {/* Destination Label */}
                <text
                  x={pt.x + 12}
                  y={pt.y + 4}
                  fontSize={isSelected ? "11" : "9"}
                  fontWeight={isSelected ? "bold" : "600"}
                  fill={isSelected ? "#062C22" : "#4A5A53"}
                  className="select-none font-sans"
                >
                  {d.shortName}
                </text>
              </g>
            );
          })}

          {/* AIRPORT MARKER (CMB Katunayake) */}
          <g transform={`translate(${airportCoords.x - 14}, ${airportCoords.y - 14})`}>
            <circle cx="14" cy="14" r="14" fill="#062C22" stroke="#FFFFFF" strokeWidth="2.5" className="shadow-lg" />
            <path
              d="M 14 6 L 16 12 L 22 13 L 17 17 L 19 22 L 14 19 L 9 22 L 11 17 L 6 13 L 12 12 Z"
              fill="#39A982"
            />
          </g>

          {/* SELECTED DESTINATION ACTIVE MARKER PIN */}
          <g transform={`translate(${destPoint.x - 16}, ${destPoint.y - 32})`}>
            <path
              d="M 16 0 C 7.2 0 0 7.2 0 16 C 0 28 16 38 16 38 C 16 38 32 28 32 16 C 32 7.2 24.8 0 16 0 Z"
              fill="#176B52"
              stroke="#FFFFFF"
              strokeWidth="2"
              className="filter drop-shadow-md"
            />
            <circle cx="16" cy="14" r="6" fill="#FFFFFF" />
            <circle cx="16" cy="14" r="3" fill="#39A982" />
          </g>

        </svg>

        {/* Floating Route Info HUD Card (Overlapping bottom left of map) in Liquid Glass */}
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs bg-white/90 backdrop-blur-xl p-3.5 sm:p-4 rounded-2xl border border-white/90 shadow-xl space-y-1.5 z-20">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] uppercase font-bold text-[#176B52] tracking-wider">
              ROAD ROUTE TO {selectedDestination.shortName.toUpperCase()}
            </span>
            <span className="font-bold text-[#0B3D2E] text-xs">Direct Route</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-[#0B3D2E]">{selectedDestination.distanceKm} km</span>
            <span className="text-xs text-[#68736E] font-medium">&bull; Approx. {selectedDestination.estimatedHours}</span>
          </div>

          <p className="text-[11px] text-stone-600 line-clamp-1">
            {selectedDestination.popularFor}
          </p>
        </div>

      </div>

      {/* 3. Selected Destination Details Bar under Map */}
      <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#DDEFE8] text-[#176B52] flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#68736E] uppercase tracking-wider block">Selected Drop-Off Destination</span>
            <h4 className="font-serif font-bold text-sm sm:text-base text-[#17231F]">{selectedDestination.name}</h4>
          </div>
        </div>

        <button
          onClick={() => {
            const input = document.querySelector('input[placeholder*="Search destination"]') as HTMLInputElement;
            if (input) {
              input.focus();
              input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }}
          className="text-xs font-bold text-[#176B52] hover:text-[#0B3D2E] underline flex items-center gap-1 shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Change Destination</span>
        </button>
      </div>

    </div>
  );
};
