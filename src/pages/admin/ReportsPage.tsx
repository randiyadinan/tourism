import React from 'react';
import { 
  Download, 
  Printer
} from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

export const ReportsPage: React.FC = () => {

  const handleExportCSV = () => {
    alert('Exporting LankaVoyage_Commercial_Report_2026.csv (14,200 rows exported)');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 print:p-0">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#062C22]">Executive Commercial Reports</h1>
          <p className="text-xs text-stone-500">Financial summaries, conversion analytics, and traveler demographic reports in <strong>Sri Lankan Rupees (LKR)</strong>.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-stone-300 text-stone-700 text-xs font-bold rounded-xl hover:bg-stone-50 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#0B3D2E]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0B3D2E] text-white text-xs font-bold rounded-xl hover:bg-[#134E3F] transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-[#39A982]" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-2">
          <span className="text-xs text-stone-400 font-bold uppercase">Average Booking Value</span>
          <span className="font-serif text-3xl font-bold text-[#062C22]">{formatPrice(745000)}</span>
          <p className="text-[11px] text-emerald-700 font-semibold">+12.3% YoY Growth</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-2">
          <span className="text-xs text-stone-400 font-bold uppercase">Booking Conversion Rate</span>
          <span className="font-serif text-3xl font-bold text-[#0B3D2E]">4.82%</span>
          <p className="text-[11px] text-stone-500">Above industry standard (2.1%)</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-2">
          <span className="text-xs text-stone-400 font-bold uppercase">Repeat & Referral Rate</span>
          <span className="font-serif text-3xl font-bold text-[#176B52]">34.6%</span>
          <p className="text-[11px] text-stone-500">High luxury guest retention</p>
        </div>
      </div>

      {/* Source Markets Table */}
      <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm space-y-6">
        <h3 className="font-serif text-xl font-bold text-[#062C22]">Key Source Travel Markets (2026)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { country: 'United Kingdom & Ireland', pct: 38, bookings: 470, rev: formatPrice(350150000) },
            { country: 'Germany & DACH Region', pct: 24, bookings: 298, rev: formatPrice(222100000) },
            { country: 'Australia & New Zealand', pct: 18, bookings: 223, rev: formatPrice(166350000) },
            { country: 'United States & Canada', pct: 12, bookings: 148, rev: formatPrice(110600000) },
            { country: 'France & Benelux', pct: 8, bookings: 101, rev: formatPrice(75450000) }
          ].map((m, i) => (
            <div key={i} className="space-y-1.5 text-xs bg-[#F8F7F2] p-4 rounded-2xl border border-stone-200/80">
              <div className="flex justify-between font-bold text-[#062C22]">
                <span>{m.country}</span>
                <span>{m.rev}</span>
              </div>
              <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#0B3D2E] rounded-full" style={{ width: `${m.pct}%` }} />
              </div>
              <div className="flex justify-between text-[11px] text-stone-500">
                <span>{m.bookings} Bookings</span>
                <span>{m.pct}% of Revenue</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
