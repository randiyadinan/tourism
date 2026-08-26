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
    region: 'Western Province',
    popularFor: 'Lagoon boat tours, beach relaxation & fresh seafood',
    heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    matchingTourSlug: 'ceylon-odyssey-classic-sri-lanka-10-days',
    matchingTourTitle: 'Ceylon Odyssey: Classic Sri Lanka (10 Days)'
  },
  {
    id: 'dest-kandy',
    name: 'Kandy (Temple of the Tooth & Royal Botanical Gardens)',
    shortName: 'Kandy',
    distanceKm: 115,
    estimatedHours: '2.5 - 3 hours',
    region: 'Central Province',
    popularFor: 'UNESCO Sacred Temple, cultural dance & scenic lake',
    heroImage: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
    matchingTourSlug: 'unesco-cultural-heritage-triangle-7-days',
    matchingTourTitle: 'UNESCO Cultural Heritage & Ancient Kingdoms (7 Days)'
  },
  {
    id: 'dest-sigiriya',
    name: 'Sigiriya / Dambulla / Habarana Cultural Triangle',
    shortName: 'Sigiriya',
    distanceKm: 150,
    estimatedHours: '3.5 hours',
    region: 'Central Province',
    popularFor: 'Lion Rock Fortress, cave temples & elephant safaris',
    heroImage: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80',
    matchingTourSlug: 'unesco-cultural-heritage-triangle-7-days',
    matchingTourTitle: 'UNESCO Cultural Heritage & Ancient Kingdoms (7 Days)'
  },
  {
    id: 'dest-galle',
    name: 'Galle Fort / Unawatuna Beach',
    shortName: 'Galle',
    distanceKm: 155,
    estimatedHours: '2 hours (Expressway)',
    region: 'Southern Province',
    popularFor: '17th-century UNESCO Dutch ramparts & coastal cafes',
    heroImage: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
    matchingTourSlug: 'sri-lanka-honeymoon-serenade-8-days',
    matchingTourTitle: 'Ceylon Honeymoon Serenade & Private Villas (8 Days)'
  },
  {
    id: 'dest-bentota',
    name: 'Bentota / Beruwala / Ahungalla Beach',
    shortName: 'Bentota',
    distanceKm: 110,
    estimatedHours: '1.5 hours (Expressway)',
    region: 'Southern Province',
    popularFor: 'Water sports, turtle conservation & luxury seaside villas',
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    matchingTourSlug: 'sri-lanka-honeymoon-serenade-8-days',
    matchingTourTitle: 'Ceylon Honeymoon Serenade & Private Villas (8 Days)'
  },
  {
    id: 'dest-mirissa',
    name: 'Mirissa / Weligama Surf & Whale Coast',
    shortName: 'Mirissa',
    distanceKm: 175,
    estimatedHours: '2.5 hours (Expressway)',
    region: 'Southern Province',
    popularFor: 'Blue whale watching, surf breaks & sunset beach lounges',
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    matchingTourSlug: 'sri-lanka-honeymoon-serenade-8-days',
    matchingTourTitle: 'Ceylon Honeymoon Serenade & Private Villas (8 Days)'
  },
  {
    id: 'dest-nuwara-eliya',
    name: 'Nuwara Eliya / Ceylon Tea Country',
    shortName: 'Nuwara Eliya',
    distanceKm: 165,
    estimatedHours: '4.5 hours',
    region: 'Central Highlands',
    popularFor: 'Tea estates, Gregory Lake, waterfalls & cool climate',
    heroImage: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80',
    matchingTourSlug: 'ceylon-tea-trails-misty-highlands-6-days',
    matchingTourTitle: 'Ceylon Tea Trails & Misty Highlands (6 Days)'
  },
  {
    id: 'dest-ella',
    name: 'Ella Highland Valley & Nine Arches Bridge',
    shortName: 'Ella',
    distanceKm: 215,
    estimatedHours: '5 hours',
    region: 'Uva Province',
    popularFor: 'Little Adams Peak, Ravana Falls & scenic colonial bridge',
    heroImage: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80',
    matchingTourSlug: 'ceylon-tea-trails-misty-highlands-6-days',
    matchingTourTitle: 'Ceylon Tea Trails & Misty Highlands (6 Days)'
  },
  {
    id: 'dest-yala',
    name: 'Yala National Park / Tissamaharama Safari Zone',
    shortName: 'Yala',
    distanceKm: 245,
    estimatedHours: '3.5 - 4 hours (Expressway)',
    region: 'Southern / Uva',
    popularFor: 'High leopard density game drives & luxury glamping',
    heroImage: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80',
    matchingTourSlug: 'wild-ceylon-leopard-safari-expedition-5-days',
    matchingTourTitle: 'Wild Ceylon: Big 5 Safari Expedition (5 Days)'
  },
  {
    id: 'dest-trincomalee',
    name: 'Trincomalee / Nilaveli Beach & Pigeon Island',
    shortName: 'Trincomalee',
    distanceKm: 240,
    estimatedHours: '5 hours',
    region: 'Eastern Province',
    popularFor: 'Pigeon Island coral snorkeling & clifftop Hindu temple',
    heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    matchingTourSlug: 'ceylon-odyssey-classic-sri-lanka-10-days',
    matchingTourTitle: 'Ceylon Odyssey: Classic Sri Lanka (10 Days)'
  },
  {
    id: 'dest-arugam-bay',
    name: 'Arugam Bay Surf Coast',
    shortName: 'Arugam Bay',
    distanceKm: 320,
    estimatedHours: '6.5 hours',
    region: 'Eastern Province',
    popularFor: 'World-class point breaks, lagoons & Kumana safaris',
    heroImage: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80',
    matchingTourSlug: 'wild-ceylon-leopard-safari-expedition-5-days',
    matchingTourTitle: 'Wild Ceylon: Big 5 Safari Expedition (5 Days)'
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
  ratePerKmUSD: number;
  baseBookingFeeUSD: number;
  description: string;
  badge: string;
  image: string;
  features: string[];
}

export const TRANSFER_VEHICLE_OPTIONS: TransferVehicleOption[] = [
  {
    id: 'veh-sedan-standard',
    vehicleCode: 'standard-car',
    name: 'Toyota Axio / Prius / Allion Sedan',
    categoryTitle: 'STANDARD CAR',
    capacityPassengers: 3,
    capacityLuggage: 2,
    ratePerKmUSD: 0.65,
    baseBookingFeeUSD: 15,
    description: 'Private air-conditioned vehicle with dedicated English-speaking chauffeur',
    badge: '1–3 PASSENGERS',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    features: ['Climate AC', '2 Large Suitcases', 'English Chauffeur', 'Highway Tolls Included', 'Complimentary Bottled Water']
  },
  {
    id: 'veh-sedan-luxury',
    vehicleCode: 'luxury-car',
    name: 'Toyota Land Cruiser Prado / Mercedes Executive',
    categoryTitle: 'LUXURY CAR',
    capacityPassengers: 3,
    capacityLuggage: 3,
    ratePerKmUSD: 0.95,
    baseBookingFeeUSD: 25,
    description: 'Premium private transfer with VIP amenities, leather seating & Wi-Fi',
    badge: '1–3 PASSENGERS',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    features: ['Executive Leather Seating', 'In-Car Wi-Fi', 'Bottled King Coconuts & Water', 'Expressway Tolls Included', 'VIP Name Sign Board Meet']
  },
  {
    id: 'veh-van-kdh',
    vehicleCode: 'van',
    name: 'Toyota KDH High-Roof Luxury Passenger Van',
    categoryTitle: 'VAN',
    capacityPassengers: 8,
    capacityLuggage: 7,
    ratePerKmUSD: 0.85,
    baseBookingFeeUSD: 20,
    description: 'Ideal for families and groups with extra spacious luggage capacity',
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
  const oneWayPrice = Math.round(vehicleOption.baseBookingFeeUSD + (distanceKm * vehicleOption.ratePerKmUSD));
  return isRoundTrip ? Math.round(oneWayPrice * 1.85) : oneWayPrice;
}

export function calculateDistanceTransferRate(
  distanceKm: number,
  vehicleType: 'Standard Car' | 'Luxury Car' | 'Van' | 'Safari SUV',
  isRoundTrip: boolean = false
): number {
  let perKmRate = 0.65;
  let baseBookingFee = 15;

  if (vehicleType === 'Luxury Car') {
    perKmRate = 0.95;
    baseBookingFee = 25;
  } else if (vehicleType === 'Van') {
    perKmRate = 0.85;
    baseBookingFee = 20;
  } else if (vehicleType === 'Safari SUV') {
    perKmRate = 1.10;
    baseBookingFee = 30;
  }

  const oneWayPrice = Math.round(baseBookingFee + (distanceKm * perKmRate));
  return isRoundTrip ? Math.round(oneWayPrice * 1.85) : oneWayPrice;
}
