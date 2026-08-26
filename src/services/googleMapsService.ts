/**
 * Professional Google Maps, Places API & Routes API Service for LankaVoyage
 * Seamlessly integrates Google Maps Platform (Maps JavaScript, Places Autocomplete / PlacesService, Routes API / Directions)
 * Handles Place details retrieval directly using PlacesService, Geocoder, and AutocompleteService.
 */

// Bandaranaike International Airport (CMB) exact coordinates (business pickup origin)
export const AIRPORT_COORDINATES = {
  lat: 7.1808,
  lng: 79.8841,
  name: 'Bandaranaike International Airport (CMB)',
  address: 'Canada Friendship Rd, Katunayake 11450, Sri Lanka'
};

export interface PlaceResult {
  placeId?: string;
  name: string;
  formattedAddress: string;
  lat: number;
  lng: number;
  photoUrl?: string;
}

export interface RouteResult {
  origin: string;
  destination: string;
  distanceKm: number;
  durationText: string;
  durationMinutes: number;
  routeGeometry?: any;
  isLiveGoogleRoute: boolean;
  status: 'SUCCESS' | 'CALCULATING' | 'ERROR';
  errorMessage?: string;
}

// Global script loader for Google Maps JavaScript API
let googleMapsPromise: Promise<any> | null = null;
let placesServiceInstance: any = null;

export const loadGoogleMapsScript = (): Promise<any> => {
  if (typeof window !== 'undefined' && (window as any).google && (window as any).google.maps) {
    return Promise.resolve((window as any).google);
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  // Retrieve public client browser API key from Vite environment variable
  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';

  if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
    if (import.meta.env.DEV) {
      console.info(
        'Google Maps API Key not yet configured. Set VITE_GOOGLE_MAPS_API_KEY in your .env or Vercel environment variables.'
      );
    }
    return Promise.resolve(null);
  }

  googleMapsPromise = new Promise((resolve) => {
    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      if ((window as any).google?.maps) {
        resolve((window as any).google);
      } else {
        existingScript.addEventListener('load', () => resolve((window as any).google));
      }
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    // Load places, geometry, routes libraries
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&loading=async`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if ((window as any).google?.maps) {
        resolve((window as any).google);
      } else {
        resolve(null);
      }
    };

    script.onerror = () => {
      console.warn('Google Maps JavaScript SDK script failed to load.');
      resolve(null);
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
};

/**
 * Fetch full place geometry (lat, lng, formatted address) using Google PlacesService / Geocoder
 */
export async function getGooglePlaceDetails(placeId: string, mapInstance?: any): Promise<{ lat: number; lng: number; formattedAddress?: string } | null> {
  const g = typeof window !== 'undefined' ? (window as any).google : null;
  if (!g?.maps || !placeId) return null;

  // 1. Try PlacesService
  try {
    if (!placesServiceInstance) {
      const dummyDiv = mapInstance || document.createElement('div');
      placesServiceInstance = new g.maps.places.PlacesService(dummyDiv);
    }

    const placeDetails = await new Promise<any>((resolve) => {
      placesServiceInstance.getDetails(
        {
          placeId: placeId,
          fields: ['geometry', 'name', 'formatted_address']
        },
        (result: any, status: string) => {
          if (status === g.maps.places.PlacesServiceStatus.OK && result?.geometry?.location) {
            resolve(result);
          } else {
            resolve(null);
          }
        }
      );
    });

    if (placeDetails?.geometry?.location) {
      const loc = placeDetails.geometry.location;
      return {
        lat: typeof loc.lat === 'function' ? loc.lat() : loc.lat,
        lng: typeof loc.lng === 'function' ? loc.lng() : loc.lng,
        formattedAddress: placeDetails.formatted_address
      };
    }
  } catch (err) {
    console.warn('PlacesService.getDetails error, falling back to Geocoder:', err);
  }

  // 2. Try Geocoder by placeId
  if (g.maps.Geocoder) {
    try {
      const geocoder = new g.maps.Geocoder();
      const geoResult = await new Promise<any>((resolve) => {
        geocoder.geocode({ placeId: placeId }, (results: any[], status: string) => {
          if (status === 'OK' && results?.[0]?.geometry?.location) {
            resolve(results[0]);
          } else {
            resolve(null);
          }
        });
      });

      if (geoResult?.geometry?.location) {
        const loc = geoResult.geometry.location;
        return {
          lat: typeof loc.lat === 'function' ? loc.lat() : loc.lat,
          lng: typeof loc.lng === 'function' ? loc.lng() : loc.lng,
          formattedAddress: geoResult.formatted_address
        };
      }
    } catch (err) {
      console.warn('Geocoder.geocode error:', err);
    }
  }

  return null;
}

/**
 * Perform Google Places Autocomplete or Places Text Search across ANY location in Sri Lanka
 * (Hotels, Resorts, Villas, Airbnbs, Restaurants, Streets, Addresses, Attractions, Landmarks, Train Stations, Towns, Villages)
 */
export async function searchGooglePlaces(query: string, mapInstance?: any): Promise<PlaceResult[]> {
  if (!query || query.trim().length < 2) return [];

  const trimmedQuery = query.trim();
  const g = typeof window !== 'undefined' ? (window as any).google : null;

  // 1. Primary: Google Maps Places AutocompleteService
  if (g?.maps?.places?.AutocompleteService) {
    try {
      const autocompleteService = new g.maps.places.AutocompleteService();
      const predictions = await new Promise<any[]>((resolve) => {
        autocompleteService.getPlacePredictions(
          {
            input: trimmedQuery,
            componentRestrictions: { country: 'lk' }
          },
          (results: any[], status: string) => {
            if (status === 'OK' && results && results.length > 0) {
              resolve(results);
            } else {
              resolve([]);
            }
          }
        );
      });

      if (predictions && predictions.length > 0) {
        // Map predictions directly so suggestions appear instantly without waiting for geocoding
        return predictions.slice(0, 8).map((pred) => ({
          placeId: pred.place_id,
          name: pred.structured_formatting?.main_text || pred.description.split(',')[0],
          formattedAddress: pred.description,
          lat: 7.8731, // Placeholder until user selects
          lng: 80.7718
        }));
      }
    } catch (err) {
      console.warn('Google Places Autocomplete error:', err);
    }
  }

  // 2. Google Places TextSearchService
  if (g?.maps?.places?.PlacesService) {
    try {
      if (!placesServiceInstance) {
        const dummyDiv = mapInstance || document.createElement('div');
        placesServiceInstance = new g.maps.places.PlacesService(dummyDiv);
      }

      const textResults = await new Promise<any[]>((resolve) => {
        placesServiceInstance.textSearch(
          {
            query: `${trimmedQuery}, Sri Lanka`,
            bounds: new g.maps.LatLngBounds(
              new g.maps.LatLng(5.9, 79.5),
              new g.maps.LatLng(9.9, 81.9)
            )
          },
          (results: any[], status: string) => {
            if (status === g.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
              resolve(results);
            } else {
              resolve([]);
            }
          }
        );
      });

      if (textResults && textResults.length > 0) {
        return textResults.slice(0, 8).map((p) => {
          const loc = p.geometry?.location;
          return {
            placeId: p.place_id,
            name: p.name,
            formattedAddress: p.formatted_address || p.name,
            lat: loc ? (typeof loc.lat === 'function' ? loc.lat() : loc.lat) : 7.8731,
            lng: loc ? (typeof loc.lng === 'function' ? loc.lng() : loc.lng) : 80.7718
          };
        });
      }
    } catch (err) {
      console.warn('Google Places textSearch error:', err);
    }
  }

  // 3. Fallback Places Search API (Nominatim lookup when key is not loaded yet)
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      trimmedQuery + ', Sri Lanka'
    )}&countrycodes=lk&limit=8&addressdetails=1`;
    
    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'en'
      }
    });

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map((item: any) => {
          const mainName = item.namedetails?.name || item.name || item.display_name.split(',')[0].trim();
          return {
            placeId: String(item.place_id || item.osm_id),
            name: mainName,
            formattedAddress: item.display_name,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon)
          };
        });
      }
    }
  } catch (err) {
    console.warn('Places search lookup error:', err);
  }

  return [];
}

/**
 * Calculate Real Driving Road Distance & Duration using Google Routes API / Directions Service
 */
export async function calculateGoogleRoute(
  origin: { lat: number; lng: number; name?: string },
  dest: { lat: number; lng: number; name?: string; address?: string }
): Promise<RouteResult> {
  const g = typeof window !== 'undefined' ? (window as any).google : null;

  // 1. Primary Provider: Google Maps Routes / Directions Service
  if (g?.maps?.DirectionsService) {
    try {
      const directionsService = new g.maps.DirectionsService();
      const result = await new Promise<any>((resolve, reject) => {
        directionsService.route(
          {
            origin: new g.maps.LatLng(origin.lat, origin.lng),
            destination: new g.maps.LatLng(dest.lat, dest.lng),
            travelMode: g.maps.TravelMode.DRIVING,
            drivingOptions: {
              departureTime: new Date(),
              trafficModel: g.maps.TrafficModel.BEST_GUESS
            }
          },
          (res: any, status: string) => {
            if (status === 'OK' && res) {
              resolve(res);
            } else {
              reject(new Error(`Google Directions failed: ${status}`));
            }
          }
        );
      });

      const route = result.routes[0];
      const leg = route.legs[0];
      const distanceKm = Math.round((leg.distance?.value || 0) / 1000);
      const durationText = leg.duration?.text || '';
      const durationMinutes = Math.round((leg.duration?.value || 0) / 60);

      return {
        origin: origin.name || 'Bandaranaike International Airport (CMB)',
        destination: dest.name || 'Selected Destination',
        distanceKm: Math.max(8, distanceKm),
        durationText: durationText,
        durationMinutes: durationMinutes,
        routeGeometry: result,
        isLiveGoogleRoute: true,
        status: 'SUCCESS'
      };
    } catch (err) {
      console.warn('Google Directions API error:', err);
    }
  }

  // 2. High-precision Driving Route Engine fallback
  try {
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${dest.lng},${dest.lat}?overview=false`;
    const response = await fetch(osrmUrl);
    if (response.ok) {
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const distanceKm = Math.round(route.distance / 1000);
        const durationMinutes = Math.round(route.duration / 60);
        const hours = Math.floor(durationMinutes / 60);
        const mins = durationMinutes % 60;
        const durationText = hours > 0 ? (mins > 0 ? `${hours} hr ${mins} min` : `${hours} hours`) : `${mins} mins`;

        return {
          origin: origin.name || 'Bandaranaike International Airport (CMB)',
          destination: dest.name || 'Selected Destination',
          distanceKm: Math.max(8, distanceKm),
          durationText: durationText,
          durationMinutes: durationMinutes,
          isLiveGoogleRoute: false,
          status: 'SUCCESS'
        };
      }
    }
  } catch (err) {
    console.warn('Routing engine error:', err);
  }

  // 3. Precision Road Terrain Model
  const R = 6371;
  const dLat = ((dest.lat - origin.lat) * Math.PI) / 180;
  const dLon = ((dest.lng - origin.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((origin.lat * Math.PI) / 180) *
      Math.cos((dest.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightLineKm = R * c;

  const isHillCountry = dest.lat > 6.7 && dest.lat < 7.5 && dest.lng > 80.4;
  const roadMultiplier = isHillCountry ? 1.45 : 1.34;
  const roadDistanceKm = Math.round(straightLineKm * roadMultiplier);

  const avgSpeed = isHillCountry ? 35 : (dest.lat < 6.5 ? 65 : 45);
  const totalMinutes = Math.round((roadDistanceKm / avgSpeed) * 60);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const durationText = hours > 0 ? (mins > 0 ? `${hours} hr ${mins} min` : `${hours} hours`) : `${mins} mins`;

  return {
    origin: origin.name || 'Bandaranaike International Airport (CMB)',
    destination: dest.name || 'Selected Destination',
    distanceKm: Math.max(8, roadDistanceKm),
    durationText: durationText,
    durationMinutes: totalMinutes,
    isLiveGoogleRoute: false,
    status: 'SUCCESS'
  };
}
