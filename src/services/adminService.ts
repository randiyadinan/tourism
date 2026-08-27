import { bookingService } from './bookingService';
import { tourService } from './tourService';
import { destinationService } from './destinationService';
import { reviewService } from './reviewService';
import { paymentService } from './paymentService';
import { authService } from './authService';
import type { User, Booking, Tour, Destination } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

function getAdminHeaders(): HeadersInit {
  const token = authService.getSessionToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
}

export const adminService = {
  // ─── 0. BUSINESS REPORTS / ANALYTICS API ───
  async fetchReports(period: string = 'all', startDate?: string, endDate?: string): Promise<any> {
    try {
      const params = new URLSearchParams();
      if (period) params.set('period', period);
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);

      const query = params.toString() ? `?${params.toString()}` : '';
      const endpoint = API_BASE ? `${API_BASE}/api/admin/reports${query}` : `/api/admin/reports${query}`;
      const res = await fetch(endpoint, { headers: getAdminHeaders() });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (err: any) {
      console.warn('[adminService] fetchReports fallback:', err.message);
    }
    return null;
  },

  // ─── DASHBOARD STATS ───
  getDashboardStats() {
    const bookings = bookingService.getAllBookings();
    const tours = tourService.getAllTours();
    const destinations = destinationService.getAllDestinations();
    const reviews = reviewService.getAllReviews();
    const payments = paymentService.getTransactions();

    const totalRevenue = bookings.reduce((sum, b) => sum + (b.amountPaid || 0), 0);
    const pendingBookings = bookings.filter(b => b.bookingStatus === 'Pending').length;
    const confirmedBookings = bookings.filter(b => b.bookingStatus === 'Confirmed').length;
    const pendingReviews = reviews.filter(r => r.status === 'pending').length;

    return {
      totalRevenue,
      totalBookings: bookings.length,
      confirmedBookings,
      pendingBookings,
      totalTours: tours.length,
      publishedTours: tours.filter(t => t.published).length,
      totalDestinations: destinations.length,
      totalReviews: reviews.length,
      pendingReviews,
      totalPaymentsCount: payments.length,
      conversionRate: 4.8,
      averageOrderValue: bookings.length > 0 ? Math.round(totalRevenue / bookings.length) : 0
    };
  },

  getRevenueByMonth() {
    return [
      { month: 'Jan', revenue: 24500, bookings: 14 },
      { month: 'Feb', revenue: 38200, bookings: 22 },
      { month: 'Mar', revenue: 42000, bookings: 26 },
      { month: 'Apr', revenue: 31500, bookings: 18 },
      { month: 'May', revenue: 19000, bookings: 11 },
      { month: 'Jun', revenue: 28400, bookings: 16 },
      { month: 'Jul', revenue: 49000, bookings: 29 },
      { month: 'Aug', revenue: 54200, bookings: 32 }
    ];
  },

  getPopularToursPerformance() {
    return [
      { name: 'Grand Highlights & Heritage', bookings: 42, revenue: 54180, percentage: 35 },
      { name: 'Wild Sri Lanka Safari', bookings: 31, revenue: 32550, percentage: 26 },
      { name: 'Luxury Ceylon Honeymoon', bookings: 18, revenue: 30240, percentage: 20 },
      { name: 'Ella & Highland Tea', bookings: 22, revenue: 16280, percentage: 12 },
      { name: 'Cultural Triangle Escape', bookings: 15, revenue: 12300, percentage: 7 }
    ];
  },

  // ══════════════════════════════════════════════════════════════════
  // 1. ADMIN CUSTOMERS / PROFILES API
  // ══════════════════════════════════════════════════════════════════
  async fetchUsers(): Promise<User[]> {
    try {
      const endpoint = API_BASE ? `${API_BASE}/api/admin/users` : '/api/admin/users';
      const res = await fetch(endpoint, { headers: getAdminHeaders() });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          return json.data;
        }
      }
    } catch (err: any) {
      console.warn('[adminService] fetchUsers fallback:', err.message);
    }
    return authService.getUsers().filter(u => u.role === 'customer');
  },

  async getUserDetails(userId: string): Promise<any> {
    try {
      const endpoint = API_BASE ? `${API_BASE}/api/admin/users/${userId}` : `/api/admin/users/${userId}`;
      const res = await fetch(endpoint, { headers: getAdminHeaders() });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (err: any) {
      console.warn('[adminService] getUserDetails fallback:', err.message);
    }
    const user = authService.getUsers().find(u => u.id === userId);
    const bookings = bookingService.getUserBookings(userId);
    return user ? { ...user, bookings } : null;
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    try {
      const endpoint = API_BASE ? `${API_BASE}/api/admin/users/${userId}` : `/api/admin/users/${userId}`;
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (err: any) {
      console.warn('[adminService] updateUser fallback:', err.message);
    }
    return authService.updateProfile(userId, updates);
  },

  async deleteUser(userId: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const endpoint = API_BASE ? `${API_BASE}/api/admin/users/${userId}` : `/api/admin/users/${userId}`;
      const res = await fetch(endpoint, {
        method: 'DELETE',
        headers: getAdminHeaders()
      });
      const json = await res.json();
      return json;
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete customer' };
    }
  },

  // ══════════════════════════════════════════════════════════════════
  // 2. ADMIN BOOKINGS API
  // ══════════════════════════════════════════════════════════════════
  async fetchBookings(): Promise<Booking[]> {
    try {
      const endpoint = API_BASE ? `${API_BASE}/api/admin/bookings` : '/api/admin/bookings';
      const res = await fetch(endpoint, { headers: getAdminHeaders() });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          return json.data;
        }
      }
    } catch (err: any) {
      console.warn('[adminService] fetchBookings fallback:', err.message);
    }
    return bookingService.getAllBookings();
  },

  async confirmBooking(bookingId: string): Promise<Booking> {
    const endpoint = API_BASE ? `${API_BASE}/api/admin/bookings/${bookingId}/confirm` : `/api/admin/bookings/${bookingId}/confirm`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: getAdminHeaders()
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to confirm booking');
    }
    return json.data;
  },

  async rejectBooking(bookingId: string, reason?: string): Promise<Booking> {
    const endpoint = API_BASE ? `${API_BASE}/api/admin/bookings/${bookingId}/reject` : `/api/admin/bookings/${bookingId}/reject`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ reason })
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to reject booking');
    }
    return json.data;
  },

  async deleteBooking(bookingId: string): Promise<{ success: boolean; message?: string; error?: string }> {
    const endpoint = API_BASE ? `${API_BASE}/api/admin/bookings/${bookingId}` : `/api/admin/bookings/${bookingId}`;
    const res = await fetch(endpoint, {
      method: 'DELETE',
      headers: getAdminHeaders()
    });
    return res.json();
  },

  // ══════════════════════════════════════════════════════════════════
  // 3. ADMIN TOURS API
  // ══════════════════════════════════════════════════════════════════
  async fetchTours(): Promise<Tour[]> {
    try {
      const endpoint = API_BASE ? `${API_BASE}/api/admin/tours` : '/api/admin/tours';
      const res = await fetch(endpoint, { headers: getAdminHeaders() });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          return json.data;
        }
      }
    } catch (err: any) {
      console.warn('[adminService] fetchTours fallback:', err.message);
    }
    return tourService.getAllTours();
  },

  async createTour(tourData: any): Promise<Tour> {
    const endpoint = API_BASE ? `${API_BASE}/api/admin/tours` : '/api/admin/tours';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify(tourData)
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to create tour');
    }
    return json.data;
  },

  async updateTour(tourId: string, updates: Partial<Tour>): Promise<Tour> {
    const endpoint = API_BASE ? `${API_BASE}/api/admin/tours/${tourId}` : `/api/admin/tours/${tourId}`;
    const res = await fetch(endpoint, {
      method: 'PUT',
      headers: getAdminHeaders(),
      body: JSON.stringify(updates)
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to update tour');
    }
    return json.data;
  },

  async deleteTour(tourId: string): Promise<{ success: boolean; message?: string; error?: string }> {
    const endpoint = API_BASE ? `${API_BASE}/api/admin/tours/${tourId}` : `/api/admin/tours/${tourId}`;
    const res = await fetch(endpoint, {
      method: 'DELETE',
      headers: getAdminHeaders()
    });
    return res.json();
  },

  // ══════════════════════════════════════════════════════════════════
  // 4. ADMIN DESTINATIONS API
  // ══════════════════════════════════════════════════════════════════
  async fetchDestinations(): Promise<Destination[]> {
    try {
      const endpoint = API_BASE ? `${API_BASE}/api/admin/destinations` : '/api/admin/destinations';
      const res = await fetch(endpoint, { headers: getAdminHeaders() });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          return json.data;
        }
      }
    } catch (err: any) {
      console.warn('[adminService] fetchDestinations fallback:', err.message);
    }
    return destinationService.getAllDestinations();
  },

  async createDestination(destData: any): Promise<Destination> {
    const endpoint = API_BASE ? `${API_BASE}/api/admin/destinations` : '/api/admin/destinations';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify(destData)
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to create destination');
    }
    return json.data;
  },

  async updateDestination(destId: string, updates: Partial<Destination>): Promise<Destination> {
    const endpoint = API_BASE ? `${API_BASE}/api/admin/destinations/${destId}` : `/api/admin/destinations/${destId}`;
    const res = await fetch(endpoint, {
      method: 'PUT',
      headers: getAdminHeaders(),
      body: JSON.stringify(updates)
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to update destination');
    }
    return json.data;
  },

  async deleteDestination(destId: string): Promise<{ success: boolean; message?: string; error?: string }> {
    const endpoint = API_BASE ? `${API_BASE}/api/admin/destinations/${destId}` : `/api/admin/destinations/${destId}`;
    const res = await fetch(endpoint, {
      method: 'DELETE',
      headers: getAdminHeaders()
    });
    return res.json();
  }
};
