import type { Destination } from '../types';
import { INITIAL_DESTINATIONS } from '../data/destinations';

const DESTINATIONS_KEY = 'lv_destinations';

export const destinationService = {
  getAllDestinations(): Destination[] {
    const data = localStorage.getItem(DESTINATIONS_KEY);
    if (!data) {
      localStorage.setItem(DESTINATIONS_KEY, JSON.stringify(INITIAL_DESTINATIONS));
      return INITIAL_DESTINATIONS;
    }
    return JSON.parse(data);
  },

  getFeaturedDestinations(): Destination[] {
    return this.getAllDestinations().filter(d => d.featured);
  },

  getDestinationById(id: string): Destination | undefined {
    return this.getAllDestinations().find(d => d.id === id);
  },

  getDestinationBySlug(slug: string): Destination | undefined {
    return this.getAllDestinations().find(d => d.slug === slug);
  },

  createDestination(dest: Omit<Destination, 'id' | 'slug' | 'rating' | 'reviewCount'>): Destination {
    const destinations = this.getAllDestinations();
    const slug = dest.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newDest: Destination = {
      ...dest,
      id: `dest-${Date.now()}`,
      slug,
      rating: 4.9,
      reviewCount: 1
    };
    destinations.push(newDest);
    localStorage.setItem(DESTINATIONS_KEY, JSON.stringify(destinations));
    return newDest;
  },

  updateDestination(id: string, updates: Partial<Destination>): Destination {
    const destinations = this.getAllDestinations();
    const idx = destinations.findIndex(d => d.id === id);
    if (idx === -1) throw new Error('Destination not found');
    destinations[idx] = { ...destinations[idx], ...updates };
    localStorage.setItem(DESTINATIONS_KEY, JSON.stringify(destinations));
    return destinations[idx];
  },

  deleteDestination(id: string): void {
    const destinations = this.getAllDestinations().filter(d => d.id !== id);
    localStorage.setItem(DESTINATIONS_KEY, JSON.stringify(destinations));
  }
};
