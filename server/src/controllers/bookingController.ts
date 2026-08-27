import type { Context } from 'hono';
import { bookingStore, type ServerBookingRecord } from '../services/bookingStore.js';

export interface BookingBindings {
  FRONTEND_URL?: string;
}

/**
 * GET /api/bookings
 * Returns all bookings (or filtered by userId query param)
 */
export async function getAllBookings(c: Context) {
  try {
    const userId = c.req.query('userId');
    if (userId) {
      const userBookings = bookingStore.getUserBookings(userId);
      return c.json({ success: true, data: userBookings });
    }
    const bookings = bookingStore.getAllBookings();
    return c.json({ success: true, data: bookings });
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    return c.json({ success: false, error: error.message || 'Failed to fetch bookings' }, 500);
  }
}

/**
 * GET /api/bookings/:idOrCode
 * Returns a specific booking by ID or Reference Code
 */
export async function getBookingById(c: Context) {
  try {
    const idOrCode = c.req.param('id');
    if (!idOrCode) {
      return c.json({ success: false, error: 'Booking ID is required' }, 400);
    }
    const booking = bookingStore.getBookingById(idOrCode);
    if (!booking) {
      return c.json({ success: false, error: 'Booking not found' }, 404);
    }
    return c.json({ success: true, data: booking });
  } catch (error: any) {
    console.error('Error fetching booking:', error);
    return c.json({ success: false, error: error.message || 'Failed to fetch booking' }, 500);
  }
}

/**
 * POST /api/bookings
 * Creates a new customer booking on the server
 */
export async function createBooking(c: Context) {
  try {
    const body = await c.req.json().catch(() => ({}));
    
    if (!body.flightNumber || typeof body.flightNumber !== 'string' || !body.flightNumber.trim()) {
      return c.json({ success: false, error: 'Flight number is required.' }, 400);
    }

    if (!body.customerName || !body.customerEmail || !body.startDate || !body.totalAmount) {
      return c.json({
        success: false,
        error: 'Missing mandatory fields: customerName, customerEmail, startDate, and totalAmount are required.'
      }, 400);
    }

    const booking = bookingStore.createBooking(body);
    console.log(`[Server Bookings] New booking created: ${booking.bookingCode} (${booking.id}) - Status: ${booking.bookingStatus}`);

    return c.json({ success: true, data: booking }, 201);
  } catch (error: any) {
    console.error('Error creating booking on server:', error);
    return c.json({ success: false, error: error.message || 'Failed to create booking' }, 400);
  }
}

/**
 * PATCH /api/bookings/:id/status
 * Updates booking status (Pending, Confirmed, Cancelled, Rejected, Completed)
 */
export async function updateBookingStatus(c: Context) {
  try {
    const id = c.req.param('id');
    if (!id) {
      return c.json({ success: false, error: 'Booking ID is required' }, 400);
    }
    const body = await c.req.json().catch(() => ({}));
    const { status } = body;

    if (!status) {
      return c.json({ success: false, error: 'Status is required' }, 400);
    }

    const updated = bookingStore.updateBookingStatus(id, status);
    if (!updated) {
      return c.json({ success: false, error: 'Booking not found' }, 404);
    }

    console.log(`[Server Bookings] Booking ${id} status updated to: ${status}`);
    return c.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating booking status:', error);
    return c.json({ success: false, error: error.message || 'Failed to update status' }, 500);
  }
}

/**
 * PATCH /api/bookings/:id/payment
 * Updates payment status and amountPaid
 */
export async function updateBookingPayment(c: Context) {
  try {
    const id = c.req.param('id');
    if (!id) {
      return c.json({ success: false, error: 'Booking ID is required' }, 400);
    }
    const body = await c.req.json().catch(() => ({}));
    const { paymentStatus, amountPaid } = body;

    if (!paymentStatus) {
      return c.json({ success: false, error: 'Payment status is required' }, 400);
    }

    const updated = bookingStore.updatePaymentStatus(id, paymentStatus, amountPaid);
    if (!updated) {
      return c.json({ success: false, error: 'Booking not found' }, 404);
    }

    console.log(`[Server Bookings] Booking ${id} payment updated to: ${paymentStatus}`);
    return c.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating booking payment:', error);
    return c.json({ success: false, error: error.message || 'Failed to update payment' }, 500);
  }
}

/**
 * POST /api/bookings/:id/mark-as-paid
 * Marks a booking as PAID and sets status to Confirmed
 */
export async function markBookingAsPaid(c: Context) {
  try {
    const id = c.req.param('id');
    if (!id) {
      return c.json({ success: false, error: 'Booking ID is required' }, 400);
    }
    const updated = bookingStore.markAsPaid(id);
    if (!updated) {
      return c.json({ success: false, error: 'Booking not found' }, 404);
    }

    console.log(`[Server Bookings] Booking ${id} marked as PAID & Confirmed`);
    return c.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error marking booking as paid:', error);
    return c.json({ success: false, error: error.message || 'Failed to mark as paid' }, 500);
  }
}

/**
 * DELETE /api/bookings/:id
 * Deletes a booking record
 */
export async function deleteBooking(c: Context) {
  try {
    const id = c.req.param('id');
    if (!id) {
      return c.json({ success: false, error: 'Booking ID is required' }, 400);
    }
    const deleted = bookingStore.deleteBooking(id);
    if (!deleted) {
      return c.json({ success: false, error: 'Booking not found' }, 404);
    }
    return c.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting booking:', error);
    return c.json({ success: false, error: error.message || 'Failed to delete booking' }, 500);
  }
}
