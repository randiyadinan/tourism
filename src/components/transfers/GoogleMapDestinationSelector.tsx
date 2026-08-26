import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, MapPin, Navigation, X, RefreshCw, Loader2 } from 'lucide-react';
import { 
  AIRPORT_COORDINATES, 
  type PlaceResult, 
  type RouteResult, 
  loadGoogleMapsScript,
  searchGooglePlaces,
  getGooglePlaceDetails
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
  const [isResolvingPlace, setIsResolvingPlace] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGoogleSdkReady, setIsGoogleSdkReady] = useState(false);

  const searchBoxRef = useRef<HTMLInputElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const googleMapInstanceRef = useRef<any>(null);
  const directionsRendererRef = useRef<any>(null);
  const fallbackPolylineRef = useRef<any>(null);
  const airportMarkerRef = useRef<any>(null);
  const destMarkerRef = useRef<any>(null);

  // Helper to fit bounds to Airport (CMB) and Destination
  const fitMapBounds = useCallback(() => {
    if (googleMapInstanceRef.current && (window as any).google?.maps) {
      const g = (window as any).google;
      const map = googleMapInstanceRef.current;

      const bounds = new g.maps.LatLngBounds();
      bounds.extend(new g.maps.LatLng(AIRPORT_COORDINATES.lat, AIRPORT_COORDINATES.lng));
      bounds.extend(new g.maps.LatLng(selectedDestination.lat, selectedDestination.lng));
      map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
    }
  }, [selectedDestination]);

  // Clean initialization of standard native Google Maps JavaScript API
  useEffect(() => {
    let isMounted = true;

    loadGoogleMapsScript().then((googleObj) => {
      if (!isMounted) return;

      if (googleObj && googleObj.maps && mapContainerRef.current) {
        try {
          const container = mapContainerRef.current;
          if (container.clientWidth === 0 || container.clientHeight === 0) return;

          // Pure default native ROADMAP
          const map = new googleObj.maps.Map(container, {
            center: { lat: selectedDestination.lat || 7.5, lng: selectedDestination.lng || 80.5 },
            zoom: 9,
            mapTypeId: googleObj.maps.MapTypeId.ROADMAP,
            gestureHandling: 'cooperative',
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false
          });

          googleMapInstanceRef.current = map;
          setIsGoogleSdkReady(true);

          // Dedicated Directions Renderer for crisp road routes
          const directionsRenderer = new googleObj.maps.DirectionsRenderer({
            map: map,
            suppressMarkers: false,
            polylineOptions: {
              strokeColor: '#0B3D2E',
              strokeWeight: 5,
              strokeOpacity: 0.9
            }
          });
          directionsRendererRef.current = directionsRenderer;

          // Airport Marker (CMB)
          const airportMarker = new googleObj.maps.Marker({
            position: { lat: AIRPORT_COORDINATES.lat, lng: AIRPORT_COORDINATES.lng },
            map: map,
            title: AIRPORT_COORDINATES.name
          });
          airportMarkerRef.current = airportMarker;

          // Destination Marker
          const destMarker = new googleObj.maps.Marker({
            position: { lat: selectedDestination.lat, lng: selectedDestination.lng },
            map: map,
            title: selectedDestination.name
          });
          destMarkerRef.current = destMarker;

          // Google Places Autocomplete on input element
          if (searchBoxRef.current && googleObj.maps.places) {
            const autocomplete = new googleObj.maps.places.Autocomplete(searchBoxRef.current, {
              componentRestrictions: { country: 'lk' },
              fields: ['place_id', 'geometry', 'name', 'formatted_address']
            });

            autocomplete.addListener('place_changed', () => {
              const place = autocomplete.getPlace();
              if (place.geometry && place.geometry.location) {
                const loc = place.geometry.location;
                const newPlace: PlaceResult = {
                  placeId: place.place_id,
                  name: place.name || 'Selected Place',
                  formattedAddress: place.formatted_address || place.name || '',
                  lat: typeof loc.lat === 'function' ? loc.lat() : loc.lat,
                  lng: typeof loc.lng === 'function' ? loc.lng() : loc.lng
                };
                onSelectPlace(newPlace);
                setSearchQuery(newPlace.name);
                setShowSuggestions(false);
              }
            });
          }

          // Initial resize trigger
          googleObj.maps.event.trigger(map, 'resize');
          fitMapBounds();

        } catch (err: any) {
          console.warn('Google Map JS SDK init error:', err);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // ResizeObserver: Trigger google.maps.event.trigger(map, 'resize') on container dimensions changes
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          if (googleMapInstanceRef.current && (window as any).google?.maps) {
            const g = (window as any).google;
            g.maps.event.trigger(googleMapInstanceRef.current, 'resize');
            if (!routeData?.routeGeometry && !routeData?.polylineCoords) {
              fitMapBounds();
            }
          }
        }
      }
    });

    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [fitMapBounds, routeData]);

  // Update Google Map Route and Bounds when destination or route data changes
  useEffect(() => {
    if (isGoogleSdkReady && googleMapInstanceRef.current && (window as any).google?.maps) {
      const g = (window as any).google;
      const map = googleMapInstanceRef.current;

      // Update destination marker position
      if (destMarkerRef.current) {
        destMarkerRef.current.setPosition({ lat: selectedDestination.lat, lng: selectedDestination.lng });
        destMarkerRef.current.setTitle(selectedDestination.name);
      }

      // Clear previous fallback polyline if any
      if (fallbackPolylineRef.current) {
        fallbackPolylineRef.current.setMap(null);
        fallbackPolylineRef.current = null;
      }

      // 1. Google Directions Route
      if (routeData?.routeGeometry && directionsRendererRef.current) {
        directionsRendererRef.current.setDirections(routeData.routeGeometry);
      } 
      // 2. High-precision Road Route Polyline (follows all roads/curves from CMB)
      else if (routeData?.polylineCoords && routeData.polylineCoords.length > 0) {
        if (directionsRendererRef.current) {
          directionsRendererRef.current.set('directions', null);
        }
        const polyline = new g.maps.Polyline({
          path: routeData.polylineCoords,
          geodesic: false,
          strokeColor: '#0B3D2E',
          strokeOpacity: 0.9,
          strokeWeight: 5,
          map: map
        });
        fallbackPolylineRef.current = polyline;

        const bounds = new g.maps.LatLngBounds();
        routeData.polylineCoords.forEach((pt) => bounds.extend(new g.maps.LatLng(pt.lat, pt.lng)));
        map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
      } 
      // 3. Re-fit bounds across CMB and Destination
      else {
        if (directionsRendererRef.current) {
          directionsRendererRef.current.set('directions', null);
        }
        fitMapBounds();
      }
    }
  }, [selectedDestination, routeData, isGoogleSdkReady, fitMapBounds]);

  // Live Places Search as customer types (Debounced)
  useEffect(() => {
    let active = true;
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSuggestions([]);
      setIsSearchingPlaces(false);
      return;
    }

    setIsSearchingPlaces(true);
    const delayTimer = setTimeout(() => {
      searchGooglePlaces(searchQuery, googleMapInstanceRef.current).then((results) => {
        if (active) {
          setSuggestions(results);
          setIsSearchingPlaces(false);
          setShowSuggestions(true);
        }
      });
    }, 250);

    return () => {
      active = false;
      clearTimeout(delayTimer);
    };
  }, [searchQuery]);

  // Click outside to close suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectPlace = async (place: PlaceResult) => {
    setShowSuggestions(false);
    setSearchQuery(place.name);

    if (place.lat && place.lat !== 7.8731 && place.lng !== 80.7718) {
      onSelectPlace(place);
      return;
    }

    if (place.placeId) {
      setIsResolvingPlace(true);
      const details = await getGooglePlaceDetails(place.placeId, googleMapInstanceRef.current);
      setIsResolvingPlace(false);

      if (details) {
        onSelectPlace({
          ...place,
          lat: details.lat,
          lng: details.lng,
          formattedAddress: details.formattedAddress || place.formattedAddress
        });
        return;
      }
    }

    onSelectPlace(place);
  };

  const handleExplicitSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearchingPlaces(true);
    searchGooglePlaces(searchQuery, googleMapInstanceRef.current).then((results) => {
      setSuggestions(results);
      setIsSearchingPlaces(false);
      setShowSuggestions(true);
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-md overflow-hidden">
      
      {/* 1. Google Places Search Bar */}
      <div className="p-4 sm:p-5 bg-white border-b border-stone-100 relative z-30" ref={searchContainerRef}>
        <label htmlFor="destination-search-input" className="text-xs font-bold text-[#176B52] uppercase tracking-wider block mb-2">
          Where are you going?
        </label>

        <div className="relative">
          <Search className="w-4 h-4 text-[#176B52] absolute left-4 top-1/2 -translate-y-1/2" aria-hidden="true" />
          <input
            id="destination-search-input"
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
            placeholder="Search any hotel, villa, resort, attraction, town or address (e.g. Heritance Kandalama, Ella, Galle)..."
            className="w-full pl-11 pr-24 py-3.5 bg-[#F8F7F2] border border-stone-300 rounded-2xl text-xs sm:text-sm font-semibold text-[#17231F] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#176B52] shadow-2xs"
            aria-label="Search destination location using Google Maps Places"
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {(isSearchingPlaces || isResolvingPlace) && (
              <Loader2 className="w-4 h-4 text-[#176B52] animate-spin" aria-label="Searching Google Places" />
            )}
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSuggestions([]);
                }}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
                aria-label="Clear destination search input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Suggestions Panel */}
        {showSuggestions && (
          <div className="absolute left-4 right-4 mt-2 bg-white border border-stone-200 rounded-2xl shadow-2xl py-2 max-h-80 overflow-y-auto z-50">
            <div className="px-3.5 py-1.5 text-[10px] font-bold text-[#176B52] uppercase tracking-wider border-b border-stone-100 flex items-center justify-between">
              <span>Google Maps Places Suggestions</span>
              <span className="text-[10px] text-[#68736E] font-normal">Any Sri Lanka Location</span>
            </div>

            {suggestions.length === 0 && !isSearchingPlaces ? (
              <div className="p-4 text-center text-xs text-[#68736E] space-y-2">
                <p>No immediate suggestions for "{searchQuery}".</p>
                <button
                  type="button"
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

      {/* 2. Direct High-Resolution Google Maps Container */}
      <div 
        className="w-full relative overflow-hidden bg-[#EAF2ED]"
        style={{
          width: '100%',
          height: '460px',
          minHeight: '360px',
          position: 'relative'
        }}
      >
        {/* The Native Google Maps Canvas */}
        <div 
          ref={mapContainerRef} 
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        />

        {/* Loading Route / Resolving Place Overlay */}
        {(isLoadingRoute || isResolvingPlace) && (
          <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center gap-2 z-20">
            <Loader2 className="w-8 h-8 text-[#176B52] animate-spin" />
            <span className="text-xs font-bold text-[#0B3D2E]">
              {isResolvingPlace ? 'Resolving place location...' : 'Calculating driving route & distance...'}
            </span>
          </div>
        )}

        {/* Floating Route Info HUD Card */}
        {routeData && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm bg-white p-4 rounded-2xl border border-stone-200 shadow-xl space-y-2 z-20">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] uppercase font-bold text-[#176B52] tracking-wider flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-[#39A982]" />
                BANDARANAIKE (CMB) &rarr; {selectedDestination.name.split(',')[0].toUpperCase()}
              </span>
              <span className="text-[10px] font-bold text-[#0B3D2E] bg-[#DDEFE8] px-2 py-0.5 rounded-full">
                {routeData.isLiveGoogleRoute ? 'Live Google Route' : 'Verified Route'}
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
      <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
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
          type="button"
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
