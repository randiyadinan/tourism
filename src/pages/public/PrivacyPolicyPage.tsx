import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Globe, 
  Eye, 
  FileText, 
  Server, 
  HelpCircle, 
  Mail, 
  Phone, 
  MapPin, 
  UserCheck,
  Cookie
} from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0D3B2E]/10 text-[#0D3B2E] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
            Data Protection & Privacy
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#082F24]">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            How LankaVoyage collects, protects, and handles your personal information when you plan and book travel with us.
          </p>
          <div className="pt-2 text-xs font-medium text-stone-500">
            Last Updated: <span className="font-bold text-[#082F24]">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Commitment Banner */}
        <div className="p-5 sm:p-6 bg-emerald-50/80 border-2 border-emerald-200 rounded-3xl flex items-start gap-4 text-xs text-emerald-900 shadow-xs">
          <Lock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-[#082F24]">Our Privacy Commitment</h4>
            <p className="leading-relaxed">
              At LankaVoyage, protecting your personal privacy and maintaining your trust is foundational to our bespoke travel services. We collect only the information necessary to plan, organize, and execute your journeys across Sri Lanka with maximum safety and personalization.
            </p>
          </div>
        </div>

        {/* Main Privacy Sections Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-sm space-y-10 text-stone-700 leading-relaxed text-sm">

          {/* 1. Information We Collect */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#082F24]">
              <FileText className="w-5 h-5 text-[#C5A059]" />
              <h2 className="font-serif text-xl font-bold">1. Information We Collect</h2>
            </div>
            <p>
              We collect information that you provide directly to us when making an inquiry, customizing an itinerary, registering an account, or finalizing a reservation.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-stone-600">
              <li><strong>Contact Information:</strong> Full name, email address, international phone number, residential address, and country of residence.</li>
              <li><strong>Travel Preferences:</strong> Travel dates, group size, dietary restrictions, preferred hotel categories, and custom itinerary notes.</li>
            </ul>
          </section>

          {/* 2. Booking and Customer Information */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#082F24]">
              <UserCheck className="w-5 h-5 text-[#C5A059]" />
              <h2 className="font-serif text-xl font-bold">2. Booking & Customer Information</h2>
            </div>
            <p>
              When you book a tour or transfer, we retain your booking history, itinerary configurations, voucher references (e.g. <code className="font-mono bg-stone-100 px-1 py-0.5 rounded text-[#082F24]">LV-2026-XXXX</code>), and assigned chauffeur guide information to manage your ongoing service delivery.
            </p>
          </section>

          {/* 3. Passport & Travel Information */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#082F24]">
              <Globe className="w-5 h-5 text-[#C5A059]" />
              <h2 className="font-serif text-xl font-bold">3. Passport & Flight Information</h2>
            </div>
            <p>
              For hotel reservations, wildlife national park safari permits (e.g. Yala, Wilpattu), domestic train tickets, and airport transfers, we may request:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-stone-600">
              <li>Passport numbers, nationality, and dates of birth for all passengers in your party as required by statutory Sri Lankan authorities and wildlife departments.</li>
              <li>Inbound and outbound flight details (airline, flight number, arrival/departure times) for airport meet-and-greet transfers.</li>
            </ul>
          </section>

          {/* 4. Payment Information & PayHere Processing */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#082F24]">
              <CreditCard className="w-5 h-5 text-[#C5A059]" />
              <h2 className="font-serif text-xl font-bold">4. Payment Information & Secure Processing</h2>
            </div>
            <p>
              Online payments for tours and transfers are handled via authorized payment gateways (including PayHere).
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-stone-600">
              <li><strong>Zero Card Storage:</strong> LankaVoyage does NOT store or process your complete credit/debit card numbers, CVVs, or bank credentials on our servers.</li>
              <li>Transactions occur over encrypted SSL/TLS channels directly with the payment processor using 3D Secure 2.0 authentication.</li>
              <li>We receive only transaction reference tokens, order IDs, payment status confirmations, and authorized currency amounts.</li>
            </ul>
          </section>

          {/* 5. Cookies & Tracking Technologies */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#082F24]">
              <Cookie className="w-5 h-5 text-[#C5A059]" />
              <h2 className="font-serif text-xl font-bold">5. Cookies & Local Storage</h2>
            </div>
            <p>
              We utilize browser cookies and local storage tokens to preserve your active customer session, maintain items in your custom trip builder, and retain your wishlist choices across page visits. You can configure your browser to reject cookies, though certain interactive features may function with reduced convenience.
            </p>
          </section>

          {/* 6. Analytics & Performance Monitoring */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#082F24]">
              <Eye className="w-5 h-5 text-[#C5A059]" />
              <h2 className="font-serif text-xl font-bold">6. Analytics & Performance</h2>
            </div>
            <p>
              We may utilize aggregated, non-personally identifiable telemetry to evaluate website loading speeds, identify broken links, and optimize our itinerary recommendations. This data does not reveal individual traveler identities.
            </p>
          </section>

          {/* 7. Third-Party Service Providers */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#082F24]">
              <Server className="w-5 h-5 text-[#C5A059]" />
              <h2 className="font-serif text-xl font-bold">7. Third-Party Service Providers</h2>
            </div>
            <p>
              To execute your travel itinerary, we share strictly necessary details with verified operational partners:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-stone-600">
              <li>Hotels, luxury resorts, and boutique villas for guest registration.</li>
              <li>Chauffeur guides and transport coordinators for route fulfillment.</li>
              <li>Government departments (e.g., Department of Wildlife Conservation, Sri Lanka Railways) for permits and train ticket issuance.</li>
            </ul>
            <p className="text-xs text-stone-600">
              We do not sell, lease, or monetize your personal data to marketing third parties under any circumstances.
            </p>
          </section>

          {/* 8. Data Security */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#082F24]">
              <Lock className="w-5 h-5 text-[#C5A059]" />
              <h2 className="font-serif text-xl font-bold">8. Data Security</h2>
            </div>
            <p>
              We implement industry-standard administrative, technical, and physical safeguards to protect your personal information against unauthorized access, destruction, or disclosure. Communications with our servers utilize HTTPS encryption protocols.
            </p>
          </section>

          {/* 9. Data Retention */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#082F24]">
              <Server className="w-5 h-5 text-[#C5A059]" />
              <h2 className="font-serif text-xl font-bold">9. Data Retention</h2>
            </div>
            <p>
              We retain personal data only for as long as necessary to complete your travel arrangements, fulfill accounting and tax obligations under Sri Lankan law, and resolve any post-trip inquiries or reviews.
            </p>
          </section>

          {/* 10. User Rights */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#082F24]">
              <UserCheck className="w-5 h-5 text-[#C5A059]" />
              <h2 className="font-serif text-xl font-bold">10. Your Rights</h2>
            </div>
            <p>
              You have the right to request access to the personal data we hold about you, request corrections to inaccurate records, or request the deletion of your customer account profile, subject to statutory retention requirements for completed financial transactions.
            </p>
          </section>

          {/* 11. International Visitors */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#082F24]">
              <Globe className="w-5 h-5 text-[#C5A059]" />
              <h2 className="font-serif text-xl font-bold">11. International Visitors</h2>
            </div>
            <p>
              LankaVoyage operates from Sri Lanka. If you are accessing our platform from overseas (Europe, North America, Australia, Asia, etc.), your information will be transferred and processed in accordance with this Privacy Policy and applicable Sri Lankan data protection frameworks.
            </p>
          </section>

          {/* 12. Children's Privacy */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#082F24]">
              <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
              <h2 className="font-serif text-xl font-bold">12. Children's Privacy</h2>
            </div>
            <p>
              Our website is intended for adult travelers and lead booking guests. We do not knowingly collect personal information directly from children under 18 without the express consent of a parent or legal guardian making a family tour booking.
            </p>
          </section>

          {/* 13. Policy Updates */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#082F24]">
              <HelpCircle className="w-5 h-5 text-[#C5A059]" />
              <h2 className="font-serif text-xl font-bold">13. Policy Updates</h2>
            </div>
            <p>
              We may update this Privacy Policy from time to time to reflect operational or regulatory changes. Any revisions will be published here with an updated "Last Updated" date.
            </p>
          </section>

          {/* 14. Contact Information */}
          <section className="space-y-4 pt-4 border-t border-stone-100">
            <div className="flex items-center gap-2.5 text-[#082F24]">
              <Phone className="w-5 h-5 text-[#C5A059]" />
              <h2 className="font-serif text-xl font-bold">14. Contact Us</h2>
            </div>
            <p className="text-xs text-stone-600">
              If you have any questions or data requests regarding this Privacy Policy, please reach out to our team:
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
