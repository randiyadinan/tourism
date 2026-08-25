import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '../../services/analytics';
import { INITIAL_TOURS } from '../../data/tours';
import { INITIAL_DESTINATIONS } from '../../data/destinations';
import { INITIAL_ACTIVITIES } from '../../data/activities';

const ROUTE_METADATA: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'LankaVoyage | Luxury Sri Lanka Tours, Chauffeurs & Bespoke Journeys',
    description: 'Experience bespoke Sri Lankan luxury travel with private chauffeur-guides, 5-star heritage stays, wildlife safaris, scenic blue trains, and 24/7 concierge care.'
  },
  '/tours': {
    title: 'Signature Sri Lanka Tours & Curated Itineraries | LankaVoyage',
    description: 'Browse luxury multi-day Sri Lanka tours spanning the UNESCO Cultural Triangle, Ella tea highlands, Yala leopard safaris, and colonial Galle Fort.'
  },
  '/destinations': {
    title: 'Sri Lanka Travel Destinations | Sigiriya, Ella, Yala, Galle & Beyond | LankaVoyage',
    description: 'Discover the finest travel destinations in Sri Lanka. Comprehensive destination guides for Sigiriya, Ella, Kandy, Galle, Yala, Nuwara Eliya, and Mirissa.'
  },
  '/activities': {
    title: 'Authentic Sri Lankan Experiences & Private Safaris | LankaVoyage',
    description: 'Explore exclusive private Sri Lanka activities: 4x4 leopard safaris, blue train journeys, Sigiriya rock climbs, whale watching, and tea tastings.'
  },
  '/customize': {
    title: 'Design Your Bespoke Sri Lanka Itinerary | LankaVoyage',
    description: 'Create a fully customized Sri Lanka travel plan tailored to your dates, preferences, pace, boutique accommodation style, and private chauffeur fleet.'
  },
  '/transfers': {
    title: 'Airport Transfers & Private Chauffeur Fleet | Bandaranaike Airport (CMB) | LankaVoyage',
    description: 'Reliable, luxury private airport transfers between Bandaranaike International Airport (CMB) and destinations across Sri Lanka with English-speaking drivers.'
  },
  '/about': {
    title: 'About LankaVoyage | Authentic Ceylon Hospitality & Luxury Travel Designers',
    description: 'Learn about LankaVoyage, our heritage, private fleet, and mission to deliver unmatched bespoke Ceylon travel stories with local authenticity.'
  },
  '/reviews': {
    title: 'Verified Traveler Reviews & Testimonials | LankaVoyage',
    description: 'Read authentic reviews from international travelers who explored Sri Lanka with LankaVoyage private chauffeur-guides and bespoke luxury itineraries.'
  },
  '/contact': {
    title: 'Contact 24/7 Island Concierge | LankaVoyage Headquarters Colombo',
    description: 'Get in touch with the LankaVoyage team in Colombo. Call, email, or chat on WhatsApp for custom itinerary proposals and round-the-clock traveler assistance.'
  },
  '/terms-and-conditions': {
    title: 'Terms & Conditions | LankaVoyage',
    description: 'Official booking terms, payment guidelines, traveler responsibilities, and booking conditions for all LankaVoyage services and private tours.'
  },
  '/privacy-policy': {
    title: 'Privacy Policy & Data Protection | LankaVoyage',
    description: 'How LankaVoyage protects customer privacy, handles booking information, adheres to zero-card-storage security, and processes travel inquiries.'
  },
  '/cancellation-refund-policy': {
    title: 'Cancellation & Refund Policy | LankaVoyage',
    description: 'Transparent cancellation tiers, refund processing timelines, itinerary amendment rules, and force majeure guarantees for LankaVoyage travelers.'
  },
  '/login': {
    title: 'Sign In | LankaVoyage Traveler Portal',
    description: 'Access your LankaVoyage customer account to view upcoming bookings, download vouchers, and manage your travel preferences.'
  },
  '/register': {
    title: 'Create Traveler Account | LankaVoyage',
    description: 'Register for a LankaVoyage account to save custom travel itineraries, track booking status, and access exclusive Ceylon travel experiences.'
  },
  '/checkout': {
    title: 'Secure Checkout & Reservation | LankaVoyage',
    description: 'Securely confirm and pay for your LankaVoyage tour with 256-bit SSL encryption and verified PayHere checkout protection.'
  }
};

export const SEOTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;
    let pageTitle = 'LankaVoyage | Luxury Sri Lanka Travel Experiences';
    let pageDescription = 'Bespoke Sri Lankan journeys with private chauffeur-guides, boutique stays, and wildlife safaris.';

    // Check exact static routes
    if (ROUTE_METADATA[pathname]) {
      pageTitle = ROUTE_METADATA[pathname].title;
      pageDescription = ROUTE_METADATA[pathname].description;
    } 
    // Dynamic Tour Detail Route
    else if (pathname.startsWith('/tours/')) {
      const slug = pathname.replace('/tours/', '');
      const tour = INITIAL_TOURS.find((t) => t.slug === slug || t.id === slug);
      if (tour) {
        pageTitle = `${tour.title} (${tour.durationDays} Days) | LankaVoyage`;
        pageDescription = tour.tagline || tour.overview?.slice(0, 155) || pageDescription;
      }
    } 
    // Dynamic Destination Detail Route
    else if (pathname.startsWith('/destinations/')) {
      const slug = pathname.replace('/destinations/', '');
      const dest = INITIAL_DESTINATIONS.find((d) => d.slug === slug || d.id === slug);
      if (dest) {
        pageTitle = `${dest.name} Travel Guide & Luxury Experiences | LankaVoyage`;
        pageDescription = dest.shortDescription || dest.tagline || dest.overview?.slice(0, 155) || pageDescription;
      }
    }
    // Dynamic Activity Detail Route
    else if (pathname.startsWith('/activities/')) {
      const slug = pathname.replace('/activities/', '');
      const act = INITIAL_ACTIVITIES.find((a) => a.slug === slug || a.id === slug);
      if (act) {
        pageTitle = `${act.title} in ${act.destination} | LankaVoyage`;
        pageDescription = act.shortDescription || act.description?.slice(0, 155) || pageDescription;
      }
    }

    // 1. Update Document Title
    document.title = pageTitle;

    // 2. Helper to set or create meta tags
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}='${name}']`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Standard Meta Description
    setMetaTag('description', pageDescription);

    // Open Graph Metadata
    setMetaTag('og:title', pageTitle, true);
    setMetaTag('og:description', pageDescription, true);
    setMetaTag('og:url', `https://tourism-swart-seven.vercel.app${pathname}`, true);
    setMetaTag('og:type', pathname === '/' ? 'website' : 'article', true);

    // Twitter Card Metadata
    setMetaTag('twitter:title', pageTitle);
    setMetaTag('twitter:description', pageDescription);

    // 3. Dynamic Canonical Link Update
    let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `https://tourism-swart-seven.vercel.app${pathname}`;

    // 4. Track GA4 Page View
    analytics.pageView(pathname, pageTitle);
  }, [location.pathname]);

  return null;
};
