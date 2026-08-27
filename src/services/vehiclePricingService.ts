import { TOUR_VEHICLE_OPTIONS, type TourVehicleOption } from '../data/tourVehiclePricing';

const VEHICLE_PRICING_KEY = 'lv_tour_vehicle_pricing';

export const vehiclePricingService = {
  getAllVehicleOptions(): TourVehicleOption[] {
    const data = localStorage.getItem(VEHICLE_PRICING_KEY);
    if (!data) {
      localStorage.setItem(VEHICLE_PRICING_KEY, JSON.stringify(TOUR_VEHICLE_OPTIONS));
      return TOUR_VEHICLE_OPTIONS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return TOUR_VEHICLE_OPTIONS;
    }
  },

  getVehicleById(id: 'car' | 'van'): TourVehicleOption | undefined {
    return this.getAllVehicleOptions().find(v => v.id === id);
  },

  updateVehicleRates(
    id: 'car' | 'van',
    updates: Partial<Pick<TourVehicleOption, 'dailyPriceLKR' | 'dailyPriceUSD' | 'name' | 'capacityPassengers' | 'capacityLuggage' | 'description'>>
  ): TourVehicleOption {
    const list = this.getAllVehicleOptions();
    const idx = list.findIndex(v => v.id === id);
    if (idx === -1) throw new Error(`Vehicle ${id} not found`);

    list[idx] = {
      ...list[idx],
      ...updates
    };

    localStorage.setItem(VEHICLE_PRICING_KEY, JSON.stringify(list));
    return list[idx];
  },

  calculateTourPrice(vehicleId: 'car' | 'van', durationDays: number): { totalLKR: number; totalUSD: number; dailyLKR: number; dailyUSD: number } {
    const veh = this.getVehicleById(vehicleId) || TOUR_VEHICLE_OPTIONS[0];
    const fixedDays = Math.max(1, durationDays);
    return {
      dailyLKR: veh.dailyPriceLKR,
      dailyUSD: veh.dailyPriceUSD,
      totalLKR: veh.dailyPriceLKR * fixedDays,
      totalUSD: veh.dailyPriceUSD * fixedDays
    };
  },

  resetDefaults(): TourVehicleOption[] {
    localStorage.setItem(VEHICLE_PRICING_KEY, JSON.stringify(TOUR_VEHICLE_OPTIONS));
    return TOUR_VEHICLE_OPTIONS;
  }
};
