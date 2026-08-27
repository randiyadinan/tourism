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
