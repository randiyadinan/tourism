import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, X, RefreshCw, Loader2 } from 'lucide-react';
import { 
  AIRPORT_COORDINATES, 
  type PlaceResult, 
  type RouteResult, 
  loadGoogleMapsScript 
} from '../../services/googleMapsService';
import { DESTINATION_DISTANCES } from '../../data/destinationDistances';

interface GoogleMapDestinationSelectorProps {
  selectedDestination: PlaceResult;
  routeData: RouteResult | null;
  isLoadingRoute: boolean;
  onSelectPlace: (place: PlaceResult) => void;
}

// Popular Sri Lankan Search Database for quick suggestions + autocomplete
const POPULAR_SEARCH_PLACES: PlaceResult[] = [
  {
    name: 'Sigiriya Rock Fortress',
    formattedAddress: 'Sigiriya Ancient City, Central Province, Sri Lanka',
    lat: 7.9570,
    lng: 80.7603
  },
  {
    name: 'Temple of the Sacred Tooth Relic',
    formattedAddress: 'Sri Dalada Veediya, Kandy 20000, Sri Lanka',
    lat: 7.2936,
    lng: 80.6413
  },
  {
    name: 'Demodara Nine Arches Bridge',
    formattedAddress: 'Nine Arch Bridge Road, Ella 90090, Sri Lanka',
    lat: 6.8768,
    lng: 81.0608
  },
  {
    name: 'Galle Dutch Fort Lighthouse',
    formattedAddress: 'Rampart St, Galle 80000, Sri Lanka',
    lat: 6.0267,
    lng: 80.2170
  },
  {
    name: 'Mirissa Whale Watching Harbour',
    formattedAddress: 'Harbour Rd, Mirissa 81740, Sri Lanka',
    lat: 5.9483,
    lng: 80.4578
  },
  {
    name: 'Nuwara Eliya Tea Hills & Gregory Lake',
    formattedAddress: 'Peradeniya-Badulla-Chenkaladi Hwy, Nuwara Eliya, Sri Lanka',
    lat: 6.9497,
    lng: 80.7891
  },
  {
    name: 'Yala National Park Safari Center',
    formattedAddress: 'Palatupana, Yala, Southern Province, Sri Lanka',
    lat: 6.3725,
    lng: 81.5186
  },
  {
    name: 'Colombo Galle Face Green & Port City',
    formattedAddress: 'Galle Face Center Rd, Colombo 00300, Sri Lanka',
    lat: 6.9271,
    lng: 79.8443
  },
  {
    name: 'Bentota Golden Beach & Water Sports',
    formattedAddress: 'Bentota Beach, Southern Province, Sri Lanka',
    lat: 6.4258,
    lng: 79.9964
  },
  {
    name: 'Negombo Coastal Resort Strip',
    formattedAddress: 'Lewis Place, Negombo, Sri Lanka',
    lat: 7.2343,
    lng: 79.8427
  },
  {
    name: 'Trincomalee Nilaveli Beach & Pigeon Island',
    formattedAddress: 'Nilaveli Beach Rd, Trincomalee 31010, Sri Lanka',
    lat: 8.6833,
    lng: 81.1894
  },
  {
    name: 'Arugam Bay Surf Point',
    formattedAddress: 'Main St, Arugam Bay 32500, Sri Lanka',
    lat: 6.8421,
    lng: 81.8340
  },
  {
    name: 'Jaffna Nallur Kandaswamy Temple',
    formattedAddress: 'Nallur, Jaffna 40000, Sri Lanka',
    lat: 9.6747,
    lng: 80.0298
  }
];

export const GoogleMapDestinationSelector: React.FC<GoogleMapDestinationSelectorProps> = ({
  selectedDestination,
  routeData,
  isLoadingRoute,
  onSelectPlace
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGoogleSdkReady, setIsGoogleSdkReady] = useState(false);

  const searchBoxRef = useRef<HTMLInputElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const googleMapInstanceRef = useRef<any>(null);
  const directionsRendererRef = useRef<any>(null);

  // Initialize Google Maps SDK and Autocomplete
  useEffect(() => {
    let isMounted = true;

    loadGoogleMapsScript().then((googleObj) => {
      if (!isMounted) return;

      if (googleObj && googleObj.maps && mapContainerRef.current) {
        try {
          setIsGoogleSdkReady(true);

          // Initialize Map
          const map = new googleObj.maps.Map(mapContainerRef.current, {
            center: { lat: 7.5, lng: 80.5 },
            zoom: 8,
            styles: [
              {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#D5E6DC' }]
              },
              {
                featureType: 'landscape',
                elementType: 'geometry',
                stylers: [{ color: '#F4F8F5' }]
              },
              {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{ color: '#FFFFFF' }]
              },
              {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{ color: '#176B52' }, { lightness: 40 }]
              },
              {
                featureType: 'poi',
                elementType: 'all',
                stylers: [{ visibility: 'off' }]
              }
            ],
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false
          });

          googleMapInstanceRef.current = map;

          // Directions Renderer
          const directionsRenderer = new googleObj.maps.DirectionsRenderer({
            map: map,
            suppressMarkers: false,
            polylineOptions: {
              strokeColor: '#0B3D2E',
              strokeWeight: 5,
              strokeOpacity: 0.85
            }
          });
          directionsRendererRef.current = directionsRenderer;

          // Google Places Autocomplete on the input
          if (searchBoxRef.current && googleObj.maps.places) {
            const autocomplete = new googleObj.maps.places.Autocomplete(searchBoxRef.current, {
              componentRestrictions: { country: 'lk' },
              fields: ['place_id', 'geometry', 'name', 'formatted_address']
            });

            autocomplete.addListener('place_changed', () => {
              const place = autocomplete.getPlace();
              if (place.geometry && place.geometry.location) {
                const newPlace: PlaceResult = {
                  placeId: place.place_id,
                  name: place.name || 'Selected Place',
                  formattedAddress: place.formatted_address || place.name || '',
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng()
                };
                onSelectPlace(newPlace);
                setSearchQuery(newPlace.name);
                setShowSuggestions(false);
              }
            });
          }
        } catch (err: any) {
          console.warn('Could not initialize interactive Google Map JS SDK:', err);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Update Google Map Route and Markers when selectedDestination changes
  useEffect(() => {
    if (isGoogleSdkReady && googleMapInstanceRef.current && (window as any).google?.maps) {
      const g = (window as any).google;
      const map = googleMapInstanceRef.current;

      if (routeData?.routeGeometry && directionsRendererRef.current) {
        directionsRendererRef.current.setDirections(routeData.routeGeometry);
      } else {
        // Center on destination
        const destLatLng = new g.maps.LatLng(selectedDestination.lat, selectedDestination.lng);
        const airportLatLng = new g.maps.LatLng(AIRPORT_COORDINATES.lat, AIRPORT_COORDINATES.lng);

        const bounds = new g.maps.LatLngBounds();
        bounds.extend(airportLatLng);
        bounds.extend(destLatLng);
        map.fitBounds(bounds, 60);
      }
    }
  }, [selectedDestination, routeData, isGoogleSdkReady]);

  // Autocomplete fallback search matching (Search any place/city in Sri Lanka)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const q = searchQuery.toLowerCase();
    const matches = POPULAR_SEARCH_PLACES.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.formattedAddress.toLowerCase().includes(q)
    );

    // Also check destination distances
    DESTINATION_DISTANCES.forEach(d => {
      if (
        (d.name.toLowerCase().includes(q) || d.shortName.toLowerCase().includes(q) || d.popularFor.toLowerCase().includes(q)) &&
        !matches.some(m => m.name.toLowerCase().includes(d.shortName.toLowerCase()))
      ) {
        const approxCoords: Record<string, { lat: number; lng: number }> = {
          'dest-sigiriya': { lat: 7.9570, lng: 80.7603 },
          'dest-kandy': { lat: 7.2936, lng: 80.6413 },
          'dest-ella': { lat: 6.8768, lng: 81.0608 },
          'dest-galle': { lat: 6.0267, lng: 80.2170 },
          'dest-mirissa': { lat: 5.9483, lng: 80.4578 },
          'dest-nuwara-eliya': { lat: 6.9497, lng: 80.7891 },
          'dest-bentota': { lat: 6.4258, lng: 79.9964 },
          'dest-yala': { lat: 6.3725, lng: 81.5186 },
          'dest-colombo': { lat: 6.9271, lng: 79.8443 },
          'dest-negombo': { lat: 7.2343, lng: 79.8427 },
          'dest-trincomalee': { lat: 8.6833, lng: 81.1894 },
          'dest-arugam-bay': { lat: 6.8421, lng: 81.8340 },
          'dest-jaffna': { lat: 9.6747, lng: 80.0298 }
        };
        const coords = approxCoords[d.id] || { lat: 7.9570, lng: 80.7603 };
        matches.push({
          name: d.name,
          formattedAddress: `${d.region}, Sri Lanka`,
          lat: coords.lat,
          lng: coords.lng
        });
      }
    });

    setSuggestions(matches);
  }, [searchQuery]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectPlace = (place: PlaceResult) => {
    onSelectPlace(place);
    setSearchQuery(place.name);
    setShowSuggestions(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-[0_10px_35px_-10px_rgba(6,44,34,0.08)] overflow-hidden space-y-0">
      
      {/* 1. Google Places Autocomplete Search Bar */}
      <div className="p-4 sm:p-5 bg-white border-b border-stone-100 relative z-30" ref={searchContainerRef}>
        <label className="text-xs font-bold text-[#176B52] uppercase tracking-wider block mb-2">
          Where are you going? (Search Google Maps)
        </label>

        <div className="relative">
          <Search className="w-4 h-4 text-[#176B52] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            ref={searchBoxRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => {
              if (searchQuery.trim() || suggestions.length > 0) setShowSuggestions(true);
            }}
            placeholder="Search any hotel, city, attraction or address in Sri Lanka (e.g. Kandy, Ella, Sigiriya)..."
            className="w-full pl-11 pr-10 py-3.5 bg-[#F8F7F2] border border-stone-300 rounded-2xl text-xs sm:text-sm font-semibold text-[#17231F] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#176B52] shadow-2xs"
          />

          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSuggestions([]);
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Autocomplete Suggestions Panel in Liquid Glass */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute left-4 right-4 mt-2 bg-white/95 backdrop-blur-2xl border border-stone-200 rounded-2xl shadow-2xl py-2 max-h-72 overflow-y-auto animate-fadeIn z-50">
            <div className="px-3.5 py-1 text-[10px] font-bold text-[#176B52] uppercase tracking-wider border-b border-stone-100">
              Google Maps Suggestions
            </div>
            {suggestions.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectPlace(item)}
                className="px-4 py-3 hover:bg-[#DDEFE8]/70 cursor-pointer flex items-center justify-between transition-colors border-b border-stone-100/60 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#176B52] shrink-0" />
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-[#17231F] block">{item.name}</span>
                    <span className="text-[11px] text-[#68736E] line-clamp-1">{item.formattedAddress}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#176B52] bg-white px-2 py-0.5 rounded-full border border-stone-200 shrink-0">
                  Select
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Interactive Map Container (Desktop: 460px, Mobile: 360px) */}
      <div className="relative w-full h-[360px] sm:h-[460px] bg-[#EAF2ED] overflow-hidden select-none">
        
        {/* Real Google Map Canvas or Embedded Google Direction Route Viewer */}
        <div ref={mapContainerRef} className="w-full h-full">
          {/* Iframe Real Google Maps Directions Preview if JS SDK is pending */}
          {!isGoogleSdkReady && (
            <iframe
              title="Google Maps Sri Lanka Route"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${selectedDestination.lat},${selectedDestination.lng}&z=10&output=embed`}
              className="w-full h-full"
            />
          )}
        </div>

        {/* Loading Route Overlay */}
        {isLoadingRoute && (
          <div className="absolute inset-0 bg-white/75 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-30 animate-fadeIn">
            <Loader2 className="w-8 h-8 text-[#176B52] animate-spin" />
            <span className="text-xs font-bold text-[#0B3D2E]">Calculating Google road route & distance...</span>
          </div>
        )}

        {/* Floating Route Info HUD Card (Overlapping bottom left of map in Liquid Glass) */}
        {routeData && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm bg-white/90 backdrop-blur-xl p-4 rounded-2xl border border-white/90 shadow-xl space-y-2 z-20 animate-fadeIn">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] uppercase font-bold text-[#176B52] tracking-wider flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-[#39A982]" />
                BANDARANAIKE (CMB) &rarr; {selectedDestination.name.split(',')[0].toUpperCase()}
              </span>
              <span className="text-[10px] font-bold text-[#0B3D2E] bg-[#DDEFE8] px-2 py-0.5 rounded-full">
                {routeData.isLiveGoogleRoute ? 'Live Google Route' : 'Expressway Verified'}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-serif text-2xl font-bold text-[#0B3D2E]">{routeData.distanceKm} km</span>
              <span className="text-xs text-[#68736E] font-medium">&bull; Approx. {routeData.durationText} drive</span>
            </div>

            <p className="text-[11px] text-stone-600 line-clamp-1">
              {selectedDestination.formattedAddress}
            </p>
          </div>
        )}

      </div>

      {/* 3. Selected Destination Details Bar under Map */}
      <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#DDEFE8] text-[#176B52] flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#68736E] uppercase tracking-wider block">Selected Destination</span>
            <h4 className="font-serif font-bold text-sm sm:text-base text-[#17231F]">{selectedDestination.name}</h4>
            <p className="text-[11px] text-[#68736E]">{selectedDestination.formattedAddress}</p>
          </div>
        </div>

        <button
          onClick={() => {
            if (searchBoxRef.current) {
              searchBoxRef.current.focus();
              searchBoxRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
