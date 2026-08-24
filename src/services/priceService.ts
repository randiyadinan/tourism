import type { CustomTripState } from '../types';

const VEHICLE_PRICES: Record<string, number> = {
  'Private Car': 65,
  'Private Van': 95,
  'Luxury SUV': 140,
  'Shared Transport': 35,
};

/**
 * Centralised calculation of the total cost for a custom trip.
 * Only includes currently supported options: Base Tour, Vehicle / Transportation, and Airport Transfers.
 * Hotels, Meals, and Activity prices are NOT added to the customer total.
 */
export function calculateBookingTotal(customization: CustomTripState) {
  // Calculate number of nights/days from arrival and departure dates
  const arrival = new Date(customization.arrivalDate || '2026-11-01');
  const departure = new Date(customization.departureDate || '2026-11-08');
  const diffMs = Math.max(0, departure.getTime() - arrival.getTime());
  const days = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

  const totalAdults = customization.adults || 2;
  const totalChildren = customization.children || 0;

  // Base day charge for route planning, private guiding, highway fees
  const baseTourPerDay = 55;
  const baseTourTotal = Math.round(baseTourPerDay * days * totalAdults + (baseTourPerDay * 0.6 * days * totalChildren));

  let total = baseTourTotal;
  const breakdown: Record<string, number> = {
    [`Base Chauffeur-Guide & Route (${days} Days)`]: baseTourTotal
  };

  // Vehicle cost (daily rate * days)
  if (customization.transportType) {
    const dailyRate = VEHICLE_PRICES[customization.transportType] ?? 95;
    const vehCost = dailyRate * days;
    total += vehCost;
    breakdown[`Transportation (${customization.transportType})`] = vehCost;
  }

  // Airport transfer: dynamic pricing based on transfer option
  if (customization.airportTransferOption === 'both') {
    const transferCost = 75;
    total += transferCost;
    breakdown['Airport Transfers (Roundtrip VIP)'] = transferCost;
  } else if (customization.airportTransferOption === 'dropoff') {
    const transferCost = 40;
    total += transferCost;
    breakdown['Airport Transfer (Dropoff)'] = transferCost;
  } else if (customization.airportTransferOption === 'pickup' || customization.airportPickup) {
    const transferCost = 40;
    total += transferCost;
    breakdown['Airport Transfer (Pickup)'] = transferCost;
  }

  // 5% Package Discount
  const discount = Math.round(total * 0.05);
  const finalTotal = total - discount;

  return { total: finalTotal, subtotal: total, discount, breakdown };
}

