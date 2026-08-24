import { bookingService } from './bookingService';
import { tourService } from './tourService';
import { destinationService } from './destinationService';
import { reviewService } from './reviewService';
import { paymentService } from './paymentService';

export const adminService = {
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
      conversionRate: 4.8, // percentage
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
  }
};
