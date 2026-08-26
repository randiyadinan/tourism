export interface DestinationDistance {
  id: string;
  name: string;
  distanceKm: number;
  estimatedHours: string;
  region: string;
  matchingTourSlug?: string;
  matchingTourTitle?: string;
}

export const DESTINATION_DISTANCES: DestinationDistance[] = [
  {
    id: 'dest-colombo',
    name: 'Colombo City (Hotels / Galle Face / Port City)',
    distanceKm: 35,
    estimatedHours: '45 mins',
    region: 'Western Province',
    matchingTourSlug: 'ceylon-odyssey-classic-sri-lanka-10-days',
    matchingTourTitle: 'Ceylon Odyssey: Classic Sri Lanka (10 Days)'
  },
  {
    id: 'dest-negombo',
    name: 'Negombo Beach & Lagoon',
    distanceKm: 12,
    estimatedHours: '20 mins',
    region: 'Western Province',
    matchingTourSlug: 'ceylon-odyssey-classic-sri-lanka-10-days',
    matchingTourTitle: 'Ceylon Odyssey: Classic Sri Lanka (10 Days)'
  },
  {
    id: 'dest-kandy',
    name: 'Kandy (Cultural Capital & Temple of the Tooth)',
    distanceKm: 115,
    estimatedHours: '2.5 - 3 hours',
    region: 'Central Province',
    matchingTourSlug: 'unesco-cultural-heritage-triangle-7-days',
    matchingTourTitle: 'UNESCO Cultural Heritage & Ancient Kingdoms (7 Days)'
  },
  {
    id: 'dest-sigiriya',
    name: 'Sigiriya / Dambulla / Habarana',
    distanceKm: 150,
    estimatedHours: '3.5 hours',
    region: 'Central Province',
    matchingTourSlug: 'unesco-cultural-heritage-triangle-7-days',
    matchingTourTitle: 'UNESCO Cultural Heritage & Ancient Kingdoms (7 Days)'
  },
  {
    id: 'dest-galle',
    name: 'Galle Fort / Unawatuna',
    distanceKm: 155,
    estimatedHours: '2 hours (Expressway)',
    region: 'Southern Province',
    matchingTourSlug: 'sri-lanka-honeymoon-serenade-8-days',
    matchingTourTitle: 'Ceylon Honeymoon Serenade & Private Villas (8 Days)'
  },
  {
    id: 'dest-bentota',
    name: 'Bentota / Beruwala / Ahungalla',
    distanceKm: 110,
    estimatedHours: '1.5 hours (Expressway)',
    region: 'Southern Province',
    matchingTourSlug: 'sri-lanka-honeymoon-serenade-8-days',
    matchingTourTitle: 'Ceylon Honeymoon Serenade & Private Villas (8 Days)'
  },
  {
    id: 'dest-mirissa',
    name: 'Mirissa / Weligama Surf & Whale Coast',
    distanceKm: 175,
    estimatedHours: '2.5 hours (Expressway)',
    region: 'Southern Province',
    matchingTourSlug: 'sri-lanka-honeymoon-serenade-8-days',
    matchingTourTitle: 'Ceylon Honeymoon Serenade & Private Villas (8 Days)'
  },
  {
    id: 'dest-nuwara-eliya',
    name: 'Nuwara Eliya / Tea Country',
    distanceKm: 165,
    estimatedHours: '4.5 hours',
    region: 'Central Highlands',
    matchingTourSlug: 'ceylon-tea-trails-misty-highlands-6-days',
    matchingTourTitle: 'Ceylon Tea Trails & Misty Highlands (6 Days)'
  },
  {
    id: 'dest-ella',
    name: 'Ella Highland Valley & Nine Arches Bridge',
    distanceKm: 215,
    estimatedHours: '5 hours',
    region: 'Uva Province',
    matchingTourSlug: 'ceylon-tea-trails-misty-highlands-6-days',
    matchingTourTitle: 'Ceylon Tea Trails & Misty Highlands (6 Days)'
  },
  {
    id: 'dest-yala',
    name: 'Yala National Park / Tissamaharama',
    distanceKm: 245,
    estimatedHours: '3.5 - 4 hours (Expressway)',
    region: 'Southern / Uva',
    matchingTourSlug: 'wild-ceylon-leopard-safari-expedition-5-days',
    matchingTourTitle: 'Wild Ceylon: Big 5 Safari Expedition (5 Days)'
  },
  {
    id: 'dest-trincomalee',
    name: 'Trincomalee / Nilaveli Beach',
    distanceKm: 240,
    estimatedHours: '5 hours',
    region: 'Eastern Province',
    matchingTourSlug: 'ceylon-odyssey-classic-sri-lanka-10-days',
    matchingTourTitle: 'Ceylon Odyssey: Classic Sri Lanka (10 Days)'
  },
  {
    id: 'dest-arugam-bay',
    name: 'Arugam Bay Surf Coast',
    distanceKm: 320,
    estimatedHours: '6.5 hours',
    region: 'Eastern Province',
    matchingTourSlug: 'wild-ceylon-leopard-safari-expedition-5-days',
    matchingTourTitle: 'Wild Ceylon: Big 5 Safari Expedition (5 Days)'
  },
  {
    id: 'dest-jaffna',
    name: 'Jaffna (Northern Heritage)',
    distanceKm: 380,
    estimatedHours: '7 hours',
    region: 'Northern Province',
    matchingTourSlug: 'unesco-cultural-heritage-triangle-7-days',
    matchingTourTitle: 'UNESCO Cultural Heritage & Ancient Kingdoms (7 Days)'
  }
];

export function calculateDistanceTransferRate(
  distanceKm: number,
  vehicleType: 'Standard Car' | 'Luxury Car' | 'Van' | 'Safari SUV',
  isRoundTrip: boolean = false
): number {
  // Base rate per km (covering fuel, highway expressway tolls, licensed chauffeur allowance, airport parking)
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
