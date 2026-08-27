export interface ServerTourRecord {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  tagline: string;
  category: string;
  durationDays: number;
  durationNights: number;
  pricePerPerson: number;
  originalPrice?: number;
  discountPercent?: number;
  featured: boolean;
  published: boolean;
  rating: number;
  reviewCount: number;
  difficulty: string;
  groupSizeMax: number;
  startLocation: string;
  endLocation: string;
  heroImage: string;
  gallery: string[];
  overview: string;
  highlights: string[];
  destinations: string[];
  itinerary: Array<{
    day: number;
    title: string;
    destination: string;
    description: string;
    highlights: string[];
    mealsIncluded: string[];
    accommodation: string;
    driveTime?: string;
  }>;
  inclusions: string[];
  exclusions: string[];
  accommodationType: string;
  transportType: string;
  createdAt: string;
  updatedAt: string;
}

const INITIAL_SERVER_TOURS: ServerTourRecord[] = [
  {
    id: 'tour-sri-lanka-highlights',
    slug: 'sri-lanka-classic-highlights',
    title: 'Sri Lanka Grand Highlights & Heritage',
    subtitle: 'Sigiriya, Kandy, Nuwara Eliya, Ella, Yala & Galle Fort',
    tagline: 'The definitive 10-day luxury journey across the Pearl of the Indian Ocean.',
    category: 'Cultural & Heritage',
    durationDays: 10,
    durationNights: 9,
    pricePerPerson: 1290,
    originalPrice: 1490,
    discountPercent: 13,
    featured: true,
    published: true,
    rating: 4.96,
    reviewCount: 142,
    difficulty: 'Moderate',
    groupSizeMax: 8,
    startLocation: 'Bandaranaike Intl Airport (CMB)',
    endLocation: 'Colombo / Airport (CMB)',
    heroImage: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Experience the absolute pinnacle of Sri Lanka in pure luxury. Journey from the ancient 5th-century rock citadel of Sigiriya to the sacred Buddhist kingdom of Kandy, through the emerald rolling hills of Nuwara Eliya aboard the scenic blue train, track wild leopards in Yala National Park, and unwind within the cobblestone charm of 17th-century Galle Dutch Fort.',
    highlights: [
      'Climb the UNESCO Sigiriya Lion Rock Citadel and Dambulla Cave Temple',
      'Witness the sacred evening Theva Puja drumming ritual at Kandy Temple of the Tooth',
      'Ride the world-famous blue train through misty tea estates from Nuwara Eliya to Ella',
      'Private 4x4 leopard and wild elephant safari in Yala National Park Block 1',
      'Sunset ramparts walk and boutique heritage stay inside Galle Dutch Fort'
    ],
    destinations: ['Sigiriya', 'Kandy', 'Nuwara Eliya', 'Ella', 'Yala', 'Galle'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival & Journey to the Cultural Triangle',
        destination: 'Sigiriya / Habarana',
        description: 'Warm VIP welcome at Bandaranaike International Airport by your LankaVoyage chauffeur-guide with fresh jasmine garlands.',
        highlights: ['VIP airport meet & greet', 'Scenic drive through rural villages'],
        mealsIncluded: ['Dinner'],
        accommodation: 'Aliya Resort & Spa / Cinnamon Lodge Habarana (5-Star)',
        driveTime: '3.5 Hours'
      }
    ],
    inclusions: [
      '9 nights luxury 5-star hotel and heritage villa accommodation',
      'Dedicated private air-conditioned vehicle with English-speaking chauffeur',
      'Daily breakfast and selected gourmet dinners'
    ],
    exclusions: [
      'International flights and Sri Lanka ETA visa fees',
      'Travel insurance and personal expenditures'
    ],
    accommodationType: '5-Star Luxury Resorts & Heritage Boutique Villas',
    transportType: 'Private Air-Conditioned Luxury Van / SUV with Chauffeur',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'tour-wild-safari',
    slug: 'wild-sri-lanka-safari-expedition',
    title: 'Wild Sri Lanka: Big Four Safari Expedition',
    subtitle: 'Wilpattu, Minneriya, Yala & Mirissa Whale Watching',
    tagline: 'Track leopards, Asian elephants, sloth bears, and blue whales.',
    category: 'Wildlife & Safari',
    durationDays: 7,
    durationNights: 6,
    pricePerPerson: 1050,
    originalPrice: 1200,
    discountPercent: 12,
    featured: true,
    published: true,
    rating: 4.93,
    reviewCount: 98,
    difficulty: 'Moderate',
    groupSizeMax: 6,
    startLocation: 'Bandaranaike Intl Airport (CMB)',
    endLocation: 'Galle / Airport (CMB)',
    heroImage: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'An untamed immersion into Sri Lanka’s most biodiverse national reserves and deep oceanic trenches.',
    highlights: [
      'Full-day game drives in Wilpattu National Park',
      'Track the highest density of leopards on Earth in Yala Block 1',
      'Private morning catamaran charter off Mirissa for blue whale watching'
    ],
    destinations: ['Wilpattu', 'Minneriya', 'Yala', 'Mirissa'],
    itinerary: [],
    inclusions: ['6 nights luxury tented safari camps & coastal lodges', 'Private 4x4 modified safari jeeps with naturalists'],
    exclusions: ['International flights'],
    accommodationType: 'Luxury Tented Safari Glamping & Boutique Beachfront Villa',
    transportType: 'Private 4WD Land Cruiser Safari Jeep',
    createdAt: '2026-02-15T12:00:00Z',
    updatedAt: '2026-02-15T12:00:00Z'
  }
];

import { getPrismaClient } from '../db/prisma.js';
import { bookingStore } from './bookingStore.js';

class TourStore {
  private tours: Map<string, ServerTourRecord> = new Map();

  constructor() {
    for (const t of INITIAL_SERVER_TOURS) {
      this.tours.set(t.id, { ...t });
    }
  }

  private async persistToDb(tour: ServerTourRecord) {
    const prisma = getPrismaClient();
    if (prisma) {
      try {
        await prisma.tour.upsert({
          where: { id: tour.id },
          create: {
            id: tour.id,
            slug: tour.slug,
            title: tour.title,
            subtitle: tour.subtitle,
            tagline: tour.tagline,
            category: tour.category,
            durationDays: tour.durationDays,
            durationNights: tour.durationNights,
            pricePerPerson: tour.pricePerPerson,
            originalPrice: tour.originalPrice,
            discountPercent: tour.discountPercent,
            featured: tour.featured,
            published: tour.published,
            rating: tour.rating,
            reviewCount: tour.reviewCount,
            difficulty: tour.difficulty,
            groupSizeMax: tour.groupSizeMax,
            startLocation: tour.startLocation,
            endLocation: tour.endLocation,
            heroImage: tour.heroImage,
            gallery: tour.gallery as any,
            overview: tour.overview,
            highlights: tour.highlights as any,
            destinations: tour.destinations as any,
            itinerary: tour.itinerary as any,
            inclusions: tour.inclusions as any,
            exclusions: tour.exclusions as any,
            accommodationType: tour.accommodationType,
            transportType: tour.transportType,
            importantInfo: [] as any,
            faqs: [] as any
          },
          update: {
            title: tour.title,
            subtitle: tour.subtitle,
            tagline: tour.tagline,
            pricePerPerson: tour.pricePerPerson,
            originalPrice: tour.originalPrice,
            discountPercent: tour.discountPercent,
            featured: tour.featured,
            published: tour.published,
            heroImage: tour.heroImage,
            gallery: tour.gallery as any,
            overview: tour.overview,
            highlights: tour.highlights as any,
            destinations: tour.destinations as any
          }
        });
      } catch {
        // Safe fallback
      }
    }
  }

  getAllTours(): ServerTourRecord[] {
    return Array.from(this.tours.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getTourById(idOrSlug: string): ServerTourRecord | undefined {
    const direct = this.tours.get(idOrSlug);
    if (direct) return direct;
    return Array.from(this.tours.values()).find(t => t.slug === idOrSlug);
  }

  createTour(input: Partial<ServerTourRecord> & { title: string; pricePerPerson: number }): ServerTourRecord {
    const id = input.id || `tour-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const slug = input.slug || input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newTour: ServerTourRecord = {
      id,
      slug,
      title: input.title,
      subtitle: input.subtitle || input.tagline || 'Experience Sri Lanka',
      tagline: input.tagline || input.subtitle || 'Bespoke Island Discovery',
      category: input.category || 'Cultural & Heritage',
      durationDays: input.durationDays || 5,
      durationNights: input.durationNights || Math.max(1, (input.durationDays || 5) - 1),
      pricePerPerson: input.pricePerPerson,
      originalPrice: input.originalPrice,
      discountPercent: input.discountPercent,
      difficulty: input.difficulty || 'Moderate',
      groupSizeMax: input.groupSizeMax || 12,
      startLocation: input.startLocation || 'Colombo (CMB)',
      endLocation: input.endLocation || 'Colombo (CMB)',
      heroImage: input.heroImage || input.gallery?.[0] || 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80',
      overview: input.overview || 'Immerse yourself in authentic Sri Lankan hospitality, world heritage landmarks, and stunning natural landscapes.',
      accommodationType: input.accommodationType || '4-Star Boutique Hotels',
      transportType: input.transportType || 'Private Air-Conditioned Vehicle',
      rating: 5.0,
      reviewCount: 1,
      featured: input.featured ?? false,
      published: input.published ?? true,
      gallery: input.gallery || [input.heroImage || 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80'],
      highlights: input.highlights || [],
      destinations: input.destinations || ['Sri Lanka'],
      itinerary: input.itinerary || [],
      inclusions: input.inclusions || [],
      exclusions: input.exclusions || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.tours.set(id, newTour);
    this.persistToDb(newTour).catch(() => {});
    return newTour;
  }

  updateTour(id: string, updates: Partial<ServerTourRecord>): ServerTourRecord | undefined {
    const tour = this.getTourById(id);
    if (!tour) return undefined;

    const updated: ServerTourRecord = {
      ...tour,
      ...updates,
      id: tour.id, // Preserve immutable ID
      updatedAt: new Date().toISOString()
    };

    this.tours.set(tour.id, updated);
    this.persistToDb(updated).catch(() => {});
    return updated;
  }

  /**
   * Safe Tour Deletion
   * If existing bookings reference this tour, soft-deletes by setting published = false to preserve data integrity and foreign keys.
   * If no bookings exist, deletes safely from store and database.
   */
  deleteTour(id: string): boolean {
    const tour = this.getTourById(id);
    if (!tour) return false;

    // Check if active or historical bookings reference this tour
    const existingBookings = bookingStore.getAllBookings().filter(b => b.tourId === tour.id);
    if (existingBookings.length > 0) {
      // Safe soft delete to prevent foreign key errors and preserve booking records
      tour.published = false;
      tour.updatedAt = new Date().toISOString();
      this.tours.set(tour.id, tour);
      this.persistToDb(tour).catch(() => {});
      return true;
    }

    const prisma = getPrismaClient();
    if (prisma) {
      prisma.tour.delete({ where: { id: tour.id } }).catch(() => {});
    }
    return this.tours.delete(tour.id);
  }

  togglePublished(id: string): ServerTourRecord | undefined {
    const tour = this.getTourById(id);
    if (!tour) return undefined;
    tour.published = !tour.published;
    tour.updatedAt = new Date().toISOString();
    this.tours.set(tour.id, tour);
    this.persistToDb(tour).catch(() => {});
    return tour;
  }

  toggleFeatured(id: string): ServerTourRecord | undefined {
    const tour = this.getTourById(id);
    if (!tour) return undefined;
    tour.featured = !tour.featured;
    tour.updatedAt = new Date().toISOString();
    this.tours.set(tour.id, tour);
    this.persistToDb(tour).catch(() => {});
    return tour;
  }
}

export const tourStore = new TourStore();
