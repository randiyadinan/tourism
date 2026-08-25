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

export const bookingService = {
  getAllBookings(): Booking[] {
    const data = localStorage.getItem(BOOKINGS_KEY);
    if (!data) {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(INITIAL_BOOKINGS));
      return INITIAL_BOOKINGS;
    }
    try {
      return JSON.parse(data);
    } catch {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(INITIAL_BOOKINGS));
      return INITIAL_BOOKINGS;
    }
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
      // Access Denied: attempting to access another customer's booking
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
   * Business Rule: Status is ALWAYS initialized as 'Pending'.
   */
  createBooking(input: CreateBookingInput): Booking {
    const bookings = this.getAllBookings();
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newBooking: Booking = {
      ...input,
      id: `bk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      bookingCode: `LV-2026-${randomCode}`,
      totalTravelers: input.adultsCount + input.childrenCount + input.infantsCount,
      // Mandatory business rule: Newly created bookings MUST start as Pending
      bookingStatus: 'Pending',
      assignedGuide: {
        name: 'Roshan Silva',
        phone: '+94 77 889 9112',
        license: 'SLTDA-CG-4412'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    bookings.unshift(newBooking);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
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

    bookings[idx].paymentStatus = 'Fully Paid';
    bookings[idx].amountPaid = details.amountPaid;
    bookings[idx].bookingStatus = 'Confirmed';
    if (details.paymentMethod) {
      bookings[idx].paymentMethod = details.paymentMethod;
    }
    bookings[idx].updatedAt = new Date().toISOString();
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    return bookings[idx];
  },

  deleteBooking(id: string): void {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('403 Forbidden: Only administrators can delete booking records.');
    }
    const bookings = this.getAllBookings().filter(b => b.id !== id);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  }
};
