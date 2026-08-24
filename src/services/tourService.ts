import type { Tour, TourCategory, TourDifficulty } from '../types';
import { INITIAL_TOURS } from '../data/tours';

const TOURS_KEY = 'lv_tours';

export interface TourFilterParams {
  category?: TourCategory | 'All';
  destination?: string | 'All';
  durationMin?: number;
  durationMax?: number;
  priceMin?: number;
  priceMax?: number;
  difficulty?: TourDifficulty | 'All';
  ratingMin?: number;
  searchQuery?: string;
  sortBy?: 'popular' | 'price_asc' | 'price_desc' | 'rating' | 'duration_asc' | 'duration_desc';
}

export const tourService = {
  getAllTours(): Tour[] {
    const data = localStorage.getItem(TOURS_KEY);
    if (!data) {
      localStorage.setItem(TOURS_KEY, JSON.stringify(INITIAL_TOURS));
      return INITIAL_TOURS;
    }
    return JSON.parse(data);
  },

  getPublishedTours(): Tour[] {
    return this.getAllTours().filter(t => t.published);
  },

  getFeaturedTours(): Tour[] {
    return this.getPublishedTours().filter(t => t.featured);
  },

  getTourById(id: string): Tour | undefined {
    return this.getAllTours().find(t => t.id === id);
  },

  getTourBySlug(slug: string): Tour | undefined {
    return this.getAllTours().find(t => t.slug === slug);
  },

  filterTours(params: TourFilterParams): Tour[] {
    let tours = this.getPublishedTours();

    if (params.searchQuery && params.searchQuery.trim()) {
      const q = params.searchQuery.toLowerCase();
      tours = tours.filter(t => 
        t.title.toLowerCase().includes(q) ||
        t.subtitle.toLowerCase().includes(q) ||
        t.overview.toLowerCase().includes(q) ||
        t.destinations.some(d => d.toLowerCase().includes(q))
      );
    }

    if (params.category && params.category !== 'All') {
      tours = tours.filter(t => t.category === params.category);
    }

    if (params.destination && params.destination !== 'All') {
      tours = tours.filter(t => t.destinations.includes(params.destination!));
    }

    if (params.difficulty && params.difficulty !== 'All') {
      tours = tours.filter(t => t.difficulty === params.difficulty);
    }

    if (params.durationMin !== undefined) {
      tours = tours.filter(t => t.durationDays >= params.durationMin!);
    }
    if (params.durationMax !== undefined) {
      tours = tours.filter(t => t.durationDays <= params.durationMax!);
    }

    if (params.priceMin !== undefined) {
      tours = tours.filter(t => t.pricePerPerson >= params.priceMin!);
    }
    if (params.priceMax !== undefined) {
      tours = tours.filter(t => t.pricePerPerson <= params.priceMax!);
    }

    if (params.ratingMin !== undefined) {
      tours = tours.filter(t => t.rating >= params.ratingMin!);
    }

    // Sorting
    switch (params.sortBy) {
      case 'price_asc':
        tours.sort((a, b) => a.pricePerPerson - b.pricePerPerson);
        break;
      case 'price_desc':
        tours.sort((a, b) => b.pricePerPerson - a.pricePerPerson);
        break;
      case 'rating':
        tours.sort((a, b) => b.rating - a.rating);
        break;
      case 'duration_asc':
        tours.sort((a, b) => a.durationDays - b.durationDays);
        break;
      case 'duration_desc':
        tours.sort((a, b) => b.durationDays - a.durationDays);
        break;
      case 'popular':
      default:
        tours.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.reviewCount - a.reviewCount);
        break;
    }

    return tours;
  },

  createTour(tour: Omit<Tour, 'id' | 'slug' | 'rating' | 'reviewCount'>): Tour {
    const tours = this.getAllTours();
    const slug = tour.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newTour: Tour = {
      ...tour,
      id: `tour-${Date.now()}`,
      slug,
      rating: 5.0,
      reviewCount: 0
    };
    tours.unshift(newTour);
    localStorage.setItem(TOURS_KEY, JSON.stringify(tours));
    return newTour;
  },

  updateTour(id: string, updates: Partial<Tour>): Tour {
    const tours = this.getAllTours();
    const idx = tours.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Tour not found');
    tours[idx] = { ...tours[idx], ...updates };
    localStorage.setItem(TOURS_KEY, JSON.stringify(tours));
    return tours[idx];
  },

  deleteTour(id: string): void {
    const tours = this.getAllTours().filter(t => t.id !== id);
    localStorage.setItem(TOURS_KEY, JSON.stringify(tours));
  },

  toggleFeatured(id: string): Tour {
    const tour = this.getTourById(id);
    if (!tour) throw new Error('Tour not found');
    return this.updateTour(id, { featured: !tour.featured });
  },

  togglePublished(id: string): Tour {
    const tour = this.getTourById(id);
    if (!tour) throw new Error('Tour not found');
    return this.updateTour(id, { published: !tour.published });
  }
};
