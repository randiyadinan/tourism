/**
 * LankaVoyage Google Analytics 4 (GA4) Integration & Event Tracker
 * Loads gtag.js dynamically if VITE_GA_MEASUREMENT_ID is configured.
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export const initGA = () => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') {
    return;
  }

  // Prevent duplicate script injection
  if (document.getElementById('ga-gtag')) {
    return;
  }

  const script = document.createElement('script');
  script.id = 'ga-gtag';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer?.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false // Managed manually on route change
  });
};

export const trackPageView = (path: string, title?: string) => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) {
    return;
  }
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href
  });
};

export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) {
    return;
  }
  window.gtag('event', eventName, params);
};

export const analytics = {
  init: initGA,
  pageView: trackPageView,
  
  viewTour: (tourId: string, tourTitle: string, priceLKR: number) => {
    trackEvent('view_item', {
      item_id: tourId,
      item_name: tourTitle,
      item_category: 'Tour',
      price: priceLKR,
      currency: 'LKR'
    });
  },

  viewDestination: (destId: string, destName: string) => {
    trackEvent('view_item', {
      item_id: destId,
      item_name: destName,
      item_category: 'Destination'
    });
  },

  beginCheckout: (bookingCode: string, title: string, amountLKR: number, currency: string = 'LKR') => {
    trackEvent('begin_checkout', {
      transaction_id: bookingCode,
      item_name: title,
      value: amountLKR,
      currency
    });
  },

  initiatePayment: (orderId: string, amountLKR: number, currency: string = 'LKR') => {
    trackEvent('add_payment_info', {
      order_id: orderId,
      value: amountLKR,
      currency,
      payment_type: 'PayHere'
    });
  },

  purchase: (orderId: string, bookingCode: string, amountLKR: number, currency: string = 'LKR') => {
    trackEvent('purchase', {
      transaction_id: orderId,
      affiliation: 'LankaVoyage',
      value: amountLKR,
      currency,
      coupon: bookingCode
    });
  }
};
