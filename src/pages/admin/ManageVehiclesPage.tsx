import React, { useState } from 'react';
import { Users, Briefcase, Check, Save, RefreshCw } from 'lucide-react';
import { vehiclePricingService } from '../../services/vehiclePricingService';
import type { TourVehicleOption } from '../../data/tourVehiclePricing';
import { formatPrice } from '../../utils/formatters';

export const ManageVehiclesPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<TourVehicleOption[]>(() => vehiclePricingService.getAllVehicleOptions());
  const [statusMsg, setStatusMsg] = useState('');

  const handleRateChange = (id: 'car' | 'van', field: 'dailyPriceLKR' | 'name' | 'description', val: any) => {
    setVehicles(prev => prev.map(v => {
      if (v.id === id) {
        return { ...v, [field]: val };
      }
      return v;
    }));
  };

  const handleSaveRates = (id: 'car' | 'van') => {
    const target = vehicles.find(v => v.id === id);
    if (!target) return;

    vehiclePricingService.updateVehicleRates(id, {
      dailyPriceLKR: Math.max(0, Number(target.dailyPriceLKR)),
      name: target.name,
      description: target.description
    });

    setStatusMsg(`Successfully updated ${target.categoryTitle} daily rates!`);
    setTimeout(() => setStatusMsg(''), 3500);
  };

  const handleResetDefaults = () => {
    if (confirm('Reset vehicle rates to default (Car LKR 15,000 / Van LKR 20,000)?')) {
      const defs = vehiclePricingService.resetDefaults();
      setVehicles(defs);
      setStatusMsg('Rates reset to system defaults.');
      setTimeout(() => setStatusMsg(''), 3500);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#062C22]">Vehicle Fleet & Tour Pricing</h1>
          <p className="text-xs text-stone-500">
            Manage Car and Van daily charter rates in <strong>Sri Lankan Rupees (LKR)</strong>. Changing these rates immediately recalculates customer tour totals: <br />
            <strong>Total Tour Price = Selected Vehicle Daily Rate × Fixed Tour Duration (Days)</strong>
          </p>
        </div>

        <button
          onClick={handleResetDefaults}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-100 text-stone-700 hover:bg-stone-200 text-xs font-semibold rounded-xl transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 animate-fadeIn">
          {statusMsg}
        </div>
      )}

      {/* Grid of 2 Managed Vehicles: Car & Van */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {vehicles.map((veh) => (
          <div key={veh.id} className="bg-white rounded-3xl border-2 border-stone-200 overflow-hidden shadow-sm flex flex-col justify-between">
            <div>
              {/* Photo & Header */}
              <div className="h-48 overflow-hidden relative bg-stone-900">
                <img src={veh.image} alt={veh.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-[#0B3D2E] text-[#39A982] border border-white/20">
                  {veh.id === 'car' ? '🚗 CAR' : '🚐 VAN'} &bull; {veh.badge}
                </span>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="font-serif font-bold text-lg leading-tight">{veh.categoryTitle} Fleet</h3>
                  <p className="text-xs text-stone-200">{veh.name}</p>
                </div>
              </div>

              {/* Edit Rate Form Area */}
              <div className="p-6 space-y-5 text-xs">
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="font-bold text-[#17231F] block">Daily Rate (LKR)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 font-bold text-xs">LKR</span>
                      <input
                        type="number"
                        step="500"
                        min="1000"
                        value={veh.dailyPriceLKR}
                        onChange={(e) => handleRateChange(veh.id, 'dailyPriceLKR', Number(e.target.value))}
                        className="w-full pl-12 pr-3 py-2.5 bg-[#F8F7F2] border border-stone-300 rounded-xl font-bold text-sm text-[#0B3D2E] focus:ring-2 focus:ring-[#176B52]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#17231F] block">Fleet Model Description</label>
                    <input
                      type="text"
                      value={veh.name}
                      onChange={(e) => handleRateChange(veh.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 bg-[#F8F7F2] border border-stone-300 rounded-xl text-xs text-[#17231F]"
                    />
                  </div>

                  <div className="flex items-center gap-4 text-xs text-stone-600 pt-1">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-[#176B52]" />
                      Max {veh.capacityPassengers} Pax
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4 text-[#176B52]" />
                      {veh.capacityLuggage} Suitcases
                    </span>
                  </div>

                  {/* Included features preview */}
                  <div className="pt-2 space-y-1">
                    {veh.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-stone-600">
                        <Check className="w-3.5 h-3.5 text-[#39A982] shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Example preview for a 5-day tour */}
                <div className="p-3.5 bg-[#DDEFE8]/60 rounded-2xl border border-stone-200 text-[11px] text-[#0B3D2E] space-y-1">
                  <span className="font-bold uppercase tracking-wider text-[10px] block">Live Example Calculation</span>
                  <div className="flex justify-between">
                    <span>5-Day Tour Total:</span>
                    <span className="font-bold">{formatPrice(veh.dailyPriceLKR * 5)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>7-Day Tour Total:</span>
                    <span className="font-bold">{formatPrice(veh.dailyPriceLKR * 7)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>10-Day Tour Total:</span>
                    <span className="font-bold">{formatPrice(veh.dailyPriceLKR * 10)}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Save Button Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-100 flex justify-end">
              <button
                type="button"
                onClick={() => handleSaveRates(veh.id)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#0B3D2E] hover:bg-[#176B52] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
              >
                <Save className="w-4 h-4 text-[#39A982]" />
                <span>Save {veh.categoryTitle} Rates (LKR)</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
