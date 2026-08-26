import React from 'react';
import { 
  Plane, 
  MapPin, 
  Hotel, 
  Car, 
   
   
   
  Sparkles,
  
  Phone } from 'lucide-react';

import { bookingService } from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';

export const MyTripsPage: React.FC = () => {
  const { user } = useAuth();
  const bookings = bookingService.getUserBookings(user?.id || 'user-customer-1');
  const currentTrip = bookings[0];

  // Visual Interactive Step Timeline of the Sri Lankan Route
  const timelineStops = [
    {
      step: '01',
      title: 'Airport Arrival & Jasmine Garland Greeting',
      location: 'Bandaranaike Intl Airport (CMB)',
      date: 'Oct 15, 2026 • 14:30',
      status: 'Confirmed',
      icon: Plane,
      details: 'Chauffeur Roshan Silva will meet you at the arrivals exit gate with a personalized tablet sign.',
      hotel: 'Silk Route VIP Service',
      transport: 'Toyota KDH Luxury High-Roof Van (AC, Wi-Fi, Chilled Water)'
    },
    {
      step: '02',
      title: 'Cultural Triangle & Ancient Citadel',
      location: 'Sigiriya & Dambulla',
      date: 'Oct 15 - 17, 2026',
      status: 'Confirmed',
      icon: MapPin,
      details: 'Ascend Sigiriya Lion Rock at sunrise, explore Dambulla Cave Temples, and private Minneriya elephant safari.',
      hotel: 'Aliya Resort & Spa Sigiriya (5-Star Luxury Pool Suite)',
      transport: 'Private Chauffeur-Guide throughout'
    },
    {
      step: '03',
      title: 'Sacred Royal Kingdom & Tooth Relic Ceremony',
      location: 'Kandy & Peradeniya',
      date: 'Oct 17 - 19, 2026',
      status: 'Confirmed',
      icon: MapPin,
      details: 'VIP Theva Puja drumming ritual at Temple of the Tooth and Peradeniya Royal Botanical Gardens walk.',
      hotel: 'Earl’s Regency Hotel Kandy (Deluxe Mountain Balcony)',
      transport: 'Private AC Chauffeur Vehicle'
    },
    {
      step: '04',
      title: 'Highland Tea Estates & Scenic Blue Train',
      location: 'Nuwara Eliya & Ella',
      date: 'Oct 19 - 21, 2026',
      status: 'Confirmed',
      icon: Sparkles,
      details: 'Single-estate Ceylon tea masterclass tasting, scenic 1st class train to Ella, and Nine Arches Bridge sunset.',
      hotel: '98 Acres Resort & Spa Ella (Deluxe Tea Chalet)',
      transport: 'Sri Lanka Railways 1st Class Observation + Private Van'
    },
    {
      step: '05',
      title: 'Wild Leopard & Sloth Bear Safari',
      location: 'Yala National Park Block 1',
      date: 'Oct 21 - 23, 2026',
      status: 'Confirmed',
      icon: MapPin,
      details: 'Dawn 4x4 leopard game drive with veteran wildlife naturalist tracker.',
      hotel: 'Cinnamon Wild Yala (Jungle Chalet)',
      transport: 'Custom 4x4 Safari Cruiser'
    },
    {
      step: '06',
      title: 'UNESCO Dutch Fort & Indian Ocean Sunset',
      location: 'Galle Fort & South Coast',
      date: 'Oct 23 - 24, 2026',
      status: 'Confirmed',
      icon: MapPin,
      details: 'Cobblestone ramparts walking tour, maritime museum, and coastal relaxation.',
      hotel: 'Le Grand Galle by Asia Leisure (Oceanfront Suite)',
      transport: 'Private Luxury AC Vehicle'
    },
    {
      step: '07',
      title: 'Expressway Highway Transfer & Departure',
      location: 'Colombo Airport (CMB)',
      date: 'Oct 24, 2026 • 18:00',
      status: 'Confirmed',
      icon: Plane,
      details: 'Comfortable express highway chauffeur transfer to Colombo airport for return flight.',
      hotel: 'Airport Departure Flight',
      transport: 'Private Luxury Van'
    }
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#176B52]/20 text-[#176B52] text-xs font-bold uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Confirmed Travel Timeline
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#062C22]">
            {currentTrip ? currentTrip.tourTitle : 'Grand Highlights & Heritage (10 Days)'}
          </h1>
          <p className="text-xs text-stone-500">Booking Code: <strong>{currentTrip?.bookingCode || 'LV-2026-8891'}</strong></p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="tel:+94771234567"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0B3D2E] text-white text-xs font-bold rounded-xl hover:bg-[#134E3F] transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#39A982]" />
            <span>Call Chauffeur Guide</span>
          </a>
        </div>
      </div>

      {/* Vertical Interactive Timeline */}
      <div className="space-y-6 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-[#176B52]/30">
        {timelineStops.map((stop, idx) => {
          const Icon = stop.icon;
          return (
            <div key={idx} className="relative pl-16">
              
              {/* Timeline Bullet */}
              <div className="absolute left-0 top-3 w-12 h-12 rounded-2xl bg-[#0B3D2E] text-[#39A982] flex items-center justify-center font-bold text-sm shadow-md border-2 border-[#176B52] z-10">
                <Icon className="w-5 h-5" />
              </div>

              {/* Stop Card */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4 hover:border-[#176B52]/50 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-[#176B52] uppercase tracking-wider">
                      Stop {stop.step} • {stop.location}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#062C22]">{stop.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-500 font-medium">{stop.date}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      {stop.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">{stop.details}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="bg-[#F8F7F2] p-3 rounded-xl border border-stone-200/60 flex items-start gap-2">
                    <Hotel className="w-4 h-4 text-[#176B52] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#062C22] block">Confirmed Stay:</strong>
                      <span className="text-stone-600">{stop.hotel}</span>
                    </div>
                  </div>

                  <div className="bg-[#F8F7F2] p-3 rounded-xl border border-stone-200/60 flex items-start gap-2">
                    <Car className="w-4 h-4 text-[#176B52] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#062C22] block">Transport Arrangement:</strong>
                      <span className="text-stone-600">{stop.transport}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
