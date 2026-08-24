import type { Review } from '../types';
import { INITIAL_REVIEWS } from '../data/reviews';

const REVIEWS_KEY = 'lv_reviews';

export const reviewService = {
  getAllReviews(): Review[] {
    const data = localStorage.getItem(REVIEWS_KEY);
    if (!data) {
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(INITIAL_REVIEWS));
      return INITIAL_REVIEWS;
    }
    return JSON.parse(data);
  },

  getApprovedReviews(): Review[] {
    return this.getAllReviews().filter(r => r.status === 'approved');
  },

  getReviewsForTarget(targetType: 'tour' | 'destination', targetId: string): Review[] {
    return this.getApprovedReviews().filter(r => r.targetType === targetType && r.targetId === targetId);
  },

  submitReview(review: Omit<Review, 'id' | 'date' | 'status' | 'verifiedTraveler'>): Review {
    const reviews = this.getAllReviews();
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'pending', // Requires admin approval
      verifiedTraveler: true
    };
    reviews.unshift(newRev);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    return newRev;
  },

  approveReview(id: string): Review {
    const reviews = this.getAllReviews();
    const idx = reviews.findIndex(r => r.id === id);
    if (idx === -1) throw new Error('Review not found');
    reviews[idx].status = 'approved';
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    return reviews[idx];
  },

  rejectReview(id: string): Review {
    const reviews = this.getAllReviews();
    const idx = reviews.findIndex(r => r.id === id);
    if (idx === -1) throw new Error('Review not found');
    reviews[idx].status = 'rejected';
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    return reviews[idx];
  },

  deleteReview(id: string): void {
    const reviews = this.getAllReviews().filter(r => r.id !== id);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  },

  replyToReview(id: string, text: string, responderName: string): Review {
    const reviews = this.getAllReviews();
    const idx = reviews.findIndex(r => r.id === id);
    if (idx === -1) throw new Error('Review not found');
    reviews[idx].replyFromManagement = {
      responderName,
      date: new Date().toISOString().split('T')[0],
      text
    };
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    return reviews[idx];
  }
};
