import type { Hotel } from '../types';

export const INITIAL_HOTELS: Hotel[] = [
  {
    id: 'hotel-aliya-sigiriya',
    name: 'Aliya Resort & Spa',
    destination: 'Sigiriya',
    starCategory: 5,
    pricePerNightUSD: 48000,
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    description: 'An architectural tribute to the Sri Lankan elephant with infinity pool framing uninterrupted views of Sigiriya Rock Fortress.',
    amenities: ['Infinity Pool', 'Ayurvedic Spa', '3 Restaurants', 'Wi-Fi', 'Gym', 'Bar', 'Room Service'],
    rating: 4.9
  },
  {
    id: 'hotel-ulagalla',
    name: 'Uga Ulagalla Resort',
    destination: 'Sigiriya',
    starCategory: 'Boutique Luxury',
    pricePerNightUSD: 115000,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    description: '58-acre eco-luxury estate featuring 25 standalone villas, each with a private plunge pool, surrounded by paddy fields and lily ponds.',
    amenities: ['Private Pool Villas', 'Horse Riding', 'Organic Farm', 'Archery', 'Fine Dining', 'Spa'],
    rating: 5.0
  },
  {
    id: 'hotel-earls-regency',
    name: 'Earl’s Regency Hotel',
    destination: 'Kandy',
    starCategory: 5,
    pricePerNightUSD: 42000,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    description: 'Nestled on hilltops overlooking the Mahaweli River, offering regal Kandyan architecture and tranquil mountain vistas.',
    amenities: ['Swimming Pool', 'Spa', 'Riverview Balconies', 'Tennis Court', 'Executive Lounge'],
    rating: 4.8
  },
  {
    id: 'hotel-grand-nuwara-eliya',
    name: 'The Grand Hotel Nuwara Eliya',
    destination: 'Nuwara Eliya',
    starCategory: 'Boutique Luxury',
    pricePerNightUSD: 65000,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    description: 'A 19th-century British colonial heritage landmark with wood fireplaces, manicured rose gardens, and legendary high tea.',
    amenities: ['Heated Indoor Pool', 'High Tea Lounge', 'Billiards Room', 'Wine Cellar', 'Spa'],
    rating: 4.9
  },
  {
    id: 'hotel-98-acres-ella',
    name: '98 Acres Resort & Spa',
    destination: 'Ella',
    starCategory: 'Boutique Luxury',
    pricePerNightUSD: 88000,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    description: 'Eco-luxury chalets crafted from recycled railway sleepers and straw thatch, perched directly on a 98-acre scenic tea estate.',
    amenities: ['Helipad', 'Tea Estate Chalets', 'Infinity Pool', 'Mountain View Restaurant', 'Spa'],
    rating: 5.0
  },
  {
    id: 'hotel-jetwing-yala',
    name: 'Jetwing Yala',
    destination: 'Yala',
    starCategory: 5,
    pricePerNightUSD: 72000,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    description: 'Set on the ocean border of Yala National Park, featuring massive solar arrays, coastal dune views, and safari glamping tents.',
    amenities: ['Oceanfront Pool', 'Wildlife Naturalist Desk', 'Beach Lounge', 'Spa', 'Outdoor Dining'],
    rating: 4.9
  },
  {
    id: 'hotel-fort-bazaar-galle',
    name: 'Fort Bazaar by Teardrop Hotels',
    destination: 'Galle',
    starCategory: 'Boutique Luxury',
    pricePerNightUSD: 78000,
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
    description: 'A restored 17th-century merchant mansion on Church Street with Moorish arches, central courtyard, and contemporary luxury.',
    amenities: ['Courtyard Bistro', 'Private Cinema', 'Z Spa', 'Concierge', 'Library'],
    rating: 4.9
  },
  {
    id: 'hotel-cape-weligama',
    name: 'Cape Weligama Resort',
    destination: 'Mirissa',
    starCategory: 'Boutique Luxury',
    pricePerNightUSD: 135000,
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
    description: 'A Relais & Châteaux clifftop headland resort with a 60-meter crescent infinity pool curving into the ocean horizon.',
    amenities: ['Crescent Infinity Pool', 'Butler Service', 'Private Residences', 'Dive Center', 'Ocean Dining'],
    rating: 5.0
  },
  {
    id: 'hotel-cinnamon-bentota',
    name: 'Cinnamon Bentota Beach',
    destination: 'Bentota',
    starCategory: 5,
    pricePerNightUSD: 60000,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    description: 'Iconic Geoffrey Bawa modernist architecture set along pristine golden sands and the Bentota river estuary.',
    amenities: ['Private Beach', 'Water Sports Center', 'Bawa Art Gallery', 'Multiple Pools', 'Kids Club'],
    rating: 4.8
  },
  {
    id: 'hotel-galle-face-colombo',
    name: 'The Galle Face Hotel Colombo',
    destination: 'Colombo',
    starCategory: 'Boutique Luxury',
    pricePerNightUSD: 58000,
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    description: 'Founded in 1864, South Asia’s grandest heritage oceanfront hotel where royalty, celebrities, and world leaders have stayed.',
    amenities: ['Sea Spray Restaurant', 'Chequerboard Ocean Terrace', 'Saltwater Pool', 'Heritage Museum'],
    rating: 4.9
  }
];
