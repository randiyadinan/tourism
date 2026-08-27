import type { Context } from 'hono';
import { authService } from '../services/authService.js';
import { bookingStore } from '../services/bookingStore.js';
import { tourStore } from '../services/tourStore.js';
import { destinationStore } from '../services/destinationStore.js';
import { emailService } from '../services/emailService.js';

function getFrontendBaseUrl(c: Context): string {
  return (c.env && (c.env as any).FRONTEND_URL) || (typeof process !== 'undefined' ? process.env.FRONTEND_URL : undefined) || new URL(c.req.url).origin;
}

// ══════════════════════════════════════════════════════════════════════
// 1. ADMIN USERS / CUSTOMERS MANAGEMENT
// ══════════════════════════════════════════════════════════════════════

export async function getAdminUsers(c: Context) {
  try {
    const users = await authService.getAllUsers();
    return c.json({ success: true, data: users });
  } catch (error: any) {
    return c.json({ success: false, error: error.message || 'Failed to fetch users' }, 500);
  }
}

export async function getAdminUserById(c: Context) {
  try {
    const id = c.req.param('id');
    if (!id) return c.json({ success: false, error: 'User ID is required' }, 400);

    const user = await authService.getUserById(id);
    if (!user) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }
    // Also include user's bookings
    const bookings = bookingStore.getUserBookings(id);
    return c.json({ success: true, data: { ...user, bookings } });
  } catch (error: any) {
    return c.json({ success: false, error: error.message || 'Failed to fetch user' }, 500);
  }
}

export async function updateAdminUser(c: Context) {
  try {
    const id = c.req.param('id');
    if (!id) return c.json({ success: false, error: 'User ID is required' }, 400);

    const body = await c.req.json().catch(() => ({}));
    const updated = await authService.updateUser(id, body);
    if (!updated) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }
    return c.json({ success: true, data: updated, message: 'User profile updated successfully.' });
  } catch (error: any) {
    return c.json({ success: false, error: error.message || 'Failed to update user' }, 500);
  }
}

export async function deleteAdminUser(c: Context) {
  try {
    const id = c.req.param('id');
    if (!id) return c.json({ success: false, error: 'User ID is required' }, 400);

    // Check if user has active bookings
    const userBookings = bookingStore.getUserBookings(id);
    const hasActiveBookings = userBookings.some(b => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Pending');

    if (hasActiveBookings) {
      return c.json({
        success: false,
        error: 'Cannot delete customer account with active or confirmed bookings. Please cancel or complete bookings first.'
      }, 400);
    }

    const deleted = await authService.deleteUser(id);
    if (!deleted) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }
    return c.json({ success: true, message: 'Customer account deleted safely.' });
  } catch (error: any) {
    return c.json({ success: false, error: error.message || 'Failed to delete user' }, 500);
  }
}

// ══════════════════════════════════════════════════════════════════════
// 2. ADMIN BOOKINGS MANAGEMENT
// ══════════════════════════════════════════════════════════════════════

export async function getAdminBookings(c: Context) {
  try {
    const bookings = bookingStore.getAllBookings();
    return c.json({ success: true, data: bookings });
  } catch (error: any) {
    return c.json({ success: false, error: error.message || 'Failed to fetch bookings' }, 500);
  }
}

export async function getAdminBookingById(c: Context) {
  try {
    const id = c.req.param('id');
    if (!id) return c.json({ success: false, error: 'Booking ID is required' }, 400);

    const booking = bookingStore.getBookingById(id);
    if (!booking) {
      return c.json({ success: false, error: 'Booking not found' }, 404);
    }
    return c.json({ success: true, data: booking });
  } catch (error: any) {
    return c.json({ success: false, error: error.message || 'Failed to fetch booking' }, 500);
  }
}

export async function confirmAdminBooking(c: Context) {
  try {
    const id = c.req.param('id');
    if (!id) return c.json({ success: false, error: 'Booking ID is required' }, 400);

    const updated = bookingStore.confirmBooking(id);
    if (!updated) {
      return c.json({ success: false, error: 'Booking not found' }, 404);
    }

    // Send customer confirmation email with Pay Now link
    const frontendUrl = getFrontendBaseUrl(c);
    emailService.sendCustomerBookingConfirmed({
      to: updated.customerEmail,
      name: updated.customerName,
      bookingCode: updated.bookingCode,
      tourTitle: updated.tourTitle || 'Sri Lanka Tour',
      startDate: updated.startDate,
      totalAmount: updated.totalAmount,
      payNowUrl: `${frontendUrl}/customer/bookings/${updated.id}`
    }).catch(err => console.warn('⚠️ [EmailService] Confirmation email warning:', err));

    return c.json({
      success: true,
      message: 'Booking confirmed. Customer notified and payment is now unlocked.',
      data: updated
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message || 'Failed to confirm booking' }, 500);
  }
}

export async function rejectAdminBooking(c: Context) {
  try {
    const id = c.req.param('id');
    if (!id) return c.json({ success: false, error: 'Booking ID is required' }, 400);

    const body = await c.req.json().catch(() => ({}));
    const updated = bookingStore.rejectBooking(id);
    if (!updated) {
      return c.json({ success: false, error: 'Booking not found' }, 404);
    }

    // Dispatch rejection notice email to customer
    emailService.sendCustomerBookingRejected({
      to: updated.customerEmail,
      name: updated.customerName,
      bookingCode: updated.bookingCode,
      tourTitle: updated.tourTitle || 'Sri Lanka Tour',
      reason: body.reason || undefined
    }).catch(err => console.warn('⚠️ [EmailService] Rejection email warning:', err));

    return c.json({
      success: true,
      message: 'Booking request rejected. Customer notified via email.',
      data: updated
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message || 'Failed to reject booking' }, 500);
  }
}

export async function updateAdminBooking(c: Context) {
  try {
    const id = c.req.param('id');
    if (!id) return c.json({ success: false, error: 'Booking ID is required' }, 400);

    const body = await c.req.json().catch(() => ({}));

    if (body.bookingStatus) {
      bookingStore.updateBookingStatus(id, body.bookingStatus);
    }
    if (body.paymentStatus) {
      bookingStore.updatePaymentStatus(id, body.paymentStatus, body.amountPaid);
    }

    const updated = bookingStore.getBookingById(id);
    return c.json({ success: true, data: updated, message: 'Booking updated successfully.' });
  } catch (error: any) {
    return c.json({ success: false, error: error.message || 'Failed to update booking' }, 500);
  }
}

export async function deleteAdminBooking(c: Context) {
  try {
    const id = c.req.param('id');
    if (!id) return c.json({ success: false, error: 'Booking ID is required' }, 400);

    const deleted = bookingStore.deleteBooking(id);
    if (!deleted) {
      return c.json({ success: false, error: 'Booking not found' }, 404);
    }
    return c.json({ success: true, message: 'Booking deleted successfully.' });
  } catch (error: any) {
    return c.json({ success: false, error: error.message || 'Failed to delete booking' }, 500);
  }
}

// ══════════════════════════════════════════════════════════════════════
// 3. ADMIN TOURS MANAGEMENT
// ══════════════════════════════════════════════════════════════════════

export async function getAdminTours(c: Context) {
  try {
    const tours = tourStore.getAllTours();
    return c.json({ success: true, data: tours });
  } catch (error: any) {
    return c.json({ success: false, error: error.message || 'Failed to fetch tours' }, 500);
  }
}

export async function getAdminTourById(c: Context) {
  try {
    const id = c.req.param('id');
    if (!id) return c.json({ success: false, error: 'Tour ID is required' }, 400);

    const tour = tourStore.getTourById(id);
    if (!tour) {
      return c.json({ success: false, error: 'Tour not found' }, 404);
    }
    return c.json({ success: true, data: tour });
  } catch (error: any) {
    return c.json({ success: false, error: error.message || 'Failed to fetch tour' }, 500);
  }
}

export async function createAdminTour(c: Context) {
  try {
    const body = await c.req.json().catch(() => ({}));
    const newTour = tourStore.createTour(body);
    return c.json({ success: true, data: newTour, message: 'Tour created successfully.' }, 201);
  } catch (error: any) {
    return c.json({ success: false, error: error.message || 'Failed to create tour' }, 400);
  }
}

export async function updateAdminTour(c: Context) {
  try {
    const id = c.req.param('id');
    if (!id) return c.json({ success: false, error: 'Tour ID is required' }, 400);

    const body = await c.req.json().catch(() => ({}));
    const updated = tourStore.updateTour(id, body);
    if (!updated) {
      return c.json({ success: false, error: 'Tour not found' }, 404);
    }
    return c.json({ success: true, data: updated, message: 'Tour updated successfully.' });
  } catch (error: any) {
    return c.json({ success: false, error: error.message || 'Failed to update tour' }, 500);
  }
}

export async function deleteAdminTour(c: Context) {
  try {
    const id = c.req.param('id');
    if (!id) return c.json({ success: false, error: 'Tour ID is required' }, 400);

    // Check if tour has active bookings
    const bookings = bookingStore.getAllBookings();
    const hasBookings = bookings.some(b => b.tourId === id);

    if (hasBookings) {
      // Soft-delete / unpublish safely so historical records aren't broken
      tourStore.updateTour(id, { published: false });
      return c.json({
        success: true,
        message: 'Tour is referenced by existing bookings and has been safely unpublished (soft deleted).'
      });
    }

    const deleted = tourStore.deleteTour(id);
    if (!deleted) {
      return c.json({ success: false, error: 'Tour not found' }, 404);
    }
    return c.json({ success: true, message: 'Tour deleted successfully.' });
  } catch (error: any) {
    return c.json({ success: false, error: error.message || 'Failed to delete tour' }, 500);
  }
}

// ══════════════════════════════════════════════════════════════════════
// 4. ADMIN DESTINATIONS MANAGEMENT
// ══════════════════════════════════════════════════════════════════════

export async function getAdminDestinations(c: Context) {
  try {
    const destinations = destinationStore.getAllDestinations();
    return c.json({ success: true, data: destinations });
  } catch (error: any) {
    return c.json({ success: false, error: error.message || 'Failed to fetch destinations' }, 500);
  }
}

export async function getAdminDestinationById(c: Context) {
  try {
    const id = c.req.param('id');
    if (!id) return c.json({ success: false, error: 'Destination ID is required' }, 400);

    const dest = destinationStore.getDestinationById(id);
    if (!dest) {
      return c.json({ success: false, error: 'Destination not found' }, 404);
    }
    return c.json({ success: true, data: dest });
  } catch (error: any) {
    return c.json({ success: false, error: error.message || 'Failed to fetch destination' }, 500);
  }
}

export async function createAdminDestination(c: Context) {
  try {
    const body = await c.req.json().catch(() => ({}));
    const newDest = destinationStore.createDestination(body);
    return c.json({ success: true, data: newDest, message: 'Destination created successfully.' }, 201);
  } catch (error: any) {
    return c.json({ success: false, error: error.message || 'Failed to create destination' }, 400);
  }
}

export async function updateAdminDestination(c: Context) {
  try {
    const id = c.req.param('id');
    if (!id) return c.json({ success: false, error: 'Destination ID is required' }, 400);

    const body = await c.req.json().catch(() => ({}));
    const updated = destinationStore.updateDestination(id, body);
    if (!updated) {
      return c.json({ success: false, error: 'Destination not found' }, 404);
    }
    return c.json({ success: true, data: updated, message: 'Destination updated successfully.' });
  } catch (error: any) {
    return c.json({ success: false, error: error.message || 'Failed to update destination' }, 500);
  }
}

export async function deleteAdminDestination(c: Context) {
  try {
    const id = c.req.param('id');
    if (!id) return c.json({ success: false, error: 'Destination ID is required' }, 400);

    const deleted = destinationStore.deleteDestination(id);
    if (!deleted) {
      return c.json({ success: false, error: 'Destination not found' }, 404);
    }
    return c.json({ success: true, message: 'Destination deleted successfully.' });
  } catch (error: any) {
    return c.json({ success: false, error: error.message || 'Failed to delete destination' }, 500);
  }
}

// ══════════════════════════════════════════════════════════════════════
// 5. ADMIN BUSINESS REPORTS & ANALYTICS
// ══════════════════════════════════════════════════════════════════════

export async function getAdminReports(c: Context) {
  try {
    const period = c.req.query('period') || 'all'; // 'today', '7d', '30d', 'this_month', 'this_year', 'all', or custom
    const startDateQuery = c.req.query('startDate');
    const endDateQuery = c.req.query('endDate');

    const allBookings = bookingStore.getAllBookings();
    const allUsers = await authService.getAllUsers();
    const allTours = tourStore.getAllTours();
    const allDestinations = destinationStore.getAllDestinations();

    const now = new Date();

    // Date filtering helper
    let filterStart: Date | null = null;
    let filterEnd: Date | null = null;

    if (period === 'today') {
      filterStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filterEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    } else if (period === '7d') {
      filterStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filterEnd = now;
    } else if (period === '30d') {
      filterStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filterEnd = now;
    } else if (period === 'this_month') {
      filterStart = new Date(now.getFullYear(), now.getMonth(), 1);
      filterEnd = now;
    } else if (period === 'this_year') {
      filterStart = new Date(now.getFullYear(), 0, 1);
      filterEnd = now;
    } else if (startDateQuery && endDateQuery) {
      filterStart = new Date(startDateQuery);
      filterEnd = new Date(endDateQuery + 'T23:59:59.999Z');
    }

    const filteredBookings = allBookings.filter(b => {
      if (!filterStart) return true;
      const bDate = new Date(b.createdAt || b.startDate);
      if (filterStart && bDate < filterStart) return false;
      if (filterEnd && bDate > filterEnd) return false;
      return true;
    });

    // 1. BUSINESS OVERVIEW
    const totalBookings = filteredBookings.length;
    const pendingBookings = filteredBookings.filter(b => b.bookingStatus === 'Pending').length;
    const confirmedBookings = filteredBookings.filter(b => b.bookingStatus === 'Confirmed').length;
    const rejectedBookings = filteredBookings.filter(b => b.bookingStatus === 'Rejected').length;
    const completedBookings = filteredBookings.filter(b => b.bookingStatus === 'Completed').length;
    const cancelledBookings = filteredBookings.filter(b => b.bookingStatus === 'Cancelled').length;

    const paidBookings = filteredBookings.filter(b => b.paymentStatus === 'PAID' || b.paymentStatus === 'Fully Paid').length;
    const unpaidBookings = filteredBookings.filter(b => b.paymentStatus === 'NOT PAID' || b.paymentStatus === 'Unpaid' || b.paymentStatus === 'FAILED').length;

    // Real Financial Totals
    const totalRevenue = filteredBookings.reduce((sum, b) => sum + (b.amountPaid || (b.paymentStatus === 'PAID' ? b.totalAmount : 0)), 0);
    const totalExpectedAmount = filteredBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const outstandingAmount = Math.max(0, totalExpectedAmount - totalRevenue);

    // This Month & This Year Revenue
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfCurrentYear = new Date(now.getFullYear(), 0, 1);

    const revenueThisMonth = allBookings
      .filter(b => new Date(b.createdAt || b.startDate) >= startOfCurrentMonth)
      .reduce((sum, b) => sum + (b.amountPaid || (b.paymentStatus === 'PAID' ? b.totalAmount : 0)), 0);

    const revenueThisYear = allBookings
      .filter(b => new Date(b.createdAt || b.startDate) >= startOfCurrentYear)
      .reduce((sum, b) => sum + (b.amountPaid || (b.paymentStatus === 'PAID' ? b.totalAmount : 0)), 0);

    const averageBookingValue = totalBookings > 0 ? Math.round(totalExpectedAmount / totalBookings) : 0;
    const conversionRate = totalBookings > 0 ? Number(((confirmedBookings + paidBookings) / (totalBookings || 1) * 100).toFixed(1)) : 0;

    // 2. REVENUE BY PAYMENT METHOD
    const revenueByMethod: Record<string, number> = {};
    for (const b of filteredBookings) {
      const method = b.paymentMethod || 'PayHere Online';
      const paid = b.amountPaid || (b.paymentStatus === 'PAID' ? b.totalAmount : 0);
      revenueByMethod[method] = (revenueByMethod[method] || 0) + paid;
    }

    // 3. TOP TOURS PERFORMANCE
    const tourPerformanceMap: Record<string, { name: string; bookingsCount: number; revenue: number }> = {};
    for (const b of filteredBookings) {
      const tourName = b.tourTitle || 'Custom Trip / Transfer';
      if (!tourPerformanceMap[tourName]) {
        tourPerformanceMap[tourName] = { name: tourName, bookingsCount: 0, revenue: 0 };
      }
      tourPerformanceMap[tourName].bookingsCount += 1;
      tourPerformanceMap[tourName].revenue += (b.amountPaid || (b.paymentStatus === 'PAID' ? b.totalAmount : 0));
    }

    const sortedTours = Object.values(tourPerformanceMap)
      .map(t => ({
        ...t,
        averageValue: t.bookingsCount > 0 ? Math.round(t.revenue / t.bookingsCount) : 0
      }))
      .sort((a, b) => b.revenue - a.revenue);

    const topTours = sortedTours.slice(0, 5);
    const leastTours = sortedTours.length > 5 ? sortedTours.slice(-3).reverse() : [];

    // 4. DESTINATION ANALYTICS
    const destinationStatsMap: Record<string, { name: string; bookingsCount: number; revenue: number }> = {};
    for (const b of filteredBookings) {
      const dests = b.destinationsCovered && b.destinationsCovered.length > 0
        ? b.destinationsCovered
        : ['Colombo / Western'];
      
      const portionRevenue = (b.amountPaid || (b.paymentStatus === 'PAID' ? b.totalAmount : 0)) / dests.length;

      for (const d of dests) {
        if (!destinationStatsMap[d]) {
          destinationStatsMap[d] = { name: d, bookingsCount: 0, revenue: 0 };
        }
        destinationStatsMap[d].bookingsCount += 1;
        destinationStatsMap[d].revenue += Math.round(portionRevenue);
      }
    }

    const topDestinations = Object.values(destinationStatsMap)
      .sort((a, b) => b.bookingsCount - a.bookingsCount || b.revenue - a.revenue)
      .slice(0, 6);

    // 5. CUSTOMER ANALYTICS
    const customersOnly = allUsers.filter(u => u.role === 'customer');
    const totalCustomers = customersOnly.length;
    const verifiedCustomers = customersOnly.filter(u => u.emailVerified).length;
    const newCustomersThisMonth = customersOnly.filter(u => new Date(u.createdAt) >= startOfCurrentMonth).length;

    const customerSpendMap: Record<string, { id: string; name: string; email: string; country: string; totalSpend: number; bookingsCount: number }> = {};
    for (const c of customersOnly) {
      customerSpendMap[c.id] = {
        id: c.id,
        name: c.name,
        email: c.email,
        country: c.country || 'International',
        totalSpend: 0,
        bookingsCount: 0
      };
    }

    for (const b of allBookings) {
      if (b.userId && customerSpendMap[b.userId]) {
        customerSpendMap[b.userId].bookingsCount += 1;
        customerSpendMap[b.userId].totalSpend += (b.amountPaid || (b.paymentStatus === 'PAID' ? b.totalAmount : 0));
      }
    }

    const customersWithBookings = Object.values(customerSpendMap).filter(c => c.bookingsCount > 0).length;
    const customersWithoutBookings = totalCustomers - customersWithBookings;
    const totalCustomerSpend = Object.values(customerSpendMap).reduce((sum, c) => sum + c.totalSpend, 0);

    const topCustomers = Object.values(customerSpendMap)
      .sort((a, b) => b.totalSpend - a.totalSpend || b.bookingsCount - a.bookingsCount)
      .slice(0, 5);

    // 6. MONTHLY BUSINESS SUMMARY (Last 6-12 Months)
    const monthlySummaryMap: Record<string, {
      month: string;
      bookings: number;
      pending: number;
      confirmed: number;
      rejected: number;
      paid: number;
      unpaid: number;
      totalRevenue: number;
      paidRevenue: number;
      outstandingRevenue: number;
      revenue: number; // backward compatibility
    }> = {};

    for (const b of allBookings) {
      const date = new Date(b.createdAt || b.startDate);
      const monthKey = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      if (!monthlySummaryMap[monthKey]) {
        monthlySummaryMap[monthKey] = {
          month: monthKey,
          bookings: 0,
          pending: 0,
          confirmed: 0,
          rejected: 0,
          paid: 0,
          unpaid: 0,
          totalRevenue: 0,
          paidRevenue: 0,
          outstandingRevenue: 0,
          revenue: 0
        };
      }
      monthlySummaryMap[monthKey].bookings += 1;
      if (b.bookingStatus === 'Pending') monthlySummaryMap[monthKey].pending += 1;
      if (b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Completed') monthlySummaryMap[monthKey].confirmed += 1;
      if (b.bookingStatus === 'Rejected' || b.bookingStatus === 'Cancelled') monthlySummaryMap[monthKey].rejected += 1;

      const isPaid = b.paymentStatus === 'PAID' || b.paymentStatus === 'Fully Paid';
      const paidAmt = b.amountPaid || (isPaid ? b.totalAmount : 0);
      const totalAmt = b.totalAmount || 0;

      if (isPaid) {
        monthlySummaryMap[monthKey].paid += 1;
      } else {
        monthlySummaryMap[monthKey].unpaid += 1;
      }

      monthlySummaryMap[monthKey].totalRevenue += totalAmt;
      monthlySummaryMap[monthKey].paidRevenue += paidAmt;
      monthlySummaryMap[monthKey].outstandingRevenue += Math.max(0, totalAmt - paidAmt);
      monthlySummaryMap[monthKey].revenue += paidAmt;
    }

    const monthlySummary = Object.values(monthlySummaryMap).slice(-8);

    // 7. RECENT BUSINESS ACTIVITY (Bookings, Payments, Customer Registrations)
    const recentActivityList: Array<{
      id: string;
      type: 'BOOKING' | 'PAYMENT' | 'CUSTOMER';
      title: string;
      description: string;
      amount?: number;
      status: string;
      timestamp: string;
    }> = [];

    for (const b of allBookings.slice(-6)) {
      recentActivityList.push({
        id: `act-bk-${b.id}`,
        type: 'BOOKING',
        title: `Booking ${b.bookingCode}`,
        description: `${b.customerName} - ${b.tourTitle || 'Custom Itinerary'}`,
        amount: b.totalAmount,
        status: b.bookingStatus,
        timestamp: b.createdAt
      });
      if (b.paymentStatus === 'PAID' || b.paymentStatus === 'Fully Paid') {
        recentActivityList.push({
          id: `act-pay-${b.id}`,
          type: 'PAYMENT',
          title: `Payment Received (${b.bookingCode})`,
          description: `${b.paymentMethod || 'PayHere Online'} - ${b.customerName}`,
          amount: b.amountPaid || b.totalAmount,
          status: 'PAID',
          timestamp: b.updatedAt || b.createdAt
        });
      }
    }

    for (const u of customersOnly.slice(-4)) {
      recentActivityList.push({
        id: `act-user-${u.id}`,
        type: 'CUSTOMER',
        title: `New Traveler Registered`,
        description: `${u.name} (${u.country || 'International'})`,
        status: u.emailVerified ? 'Verified' : 'Pending Verification',
        timestamp: u.createdAt instanceof Date ? u.createdAt.toISOString() : String(u.createdAt)
      });
    }

    const recentActivity = recentActivityList
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    // 8. PENDING ADMINISTRATIVE ACTIONS
    const pendingActions = {
      awaitingConfirmationCount: allBookings.filter(b => b.bookingStatus === 'Pending').length,
      unpaidConfirmedCount: allBookings.filter(b => b.bookingStatus === 'Confirmed' && (b.paymentStatus === 'NOT PAID' || b.paymentStatus === 'Unpaid')).length,
      unverifiedCustomersCount: customersOnly.filter(u => !u.emailVerified).length
    };

    return c.json({
      success: true,
      period,
      data: {
        overview: {
          totalRevenue,
          totalPaymentsReceived: totalRevenue,
          totalExpectedAmount,
          outstandingAmount,
          revenueThisMonth,
          revenueThisYear,
          averageBookingValue,
          conversionRate,
          totalBookings,
          pendingBookings,
          confirmedBookings,
          rejectedBookings,
          completedBookings,
          cancelledBookings,
          paidBookings,
          unpaidBookings,
          totalCustomers,
          totalTours: allTours.length,
          totalDestinations: allDestinations.length
        },
        revenueByMethod,
        topTours,
        leastTours,
        topDestinations,
        customerAnalytics: {
          totalCustomers,
          verifiedCustomers,
          newCustomersThisMonth,
          customersWithBookings,
          customersWithoutBookings,
          totalCustomerSpend,
          topCustomers
        },
        monthlySummary,
        recentActivity,
        pendingActions
      }
    });
  } catch (error: any) {
    console.error('Error generating admin reports:', error);
    return c.json({ success: false, error: error.message || 'Failed to generate admin reports' }, 500);
  }
}
