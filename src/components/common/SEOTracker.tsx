import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '../../services/analytics';

const ROUTE_TITLES: Record<string, string> = {
  '/': 'LankaVoyage | Premium Sri Lankan Travel Experiences & Bespoke Tours',
  '/tours': 'Signature Sri Lanka Tours & Curated Itineraries | LankaVoyage',
  '/destinations': 'Explore Sri Lanka Destinations | Sigiriya, Ella, Yala & Galle | LankaVoyage',
  '/activities': 'Authentic Sri Lankan Experiences & Safaris | LankaVoyage',
  '/customize': 'Design Your Bespoke Sri Lanka Itinerary | LankaVoyage',
  '/transfers': 'Airport Transfers & Private Chauffeur Fleet | LankaVoyage',
  '/about': 'About LankaVoyage | Ceylon Hospitality & Luxury Travel Designers',
  '/reviews': 'Verified Traveler Reviews & Testimonials | LankaVoyage',
  '/contact': 'Contact 24/7 Island Concierge | LankaVoyage',
  '/terms-and-conditions': 'Terms & Conditions | LankaVoyage',
  '/privacy-policy': 'Privacy Policy & Data Protection | LankaVoyage',
  '/login': 'Sign In | LankaVoyage Traveler Portal',
  '/register': 'Create Traveler Account | LankaVoyage',
  '/checkout': 'Secure Checkout & Reservation | LankaVoyage'
};

export const SEOTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Dynamic document title update based on route
    const currentTitle = ROUTE_TITLES[location.pathname];
    if (currentTitle) {
      document.title = currentTitle;
    }

    // Dynamic canonical link update
    let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `https://tourism-swart-seven.vercel.app${location.pathname}`;

    // Track GA4 page view
    analytics.pageView(location.pathname, document.title);
  }, [location.pathname]);

  return null;
};
