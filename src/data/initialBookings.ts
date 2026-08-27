import type { DiscountCoupon, User, Booking } from '../types';

export const INITIAL_DISCOUNTS: DiscountCoupon[] = [
  {
    code: 'CEYLON10',
    description: '10% discount on all signature multi-day tours',
    discountType: 'percentage',
    discountValue: 10,
    minSpendUSD: 150000,
    validUntil: '2026-12-31',
    isActive: true,
    usageCount: 45
  },
  {
    code: 'HONEYMOON100',
    description: 'LKR 30,000 off any Luxury or Honeymoon experience',
    discountType: 'fixed_usd',
    discountValue: 30000,
    minSpendUSD: 300000,
    validUntil: '2026-12-31',
    isActive: true,
    usageCount: 28
  },
  {
    code: 'EARLYBIRD',
    description: '15% early bird booking savings',
    discountType: 'percentage',
    discountValue: 15,
    minSpendUSD: 200000,
    validUntil: '2026-11-30',
    isActive: true,
    usageCount: 19
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-customer-1',
    name: 'Sarah Jenkins',
    email: 'sarah.traveler@example.com',
    role: 'customer',
    passwordHash: 'password123',
    emailVerified: true,
    phone: '+44 7700 900077',
    country: 'United Kingdom',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    passportNumber: 'GB98821458',
    dietaryPreferences: 'Vegetarian, allergic to shellfish',
    emergencyContact: {
      name: 'Mark Jenkins',
      relationship: 'Spouse',
      phone: '+44 7700 900088'
    },
    createdAt: '2026-05-10'
  },
  {
    id: 'user-admin-1',
    name: 'Kasun Bandara (Operations Director)',
    email: 'admin@lankavoyage.com',
    role: 'admin',
    passwordHash: 'admin123',
    emailVerified: true,
    phone: '+94 77 123 4567',
    country: 'Sri Lanka',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    createdAt: '2026-01-01'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-1001',
    bookingCode: 'LV-2026-8891',
    userId: 'user-customer-1',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.traveler@example.com',
    customerPhone: '+44 7700 900077',
    type: 'standard_tour',
    tourId: 'tour-sri-lanka-highlights',
    tourTitle: 'Sri Lanka Grand Highlights & Heritage (10 Days)',
    tourImage: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80',
    startDate: '2026-10-15',
    endDate: '2026-10-24',
    adultsCount: 2,
    childrenCount: 0,
    infantsCount: 0,
    totalTravelers: 2,
    destinationsCovered: ['Sigiriya', 'Kandy', 'Nuwara Eliya', 'Ella', 'Yala', 'Galle'],
    hotelTier: '5-Star Luxury Resorts',
    vehicleType: 'Van (LKR 20,000/day)',
    mealPlan: 'Half Board (Breakfast & Dinner)',
    airportPickup: true,
    flightNumber: 'UL 504 (Heathrow to Colombo)',
    flightArrivalTime: '14:30',
    travelers: [
      {
        title: 'Mrs',
        fullName: 'Sarah Jenkins',
        email: 'sarah.traveler@example.com',
        phone: '+44 7700 900077',
        nationality: 'British',
        passportNumber: 'GB98821458',
        isLead: true
      },
      {
        title: 'Mr',
        fullName: 'Mark Jenkins',
        email: 'mark.jenkins@example.com',
        phone: '+44 7700 900088',
        nationality: 'British',
        passportNumber: 'GB98821459',
        isLead: false
      }
    ],
    basePrice: 200000,
    customizationTotal: 0,
    discountAmount: 20000,
    discountCode: 'CEYLON10',
    taxAmount: 0,
    totalAmount: 180000,
    amountPaid: 180000,
    bookingStatus: 'Confirmed',
    paymentStatus: 'Fully Paid',
    paymentMethod: 'Credit / Debit Card',
    notes: 'Please arrange a quiet high-floor room in Nuwara Eliya with garden views.',
    assignedGuide: {
      name: 'Roshan Silva',
      phone: '+94 77 889 9112',
      license: 'SLTDA-CG-4412'
    },
    createdAt: '2026-08-10T11:20:00Z',
    updatedAt: '2026-08-10T11:25:00Z'
  },
  {
    id: 'bk-1002',
    bookingCode: 'LV-2026-9042',
    userId: 'user-customer-1',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.traveler@example.com',
    customerPhone: '+44 7700 900077',
    type: 'custom_trip',
    tourTitle: 'Bespoke South Coast & Yala Adventure (6 Days)',
    tourImage: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80',
    startDate: '2026-12-05',
    endDate: '2026-12-11',
    adultsCount: 2,
    childrenCount: 1,
    infantsCount: 0,
    totalTravelers: 3,
    destinationsCovered: ['Mirissa', 'Yala', 'Galle'],
    hotelTier: 'Premium 4-Star',
    vehicleType: 'Car (LKR 15,000/day)',
    mealPlan: 'Breakfast Included',
    airportPickup: true,
    flightNumber: 'QR 668 (Doha to Colombo)',
    flightArrivalTime: '08:45',
    travelers: [
      {
        title: 'Mrs',
        fullName: 'Sarah Jenkins',
        email: 'sarah.traveler@example.com',
        phone: '+44 7700 900077',
        nationality: 'British',
        isLead: true
      }
    ],
    basePrice: 90000,
    customizationTotal: 0,
    discountAmount: 0,
    taxAmount: 0,
    totalAmount: 90000,
    amountPaid: 30000,
    bookingStatus: 'Confirmed',
    paymentStatus: 'Deposit Paid',
    paymentMethod: 'Credit / Debit Card',
    notes: 'Travelling with 8-year-old child; child booster seat requested in vehicle.',
    assignedGuide: {
      name: 'Chaminda Fernando',
      phone: '+94 71 556 7788',
      license: 'SLTDA-CG-2981'
    },
    createdAt: '2026-08-20T09:15:00Z',
    updatedAt: '2026-08-20T09:20:00Z'
  },
  {
    id: 'bk-1003',
    bookingCode: 'LV-2026-7734',
    userId: 'user-customer-2',
    customerName: 'Alexander Petrov',
    customerEmail: 'alex.petrov@example.com',
    customerPhone: '+49 170 1234567',
    type: 'standard_tour',
    tourId: 'tour-wildlife-safari',
    tourTitle: 'Wild Sri Lanka: Leopards, Whales & Elephants (8 Days)',
    tourImage: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80',
    startDate: '2026-09-10',
    endDate: '2026-09-17',
    adultsCount: 2,
    childrenCount: 0,
    infantsCount: 0,
    totalTravelers: 2,
    destinationsCovered: ['Yala', 'Mirissa', 'Sigiriya'],
    hotelTier: '5-Star Luxury Eco Lodges',
    vehicleType: 'Car (LKR 15,000/day)',
    mealPlan: 'Full Board',
    airportPickup: true,
    travelers: [
      {
        title: 'Mr',
        fullName: 'Alexander Petrov',
        email: 'alex.petrov@example.com',
        phone: '+49 170 1234567',
        nationality: 'German',
        isLead: true
      }
    ],
    basePrice: 120000,
    customizationTotal: 0,
    discountAmount: 0,
    taxAmount: 0,
    totalAmount: 120000,
    amountPaid: 0,
    bookingStatus: 'Pending',
    paymentStatus: 'Unpaid',
    paymentMethod: 'Bank Wire Transfer',
    createdAt: '2026-08-22T16:40:00Z',
    updatedAt: '2026-08-22T16:40:00Z'
  }
];
