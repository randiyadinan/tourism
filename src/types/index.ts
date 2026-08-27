// ==========================================
// LANKAVOYAGE - COMPLETE TYPE DEFINITIONS
// ==========================================

export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  passwordHash?: string;
  phone?: string;
  country?: string;
  avatar?: string;
  passportNumber?: string;
  dietaryPreferences?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  emailVerified?: boolean;
  emailVerificationTokenHash?: string;
  emailVerificationExpiresAt?: string;
  createdAt: string;
}

export type TourCategory = 
  | 'Cultural & Heritage' 
  | 'Wildlife & Safari' 
  | 'Hill Country & Nature' 
  | 'Beach & Coastal' 
  | 'Luxury & Honeymoon' 
  | 'Active Adventure' 
  | 'Ayurveda & Wellness';

export type TourDifficulty = 'Easy' | 'Moderate' | 'Challenging';

export interface ItineraryDay {
  day: number;
  title: string;
  destination: string;
  description: string;
  highlights: string[];
  mealsIncluded: ('Breakfast' | 'Lunch' | 'Dinner')[];
  accommodation: string;
  optionalActivities?: string[];
  driveTime?: string;
}

export interface Tour {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  tagline: string;
  category: TourCategory;
  durationDays: number;
  durationNights: number;
  pricePerPerson: number;
  originalPrice?: number;
  discountPercent?: number;
  featured: boolean;
  published: boolean;
  rating: number;
  reviewCount: number;
  difficulty: TourDifficulty;
  groupSizeMax: number;
  startLocation: string;
  endLocation: string;
  heroImage: string;
  gallery: string[];
  overview: string;
  highlights: string[];
  destinations: string[]; // List of destination IDs or names
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  accommodationType: string;
  transportType: string;
  importantInfo: string[];
  faqs: { question: string; answer: string }[];
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  sinhalaName?: string;
  province: string;
  tagline: string;
  shortDescription: string;
  overview: string;
  heroImage: string;
  gallery: string[];
  bestTimeToVisit: string;
  recommendedDuration: string;
  startingPrice: number;
  rating: number;
  reviewCount: number;
  popularActivities: string[];
  attractions: {
    name: string;
    description: string;
    image: string;
    entranceFee?: string;
  }[];
  coordinates: {
    lat: number;
    lng: number;
  };
  climate: {
    temperature: string;
    rainfall: string;
  };
  featured: boolean;
}

export type ActivityCategory = 
  | 'Wildlife' 
  | 'Water Sports' 
  | 'Trekking' 
  | 'Culture & Heritage' 
  | 'Culinary' 
  | 'Scenic & Leisure' 
  | 'Wellness';

export interface Activity {
  id: string;
  slug: string;
  title: string;
  category: ActivityCategory;
  destination: string;
  duration: string;
  pricePerPerson: number;
  rating: number;
  reviewCount: number;
  difficulty: 'Easy' | 'Moderate' | 'Strenuous';
  image: string;
  gallery?: string[];
  shortDescription: string;
  description: string;
  highlights: string[];
  included: string[];
  whatToBring: string[];
  meetingPoint: string;
  featured: boolean;
}

export interface Hotel {
  id: string;
  name: string;
  destination: string;
  starCategory: 3 | 4 | 5 | 'Boutique Luxury';
  pricePerNightUSD: number;
  image: string;
  description: string;
  amenities: string[];
  rating: number;
}

export interface Vehicle {
  id: string;
  name: string;
  type: 'Sedan Car' | 'Mini Van' | 'Luxury SUV' | 'Mini Bus' | 'Safari 4x4 Jeep';
  capacityPassengers: number;
  capacityLuggage: number;
  dailyRateUSD: number;
  transferRateCMBtoColombo: number;
  image: string;
  features: string[];
  isAirConditioned: boolean;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Rejected';
export type PaymentStatus = 'PAID' | 'NOT PAID' | 'FAILED' | 'CANCELLED' | 'Unpaid' | 'Deposit Paid' | 'Fully Paid' | 'Refunded';
export type PaymentMethod = 'Credit / Debit Card' | 'Cash Payment' | 'PayPal' | 'Bank Wire Transfer' | 'Pay on Arrival / Deposit';

export interface TravelerDetail {
  title: 'Mr' | 'Mrs' | 'Ms' | 'Dr';
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  passportNumber?: string;
  isLead: boolean;
  specialRequirements?: string;
}

export interface Booking {
  id: string;
  bookingCode: string; // e.g. LV-2026-8891
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  type: 'standard_tour' | 'custom_trip' | 'airport_transfer' | 'activity_only';
  tourId?: string;
  tourTitle?: string;
  tourImage?: string;
  startDate: string;
  endDate: string;
  adultsCount: number;
  childrenCount: number;
  infantsCount: number;
  totalTravelers: number;
  destinationsCovered?: string[];
  hotelTier?: string;
  vehicleType?: string;
  mealPlan?: string;
  activitiesSelected?: string[];
  airportPickup?: boolean;
  airportTransferOption?: 'none' | 'pickup' | 'dropoff' | 'both';
  airportTransferDetails?: {
    airport: string;
    flightNumber?: string;
    arrivalTime?: string;
    pickupLocation?: string;
    dropoffLocation?: string;
    passengers?: number;
    vehicleId?: string;
    priceUSD?: number;
  };
  flightNumber?: string;
  flightArrivalTime?: string;
  travelers: TravelerDetail[];
  basePrice: number;
  customizationTotal: number;
  discountAmount: number;
  discountCode?: string;
  taxAmount: number;
  totalAmount: number;
  amountPaid: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentAvailable?: boolean;
  paymentMethod: PaymentMethod;
  notes?: string;
  assignedGuide?: {
    name: string;
    phone: string;
    license: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CustomTripState {
  arrivalDate: string;
  departureDate: string;
  adults: number;
  children: number;
  infants: number;
  airport: string;
  flightNumber: string;
  arrivalTime: string;
  // Detailed airport transfer options
  airportPickup?: boolean;
  airportTransferOption: 'none' | 'pickup' | 'dropoff' | 'both';
  airportTransferDetails?: {
    airport: string;
    flightNumber?: string;
    arrivalTime?: string;
    pickupLocation?: string;
    dropoffLocation?: string;
    passengers?: number;
    vehicleId?: string;
    priceUSD?: number;
  };
  selectedDestinations: string[]; // Destination IDs
  selectedActivities: string[]; // Activity IDs
  transportType: 'Private Car' | 'Private Van' | 'Luxury SUV' | 'Shared Transport';
  accommodationLevel?: 'Budget / Guest House' | 'Standard 3-Star' | 'Premium 4-Star' | 'Luxury 5-Star & Heritage';
  mealPlan?: 'No Meals / Room Only' | 'Breakfast Included' | 'Half Board (Breakfast & Dinner)' | 'Full Board (All Meals)';
  specialRequests: string;
}

export interface AirportTransferBooking {
  id: string;
  bookingCode: string;
  airport: 'Bandaranaike International Airport (CMB) – Katunayake' | string;
  tripType: 'One Way: Airport to Hotel' | 'One Way: Hotel to Airport' | 'Round Trip';
  destinationArea: string;
  hotelAddress: string;
  flightDate: string;
  flightTime: string;
  flightNumber: string;
  passengers: number;
  luggageCount: number;
  vehicleId: string;
  vehicleName: string;
  basePriceUSD: number;
  totalPriceUSD: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  specialRequests?: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface Review {
  id: string;
  targetType: 'tour' | 'destination' | 'general';
  targetId?: string;
  targetTitle?: string;
  authorName: string;
  authorCountry: string;
  authorAvatar?: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  tripType: 'Couple / Honeymoon' | 'Family Vacation' | 'Solo Explorer' | 'Friends Group';
  verifiedTraveler: boolean;
  photos?: string[];
  status: 'approved' | 'pending' | 'rejected';
  replyFromManagement?: {
    responderName: string;
    date: string;
    text: string;
  };
}

export interface DiscountCoupon {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed_usd';
  discountValue: number;
  minSpendUSD?: number;
  validUntil: string;
  isActive: boolean;
  usageCount: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'trip_update' | 'promo' | 'system';
  isRead: boolean;
  linkUrl?: string;
  createdAt: string;
}
