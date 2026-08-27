import React, { useState } from 'react';
import { Minus, Plus, Ticket } from 'lucide-react';
import type { DestinationTicketRecord } from '../../services/destinationTicketService';
import { destinationTicketService } from '../../services/destinationTicketService';
import { formatPrice } from '../../utils/formatters';

interface DestinationTicketCardProps {
  destination: DestinationTicketRecord;
}

export const DestinationTicketCard: React.FC<DestinationTicketCardProps> = ({ destination }) => {
  const [adults, setAdults] = useState<number>(0);
  const [children, setChildren] = useState<number>(0);

  const total = destinationTicketService.calculateTicketsTotal(
    destination.adultTicketPrice,
    adults,
    destination.childTicketPrice,
    children
  );

  return (
    <div className="glass-card-interactive liquid-glass-white rounded-3xl overflow-hidden border border-white/80 shadow-[0_10px_30px_-10px_rgba(6,44,34,0.08)] flex flex-col justify-between group">
      
      {/* 1. Destination Photo & Title Header */}
      <div>
        <div className="relative h-48 overflow-hidden bg-stone-900">
          <img
            src={destination.image}
            alt={destination.name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
          
          <div className="absolute top-3 left-3">
            <span className="text-[10px] font-bold bg-[#0B3D2E]/80 text-[#DDEFE8] backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-xs">
              {destination.region}
            </span>
          </div>

          <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
            <h3 className="font-serif text-xl font-bold tracking-wide uppercase text-white leading-tight">
              {destination.name}
            </h3>
            <p className="text-xs text-stone-200 line-clamp-1">{destination.subtitle}</p>
          </div>
        </div>

        {/* 2. Standalone Ticket Quantity & Pricing Controls */}
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#176B52] uppercase tracking-wider">
            <Ticket className="w-4 h-4 text-[#39A982]" />
            <span>Admission Ticket Rates</span>
          </div>

          {/* Adult Ticket Row */}
          <div className="p-3 bg-white/70 backdrop-blur-md rounded-2xl border border-stone-200/70 shadow-2xs flex items-center justify-between transition-all hover:border-[#39A982]/40">
            <div>
              <span className="font-bold text-xs text-[#17231F] block">Adult</span>
              <span className="font-serif text-sm font-bold text-[#0B3D2E]">{formatPrice(destination.adultTicketPrice)}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setAdults(Math.max(0, adults - 1))}
                className="w-8 h-8 rounded-xl bg-white border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-[#DDEFE8] hover:text-[#0B3D2E] active:scale-95 font-bold transition-all shadow-xs"
                aria-label={`Decrease adult tickets for ${destination.name}`}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-sm w-4 text-center text-[#17231F]">
                {adults}
              </span>
              <button
                type="button"
                onClick={() => setAdults(adults + 1)}
                className="w-8 h-8 rounded-xl bg-white border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-[#DDEFE8] hover:text-[#0B3D2E] active:scale-95 font-bold transition-all shadow-xs"
                aria-label={`Increase adult tickets for ${destination.name}`}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Child Ticket Row */}
          <div className="p-3 bg-white/70 backdrop-blur-md rounded-2xl border border-stone-200/70 shadow-2xs flex items-center justify-between transition-all hover:border-[#39A982]/40">
            <div>
              <span className="font-bold text-xs text-[#17231F] block">Child</span>
              <span className="font-serif text-sm font-bold text-[#0B3D2E]">{formatPrice(destination.childTicketPrice)}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setChildren(Math.max(0, children - 1))}
                className="w-8 h-8 rounded-xl bg-white border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-[#DDEFE8] hover:text-[#0B3D2E] active:scale-95 font-bold transition-all shadow-xs"
                aria-label={`Decrease child tickets for ${destination.name}`}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-sm w-4 text-center text-[#17231F]">
                {children}
              </span>
              <button
                type="button"
                onClick={() => setChildren(children + 1)}
                className="w-8 h-8 rounded-xl bg-white border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-[#DDEFE8] hover:text-[#0B3D2E] active:scale-95 font-bold transition-all shadow-xs"
                aria-label={`Increase child tickets for ${destination.name}`}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Live Total Display Banner (Instant Calculation & Standalone UI) */}
      <div className="bg-[#DDEFE8]/80 backdrop-blur-md border-t border-stone-200 px-5 py-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#176B52] block tracking-wider">
            TOTAL TICKETS
          </span>
          <span className="text-[11px] text-[#68736E]">
            {adults} Adult{adults === 1 ? '' : 's'} &bull; {children} Child{children === 1 ? '' : 'ren'}
          </span>
        </div>
        <div className="text-right">
          <span className="font-serif text-xl font-bold text-[#0B3D2E]">
            {formatPrice(total)}
          </span>
          <span className="text-[10px] text-[#68736E] block font-medium">Estimated Total</span>
        </div>
      </div>
    </div>
  );
};
