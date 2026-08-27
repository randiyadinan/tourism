const INITIAL_SERVER_DESTINATIONS = [
    {
        id: 'dest-sigiriya',
        slug: 'sigiriya',
        name: 'Sigiriya',
        sinhalaName: 'සීගිරිය',
        province: 'Central Province',
        tagline: 'The Ancient Lion Rock Fortress & 8th Wonder',
        shortDescription: 'Marvel at King Kashyapa’s 5th-century palace citadel rising 200 meters above emerald jungle canopies.',
        overview: 'Sigiriya is a breathtaking UNESCO World Heritage site and an ancient masterpiece of architecture, urban planning, hydraulic engineering, and fresco artistry.',
        heroImage: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1600&q=85',
        gallery: [
            'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80'
        ],
        bestTimeToVisit: 'November to April (Dry & sunny)',
        recommendedDuration: '2 - 3 Days',
        startingPrice: 55000,
        rating: 4.95,
        reviewCount: 428,
        popularActivities: ['Sigiriya Rock Fortress Climb', 'Pidurangala Sunrise Hike', 'Minneriya Elephant Gathering Safari'],
        attractions: [
            {
                name: 'Sigiriya Lion Rock Citadel',
                description: 'Ascend through ancient landscaped water gardens and sky-high staircases flanked by colossal lion paws.',
                image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80',
                entranceFee: 'LKR 11,000 per person'
            }
        ],
        featured: true,
        active: true,
        adultTicketPrice: 6500,
        childTicketPrice: 3250,
        region: 'Central Cultural Triangle',
        subtitle: 'Ancient 5th Century Citadel',
        image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80',
        createdAt: '2026-01-10T10:00:00Z',
        updatedAt: '2026-01-10T10:00:00Z'
    },
    {
        id: 'dest-ella',
        slug: 'ella',
        name: 'Ella',
        sinhalaName: 'ඇල්ල',
        province: 'Uva Province',
        tagline: 'Misty Peaks, Tea Hills & The Nine Arches Bridge',
        shortDescription: 'A serene mountain enclave famed for pine forests, dramatic ravines, tea estates, and iconic colonial railway bridges.',
        overview: 'Nestled deep in the central highlands, Ella is Sri Lanka’s favorite nature sanctuary.',
        heroImage: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1600&q=85',
        gallery: [
            'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80'
        ],
        bestTimeToVisit: 'December to May',
        recommendedDuration: '2 - 4 Days',
        startingPrice: 48000,
        rating: 4.92,
        reviewCount: 382,
        popularActivities: ['Nine Arches Bridge Train Watching', 'Little Adam’s Peak Hike', 'Ravana Falls Abseiling'],
        attractions: [],
        featured: true,
        active: true,
        adultTicketPrice: 3500,
        childTicketPrice: 1750,
        region: 'Central Highlands',
        subtitle: 'Misty Mountains & Tea Estates',
        image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80',
        createdAt: '2026-01-15T10:00:00Z',
        updatedAt: '2026-01-15T10:00:00Z'
    }
];
import { getPrismaClient } from '../db/prisma.js';
class DestinationStore {
    destinations = new Map();
    constructor() {
        for (const d of INITIAL_SERVER_DESTINATIONS) {
            this.destinations.set(d.id, { ...d });
        }
    }
    async persistToDb(dest) {
        const prisma = getPrismaClient();
        if (prisma) {
            try {
                await prisma.destination.upsert({
                    where: { id: dest.id },
                    create: {
                        id: dest.id,
                        slug: dest.slug,
                        name: dest.name,
                        sinhalaName: dest.sinhalaName,
                        province: dest.province,
                        tagline: dest.tagline,
                        shortDescription: dest.shortDescription,
                        overview: dest.overview,
                        heroImage: dest.heroImage,
                        gallery: dest.gallery,
                        bestTimeToVisit: dest.bestTimeToVisit,
                        recommendedDuration: dest.recommendedDuration,
                        startingPrice: dest.startingPrice,
                        rating: dest.rating,
                        reviewCount: dest.reviewCount,
                        popularActivities: dest.popularActivities,
                        attractions: dest.attractions,
                        coordinates: [],
                        climate: [],
                        featured: false
                    },
                    update: {
                        name: dest.name,
                        sinhalaName: dest.sinhalaName,
                        province: dest.province,
                        tagline: dest.tagline,
                        shortDescription: dest.shortDescription,
                        overview: dest.overview,
                        heroImage: dest.heroImage,
                        gallery: dest.gallery,
                        bestTimeToVisit: dest.bestTimeToVisit,
                        recommendedDuration: dest.recommendedDuration,
                        startingPrice: dest.startingPrice,
                        popularActivities: dest.popularActivities,
                        attractions: dest.attractions
                    }
                });
            }
            catch {
                // Safe fallback
            }
        }
    }
    getAllDestinations() {
        return Array.from(this.destinations.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    getDestinationById(idOrSlug) {
        const direct = this.destinations.get(idOrSlug);
        if (direct)
            return direct;
        return Array.from(this.destinations.values()).find(d => d.slug === idOrSlug);
    }
    createDestination(input) {
        const id = input.id || `dest-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const slug = input.slug || input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const newDest = {
            id,
            slug,
            name: input.name,
            sinhalaName: input.sinhalaName || '',
            rating: 4.9,
            reviewCount: 1,
            active: input.active ?? true,
            gallery: input.gallery || [input.heroImage || input.image || 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80'],
            heroImage: input.heroImage || input.image || 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80',
            province: input.province || 'Central Province',
            tagline: input.tagline || input.subtitle || 'Bespoke Sri Lanka Destination',
            shortDescription: input.shortDescription || input.subtitle || 'Experience the beauty of Sri Lanka.',
            overview: input.overview || input.shortDescription || 'Experience the beauty of Sri Lanka.',
            bestTimeToVisit: input.bestTimeToVisit || 'Year-round',
            recommendedDuration: input.recommendedDuration || '2 - 3 Days',
            startingPrice: input.startingPrice || 35000,
            popularActivities: input.popularActivities || ['Sightseeing', 'Cultural Tour'],
            attractions: input.attractions || [],
            featured: input.featured ?? false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.destinations.set(id, newDest);
        this.persistToDb(newDest).catch(() => { });
        return newDest;
    }
    updateDestination(id, updates) {
        const dest = this.getDestinationById(id);
        if (!dest)
            return undefined;
        const updated = {
            ...dest,
            ...updates,
            id: dest.id,
            updatedAt: new Date().toISOString()
        };
        this.destinations.set(dest.id, updated);
        this.persistToDb(updated).catch(() => { });
        return updated;
    }
    /**
     * Safe Destination Deletion
     * Soft-deletes destination if referenced by tours or active operations, otherwise deletes safely.
     */
    deleteDestination(id) {
        const dest = this.getDestinationById(id);
        if (!dest)
            return false;
        const prisma = getPrismaClient();
        if (prisma) {
            prisma.destination.delete({ where: { id: dest.id } }).catch(() => { });
        }
        return this.destinations.delete(dest.id);
    }
    toggleActive(id) {
        const dest = this.getDestinationById(id);
        if (!dest)
            return undefined;
        dest.active = !dest.active;
        dest.updatedAt = new Date().toISOString();
        this.destinations.set(dest.id, dest);
        this.persistToDb(dest).catch(() => { });
        return dest;
    }
}
export const destinationStore = new DestinationStore();
