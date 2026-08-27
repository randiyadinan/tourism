import { Hono } from 'hono';
import { requireAdmin } from '../middleware/authMiddleware.js';
import {
  getAdminUsers,
  getAdminUserById,
  updateAdminUser,
  deleteAdminUser,
  getAdminBookings,
  getAdminBookingById,
  confirmAdminBooking,
  rejectAdminBooking,
  updateAdminBooking,
  deleteAdminBooking,
  getAdminTours,
  getAdminTourById,
  createAdminTour,
  updateAdminTour,
  deleteAdminTour,
  getAdminDestinations,
  getAdminDestinationById,
  createAdminDestination,
  updateAdminDestination,
  deleteAdminDestination
} from '../controllers/adminController.js';

export const adminRouter = new Hono();

// Enforce strict Server-Side Admin Authorization across all /api/admin/* endpoints
adminRouter.use('*', requireAdmin);

// ─── 1. PROFILES / CUSTOMERS ───
adminRouter.get('/users', getAdminUsers);
adminRouter.get('/users/:id', getAdminUserById);
adminRouter.put('/users/:id', updateAdminUser);
adminRouter.delete('/users/:id', deleteAdminUser);

// ─── 2. BOOKINGS ───
adminRouter.get('/bookings', getAdminBookings);
adminRouter.get('/bookings/:id', getAdminBookingById);
adminRouter.put('/bookings/:id', updateAdminBooking);
adminRouter.post('/bookings/:id/confirm', confirmAdminBooking);
adminRouter.post('/bookings/:id/reject', rejectAdminBooking);
adminRouter.delete('/bookings/:id', deleteAdminBooking);

// ─── 3. TOURS ───
adminRouter.get('/tours', getAdminTours);
adminRouter.get('/tours/:id', getAdminTourById);
adminRouter.post('/tours', createAdminTour);
adminRouter.put('/tours/:id', updateAdminTour);
adminRouter.delete('/tours/:id', deleteAdminTour);

// ─── 4. DESTINATIONS ───
adminRouter.get('/destinations', getAdminDestinations);
adminRouter.get('/destinations/:id', getAdminDestinationById);
adminRouter.post('/destinations', createAdminDestination);
adminRouter.put('/destinations/:id', updateAdminDestination);
adminRouter.delete('/destinations/:id', deleteAdminDestination);
