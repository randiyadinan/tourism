import { Hono } from 'hono';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { getAllBookings, getBookingById, createBooking, confirmBookingController, rejectBookingController, updateBookingStatus, updateBookingPayment, markBookingAsPaid, deleteBooking } from '../controllers/bookingController.js';
export const bookingRouter = new Hono();
// List bookings (Enforces role-based IDOR scoping)
bookingRouter.get('/', getAllBookings);
// Get single booking (Enforces customer ownership verification)
bookingRouter.get('/:id', getBookingById);
// Create new customer booking request (Pending status)
bookingRouter.post('/', createBooking);
// Admin Confirm booking endpoint (Requires Admin)
bookingRouter.post('/:id/confirm', requireAdmin, confirmBookingController);
// Admin Reject booking endpoint (Requires Admin)
bookingRouter.post('/:id/reject', requireAdmin, rejectBookingController);
// Admin update booking status (Requires Admin)
bookingRouter.patch('/:id/status', requireAdmin, updateBookingStatus);
// Admin update payment status (Requires Admin)
bookingRouter.patch('/:id/payment', requireAdmin, updateBookingPayment);
// Admin mark booking as Paid (Requires Admin)
bookingRouter.post('/:id/mark-as-paid', requireAdmin, markBookingAsPaid);
// Admin delete booking (Requires Admin)
bookingRouter.delete('/:id', requireAdmin, deleteBooking);
