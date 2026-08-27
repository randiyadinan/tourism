const INITIAL_SERVER_TOURS = [
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
class TourStore {
    tours = new Map();
    constructor() {
        for (const t of INITIAL_SERVER_TOURS) {
            this.tours.set(t.id, { ...t });
        }
    }
    getAllTours() {
        return Array.from(this.tours.values());
    }
    getTourById(idOrSlug) {
        const direct = this.tours.get(idOrSlug);
        if (direct)
            return direct;
        return Array.from(this.tours.values()).find(t => t.slug === idOrSlug);
    }
    createTour(input) {
        if (!input.title || !input.title.trim()) {
            throw new Error('Tour title is required.');
        }
        if (!input.pricePerPerson || input.pricePerPerson <= 0) {
            throw new Error('Price per person must be greater than zero.');
        }
        const id = input.id || `tour-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const slug = input.slug || input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const newTour = {
            ...input,
            id,
            slug,
            rating: 5.0,
            reviewCount: 1,
            featured: input.featured ?? false,
            published: input.published ?? true,
            gallery: input.gallery || [input.heroImage],
            highlights: input.highlights || [],
            destinations: input.destinations || ['Sri Lanka'],
            itinerary: input.itinerary || [],
            inclusions: input.inclusions || [],
            exclusions: input.exclusions || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.tours.set(id, newTour);
        return newTour;
    }
    updateTour(id, updates) {
        const tour = this.getTourById(id);
        if (!tour)
            return undefined;
        const updated = {
            ...tour,
            ...updates,
            id: tour.id, // Preserve immutable ID
            updatedAt: new Date().toISOString()
        };
        this.tours.set(tour.id, updated);
        return updated;
    }
    deleteTour(id) {
        const tour = this.getTourById(id);
        if (!tour)
            return false;
        return this.tours.delete(tour.id);
    }
    togglePublished(id) {
        const tour = this.getTourById(id);
        if (!tour)
            return undefined;
        tour.published = !tour.published;
        tour.updatedAt = new Date().toISOString();
        this.tours.set(tour.id, tour);
        return tour;
    }
    toggleFeatured(id) {
        const tour = this.getTourById(id);
        if (!tour)
            return undefined;
        tour.featured = !tour.featured;
        tour.updatedAt = new Date().toISOString();
        this.tours.set(tour.id, tour);
        return tour;
    }
}
export const tourStore = new TourStore();
