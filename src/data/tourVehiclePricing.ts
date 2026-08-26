export interface TourVehicleOption {
  id: 'car' | 'van';
  name: string;
  categoryTitle: string;
  capacityPassengers: number;
  capacityLuggage: number;
  dailyPriceLKR: number; // e.g. 15,000 for Car, 20,000 for Van
  dailyPriceUSD: number; // e.g. $50 for Car, $68 for Van
  description: string;
  badge: string;
  image: string;
  features: string[];
}

export const TOUR_VEHICLE_OPTIONS: TourVehicleOption[] = [
  {
    id: 'car',
    name: 'Private Sedan (Toyota Axio / Allion / Prius)',
    categoryTitle: 'Car',
    capacityPassengers: 3,
    capacityLuggage: 2,
    dailyPriceLKR: 15000,
    dailyPriceUSD: 50,
    description: 'Comfortable air-conditioned private car with dedicated English-speaking chauffeur-guide for 1–3 passengers.',
    badge: '1–3 PASSENGERS',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    features: [
      'Dedicated Chauffeur-Guide Daily',
      'All Fuel & Highway Tolls Included',
      'Full Vehicle Insurance',
      'Chauffeur Accommodation & Meals Covered',
      'Bottled Drinking Water Daily'
    ]
  },
  {
    id: 'van',
    name: 'Spacious Passenger Van (Toyota KDH High-Roof)',
    categoryTitle: 'Van',
    capacityPassengers: 8,
    capacityLuggage: 7,
    dailyPriceLKR: 20000,
    dailyPriceUSD: 68,
    description: 'Spacious high-roof air-conditioned passenger van with ample luggage room for families and small groups.',
    badge: '4–8 PASSENGERS',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    features: [
      'Dedicated Chauffeur-Guide Daily',
      'High-Roof Dual AC Climate Control',
      'All Fuel & Highway Tolls Included',
      'Spacious Reclining High-Back Seats',
      'Chauffeur Accommodation & Meals Covered',
      'Bottled Drinking Water Daily'
    ]
  }
];

export function calculateTourTotalPrice(
  dailyPrice: number,
  durationDays: number
): number {
  return dailyPrice * Math.max(1, durationDays);
}
