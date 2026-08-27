const INITIAL_SERVER_BOOKINGS = [
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
    bookings = new Map();
    constructor() {
        for (const b of INITIAL_SERVER_BOOKINGS) {
            this.bookings.set(b.id, { ...b });
        }
    }
    getAllBookings() {
        return Array.from(this.bookings.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    getBookingById(idOrCode) {
        const direct = this.bookings.get(idOrCode);
        if (direct)
            return direct;
        return Array.from(this.bookings.values()).find(b => b.bookingCode === idOrCode);
    }
    getUserBookings(userId) {
        if (!userId)
            return [];
        return this.getAllBookings().filter(b => b.userId === userId);
    }
    createBooking(input) {
        if (!input.flightNumber || !input.flightNumber.trim()) {
            throw new Error('Flight number is required.');
        }
        const randomCode = Math.floor(1000 + Math.random() * 9000);
        const id = input.id || `bk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const bookingCode = input.bookingCode || `LV-2026-${randomCode}`;
        const totalTravelers = (input.adultsCount || 0) + (input.childrenCount || 0) + (input.infantsCount || 0);
        const booking = {
            ...input,
            id,
            bookingCode,
            flightNumber: input.flightNumber.trim(),
            totalTravelers: totalTravelers || 1,
            bookingStatus: 'Pending', // Strictly start as Pending for review
            paymentStatus: 'NOT PAID',
            paymentAvailable: false, // Payment lock active until Admin confirms
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
    confirmBooking(idOrCode) {
        const booking = this.getBookingById(idOrCode);
        if (!booking)
            return undefined;
        booking.bookingStatus = 'Confirmed';
        booking.paymentAvailable = true;
        booking.updatedAt = new Date().toISOString();
        this.bookings.set(booking.id, booking);
        return booking;
    }
    rejectBooking(idOrCode) {
        const booking = this.getBookingById(idOrCode);
        if (!booking)
            return undefined;
        booking.bookingStatus = 'Rejected';
        booking.paymentAvailable = false;
        booking.updatedAt = new Date().toISOString();
        this.bookings.set(booking.id, booking);
        return booking;
    }
    updateBookingStatus(idOrCode, status) {
        const booking = this.getBookingById(idOrCode);
        if (!booking)
            return undefined;
        booking.bookingStatus = status;
        if (status === 'Confirmed') {
            booking.paymentAvailable = true;
        }
        else if (status === 'Rejected' || status === 'Cancelled' || status === 'Pending') {
            booking.paymentAvailable = false;
        }
        booking.updatedAt = new Date().toISOString();
        this.bookings.set(booking.id, booking);
        return booking;
    }
    updatePaymentStatus(idOrCode, paymentStatus, amountPaid) {
        const booking = this.getBookingById(idOrCode);
        if (!booking)
            return undefined;
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
    markAsPaid(idOrCode) {
        const booking = this.getBookingById(idOrCode);
        if (!booking)
            return undefined;
        booking.paymentStatus = 'PAID';
        booking.amountPaid = booking.totalAmount;
        booking.bookingStatus = 'Confirmed';
        booking.paymentAvailable = false;
        booking.updatedAt = new Date().toISOString();
        this.bookings.set(booking.id, booking);
        return booking;
    }
    deleteBooking(idOrCode) {
        const booking = this.getBookingById(idOrCode);
        if (!booking)
            return false;
        return this.bookings.delete(booking.id);
    }
}
export const bookingStore = new BookingStore();
