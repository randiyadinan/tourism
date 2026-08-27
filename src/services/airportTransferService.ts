import type { AirportTransferBooking } from '../types';
import { bookingService } from './bookingService';
import { authService } from './authService';

const AIRPORT_TRANSFERS_KEY = 'lv_airport_transfers';

export const TRANSFER_RATES: Record<string, number> = {
  'Colombo City (Hotels / Galle Face / Port City)': 35,
  'Negombo Beach Hotels': 25,
  'Kandy / Cultural Hills': 90,
  'Sigiriya / Dambulla / Habarana': 110,
  'Bentota / Beruwala / Ahungalla': 70,
  'Hikkaduwa Beach Area': 85,
  'Galle Fort / Unawatuna': 95,
  'Mirissa / Weligama / Matara': 115,
  'Tangalle / Hiriketiya': 135,
  'Yala National Park / Tissamaharama': 165,
  'Nuwara Eliya / Tea Country': 120,
  'Ella Highland Valley': 140,
  'Trincomalee / Nilaveli': 175,
  'Arugam Bay Surf Coast': 190
};

const INITIAL_TRANSFERS: AirportTransferBooking[] = [
  {
    id: 'atb-1',
    bookingCode: 'TRF-CMB-8801',
    airport: 'Bandaranaike International Airport (CMB - Colombo)',
    tripType: 'One Way: Airport to Hotel',
    destinationArea: 'Colombo City (Hotels / Galle Face / Port City)',
    hotelAddress: 'The Galle Face Hotel, 2 Galle Road, Colombo 03',
    flightDate: '2026-10-15',
    flightTime: '14:30',
    flightNumber: 'UL 504',
    passengers: 2,
    luggageCount: 2,
    vehicleId: 'veh-sedan-luxury',
    vehicleName: 'Toyota Allion / Axio Executive Sedan',
    basePriceUSD: 35,
    totalPriceUSD: 35,
    contactName: 'Sarah Jenkins',
    contactEmail: 'sarah.traveler@example.com',
    contactPhone: '+44 7700 900077',
    status: 'Confirmed',
    paymentStatus: 'Fully Paid',
    createdAt: '2026-08-10T11:20:00Z'
  }
];

export const airportTransferService = {
  getTransfers(): AirportTransferBooking[] {
    const data = localStorage.getItem(AIRPORT_TRANSFERS_KEY);
    if (!data) {
      localStorage.setItem(AIRPORT_TRANSFERS_KEY, JSON.stringify(INITIAL_TRANSFERS));
      return INITIAL_TRANSFERS;
    }
    return JSON.parse(data);
  },

  calculateQuote(destinationArea: string, vehicleTypeDailyRate: number, isRoundTrip: boolean): number {
    const baseDestinationRate = TRANSFER_RATES[destinationArea] || 60;
    // Premium vehicle multiplier
    const vehicleMultiplier = vehicleTypeDailyRate > 100 ? 1.4 : vehicleTypeDailyRate > 70 ? 1.2 : 1.0;
    const singleTrip = Math.round(baseDestinationRate * vehicleMultiplier);
    return isRoundTrip ? Math.round(singleTrip * 1.85) : singleTrip; // 15% roundtrip discount
  },

  bookTransfer(data: Omit<AirportTransferBooking, 'id' | 'bookingCode' | 'status' | 'createdAt'>): AirportTransferBooking {
    const transfers = this.getTransfers();
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newTransfer: AirportTransferBooking = {
      ...data,
      id: `atb-${Date.now()}`,
      bookingCode: `TRF-CMB-${randomCode}`,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    transfers.unshift(newTransfer);
    localStorage.setItem(AIRPORT_TRANSFERS_KEY, JSON.stringify(transfers));

    // Also register in central bookingService for customer portal & admin management
    const currentUser = authService.getCurrentUser();
    bookingService.createBooking({
      userId: currentUser?.id || 'guest-user',
      customerName: data.contactName,
      customerEmail: data.contactEmail,
      customerPhone: data.contactPhone,
      type: 'airport_transfer',
      tourTitle: `VIP Airport Transfer: ${data.destinationArea}`,
      tourImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      startDate: data.flightDate,
      endDate: data.flightDate,
      adultsCount: data.passengers,
      childrenCount: 0,
      infantsCount: 0,
      airportPickup: true,
      airportTransferOption: data.tripType === 'Round Trip' ? 'both' : data.tripType.includes('Hotel to Airport') ? 'dropoff' : 'pickup',
      airportTransferDetails: {
        airport: data.airport,
        flightNumber: data.flightNumber,
        arrivalTime: data.flightTime,
        pickupLocation: data.airport,
        dropoffLocation: data.hotelAddress,
        passengers: data.passengers,
        vehicleId: data.vehicleId,
        priceUSD: data.totalPriceUSD
      },
      flightNumber: data.flightNumber,
      flightArrivalTime: data.flightTime,
      vehicleType: data.vehicleName,
      travelers: [
        {
          title: 'Mr',
          fullName: data.contactName,
          email: data.contactEmail,
          phone: data.contactPhone,
          nationality: 'International',
          isLead: true,
          specialRequirements: data.specialRequests
        }
      ],
      basePrice: data.basePriceUSD,
      customizationTotal: 0,
      discountAmount: 0,
      taxAmount: 0,
      totalAmount: data.totalPriceUSD,
      amountPaid: data.totalPriceUSD,
      bookingStatus: 'Pending',
      paymentStatus: data.paymentStatus,
      paymentMethod: 'Credit / Debit Card',
      notes: data.specialRequests
    });

    return newTransfer;
  }
};
