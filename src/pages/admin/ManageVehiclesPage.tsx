import React, { useState } from 'react';
import {    Users, Briefcase,  Check } from 'lucide-react';
import { INITIAL_VEHICLES } from '../../data/vehicles';
import type { Vehicle } from '../../types';

export const ManageVehiclesPage: React.FC = () => {
  const [vehicles, ] = useState<Vehicle[]>(INITIAL_VEHICLES);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#082F24]">Fleet & Transport Logistics</h1>
        <p className="text-xs text-stone-500">Manage private air-conditioned vehicles, capacity, and daily charter pricing.</p>
      </div>

      {/* Grid of Vehicles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((veh) => (
          <div key={veh.id} className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="h-44 overflow-hidden relative">
              <img src={veh.image} alt={veh.name} className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#0D3B2E] text-[#E5C378]">
                {veh.type}
              </span>
            </div>

            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-base text-[#082F24]">{veh.name}</h3>
                
                <div className="flex items-center gap-4 text-xs text-stone-500">
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-[#C5A059]" /> {veh.capacityPassengers} Pax</span>
                  <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-[#C5A059]" /> {veh.capacityLuggage} Bags</span>
                  <span className="text-emerald-700 font-semibold">{veh.isAirConditioned ? 'Dual AC' : 'Open 4x4'}</span>
                </div>

                <div className="pt-2 space-y-1">
                  {veh.features.slice(0, 3).map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-stone-600">
                      <Check className="w-3 h-3 text-[#0D3B2E] shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 block uppercase font-bold">Charter Rate</span>
                  <span className="font-serif text-lg font-bold text-[#082F24]">${veh.dailyRateUSD} / day</span>
                </div>
                <span className="px-3 py-1 bg-[#FAF8F5] text-[#0D3B2E] border border-stone-200 rounded-xl text-xs font-bold">
                  CMB: ${veh.transferRateCMBtoColombo}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
