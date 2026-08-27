import React from 'react';
import { 
  RefreshCcw, 
  ShieldCheck, 
  Calendar, 
  CreditCard, 
  AlertCircle, 
  Clock, 
  Plane, 
  Phone, 
  Mail, 
  MapPin, 
  FileText 
} from 'lucide-react';

export const CancellationRefundPolicyPage: React.FC = () => {
  return (
    <div className="bg-[#F8F7F2] min-h-screen py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0B3D2E]/10 text-[#0B3D2E] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-[#176B52]" />
            Official Booking Guarantee
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#062C22]">
            Cancellation & Refund Policy
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Transparent cancellation terms, refund processing schedules, and itinerary modification guidelines for all LankaVoyage bookings.
          </p>
          <div className="pt-2 text-xs font-medium text-stone-500">
            Last Updated: <span className="font-bold text-[#062C22]">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Commitment Banner */}
        <div className="p-5 sm:p-6 bg-emerald-50/80 border-2 border-emerald-200 rounded-3xl flex items-start gap-4 text-xs text-emerald-900 shadow-xs">
          <RefreshCcw className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-[#062C22]">Fair Travel Commitment</h4>
            <p className="leading-relaxed">
              We understand that international travel plans can change. LankaVoyage maintains a transparent cancellation policy designed to provide maximum flexibility while honoring advance commitments made to our boutique hotel partners, wildlife concessionaires, and transport providers.
            </p>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-sm space-y-10 text-stone-700 leading-relaxed text-sm">

          {/* 1. Cancellation by Customer */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5 text-[#062C22]">
              <Calendar className="w-5 h-5 text-[#176B52]" />
              <h2 className="font-serif text-xl font-bold">1. Cancellation by the Customer</h2>
            </div>
            <p>
              To cancel a confirmed reservation, the Lead Guest must submit a formal written notice via email to our concierge team at <a href="mailto:concierge@lankavoyage.com" className="text-[#0B3D2E] font-bold underline">concierge@lankavoyage.com</a> stating the booking reference code (e.g. <code className="font-mono bg-stone-100 px-1.5 py-0.5 rounded text-[#062C22]">LV-2026-XXXX</code>). The cancellation notice becomes effective on the date and time received by our operations team.
            </p>
            <p className="font-semibold text-[#062C22] text-xs uppercase tracking-wider">Standard Tour Cancellation Schedule:</p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-stone-200 rounded-xl overflow-hidden">
                <thead className="bg-[#F8F7F2] text-[#062C22] font-bold border-b border-stone-200">
                  <tr>
                    <th className="p-3.5">Notice Period Prior to Tour Departure</th>
                    <th className="p-3.5">Cancellation Fee / Refund Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-600">
                  <tr>
                    <td className="p-3.5 font-medium">30 days or more prior to arrival</td>
                    <td className="p-3.5 text-emerald-700 font-bold">100% Full Refund (Zero cancellation fee)</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-medium">15 to 29 days prior to arrival</td>
                    <td className="p-3.5 text-amber-700 font-bold">70% Refund (30% deposit retained for advance partner holds)</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-medium">7 to 14 days prior to arrival</td>
                    <td className="p-3.5 text-amber-800 font-bold">50% Refund</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-medium">Less than 7 days / No-Show</td>
                    <td className="p-3.5 text-rose-700 font-bold">Non-refundable (100% cancellation fee)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 2. Cancellation by LankaVoyage */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#062C22]">
              <AlertCircle className="w-5 h-5 text-[#176B52]" />
              <h2 className="font-serif text-xl font-bold">2. Cancellation by LankaVoyage</h2>
            </div>
            <p>
              In the rare event that LankaVoyage is compelled to cancel an itinerary prior to departure due to unforeseen operational constraints, we will promptly offer you the option of:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-stone-600">
              <li>A 100% full refund of all monies paid to LankaVoyage for the affected tour.</li>
              <li>An alternative bespoke itinerary of equivalent or superior standard at no additional cost.</li>
              <li>A flexible travel credit voucher valid for 24 months from the original date of travel.</li>
            </ul>
          </section>

          {/* 3. Refund Processing */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#062C22]">
              <CreditCard className="w-5 h-5 text-[#176B52]" />
              <h2 className="font-serif text-xl font-bold">3. Refund Processing Schedule</h2>
            </div>
            <p>
              All approved refunds are credited directly to the original payment method / card utilized during checkout.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-stone-600">
              <li>Refund requests are reviewed and authorized by our finance department within 3 business days of formal notice.</li>
              <li>Card settlements and bank reversals typically reflect on your bank statement within 7 to 10 business days, subject to inter-bank clearing cycles.</li>
              <li>LankaVoyage does not deduct hidden administration fees from eligible refund settlements.</li>
            </ul>
          </section>

          {/* 4. Non-Refundable & Third-Party Supplier Costs */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#062C22]">
              <FileText className="w-5 h-5 text-[#176B52]" />
              <h2 className="font-serif text-xl font-bold">4. Non-Refundable & Third-Party Services</h2>
            </div>
            <p>
              Certain bespoke elements are subject to strict third-party supplier non-refundability policies once issued:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-stone-600">
              <li>Sri Lanka Railways reserved 1st class train observation tickets (non-refundable by government railway policy).</li>
              <li>Department of Wildlife Conservation safari permits once date-stamped and allocated.</li>
              <li>Special peak-season hotel supplements (e.g. Christmas/New Year gala dinner tariffs) if mandated non-refundable by the respective resort.</li>
            </ul>
          </section>

          {/* 5. Date Changes & Itinerary Modifications */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#062C22]">
              <Clock className="w-5 h-5 text-[#176B52]" />
              <h2 className="font-serif text-xl font-bold">5. Date Changes & Rescheduling</h2>
            </div>
            <p>
              We provide maximum flexibility for date adjustments. If you need to postpone your journey:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-stone-600">
              <li>Date amendments requested 15 days or more prior to arrival are processed with zero LankaVoyage penalty fees, subject to seasonal hotel rate differences.</li>
              <li>Amendments requested less than 7 days prior to travel may be subject to individual boutique hotel room hold surcharges.</li>
            </ul>
          </section>

          {/* 6. Airport Transfers Cancellation */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#062C22]">
              <Plane className="w-5 h-5 text-[#176B52]" />
              <h2 className="font-serif text-xl font-bold">6. Airport Transfers Cancellation Policy</h2>
            </div>
            <p>
              For standalone private airport transfers (CMB / HRI / JAF terminals):
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-stone-600">
              <li>Cancellations notified at least 24 hours prior to scheduled flight arrival time receive a 100% full refund.</li>
              <li>Flight delays are monitored live by our chauffeur fleet dispatch; delayed flights do not incur cancellation penalties or extra waiting fees.</li>
            </ul>
          </section>

          {/* 7. Force Majeure */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#062C22]">
              <ShieldCheck className="w-5 h-5 text-[#176B52]" />
              <h2 className="font-serif text-xl font-bold">7. Force Majeure</h2>
            </div>
            <p>
              In events of Force Majeure (including natural disasters, severe monsoons, border closures, government travel advisories, civil disturbances, or international flight groundings), standard cancellation penalties are waived. Clients are issued a 100% flexible travel voucher valid for 24 months or given a prompt settlement as outlined under our master Terms & Conditions.
            </p>
          </section>

          {/* 8. Contact Concierge Support */}
          <section className="space-y-4 pt-4 border-t border-stone-100">
            <div className="flex items-center gap-2.5 text-[#062C22]">
              <Phone className="w-5 h-5 text-[#176B52]" />
              <h2 className="font-serif text-xl font-bold">8. Cancellation & Refund Assistance</h2>
            </div>
            <p className="text-xs text-stone-600">
              For any refund inquiries, cancellation notices, or itinerary rescheduling assistance, please contact our 24/7 Concierge Desk:
            </p>
            <div className="bg-[#F8F7F2] p-5 rounded-2xl border border-stone-200 space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#176B52] shrink-0 mt-0.5" />
                <span>[Registered Corporate Office Address, Colombo, Sri Lanka]</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#176B52] shrink-0" />
                <span className="text-[#0B3D2E] font-bold">[Official Contact Phone / +94 XX XXX XXXX]</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#176B52] shrink-0" />
                <span className="text-[#0B3D2E] font-bold">[Official Contact Email / concierge@lankavoyage.com]</span>
              </div>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
};
