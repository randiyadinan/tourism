export interface AirportOption {
  id: string;
  code: string;
  name: string;
  location: string;
  isDefault?: boolean;
}

export const SUPPORTED_AIRPORTS: AirportOption[] = [
  {
    id: 'airport-cmb',
    code: 'CMB',
    name: 'Bandaranaike International Airport',
    location: 'Katunayake, Colombo, Sri Lanka',
    isDefault: true
  },
  {
    id: 'airport-hri',
    code: 'HRI',
    name: 'Mattala Rajapaksa International Airport',
    location: 'Hambantota, Southern Sri Lanka'
  },
  {
    id: 'airport-jaf',
    code: 'JAF',
    name: 'Jaffna International Airport',
    location: 'Palaly, Northern Sri Lanka'
  }
];

export interface DestinationDistance {
  id: string;
  name: string;
  shortName: string;
  distanceKm: number;
  estimatedHours: string;
  region: string;
  popularFor: string;
  heroImage: string;
  matchingTourSlug?: string;
  matchingTourTitle?: string;
}

// Real road distance map from Bandaranaike International Airport (CMB)
export const DESTINATION_DISTANCES: DestinationDistance[] = [
  {
    id: 'dest-colombo',
    name: 'Colombo City (Hotels / Galle Face / Port City)',
    shortName: 'Colombo',
    distanceKm: 35,
    estimatedHours: '45 mins',
    region: 'Western Province',
    popularFor: 'Boutique city hotels, dining & shopping',
    heroImage: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80',
    matchingTourSlug: 'ceylon-odyssey-classic-sri-lanka-10-days',
    matchingTourTitle: 'Ceylon Odyssey: Classic Sri Lanka (10 Days)'
  },
  {
    id: 'dest-negombo',
    name: 'Negombo Beach & Coastal Resorts',
    shortName: 'Negombo',
    distanceKm: 12,
    estimatedHours: '20 mins',
    region: 'Western Coast',
    popularFor: 'Quick airport layovers, beach hotels & seafood lagoons',
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    matchingTourSlug: 'ceylon-odyssey-classic-sri-lanka-10-days',
    matchingTourTitle: 'Ceylon Odyssey: Classic Sri Lanka (10 Days)'
  },
  {
    id: 'dest-kandy',
    name: 'Kandy (Temple of the Tooth & Hill Capital)',
    shortName: 'Kandy',
    distanceKm: 115,
    estimatedHours: '3 hours',
    region: 'Central Highlands',
    popularFor: 'Sacred Temple of the Tooth, royal botanical gardens & cultural dance',
    heroImage: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
    matchingTourSlug: 'ceylon-odyssey-classic-sri-lanka-10-days',
    matchingTourTitle: 'Ceylon Odyssey: Classic Sri Lanka (10 Days)'
  },
  {
    id: 'dest-sigiriya',
    name: 'Sigiriya & Dambulla (Cultural Triangle)',
    shortName: 'Sigiriya',
    distanceKm: 155,
    estimatedHours: '3.5 hours',
    region: 'Cultural Triangle',
    popularFor: '5th-century Lion Rock fortress citadel & Dambulla cave temples',
    heroImage: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80',
    matchingTourSlug: 'unesco-cultural-heritage-triangle-7-days',
    matchingTourTitle: 'UNESCO Cultural Heritage & Ancient Kingdoms (7 Days)'
  },
  {
    id: 'dest-galle',
    name: 'Galle Fort & Unawatuna Coast',
    shortName: 'Galle',
    distanceKm: 155,
    estimatedHours: '2 hours (Expressway)',
    region: 'Southern Province',
    popularFor: 'UNESCO Dutch Fort ramparts, colonial boutique cafes & beaches',
    heroImage: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
    matchingTourSlug: 'southern-coast-yala-safari-6-days',
    matchingTourTitle: 'Southern Coast, Whales & Yala Safari (6 Days)'
  },
  {
    id: 'dest-bentota',
    name: 'Bentota & Beruwala Luxury Beach Belt',
    shortName: 'Bentota',
    distanceKm: 110,
    estimatedHours: '1.5 hours (Expressway)',
    region: 'South-West Coast',
    popularFor: 'Golden sand beaches, luxury 5-star resorts & water sports',
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    matchingTourSlug: 'southern-coast-yala-safari-6-days',
    matchingTourTitle: 'Southern Coast, Whales & Yala Safari (6 Days)'
  },
  {
    id: 'dest-nuwara-eliya',
    name: 'Nuwara Eliya (Little England & Tea Country)',
    shortName: 'Nuwara Eliya',
    distanceKm: 165,
    estimatedHours: '4.5 hours',
    region: 'Central Tea Country',
    popularFor: 'Cool mountain climate, high-grown Ceylon tea estates & waterfalls',
    heroImage: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80',
    matchingTourSlug: 'ceylon-odyssey-classic-sri-lanka-10-days',
    matchingTourTitle: 'Ceylon Odyssey: Classic Sri Lanka (10 Days)'
  },
  {
    id: 'dest-ella',
    name: 'Ella (Nine Arches Bridge & Mountain Peaks)',
    shortName: 'Ella',
    distanceKm: 215,
    estimatedHours: '5.5 hours',
    region: 'Uva Province',
    popularFor: 'Nine Arches viaduct bridge, Little Adam\'s Peak & scenic cafes',
    heroImage: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80',
    matchingTourSlug: 'ceylon-odyssey-classic-sri-lanka-10-days',
    matchingTourTitle: 'Ceylon Odyssey: Classic Sri Lanka (10 Days)'
  },
  {
    id: 'dest-yala',
    name: 'Yala National Park (Safari Camps & Lodges)',
    shortName: 'Yala',
    distanceKm: 285,
    estimatedHours: '4.5 hours (Expressway)',
    region: 'Southern Wilderness',
    popularFor: 'World\'s highest density leopard safaris, sloth bears & wild elephants',
    heroImage: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
    matchingTourSlug: 'wild-sri-lanka-safari-expedition-8-days',
    matchingTourTitle: 'Wild Sri Lanka: Ultimate Safari Expedition (8 Days)'
  },
  {
    id: 'dest-mirissa',
    name: 'Mirissa & Weligama Bay (Whales & Surfing)',
    shortName: 'Mirissa',
    distanceKm: 180,
    estimatedHours: '2.5 hours (Expressway)',
    region: 'Southern Coast',
    popularFor: 'Blue whale watching charters, palm hill viewpoints & beginner surfing',
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    matchingTourSlug: 'southern-coast-yala-safari-6-days',
    matchingTourTitle: 'Southern Coast, Whales & Yala Safari (6 Days)'
  },
  {
    id: 'dest-anuradhapura',
    name: 'Anuradhapura Sacred Kingdom',
    shortName: 'Anuradhapura',
    distanceKm: 175,
    estimatedHours: '3.5 hours',
    region: 'North Central Province',
    popularFor: 'Ruwanwelisaya stupa, sacred Jaya Sri Maha Bodhi & monastic ruins',
    heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    matchingTourSlug: 'unesco-cultural-heritage-triangle-7-days',
    matchingTourTitle: 'UNESCO Cultural Heritage & Ancient Kingdoms (7 Days)'
  },
  {
    id: 'dest-tangalle',
    name: 'Tangalle & Dikwella (Secluded South Coast)',
    shortName: 'Tangalle',
    distanceKm: 215,
    estimatedHours: '3 hours (Expressway)',
    region: 'Southern Province',
    popularFor: 'Serene secluded coves, turtle conservation & luxury cliff villas',
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    matchingTourSlug: 'southern-coast-yala-safari-6-days',
    matchingTourTitle: 'Southern Coast, Whales & Yala Safari (6 Days)'
  },
  {
    id: 'dest-arugam-bay',
    name: 'Arugam Bay (World-Class Surf Point)',
    shortName: 'Arugam Bay',
    distanceKm: 340,
    estimatedHours: '6.5 hours',
    region: 'Eastern Province',
    popularFor: 'Right hand point break surf, lagoon eco tours & bohemian cafes',
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    matchingTourSlug: 'east-coast-trincomalee-arugambay-8-days',
    matchingTourTitle: 'East Coast Sun & Surf: Trincomalee & Arugam Bay (8 Days)'
  },
  {
    id: 'dest-trincomalee',
    name: 'Trincomalee & Nilaveli Beach',
    shortName: 'Trincomalee',
    distanceKm: 245,
    estimatedHours: '5 hours',
    region: 'Eastern Province',
    popularFor: 'Pigeon Island coral reef snorkelling, Koneswaram temple & white sands',
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    matchingTourSlug: 'east-coast-trincomalee-arugambay-8-days',
    matchingTourTitle: 'East Coast Sun & Surf: Trincomalee & Arugam Bay (8 Days)'
  },
  {
    id: 'dest-polonnaruwa',
    name: 'Polonnaruwa Medieval Kingdom',
    shortName: 'Polonnaruwa',
    distanceKm: 210,
    estimatedHours: '4.5 hours',
    region: 'North Central Province',
    popularFor: 'Gal Vihara rock-cut statues, Parakrama Samudra & cycling ruins',
    heroImage: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80',
    matchingTourSlug: 'unesco-cultural-heritage-triangle-7-days',
    matchingTourTitle: 'UNESCO Cultural Heritage & Ancient Kingdoms (7 Days)'
  },
  {
    id: 'dest-jaffna',
    name: 'Jaffna (Northern Heritage & Nallur Temple)',
    shortName: 'Jaffna',
    distanceKm: 380,
    estimatedHours: '7 hours',
    region: 'Northern Province',
    popularFor: 'Nallur temple pujas, Delft island wild horses & cuisine',
    heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    matchingTourSlug: 'unesco-cultural-heritage-triangle-7-days',
    matchingTourTitle: 'UNESCO Cultural Heritage & Ancient Kingdoms (7 Days)'
  }
];

export interface TransferVehicleOption {
  id: string;
  vehicleCode: 'standard-car' | 'luxury-car' | 'van';
  name: string;
  categoryTitle: string;
  capacityPassengers: number;
  capacityLuggage: number;
  ratePerKmLKR: number;
  baseBookingFeeLKR: number;
  description: string;
  badge: string;
  image: string;
  features: string[];
}

export const TRANSFER_VEHICLE_OPTIONS: TransferVehicleOption[] = [
  {
    id: 'veh-car',
    vehicleCode: 'standard-car',
    name: 'Private Air-Conditioned Sedan Car (Toyota / Honda)',
    categoryTitle: 'CAR',
    capacityPassengers: 3,
    capacityLuggage: 3,
    ratePerKmLKR: 200,
    baseBookingFeeLKR: 5000,
    description: 'Private air-conditioned car with dedicated English-speaking chauffeur',
    badge: '1–3 PASSENGERS',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    features: ['Climate AC', '2–3 Suitcases', 'English Chauffeur', 'Highway Tolls Included', 'Complimentary Bottled Water']
  },
  {
    id: 'veh-van',
    vehicleCode: 'van',
    name: 'Toyota KDH High-Roof Luxury Passenger Van',
    categoryTitle: 'VAN',
    capacityPassengers: 8,
    capacityLuggage: 7,
    ratePerKmLKR: 260,
    baseBookingFeeLKR: 6500,
    description: 'Spacious high-roof passenger van ideal for families and large groups',
    badge: '4–8 PASSENGERS',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    features: ['Spacious Reclining High-Back Seats', 'Large Family Luggage Compartment', 'Dual Zone High AC', 'All Tolls & Fuel Included', 'Child Safety Seat Available']
  }
];

export function calculateRealRoadTransferPrice(
  distanceKm: number,
  vehicleOption: TransferVehicleOption,
  isRoundTrip: boolean = false
): number {
  const oneWayPrice = Math.round(vehicleOption.baseBookingFeeLKR + (distanceKm * vehicleOption.ratePerKmLKR));
  return isRoundTrip ? Math.round(oneWayPrice * 1.85) : oneWayPrice;
}

export function calculateDistanceTransferRate(
  distanceKm: number,
  vehicleType: 'Standard Car' | 'Luxury Car' | 'Van' | 'Safari SUV',
  isRoundTrip: boolean = false
): number {
  let perKmRate = 200;
  let baseBookingFee = 5000;

  if (vehicleType === 'Luxury Car') {
    perKmRate = 300;
    baseBookingFee = 7500;
  } else if (vehicleType === 'Van') {
    perKmRate = 260;
    baseBookingFee = 6500;
  } else if (vehicleType === 'Safari SUV') {
    perKmRate = 340;
    baseBookingFee = 9000;
  }

  const oneWayPrice = Math.round(baseBookingFee + (distanceKm * perKmRate));
  return isRoundTrip ? Math.round(oneWayPrice * 1.85) : oneWayPrice;
}
