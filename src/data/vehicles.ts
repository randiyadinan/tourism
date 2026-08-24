import type { Vehicle } from '../types';

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh-sedan-luxury',
    name: 'Toyota Allion / Axio Executive Sedan',
    type: 'Sedan Car',
    capacityPassengers: 3,
    capacityLuggage: 2,
    dailyRateUSD: 65,
    transferRateCMBtoColombo: 35,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    features: ['Dual Climate Air Conditioning', 'Complimentary In-Car Wi-Fi', 'Bottled Mineral Water', 'USB Charging Ports', 'English-speaking Tourist Board Driver'],
    isAirConditioned: true
  },
  {
    id: 'veh-van-kdh',
    name: 'Toyota KDH High-Roof Luxury Mini Van',
    type: 'Mini Van',
    capacityPassengers: 7,
    capacityLuggage: 6,
    dailyRateUSD: 95,
    transferRateCMBtoColombo: 50,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    features: ['Spacious Reclining Velvet Seats', 'Dual Zone High AC', 'Large Luggage Compartment', 'High-Speed Wi-Fi', 'Bottled King Coconuts & Water'],
    isAirConditioned: true
  },
  {
    id: 'veh-prado-suv',
    name: 'Toyota Land Cruiser Prado 4x4 Luxury SUV',
    type: 'Luxury SUV',
    capacityPassengers: 4,
    capacityLuggage: 4,
    dailyRateUSD: 140,
    transferRateCMBtoColombo: 85,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    features: ['Full Leather Interior', 'Panoramic Sunroof', 'All-Terrain 4WD', 'Premium Sound System', 'Chilled Mini Cooler'],
    isAirConditioned: true
  },
  {
    id: 'veh-safari-cruiser',
    name: 'Toyota Hilux Custom 4x4 Safari Cruiser',
    type: 'Safari 4x4 Jeep',
    capacityPassengers: 6,
    capacityLuggage: 2,
    dailyRateUSD: 110,
    transferRateCMBtoColombo: 70,
    image: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80',
    features: ['Tiered Elevated Cushion Seating', '360° Open Safari Canopy', 'High Clearance Off-Road Suspension', 'Binoculars & Bird Books'],
    isAirConditioned: false
  },
  {
    id: 'veh-coaster-bus',
    name: 'Toyota Coaster Executive Mini Bus',
    type: 'Mini Bus',
    capacityPassengers: 18,
    capacityLuggage: 18,
    dailyRateUSD: 175,
    transferRateCMBtoColombo: 120,
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
    features: ['Individual Air Vents & Reading Lights', 'Public Address Mic System', 'Overhead Luggage Racks', 'Reclining Armchair Seats'],
    isAirConditioned: true
  }
];
