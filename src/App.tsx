import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Common Components
import { ScrollToTop } from './components/common/ScrollToTop';
import { PublicLayout } from './components/common/PublicLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { CustomerLayout } from './components/customer/CustomerLayout';
import { AdminLayout } from './components/admin/AdminLayout';
import { SEOTracker } from './components/common/SEOTracker';
import { analytics } from './services/analytics';

// 3 Main Customer Pages + Utility Pages
import { HomePage } from './pages/public/HomePage';
import { AirportTransferPage } from './pages/public/AirportTransferPage';
import { ReviewsPage } from './pages/public/ReviewsPage';
import { ContactPage } from './pages/public/ContactPage';
import { AboutPage } from './pages/public/AboutPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { VerifyEmailPage } from './pages/public/VerifyEmailPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';
import { CheckoutPage } from './pages/public/CheckoutPage';
import { TermsAndConditionsPage } from './pages/public/TermsAndConditionsPage';
import { PrivacyPolicyPage } from './pages/public/PrivacyPolicyPage';
import { CancellationRefundPolicyPage } from './pages/public/CancellationRefundPolicyPage';

// Customer Portal Pages (Only Dashboard, My Bookings, Booking Detail, Profile, Payments)
import { CustomerDashboardPage } from './pages/customer/CustomerDashboardPage';
import { MyBookingsPage } from './pages/customer/MyBookingsPage';
import { BookingDetailPage } from './pages/customer/BookingDetailPage';
import { CustomerProfilePage } from './pages/customer/CustomerProfilePage';
import { PaymentsPage } from './pages/customer/PaymentsPage';

// Admin Suite Pages
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
import { ManageAirportTransfersPage } from './pages/admin/ManageAirportTransfersPage';
import { AdminNotificationsPage } from './pages/admin/AdminNotificationsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export const App: React.FC = () => {
  React.useEffect(() => {
    analytics.init();
  }, []);

  return (
    <>
      <ScrollToTop />
      <SEOTracker />
      
      <Routes>
        
        {/* PUBLIC ROUTES (with PublicLayout: TopAnnouncement, Navbar, Footer) */}
        <Route element={<PublicLayout />}>
          {/* 1. HOME */}
          <Route path="/" element={<HomePage />} />
          
          {/* 2. AIRPORT TRANSFER & TOURS (Combined Single Location) */}
          <Route path="/transfers" element={<AirportTransferPage />} />
          <Route path="/airport-transfer" element={<Navigate to="/transfers" replace />} />
          
          {/* 3. REVIEWS */}
          <Route path="/reviews" element={<ReviewsPage />} />

          {/* Standalone Tours & Destinations public listing routes removed -> Redirects to /transfers or / */}
          <Route path="/tours" element={<Navigate to="/transfers" replace />} />
          <Route path="/tours/:slug" element={<Navigate to="/transfers" replace />} />
          <Route path="/destinations" element={<Navigate to="/" replace />} />
          <Route path="/destinations/:slug" element={<Navigate to="/" replace />} />
          <Route path="/activities" element={<Navigate to="/transfers" replace />} />
          <Route path="/activities/:slug" element={<Navigate to="/transfers" replace />} />
          <Route path="/customize" element={<Navigate to="/transfers" replace />} />

          {/* Static info & Auth pages */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/cancellation-refund-policy" element={<CancellationRefundPolicyPage />} />
        </Route>

        {/* CUSTOMER PORTAL ROUTES (Protected) */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute requiredRole="customer">
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CustomerDashboardPage />} />
          <Route path="bookings" element={<MyBookingsPage />} />
          <Route path="bookings/:id" element={<BookingDetailPage />} />
          <Route path="profile" element={<CustomerProfilePage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="trips" element={<Navigate to="/customer/bookings" replace />} />
          <Route path="wishlist" element={<Navigate to="/customer" replace />} />
          <Route path="notifications" element={<Navigate to="/customer" replace />} />
        </Route>

        {/* ADMIN SUITE ROUTES (Protected) */}
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
          <Route path="tours/edit/:id" element={<EditTourPage />} />
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
          <Route path="airport-transfers" element={<ManageAirportTransfersPage />} />
          <Route path="notifications" element={<AdminNotificationsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </>
  );
};
