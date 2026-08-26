import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, X, RefreshCw, Loader2 } from 'lucide-react';
import { 
  AIRPORT_COORDINATES, 
  type PlaceResult, 
  type RouteResult, 
  loadGoogleMapsScript,
  searchGooglePlaces
} from '../../services/googleMapsService';

interface GoogleMapDestinationSelectorProps {
  selectedDestination: PlaceResult;
  routeData: RouteResult | null;
  isLoadingRoute: boolean;
  onSelectPlace: (place: PlaceResult) => void;
}

export const GoogleMapDestinationSelector: React.FC<GoogleMapDestinationSelectorProps> = ({
  selectedDestination,
  routeData,
  isLoadingRoute,
  onSelectPlace
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceResult[]>([]);
  const [isSearchingPlaces, setIsSearchingPlaces] = useState(false);
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
            center: { lat: selectedDestination.lat || 7.5, lng: selectedDestination.lng || 80.5 },
            zoom: 9,
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

          // Google Places Autocomplete on the input (Unrestricted search across Sri Lanka)
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
          console.warn('Could not initialize Google Map JS SDK:', err);
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

  // Live Unrestricted Places Search as customer types
  useEffect(() => {
    let active = true;
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSuggestions([]);
      setIsSearchingPlaces(false);
      return;
    }

    setIsSearchingPlaces(true);
    const delayTimer = setTimeout(() => {
      searchGooglePlaces(searchQuery).then((results) => {
        if (active) {
          setSuggestions(results);
          setIsSearchingPlaces(false);
          setShowSuggestions(true);
        }
      });
    }, 280);

    return () => {
      active = false;
      clearTimeout(delayTimer);
    };
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

  const handleExplicitSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearchingPlaces(true);
    searchGooglePlaces(searchQuery).then((results) => {
      setSuggestions(results);
      setIsSearchingPlaces(false);
      setShowSuggestions(true);
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-[0_10px_35px_-10px_rgba(6,44,34,0.08)] overflow-hidden space-y-0">
      
      {/* 1. Google Places Search Bar (Unrestricted for any Sri Lanka address, hotel, attraction or street) */}
      <div className="p-4 sm:p-5 bg-white border-b border-stone-100 relative z-30" ref={searchContainerRef}>
        <label className="text-xs font-bold text-[#176B52] uppercase tracking-wider block mb-2">
          Where are you going?
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
              if (searchQuery.trim().length >= 2 || suggestions.length > 0) setShowSuggestions(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleExplicitSearch();
              }
            }}
            placeholder="Search any place, hotel, attraction or address in Sri Lanka..."
            className="w-full pl-11 pr-24 py-3.5 bg-[#F8F7F2] border border-stone-300 rounded-2xl text-xs sm:text-sm font-semibold text-[#17231F] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#176B52] shadow-2xs"
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {isSearchingPlaces && (
              <Loader2 className="w-4 h-4 text-[#176B52] animate-spin" />
            )}
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSuggestions([]);
                }}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Live Suggestions Panel in Liquid Glass (Unrestricted) */}
        {showSuggestions && (
          <div className="absolute left-4 right-4 mt-2 bg-white/95 backdrop-blur-2xl border border-stone-200 rounded-2xl shadow-2xl py-2 max-h-80 overflow-y-auto animate-fadeIn z-50">
            <div className="px-3.5 py-1.5 text-[10px] font-bold text-[#176B52] uppercase tracking-wider border-b border-stone-100 flex items-center justify-between">
              <span>Google Maps Places Results</span>
              <span className="text-[10px] text-[#68736E] font-normal">Islandwide Search</span>
            </div>

            {suggestions.length === 0 && !isSearchingPlaces ? (
              <div className="p-4 text-center text-xs text-[#68736E] space-y-2">
                <p>No direct match for "{searchQuery}".</p>
                <button
                  onClick={handleExplicitSearch}
                  className="px-4 py-1.5 rounded-xl bg-[#0B3D2E] text-white text-xs font-semibold hover:bg-[#176B52]"
                >
                  Search Google Maps for "{searchQuery}"
                </button>
              </div>
            ) : (
              suggestions.map((item, idx) => (
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
                  <span className="text-[10px] font-bold text-[#176B52] bg-white px-2.5 py-1 rounded-full border border-stone-200 shrink-0">
                    Select
                  </span>
                </div>
              ))
            )}

            {/* Explicit search trigger at bottom */}
            {searchQuery.trim().length > 0 && (
              <div 
                onClick={handleExplicitSearch}
                className="px-4 py-2.5 bg-stone-50 hover:bg-[#DDEFE8]/50 cursor-pointer flex items-center gap-2 text-xs font-semibold text-[#176B52] border-t border-stone-100"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search Google Maps for "{searchQuery}"</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Interactive Map Container (Desktop: 460px, Mobile: 360px) */}
      <div className="relative w-full h-[360px] sm:h-[460px] bg-[#EAF2ED] overflow-hidden select-none">
        
        {/* Real Google Map Canvas or Embedded Google Direction Route Viewer */}
        <div ref={mapContainerRef} className="w-full h-full">
          {!isGoogleSdkReady && (
            <iframe
              title="Google Maps Sri Lanka Route"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${selectedDestination.lat},${selectedDestination.lng}&z=11&output=embed`}
              className="w-full h-full"
            />
          )}
        </div>

        {/* Loading Route Overlay */}
        {isLoadingRoute && (
          <div className="absolute inset-0 bg-white/75 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-30 animate-fadeIn">
            <Loader2 className="w-8 h-8 text-[#176B52] animate-spin" />
            <span className="text-xs font-bold text-[#0B3D2E]">Calculating road route & distance...</span>
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
                {routeData.isLiveGoogleRoute ? 'Live Road Route' : 'Verified Route'}
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
            <p className="text-[11px] text-[#68736E] line-clamp-1">{selectedDestination.formattedAddress}</p>
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
