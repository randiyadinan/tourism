export interface TransferPricingRate {
  id: 'car' | 'van';
  title: string;
  name: string;
  ratePerKmUSD: number;
  ratePerKmLKR: number;
  baseBookingFeeUSD: number;
  baseBookingFeeLKR: number;
}

export const DEFAULT_TRANSFER_RATES: TransferPricingRate[] = [
  {
    id: 'car',
    title: 'Car',
    name: 'Private Sedan (Toyota Axio / Allion / Prius)',
    ratePerKmUSD: 0.65,
    ratePerKmLKR: 200,
    baseBookingFeeUSD: 15,
    baseBookingFeeLKR: 4500
  },
  {
    id: 'van',
    title: 'Van',
    name: 'Spacious Van (Toyota KDH High-Roof)',
    ratePerKmUSD: 0.85,
    ratePerKmLKR: 260,
    baseBookingFeeUSD: 20,
    baseBookingFeeLKR: 6000
  }
];

const TRANSFER_PRICING_KEY = 'lv_transfer_pricing';

export const transferPricingService = {
  getAllRates(): TransferPricingRate[] {
    const data = localStorage.getItem(TRANSFER_PRICING_KEY);
    if (!data) {
      localStorage.setItem(TRANSFER_PRICING_KEY, JSON.stringify(DEFAULT_TRANSFER_RATES));
      return DEFAULT_TRANSFER_RATES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_TRANSFER_RATES;
    }
  },

  getRateById(id: 'car' | 'van'): TransferPricingRate {
    return this.getAllRates().find(r => r.id === id) || DEFAULT_TRANSFER_RATES[0];
  },

  updateRates(id: 'car' | 'van', updates: Partial<TransferPricingRate>): TransferPricingRate {
    const list = this.getAllRates();
    const idx = list.findIndex(r => r.id === id);
    if (idx === -1) throw new Error(`Transfer rate ${id} not found`);

    list[idx] = {
      ...list[idx],
      ...updates
    };

    localStorage.setItem(TRANSFER_PRICING_KEY, JSON.stringify(list));
    return list[idx];
  },

  calculateDistancePrice(distanceKm: number, vehicleId: 'car' | 'van', isRoundTrip: boolean = false): { totalUSD: number; totalLKR: number } {
    const rate = this.getRateById(vehicleId);
    const multiplier = isRoundTrip ? 1.85 : 1.0;
    const distanceCostUSD = distanceKm * rate.ratePerKmUSD * multiplier;
    const totalUSD = Math.round(distanceCostUSD + (rate.baseBookingFeeUSD * (isRoundTrip ? 1.5 : 1.0)));
    const totalLKR = totalUSD * 305;

    return {
      totalUSD: Math.max(25, totalUSD),
      totalLKR: Math.max(7500, totalLKR)
    };
  }
};
