import React from 'react';
import { Sparkles, Calendar, CheckCircle, PlaneTakeoff, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Design or Pick Itinerary',
      description: 'Choose one of our signature luxury tours or build a custom route in our 10-step wizard with real-time pricing.',
      icon: Sparkles
    },
    {
      step: '02',
      title: 'Personal Concierge Polish',
      description: 'Our destination specialist reviews your dates, refines hotel suites, assigns your private guide, and locks in permits.',
      icon: Calendar
    },
    {
      step: '03',
      title: 'Secure Booking Confirmation',
      description: 'Confirm with flexible deposit options and receive your instant digital travel voucher and itinerary dashboard.',
      icon: CheckCircle
    },
    {
      step: '04',
      title: 'VIP Arrival in Paradise',
      description: 'Step off the plane to a warm jasmine garland greeting at Colombo airport and begin your seamless luxury adventure.',
      icon: PlaneTakeoff
    }
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#176B52]/15 text-[#176B52] text-xs font-bold uppercase tracking-wider">
            Simple 4-Step Process
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#062C22]">
            How Your LankaVoyage Journey Unfolds
          </h2>
          <p className="text-base text-stone-600">
            From the first spark of inspiration to your flight home, we handle every detail with white-glove precision.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative bg-[#F8F7F2] rounded-2xl p-7 border border-stone-200 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-3xl font-bold text-[#176B52] opacity-70">
                      {step.step}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-[#0B3D2E] text-[#39A982] flex items-center justify-center shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#062C22]">
                    {step.title}
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-stone-200/60 text-xs font-semibold text-[#0B3D2E]">
                  Step {idx + 1} of 4
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <Link
            to="/customize"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#0B3D2E] text-white hover:bg-[#134E3F] text-base font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-5 h-5 text-[#39A982]" />
            Launch Custom Trip Builder
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};
