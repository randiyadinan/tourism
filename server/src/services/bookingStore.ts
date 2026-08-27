export interface ServerBookingRecord {
  id: string;
  bookingCode: string;
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
  travelers: Array<{
    title: string;
    fullName: string;
    email: string;
    phone: string;
    nationality: string;
    passportNumber?: string;
    isLead: boolean;
    specialRequirements?: string;
  }>;
  basePrice: number;
  customizationTotal: number;
  discountAmount: number;
  discountCode?: string;
  taxAmount: number;
  totalAmount: number;
  amountPaid: number;
  bookingStatus: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Rejected';
  paymentStatus: 'NOT PAID' | 'PAID' | 'FAILED' | 'CANCELLED' | 'REFUNDED' | 'Unpaid' | 'Deposit Paid' | 'Fully Paid';
  paymentAvailable?: boolean;
  paymentMethod: 'Credit / Debit Card' | 'Cash Payment' | 'Direct Bank Transfer' | 'PayHere Online';
  notes?: string;
  assignedGuide?: {
    name: string;
    phone: string;
    license: string;
  };
  createdAt: string;
  updatedAt: string;
}

const INITIAL_SERVER_BOOKINGS: ServerBookingRecord[] = [
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
    paymentStatus: 'PAID',
    paymentAvailable: true,
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
    startDate: '2026-11-04',
    endDate: '2026-11-09',
    adultsCount: 2,
    childrenCount: 1,
    infantsCount: 0,
    totalTravelers: 3,
    destinationsCovered: ['Mirissa', 'Yala', 'Galle'],
    hotelTier: 'Boutique Heritage Villas',
    vehicleType: 'Car (LKR 15,000/day)',
    mealPlan: 'Bed & Breakfast',
    airportPickup: true,
    flightNumber: 'QR 668',
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
    amountPaid: 0,
    bookingStatus: 'Pending',
    paymentStatus: 'NOT PAID',
    paymentAvailable: false,
    paymentMethod: 'Cash Payment',
    notes: 'Require 1 child car safety seat for our 4-year-old.',
    createdAt: '2026-08-20T14:15:00Z',
    updatedAt: '2026-08-20T14:15:00Z'
  }
];

class BookingStore {
  private bookings: Map<string, ServerBookingRecord> = new Map();

  constructor() {
    for (const b of INITIAL_SERVER_BOOKINGS) {
      this.bookings.set(b.id, { ...b });
    }
  }

  getAllBookings(): ServerBookingRecord[] {
    return Array.from(this.bookings.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getBookingById(idOrCode: string): ServerBookingRecord | undefined {
    const direct = this.bookings.get(idOrCode);
    if (direct) return direct;
    return Array.from(this.bookings.values()).find(b => b.bookingCode === idOrCode);
  }

  getUserBookings(userId: string): ServerBookingRecord[] {
    if (!userId) return [];
    return this.getAllBookings().filter(b => b.userId === userId);
  }

  createBooking(input: Omit<ServerBookingRecord, 'id' | 'bookingCode' | 'createdAt' | 'updatedAt' | 'totalTravelers'> & { id?: string; bookingCode?: string }): ServerBookingRecord {
    if (!input.flightNumber || !input.flightNumber.trim()) {
      throw new Error('Flight number is required.');
    }

    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const id = input.id || `bk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const bookingCode = input.bookingCode || `LV-2026-${randomCode}`;
    const totalTravelers = (input.adultsCount || 0) + (input.childrenCount || 0) + (input.infantsCount || 0);

    const booking: ServerBookingRecord = {
      ...input,
      id,
      bookingCode,
      flightNumber: input.flightNumber.trim(),
      totalTravelers: totalTravelers || 1,
      bookingStatus: 'Pending', // Strictly start as Pending for review
      paymentStatus: 'NOT PAID',
      paymentAvailable: false,  // Payment lock active until Admin confirms
      assignedGuide: input.assignedGuide || {
        name: 'Roshan Silva',
        phone: '+94 77 889 9112',
        license: 'SLTDA-CG-4412'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.bookings.set(id, booking);
    return booking;
  }

  confirmBooking(idOrCode: string): ServerBookingRecord | undefined {
    const booking = this.getBookingById(idOrCode);
    if (!booking) return undefined;

    booking.bookingStatus = 'Confirmed';
    booking.paymentAvailable = true;
    booking.updatedAt = new Date().toISOString();
    this.bookings.set(booking.id, booking);
    return booking;
  }

  rejectBooking(idOrCode: string): ServerBookingRecord | undefined {
    const booking = this.getBookingById(idOrCode);
    if (!booking) return undefined;

    booking.bookingStatus = 'Rejected';
    booking.paymentAvailable = false;
    booking.updatedAt = new Date().toISOString();
    this.bookings.set(booking.id, booking);
    return booking;
  }

  updateBookingStatus(idOrCode: string, status: ServerBookingRecord['bookingStatus']): ServerBookingRecord | undefined {
    const booking = this.getBookingById(idOrCode);
    if (!booking) return undefined;

    booking.bookingStatus = status;
    if (status === 'Confirmed') {
      booking.paymentAvailable = true;
    } else if (status === 'Rejected' || status === 'Cancelled' || status === 'Pending') {
      booking.paymentAvailable = false;
    }
    booking.updatedAt = new Date().toISOString();
    this.bookings.set(booking.id, booking);
    return booking;
  }

  updatePaymentStatus(idOrCode: string, paymentStatus: ServerBookingRecord['paymentStatus'], amountPaid?: number): ServerBookingRecord | undefined {
    const booking = this.getBookingById(idOrCode);
    if (!booking) return undefined;

    booking.paymentStatus = paymentStatus;
    if (amountPaid !== undefined) {
      booking.amountPaid = amountPaid;
    }
    if (paymentStatus === 'PAID' || paymentStatus === 'Fully Paid') {
      booking.amountPaid = booking.totalAmount;
      booking.paymentAvailable = false; // Already paid
    }
    booking.updatedAt = new Date().toISOString();
    this.bookings.set(booking.id, booking);
    return booking;
  }

  markAsPaid(idOrCode: string): ServerBookingRecord | undefined {
    const booking = this.getBookingById(idOrCode);
    if (!booking) return undefined;

    booking.paymentStatus = 'PAID';
    booking.amountPaid = booking.totalAmount;
    booking.bookingStatus = 'Confirmed';
    booking.paymentAvailable = false;
    booking.updatedAt = new Date().toISOString();
    this.bookings.set(booking.id, booking);
    return booking;
  }

  deleteBooking(idOrCode: string): boolean {
    const booking = this.getBookingById(idOrCode);
    if (!booking) return false;
    return this.bookings.delete(booking.id);
  }
}

export const bookingStore = new BookingStore();
