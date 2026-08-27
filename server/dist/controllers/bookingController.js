import { bookingStore } from '../services/bookingStore.js';
import { emailService } from '../services/emailService.js';
import { getOptionalAuthUser } from '../middleware/authMiddleware.js';
/**
 * Helper to get environment variable or origin from context
 */
function getFrontendBaseUrl(c) {
    return (c.env && c.env.FRONTEND_URL) || (typeof process !== 'undefined' ? process.env.FRONTEND_URL : undefined) || new URL(c.req.url).origin;
}
/**
 * GET /api/bookings
 * Returns bookings scoped to role:
 * - Admin: All bookings or filtered by userId
 * - Customer: Only own bookings (IDOR protection prevents seeing others' bookings)
 * - Guest/Public: Empty list or filtered by userId if matching session
 */
export async function getAllBookings(c) {
    try {
        const authUser = await getOptionalAuthUser(c);
        const userId = c.req.query('userId');
        // Admin has full visibility
        if (authUser && authUser.role === 'admin') {
            if (userId) {
                return c.json({ success: true, data: bookingStore.getUserBookings(userId) });
            }
            return c.json({ success: true, data: bookingStore.getAllBookings() });
        }
        // Customer: Strictly restricted to own bookings (IDOR Protection)
        if (authUser && authUser.role === 'customer') {
            const customerBookings = bookingStore.getUserBookings(authUser.id);
            return c.json({ success: true, data: customerBookings });
        }
        // Unauthenticated requests cannot browse bookings
        return c.json({ success: true, data: [] });
    }
    catch (error) {
        console.error('Error fetching bookings:', error);
        return c.json({ success: false, error: error.message || 'Failed to fetch bookings' }, 500);
    }
}
/**
 * GET /api/bookings/:idOrCode
 * Returns a specific booking with IDOR ownership validation
 */
export async function getBookingById(c) {
    try {
        const idOrCode = c.req.param('id');
        if (!idOrCode) {
            return c.json({ success: false, error: 'Booking ID is required' }, 400);
        }
        const booking = bookingStore.getBookingById(idOrCode);
        if (!booking) {
            return c.json({ success: false, error: 'Booking not found' }, 404);
        }
        const authHeader = c.req.header('authorization') || c.req.header('Authorization');
        const authUser = await getOptionalAuthUser(c);
        if (authHeader && !authUser) {
            return c.json({ success: false, error: '401 Unauthorized: Invalid or expired session token.' }, 401);
        }
        // Admin has full access
        if (authUser && authUser.role === 'admin') {
            return c.json({ success: true, data: booking });
        }
        // IDOR Protection: If authenticated as customer, verify booking belongs to them
        if (authUser && authUser.role === 'customer') {
            const isOwner = booking.userId === authUser.id ||
                (booking.customerEmail && booking.customerEmail.toLowerCase() === authUser.email.toLowerCase());
            if (!isOwner) {
                return c.json({
                    success: false,
                    error: '403 Forbidden: You do not have permission to access another customer’s booking.'
                }, 403);
            }
            return c.json({ success: true, data: booking });
        }
        // Unauthenticated guest: Only allow lookup by full booking reference code (e.g. LV-2026-8891)
        if (idOrCode === booking.bookingCode) {
            return c.json({ success: true, data: booking });
        }
        return c.json({
            success: false,
            error: '403 Forbidden: Authentication required to access booking by ID.'
        }, 403);
    }
    catch (error) {
        console.error('Error fetching booking:', error);
        return c.json({ success: false, error: error.message || 'Failed to fetch booking' }, 500);
    }
}
/**
 * POST /api/bookings
 * Creates a new customer booking request (Status = Pending, paymentAvailable = false)
 * Dispatches Admin notification email
 */
export async function createBooking(c) {
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
        console.log(`[Server Bookings] New booking request created: ${booking.bookingCode} (${booking.id}) - Status: ${booking.bookingStatus} (Awaiting Admin Review)`);
        // Asynchronously dispatch Admin Notification Email
        const frontendUrl = getFrontendBaseUrl(c);
        emailService.sendAdminNewBookingNotification({
            bookingCode: booking.bookingCode,
            customerName: booking.customerName,
            customerEmail: booking.customerEmail,
            customerPhone: booking.customerPhone,
            tourTitle: booking.tourTitle || 'Custom Sri Lanka Journey',
            startDate: booking.startDate,
            flightNumber: booking.flightNumber,
            totalTravelers: booking.totalTravelers,
            totalAmount: booking.totalAmount,
            adminDashboardUrl: `${frontendUrl}/admin/bookings`
        }).catch(err => console.warn('⚠️ [EmailService] Admin new booking notification email dispatch warning:', err));
        return c.json({
            success: true,
            message: 'Your booking request has been submitted. Our team will review your request and confirm availability.',
            data: booking
        }, 201);
    }
    catch (error) {
        console.error('Error creating booking on server:', error);
        return c.json({ success: false, error: error.message || 'Failed to create booking' }, 400);
    }
}
/**
 * POST /api/bookings/:id/confirm
 * Admin confirms booking -> bookingStatus = "Confirmed", paymentAvailable = true
 * Dispatches Customer confirmation email with Pay Now button
 */
export async function confirmBookingController(c) {
    try {
        const id = c.req.param('id');
        if (!id) {
            return c.json({ success: false, error: 'Booking ID is required' }, 400);
        }
        // Role verification (Admin authorization check)
        const roleHeader = c.req.header('x-user-role');
        const authHeader = c.req.header('authorization');
        if (roleHeader && roleHeader !== 'admin' && !authHeader?.includes('admin')) {
            return c.json({ success: false, error: 'Unauthorized: Admin privileges required to confirm bookings.' }, 403);
        }
        const updated = bookingStore.confirmBooking(id);
        if (!updated) {
            return c.json({ success: false, error: 'Booking not found' }, 404);
        }
        console.log(`[Server Bookings] Booking ${id} (${updated.bookingCode}) CONFIRMED by Admin -> Payment is now available.`);
        // Dispatch Customer Confirmation Email with Pay Now Link
        const frontendUrl = getFrontendBaseUrl(c);
        const payNowUrl = `${frontendUrl}/customer/bookings/${updated.id}`;
        emailService.sendCustomerBookingConfirmed({
            to: updated.customerEmail,
            name: updated.customerName,
            bookingCode: updated.bookingCode,
            tourTitle: updated.tourTitle || 'Sri Lanka Tour',
            startDate: updated.startDate,
            totalAmount: updated.totalAmount,
            payNowUrl
        }).catch(err => console.warn('⚠️ [EmailService] Customer confirmation email dispatch warning:', err));
        return c.json({
            success: true,
            message: 'Booking confirmed successfully. Customer has been notified with payment instructions.',
            data: updated
        }, 200);
    }
    catch (error) {
        console.error('Error confirming booking:', error);
        return c.json({ success: false, error: error.message || 'Failed to confirm booking' }, 500);
    }
}
/**
 * POST /api/bookings/:id/reject
 * Admin rejects/cancels booking -> bookingStatus = "Rejected", paymentAvailable = false
 */
export async function rejectBookingController(c) {
    try {
        const id = c.req.param('id');
        if (!id) {
            return c.json({ success: false, error: 'Booking ID is required' }, 400);
        }
        const roleHeader = c.req.header('x-user-role');
        const authHeader = c.req.header('authorization');
        if (roleHeader && roleHeader !== 'admin' && !authHeader?.includes('admin')) {
            return c.json({ success: false, error: 'Unauthorized: Admin privileges required to reject bookings.' }, 403);
        }
        const updated = bookingStore.rejectBooking(id);
        if (!updated) {
            return c.json({ success: false, error: 'Booking not found' }, 404);
        }
        console.log(`[Server Bookings] Booking ${id} (${updated.bookingCode}) REJECTED by Admin.`);
        return c.json({
            success: true,
            message: 'Booking request rejected.',
            data: updated
        }, 200);
    }
    catch (error) {
        console.error('Error rejecting booking:', error);
        return c.json({ success: false, error: error.message || 'Failed to reject booking' }, 500);
    }
}
/**
 * PATCH /api/bookings/:id/status
 * Updates booking status (Pending, Confirmed, Cancelled, Rejected, Completed)
 */
export async function updateBookingStatus(c) {
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
        // If updated to Confirmed, send customer email
        if (status === 'Confirmed') {
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
        }
        console.log(`[Server Bookings] Booking ${id} status updated to: ${status}`);
        return c.json({ success: true, data: updated });
    }
    catch (error) {
        console.error('Error updating booking status:', error);
        return c.json({ success: false, error: error.message || 'Failed to update status' }, 500);
    }
}
/**
 * PATCH /api/bookings/:id/payment
 * Updates payment status and amountPaid
 */
export async function updateBookingPayment(c) {
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
    }
    catch (error) {
        console.error('Error updating booking payment:', error);
        return c.json({ success: false, error: error.message || 'Failed to update payment' }, 500);
    }
}
/**
 * POST /api/bookings/:id/mark-as-paid
 * Marks a booking as PAID and sets status to Confirmed
 */
export async function markBookingAsPaid(c) {
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
    }
    catch (error) {
        console.error('Error marking booking as paid:', error);
        return c.json({ success: false, error: error.message || 'Failed to mark as paid' }, 500);
    }
}
/**
 * DELETE /api/bookings/:id
 * Deletes a booking record
 */
export async function deleteBooking(c) {
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
    }
    catch (error) {
        console.error('Error deleting booking:', error);
        return c.json({ success: false, error: error.message || 'Failed to delete booking' }, 500);
    }
}
