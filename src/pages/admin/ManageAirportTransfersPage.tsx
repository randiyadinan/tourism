import React, { useState } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import { transferPricingService, type TransferPricingRate } from '../../services/transferPricingService';
import { formatPrice } from '../../utils/formatters';

export const ManageAirportTransfersPage: React.FC = () => {
  const [rates, setRates] = useState<TransferPricingRate[]>(() => transferPricingService.getAllRates());
  const [statusMsg, setStatusMsg] = useState('');

  const handlePriceChange = (id: 'car' | 'van', field: keyof TransferPricingRate, val: any) => {
    setRates(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, [field]: val };
      }
      return r;
    }));
  };

  const handleSave = (id: 'car' | 'van') => {
    const target = rates.find(r => r.id === id);
    if (!target) return;

    transferPricingService.updateRates(id, {
      ratePerKmLKR: Math.max(0, Number(target.ratePerKmLKR)),
      baseBookingFeeLKR: Math.max(0, Number(target.baseBookingFeeLKR))
    });

    setStatusMsg(`Updated Airport Transfer rates for ${target.title}!`);
    setTimeout(() => setStatusMsg(''), 3500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#062C22]">Airport Transfer Rates</h1>
        <p className="text-xs text-stone-500 mt-1">
          Manage distance rates in <strong>Sri Lankan Rupees (LKR)</strong> for <strong>Bandaranaike International Airport (CMB)</strong> transfers. <br />
          Customers select their destination on Google Maps, and the total is calculated via live road distance.
        </p>
      </div>

      {statusMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Grid of Car & Van Transfer Rates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rates.map((rate) => (
          <div key={rate.id} className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#0B3D2E] text-[#39A982] flex items-center justify-center font-bold">
                  {rate.id === 'car' ? '🚗' : '🚐'}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#062C22]">{rate.title} Transfer</h3>
                  <p className="text-[11px] text-stone-400">{rate.name}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-[#DDEFE8] text-[#176B52] px-2.5 py-0.5 rounded-full">
                CMB Origin
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Rate per Kilometer (LKR)</label>
                  <input
                    type="number"
                    step="10"
                    min="10"
                    value={rate.ratePerKmLKR}
                    onChange={(e) => handlePriceChange(rate.id, 'ratePerKmLKR', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F8F7F2] border border-stone-300 rounded-xl font-bold text-[#0B3D2E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Base Airport Meet Fee (LKR)</label>
                  <input
                    type="number"
                    step="500"
                    min="0"
                    value={rate.baseBookingFeeLKR}
                    onChange={(e) => handlePriceChange(rate.id, 'baseBookingFeeLKR', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F8F7F2] border border-stone-300 rounded-xl font-bold text-[#0B3D2E]"
                  />
                </div>
              </div>

              {/* Sample Calculation Preview */}
              <div className="p-3 bg-[#F8F7F2] rounded-2xl border border-stone-200/80 text-[11px] space-y-1 text-stone-700">
                <span className="font-bold text-[#176B52] block text-[10px] uppercase tracking-wider">Example Highway Calculations</span>
                <div className="flex justify-between">
                  <span>CMB to Colombo (35 km):</span>
                  <strong className="text-[#062C22]">
                    {formatPrice(rate.baseBookingFeeLKR + (35 * rate.ratePerKmLKR))}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>CMB to Kandy (115 km):</span>
                  <strong className="text-[#062C22]">
                    {formatPrice(rate.baseBookingFeeLKR + (115 * rate.ratePerKmLKR))}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>CMB to Galle Fort (155 km):</span>
                  <strong className="text-[#062C22]">
                    {formatPrice(rate.baseBookingFeeLKR + (155 * rate.ratePerKmLKR))}
                  </strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSave(rate.id)}
                className="w-full py-2.5 bg-[#0B3D2E] hover:bg-[#134E3F] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save {rate.title} Rates (LKR)</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
