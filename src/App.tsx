import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Common Components
import { ScrollToTop } from './components/common/ScrollToTop';
import { PublicLayout } from './components/common/PublicLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { CustomerLayout } from './components/customer/CustomerLayout';
import { AdminLayout } from './components/admin/AdminLayout';

// Public Pages (15)
import { HomePage } from './pages/public/HomePage';
import { ToursPage } from './pages/public/ToursPage';
import { TourDetailPage } from './pages/public/TourDetailPage';
import { DestinationsPage } from './pages/public/DestinationsPage';
import { DestinationDetailPage } from './pages/public/DestinationDetailPage';
import { ActivitiesPage } from './pages/public/ActivitiesPage';
import { ActivityDetailPage } from './pages/public/ActivityDetailPage';
import { CustomTripPage } from './pages/public/CustomTripPage';
import { AirportTransferPage } from './pages/public/AirportTransferPage';
import { AboutPage } from './pages/public/AboutPage';
import { ReviewsPage } from './pages/public/ReviewsPage';
import { ContactPage } from './pages/public/ContactPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';

// Customer Portal Pages (8)
import { CustomerDashboardPage } from './pages/customer/CustomerDashboardPage';
import { MyTripsPage } from './pages/customer/MyTripsPage';
import { MyBookingsPage } from './pages/customer/MyBookingsPage';
import { BookingDetailPage } from './pages/customer/BookingDetailPage';
import { CustomerProfilePage } from './pages/customer/CustomerProfilePage';
import { WishlistPage } from './pages/customer/WishlistPage';
import { PaymentsPage } from './pages/customer/PaymentsPage';
import { NotificationsPage } from './pages/customer/NotificationsPage';

// Admin Suite Pages (13)
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { ManageToursPage } from './pages/admin/ManageToursPage';
import { EditTourPage } from './pages/admin/EditTourPage';
import { ManageDestinationsPage } from './pages/admin/ManageDestinationsPage';
import { ManageActivitiesPage } from './pages/admin/ManageActivitiesPage';
import { ManageHotelsPage } from './pages/admin/ManageHotelsPage';
import { ManageVehiclesPage } from './pages/admin/ManageVehiclesPage';
import { ManageCustomersPage } from './pages/admin/ManageCustomersPage';
import { ManageBookingsPage } from './pages/admin/ManageBookingsPage';
import { ManagePaymentsPage } from './pages/admin/ManagePaymentsPage';
import { ManageReviewsPage } from './pages/admin/ManageReviewsPage';
import { ManageDiscountsPage } from './pages/admin/ManageDiscountsPage';
import { ReportsPage } from './pages/admin/ReportsPage';

export const App: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        
        {/* PUBLIC ROUTES (with PublicLayout: TopAnnouncement, Navbar, Footer) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/tours" element={<ToursPage />} />
          <Route path="/tours/:slug" element={<TourDetailPage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/destinations/:slug" element={<DestinationDetailPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/activities/:slug" element={<ActivityDetailPage />} />
          <Route path="/customize" element={<CustomTripPage />} />
          <Route path="/transfers" element={<AirportTransferPage />} />
          <Route path="/airport-transfer" element={<Navigate to="/transfers" replace />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        <Route
          path="/customer"
          element={
            <ProtectedRoute requiredRole="customer">
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CustomerDashboardPage />} />
          <Route path="trips" element={<MyTripsPage />} />
          <Route path="bookings" element={<MyBookingsPage />} />
          <Route path="bookings/:id" element={<BookingDetailPage />} />
          <Route path="profile" element={<CustomerProfilePage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        {/* ADMIN MANAGEMENT SUITE ROUTES (Protected) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="tours" element={<ManageToursPage />} />
          <Route path="tours/new" element={<EditTourPage />} />
          <Route path="tours/:id/edit" element={<EditTourPage />} />
          <Route path="destinations" element={<ManageDestinationsPage />} />
          <Route path="activities" element={<ManageActivitiesPage />} />
          <Route path="hotels" element={<ManageHotelsPage />} />
          <Route path="vehicles" element={<ManageVehiclesPage />} />
          <Route path="customers" element={<ManageCustomersPage />} />
          <Route path="bookings" element={<ManageBookingsPage />} />
          <Route path="payments" element={<ManagePaymentsPage />} />
          <Route path="reviews" element={<ManageReviewsPage />} />
          <Route path="discounts" element={<ManageDiscountsPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </>
  );
};
