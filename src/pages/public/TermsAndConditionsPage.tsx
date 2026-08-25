import React from 'react';
import { 
  FileText, 
  ShieldCheck, 
  CreditCard, 
  Calendar, 
  AlertCircle, 
  HelpCircle, 
  Lock, 
  Clock, 
  Plane, 
  Users, 
  Sparkles, 
  Phone, 
  Mail, 
  MapPin 
} from 'lucide-react';

export const TermsAndConditionsPage: React.FC = () => {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0D3B2E]/10 text-[#0D3B2E] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
            Official Booking Agreement
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#082F24]">
            Terms & Conditions
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Please read these terms carefully before booking a tour with LankaVoyage.
          </p>
          <div className="pt-2 text-xs font-medium text-stone-500">
            Last Updated: <span className="font-bold text-[#082F24]">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Binding Agreement Alert Banner */}
        <div className="p-5 sm:p-6 bg-amber-50/80 border-2 border-amber-200 rounded-3xl flex items-start gap-4 text-xs text-amber-900 shadow-xs">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-[#082F24]">Binding Travel Agreement</h4>
            <p className="leading-relaxed">
              By confirming a reservation, submitting a booking request, or making any payment (full or deposit) for private tours, group excursions, bespoke itineraries, or airport transfers with LankaVoyage, you acknowledge that you have read, understood, and agreed to be bound by these Terms & Conditions.
            </p>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-sm space-y-10 text-stone-700 leading-relaxed text-sm">

          {/* 1. Introduction */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#082F24]">
              <FileText className="w-5 h-5 text-[#C5A059]" />
              <h2 className="font-serif text-xl font-bold">1. Introduction</h2>
            </div>
            <p>
              Welcome to LankaVoyage (SLTDA Registered Tour Operator No: TS/2026/884). We specialize in curating bespoke holidays, private chauffeur-guided tours, group excursions, and airport transfers across Sri Lanka. These Terms & Conditions govern the contractual relationship between LankaVoyage ("we", "us", "our") and the traveler ("client", "customer", "you", "lead guest").
            </p>
          </section>

          {/* 2. Booking & Reservations */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#082F24]">
              <Calendar className="w-5 h-5 text-[#C5A059]" />
              <h2 className="font-serif text-xl font-bold">2. Booking & Reservations</h2>
            </div>
            <p>
              A booking is officially confirmed once an initial deposit or full payment has been successfully processed through our secure gateway and a formal digital Booking Confirmation Voucher with a unique reference code (e.g., <code className="font-mono bg-stone-100 px-1.5 py-0.5 rounded text-[#082F24]">LV-2026-XXXX</code>) is issued.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-stone-600">
              <li>The person making the booking ("Lead Guest") warrants that they possess the legal authority to accept these terms on behalf of all traveling party members.</li>
              <li>Bespoke and custom tour itineraries require mutual written confirmation of hotel tier, transport specs, and travel dates before issuance.</li>
              <li>Airport transfer reservations must include accurate landing/departure flight numbers to ensure chauffeur meet-and-greet monitoring.</li>
            </ul>
          </section>

          {/* 3. Payments */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#082F24]">
              <CreditCard className="w-5 h-5 text-[#C5A059]" />
              <h2 className="font-serif text-xl font-bold">3. Payments</h2>
            </div>
            <p>
              Payments are processed securely via authorized international payment gateways (including PayHere). All credit/debit card transactions adhere to bank-grade PCI-DSS compliance and 3D-Secure 2.0 verification protocols.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-stone-600">
              <li>For standard package bookings, a minimum 30% deposit is required upon reservation, with the balance due 14 days prior to arrival in Sri Lanka.</li>
              <li>Day tours and standalone airport transfers require 100% prepayment at the time of online confirmation.</li>
              <li>Payments may be completed in United States Dollars (USD) or equivalent converted currencies as displayed during checkout.</li>
            </ul>
          </section>

          {/* 4. Tour Prices */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#082F24]">
              <Sparkles className="w-5 h-5 text-[#C5A059]" />
              <h2 className="font-serif text-xl font-bold">4. Tour Prices</h2>
            </div>
            <p>
              Quoted tour prices include private air-conditioned vehicle transport, professional English-speaking chauffeur-guide services, fuel, expressway highway tolls, driver accommodation/meals, and all government taxes (VAT/SSCL).
            </p>
            <p className="text-xs text-stone-600">
              Unless explicitly specified in your itinerary inclusions, quoted prices exclude international airfare, Sri Lanka entry visa fees (ETA), optional activity entrance tickets not pre-booked, travel insurance, personal laundry/telephone expenses, and discretionary gratuities.
            </p>
          </section>

          {/* 5. Customer Responsibilities */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#082F24]">
              <Users className="w-5 h-5 text-[#C5A059]" />
              <h2 className="font-serif text-xl font-bold">5. Customer Responsibilities</h2>
            </div>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-stone-600">
              <li>Travelers are responsible for providing correct personal details, passport numbers, and flight schedules at checkout.</li>
              <li>Guests must respect Sri Lankan cultural norms, sacred dress codes when visiting temples (covering shoulders and knees, removing shoes and headwear), and national park wildlife safety regulations.</li>
              <li>Travelers must arrive at designated departure points on time. Delays caused by late guest arrivals that result in missed train connections or excursions are non-refundable.</li>
            </ul>
          </section>

          {/* 6. Tour Changes */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#082F24]">
              <Clock className="w-5 h-5 text-[#C5A059]" />
              <h2 className="font-serif text-xl font-bold">6. Tour Changes</h2>
            </div>
            <p>
              <strong>Changes by the Customer:</strong> We accommodate date and route adjustments whenever feasible. Changes requested less than 7 days prior to travel may incur hotel amendment surcharges.
            </p>
            <p className="text-xs text-stone-600">
              <strong>Changes by LankaVoyage:</strong> In the rare event of unforeseen road closures, severe weather conditions, or railway maintenance, we reserve the right to alter route sequences or substitute equal or higher-standard boutique accommodations with prior notification to the guest.
            </p>
          </section>

          {/* 7. Cancellation Policy */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#082F24]">
              <Calendar className="w-5 h-5 text-[#C5A059]" />
              <h2 className="font-serif text-xl font-bold">7. Cancellation Policy</h2>
            </div>
            <p>Cancellation requests must be submitted in writing via email to our concierge team.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-stone-200 rounded-xl overflow-hidden">
                <thead className="bg-[#FAF8F5] text-[#082F24] font-bold border-b border-stone-200">
                  <tr>
                    <th className="p-3">Notice Period Prior to Tour Start</th>
                    <th className="p-3">Cancellation Fee / Refund</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-600">
                  <tr>
                    <td className="p-3 font-medium">30 days or more</td>
                    <td className="p-3 text-emerald-700 font-bold">100% Full Refund (Zero penalty fee)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">15 to 29 days</td>
                    <td className="p-3 text-amber-700 font-bold">70% Refund (30% deposit retained for hotel holds)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">7 to 14 days</td>
                    <td className="p-3 text-amber-800 font-bold">50% Refund</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Less than 7 days / No-Show</td>
                    <td className="p-3 text-rose-700 font-bold">Non-refundable (100% cancellation charge)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 8. Refunds */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#082F24]">
              <CreditCard className="w-5 h-5 text-[#C5A059]" />
              <h2 className="font-serif text-xl font-bold">8. Refunds</h2>
            </div>
            <p>
              Approved refunds are credited directly to the original payment method / card utilized during booking within 7 to 10 business days, subject to inter-bank clearing processing schedules.
            </p>
          </section>

          {/* 9. Travel Documents */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#082F24]">
              <Plane className="w-5 h-5 text-[#C5A059]" />
              <h2 className="font-serif text-xl font-bold">9. Travel Documents</h2>
            </div>
            <p>
              Travelers must hold a valid passport with at least 6 months of validity beyond their intended stay in Sri Lanka and obtain the mandatory Electronic Travel Authorization (ETA / e-Visa) prior to departure. LankaVoyage is not liable for entry refusals resulting from invalid travel documentation.
            </p>
          </section>

          {/* 10. Health & Safety */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#082F24]">
              <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
              <h2 className="font-serif text-xl font-bold">10. Health & Safety</h2>
            </div>
            <p>
              Comprehensive international travel and medical insurance covering emergency evacuation, luggage loss, and trip interruption is strongly advised for all international guests. Travelers should inform us in advance of any severe allergies, mobility constraints, or special dietary requirements.
            </p>
          </section>

          {/* 11. Liability */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#082F24]">
              <Lock className="w-5 h-5 text-[#C5A059]" />
              <h2 className="font-serif text-xl font-bold">11. Limitation of Liability</h2>
            </div>
            <p>
              While LankaVoyage engages exclusively licensed, fully insured tourist vehicles and SLTDA-certified chauffeur guides, we act solely as an agent in contracting third-party service providers (such as hoteliers, airlines, safari jeep concessionaires, and boat operators). We shall not be held liable for personal injury, property damage, loss, or delay arising from actions beyond our direct operational control.
            </p>
          </section>

          {/* 12. Force Majeure */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#082F24]">
              <AlertCircle className="w-5 h-5 text-[#C5A059]" />
              <h2 className="font-serif text-xl font-bold">12. Force Majeure</h2>
            </div>
            <p>
              LankaVoyage shall not be liable or deemed in default for failure or delay in executing its contractual obligations caused by events of Force Majeure, including natural disasters, extreme monsoons, acts of war, civil disturbances, government travel bans, airline schedule cancellations, or pandemics. In such circumstances, we provide flexible rescheduling vouchers valid for up to 24 months.
            </p>
          </section>

          {/* 13. Privacy */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#082F24]">
              <Lock className="w-5 h-5 text-[#C5A059]" />
              <h2 className="font-serif text-xl font-bold">13. Privacy & Data Protection</h2>
            </div>
            <p>
              We treat your personal information with strict confidentiality. Customer data collected during the reservation process (names, passport numbers, dietary requests, contact details) is utilized solely for tour coordination and hotel room reservations. We do not sell or distribute personal data to third-party marketing entities.
            </p>
          </section>

          {/* 14. Changes to These Terms */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#082F24]">
              <HelpCircle className="w-5 h-5 text-[#C5A059]" />
              <h2 className="font-serif text-xl font-bold">14. Changes to These Terms</h2>
            </div>
            <p>
              We reserve the right to revise these Terms & Conditions periodically to align with evolving statutory regulations and operational policies. The updated terms will be posted on this page with an amended "Last Updated" timestamp.
            </p>
          </section>

          {/* 15. Contact Us */}
          <section className="space-y-4 pt-4 border-t border-stone-100">
            <div className="flex items-center gap-2.5 text-[#082F24]">
              <Phone className="w-5 h-5 text-[#C5A059]" />
              <h2 className="font-serif text-xl font-bold">15. Contact Us</h2>
            </div>
            <p className="text-xs text-stone-600">
              For any inquiries, itinerary amendment requests, or legal clarifications regarding these Terms & Conditions, please contact our 24/7 Concierge Office:
            </p>
            <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-stone-200 space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>Level 14, World Trade Center, Echelon Square, Colombo 01, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a href="tel:+94771234567" className="text-[#0D3B2E] font-bold hover:underline">+94 77 123 4567</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a href="mailto:concierge@lankavoyage.com" className="text-[#0D3B2E] font-bold hover:underline">concierge@lankavoyage.com</a>
              </div>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
};
