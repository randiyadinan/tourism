import { Hono } from 'hono';
import {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  updateBookingPayment,
  markBookingAsPaid,
  deleteBooking
} from '../controllers/bookingController.js';

export const bookingRouter = new Hono();

// List all bookings (supports ?userId= query)
bookingRouter.get('/', getAllBookings);

// Get single booking by ID or Reference Code
bookingRouter.get('/:id', getBookingById);

// Create new customer booking
bookingRouter.post('/', createBooking);

// Admin update booking status (Pending -> Confirmed / Rejected / Cancelled)
bookingRouter.patch('/:id/status', updateBookingStatus);

// Admin update payment status
bookingRouter.patch('/:id/payment', updateBookingPayment);

// Admin mark booking as Paid
bookingRouter.post('/:id/mark-as-paid', markBookingAsPaid);

// Admin delete booking
bookingRouter.delete('/:id', deleteBooking);
