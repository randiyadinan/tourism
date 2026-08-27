import type { Booking, BookingStatus, PaymentStatus, PaymentMethod, TravelerDetail } from '../types';
import { INITIAL_BOOKINGS } from '../data/initialBookings';
import { authService } from './authService';

const BOOKINGS_KEY = 'lv_bookings';

export interface CreateBookingInput {
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  type: 'standard_tour' | 'custom_trip' | 'airport_transfer' | 'activity_only';
  tourId?: string;
  tourTitle?: string;
  tourImage?: string;
  startDate: string;
  endDate: string;
  adultsCount: number;
  childrenCount: number;
  infantsCount: number;
  destinationsCovered?: string[];
  hotelTier?: string;
  vehicleType?: string;
  mealPlan?: string;
  activitiesSelected?: string[];
  airportPickup?: boolean;
  airportTransferOption?: 'none' | 'pickup' | 'dropoff' | 'both';
  airportTransferDetails?: {
    airport: string;
    flightNumber?: string;
    arrivalTime?: string;
    pickupLocation?: string;
    dropoffLocation?: string;
    passengers?: number;
    vehicleId?: string;
    priceUSD?: number;
  };
  flightNumber?: string;
  flightArrivalTime?: string;
  travelers: TravelerDetail[];
  basePrice: number;
  customizationTotal: number;
  discountAmount: number;
  discountCode?: string;
  taxAmount: number;
  totalAmount: number;
  amountPaid: number;
  bookingStatus?: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  notes?: string;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export const bookingService = {
  /**
   * Fetches all bookings from the server (if available) and caches in localStorage.
   * Also triggers background fetch if called synchronously.
   */
  getAllBookings(): Booking[] {
    // Return cached from localStorage immediately for synchronous UI renders
    const localData = localStorage.getItem(BOOKINGS_KEY);
    let cachedBookings: Booking[] = [];
    if (!localData) {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(INITIAL_BOOKINGS));
      cachedBookings = INITIAL_BOOKINGS;
    } else {
      try {
        cachedBookings = JSON.parse(localData);
      } catch {
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(INITIAL_BOOKINGS));
        cachedBookings = INITIAL_BOOKINGS;
      }
    }

    return cachedBookings;
  },

  /**
   * Async fetch from backend server to synchronize local cache
   */
  async fetchBookingsFromServer(): Promise<Booking[]> {
    const endpoints = [
      API_BASE ? `${API_BASE}/api/bookings` : '/api/bookings',
      '/api/bookings'
    ];

    for (const url of endpoints) {
      if (!url) continue;
      try {
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            // Merge server bookings with localStorage
            const localData = this.getAllBookings();
            const serverMap = new Map<string, Booking>();
            for (const b of json.data) {
              serverMap.set(b.id, b);
            }
            // Keep any local-only created bookings that haven't hit server yet
            for (const b of localData) {
              if (!serverMap.has(b.id)) {
                serverMap.set(b.id, b);
              }
            }
            const merged = Array.from(serverMap.values()).sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            localStorage.setItem(BOOKINGS_KEY, JSON.stringify(merged));
            return merged;
          }
        }
      } catch {
        // Continue to fallback
      }
    }

    return this.getAllBookings();
  },

  /**
   * Returns bookings strictly owned by the specified customer ID.
   * Enforces data isolation between different customer accounts.
   */
  getUserBookings(userId: string): Booking[] {
    if (!userId) return [];
    const bookings = this.getAllBookings();
    return bookings.filter(b => b.userId === userId);
  },

  /**
   * Retrieves a booking by ID or Reference Code with authorization validation.
   * - Admins can inspect any booking.
   * - Customers can ONLY inspect bookings matching their own userId.
   */
  getBookingById(id: string, requestingUserId?: string, requestingUserRole?: string): Booking | undefined {
    const booking = this.getAllBookings().find(b => b.id === id || b.bookingCode === id);
    if (!booking) return undefined;

    // Admin role has full access
    if (requestingUserRole === 'admin') {
      return booking;
    }

    // Customer role is strictly restricted to their own bookings
    if (requestingUserRole === 'customer') {
      if (requestingUserId && booking.userId === requestingUserId) {
        return booking;
      }
      return undefined;
    }

    // If role not provided or guest, check current authenticated user
    const currentUser = authService.getCurrentUser();
    if (!currentUser) return undefined;
    if (currentUser.role === 'admin' || booking.userId === currentUser.id) {
      return booking;
    }

    return undefined;
  },

  /**
   * Creates a new booking.
   * Default status is 'Pending' unless explicitly provided (e.g. Cash payment defaults to 'Pending' awaiting admin confirmation).
   * Enforces mandatory flightNumber.
   * Automatically persists to both localStorage and backend API.
   */
  createBooking(input: CreateBookingInput): Booking {
    if (!input.flightNumber || !input.flightNumber.trim()) {
      throw new Error('Flight number is required.');
    }

    const bookings = this.getAllBookings();
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newBooking: Booking = {
      ...input,
      flightNumber: input.flightNumber.trim(),
      id: `bk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      bookingCode: `LV-2026-${randomCode}`,
      totalTravelers: (input.adultsCount || 0) + (input.childrenCount || 0) + (input.infantsCount || 0) || 1,
      bookingStatus: input.bookingStatus || 'Pending',
      paymentStatus: input.paymentStatus || 'NOT PAID',
      assignedGuide: {
        name: 'Roshan Silva',
        phone: '+94 77 889 9112',
        license: 'SLTDA-CG-4412'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save locally immediately
    bookings.unshift(newBooking);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));

    // Send to backend server asynchronously
    const endpoints = [
      API_BASE ? `${API_BASE}/api/bookings` : '/api/bookings',
      '/api/bookings'
    ];

    for (const url of endpoints) {
      if (!url) continue;
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking)
      }).catch(err => {
        console.warn('[bookingService] Async backend sync notice:', err.message);
      });
      break;
    }

    return newBooking;
  },

  /**
   * Admin-Only Status Update with permission verification.
   */
  updateBookingStatus(id: string, bookingStatus: BookingStatus): Booking {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('403 Forbidden: Only administrators are authorized to modify booking status.');
    }
    const bookings = this.getAllBookings();
    const idx = bookings.findIndex(b => b.id === id);
    if (idx === -1) throw new Error('Booking not found');
    bookings[idx].bookingStatus = bookingStatus;
    bookings[idx].updatedAt = new Date().toISOString();
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));

    // Async sync to server
    const endpoint = API_BASE ? `${API_BASE}/api/bookings/${id}/status` : `/api/bookings/${id}/status`;
    fetch(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: bookingStatus })
    }).catch(err => console.warn('[bookingService] Server status sync notice:', err.message));

    return bookings[idx];
  },

  adminUpdateStatus(id: string, newStatus: BookingStatus): Booking {
    return this.updateBookingStatus(id, newStatus);
  },

  /**
   * Allows customer to cancel their own booking if it is not already Completed.
   */
  customerCancelBooking(id: string, currentUserId: string): Booking {
    const bookings = this.getAllBookings();
    const idx = bookings.findIndex(b => b.id === id);
    if (idx === -1) throw new Error('Booking not found');
    if (bookings[idx].userId !== currentUserId) {
      throw new Error('403 Forbidden: You do not have permission to cancel this booking.');
    }
    if (bookings[idx].bookingStatus === 'Completed' || bookings[idx].bookingStatus === 'Rejected') {
      throw new Error(`Cannot cancel a booking with status '${bookings[idx].bookingStatus}'.`);
    }

    bookings[idx].bookingStatus = 'Cancelled';
    bookings[idx].updatedAt = new Date().toISOString();
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));

    const endpoint = API_BASE ? `${API_BASE}/api/bookings/${id}/status` : `/api/bookings/${id}/status`;
    fetch(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Cancelled' })
    }).catch(err => console.warn('[bookingService] Server status sync notice:', err.message));

    return bookings[idx];
  },

  updatePaymentStatus(id: string, paymentStatus: PaymentStatus, amountPaid?: number): Booking {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('403 Forbidden: Only administrators can update payment records.');
    }
    const bookings = this.getAllBookings();
    const idx = bookings.findIndex(b => b.id === id);
    if (idx === -1) throw new Error('Booking not found');
    bookings[idx].paymentStatus = paymentStatus;
    if (amountPaid !== undefined) {
      bookings[idx].amountPaid = amountPaid;
    }
    bookings[idx].updatedAt = new Date().toISOString();
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));

    const endpoint = API_BASE ? `${API_BASE}/api/bookings/${id}/payment` : `/api/bookings/${id}/payment`;
    fetch(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentStatus, amountPaid })
    }).catch(err => console.warn('[bookingService] Server payment sync notice:', err.message));

    return bookings[idx];
  },

  /**
   * Admin mark cash booking as paid
   */
  markAsPaid(id: string): Booking {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('403 Forbidden: Only administrators can mark bookings as paid.');
    }
    const bookings = this.getAllBookings();
    const idx = bookings.findIndex(b => b.id === id);
    if (idx === -1) throw new Error('Booking not found');
    
    bookings[idx].paymentStatus = 'PAID';
    bookings[idx].amountPaid = bookings[idx].totalAmount;
    bookings[idx].bookingStatus = 'Confirmed';
    bookings[idx].updatedAt = new Date().toISOString();
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));

    const endpoint = API_BASE ? `${API_BASE}/api/bookings/${id}/mark-as-paid` : `/api/bookings/${id}/mark-as-paid`;
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).catch(err => console.warn('[bookingService] Server mark-as-paid sync notice:', err.message));

    return bookings[idx];
  },

  /**
   * Updates booking after verified gateway payment (PayHere).
   */
  applyGatewayPaymentSuccess(
    idOrCode: string,
    details: {
      amountPaid: number;
      paymentMethod?: PaymentMethod;
    }
  ): Booking | undefined {
    const bookings = this.getAllBookings();
    const idx = bookings.findIndex(b => b.id === idOrCode || b.bookingCode === idOrCode);
    if (idx === -1) return undefined;

    bookings[idx].paymentStatus = 'PAID';
    bookings[idx].amountPaid = details.amountPaid;
    bookings[idx].bookingStatus = 'Confirmed';
    if (details.paymentMethod) {
      bookings[idx].paymentMethod = details.paymentMethod;
    }
    bookings[idx].updatedAt = new Date().toISOString();
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));

    const id = bookings[idx].id;
    const endpoint = API_BASE ? `${API_BASE}/api/bookings/${id}/mark-as-paid` : `/api/bookings/${id}/mark-as-paid`;
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).catch(err => console.warn('[bookingService] Server gateway payment sync notice:', err.message));

    return bookings[idx];
  },

  /**
   * Updates booking when PayHere payment fails or is cancelled.
   */
  applyGatewayPaymentFailure(
    idOrCode: string,
    status: 'FAILED' | 'CANCELLED' = 'FAILED'
  ): Booking | undefined {
    const bookings = this.getAllBookings();
    const idx = bookings.findIndex(b => b.id === idOrCode || b.bookingCode === idOrCode);
    if (idx === -1) return undefined;

    bookings[idx].paymentStatus = status;
    bookings[idx].updatedAt = new Date().toISOString();
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));

    const id = bookings[idx].id;
    const endpoint = API_BASE ? `${API_BASE}/api/bookings/${id}/payment` : `/api/bookings/${id}/payment`;
    fetch(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentStatus: status })
    }).catch(err => console.warn('[bookingService] Server gateway payment fail sync notice:', err.message));

    return bookings[idx];
  },

  deleteBooking(id: string): void {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('403 Forbidden: Only administrators can delete booking records.');
    }
    const bookings = this.getAllBookings().filter(b => b.id !== id);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));

    const endpoint = API_BASE ? `${API_BASE}/api/bookings/${id}` : `/api/bookings/${id}`;
    fetch(endpoint, {
      method: 'DELETE'
    }).catch(err => console.warn('[bookingService] Server delete sync notice:', err.message));
  }
};
