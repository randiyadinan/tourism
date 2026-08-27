import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Download, 
  Printer, 
  RefreshCw, 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  Clock, 
  Users, 
  Compass, 
  MapPin, 
  AlertCircle,
  BarChart3,
  Filter
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatPrice } from '../../utils/formatters';

export const ReportsPage: React.FC = () => {
  const [period, setPeriod] = useState<string>('all');
  const [customStart, setCustomStart] = useState<string>('');
  const [customEnd, setCustomEnd] = useState<string>('');
  const [isCustomDateOpen, setIsCustomDateOpen] = useState<boolean>(false);
  
  const [reportsData, setReportsData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadReports = async (p = period, start = customStart, end = customEnd) => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.fetchReports(p, start, end);
      if (data) {
        setReportsData(data);
      } else {
        setError('Unable to load business reports. Please check your connection.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch business reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports(period, customStart, customEnd);
  }, [period]);

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
    if (newPeriod !== 'custom') {
      setIsCustomDateOpen(false);
    } else {
      setIsCustomDateOpen(true);
    }
  };

  const handleApplyCustomDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customStart || !customEnd) {
      alert('Please select both start and end dates.');
      return;
    }
    loadReports('custom', customStart, customEnd);
  };

  const handleExportCSV = () => {
    if (!reportsData) return;
    const { overview, monthlySummary, topTours, customerAnalytics } = reportsData;

    let csv = 'LANKAVOYAGE COMMERCIAL BUSINESS REPORT\n';
    csv += `Generated On,${new Date().toISOString()}\n`;
    csv += `Filter Period,${period}\n\n`;

    csv += 'EXECUTIVE KPI OVERVIEW\n';
    csv += `Total Revenue (LKR),${overview.totalRevenue}\n`;
    csv += `Total Payments Received (LKR),${overview.totalPaymentsReceived}\n`;
    csv += `Outstanding Amount (LKR),${overview.outstandingAmount}\n`;
    csv += `Total Bookings,${overview.totalBookings}\n`;
    csv += `Pending Bookings,${overview.pendingBookings}\n`;
    csv += `Confirmed Bookings,${overview.confirmedBookings}\n`;
    csv += `Paid Bookings,${overview.paidBookings}\n`;
    csv += `Conversion Rate,${overview.conversionRate}%\n`;
    csv += `Total Registered Customers,${overview.totalCustomers}\n\n`;

    csv += 'MONTHLY BUSINESS SUMMARY\n';
    csv += 'Month,Bookings,Confirmed,Paid,Revenue (LKR)\n';
    for (const m of monthlySummary || []) {
      csv += `"${m.month}",${m.bookings},${m.confirmed},${m.paid},${m.revenue}\n`;
    }
    csv += '\n';

    csv += 'TOP PERFORMING TOURS\n';
    csv += 'Tour Name,Bookings Count,Revenue (LKR),Average Value (LKR)\n';
    for (const t of topTours || []) {
      csv += `"${t.name}",${t.bookingsCount},${t.revenue},${t.averageValue}\n`;
    }
    csv += '\n';

    csv += 'TOP CUSTOMERS\n';
    csv += 'Customer Name,Email,Country,Bookings,Total Spend (LKR)\n';
    for (const c of customerAnalytics?.topCustomers || []) {
      csv += `"${c.name}","${c.email}","${c.country}",${c.bookingsCount},${c.totalSpend}\n`;
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LankaVoyage_Report_${period}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const overview = reportsData?.overview;
  const topTours = reportsData?.topTours || [];
  const topDestinations = reportsData?.topDestinations || [];
  const customerAnalytics = reportsData?.customerAnalytics;
  const monthlySummary = reportsData?.monthlySummary || [];
  const recentActivity = reportsData?.recentActivity || [];
  const pendingActions = reportsData?.pendingActions;
  const revenueByMethod = reportsData?.revenueByMethod || {};

  return (
    <div className="space-y-8 print:p-0">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#062C22]">Business Reports & Analytics</h1>
          <p className="text-xs text-stone-500">Real financial KPIs, conversion analytics, tour revenue, and customer intelligence in <strong>LKR</strong>.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => loadReports(period, customStart, customEnd)}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 text-stone-700 text-xs font-bold rounded-xl hover:bg-stone-200 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExportCSV}
            disabled={!reportsData || loading}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-stone-300 text-stone-700 text-xs font-bold rounded-xl hover:bg-stone-50 transition-colors shadow-xs disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-[#0B3D2E]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            disabled={!reportsData || loading}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0B3D2E] text-white text-xs font-bold rounded-xl hover:bg-[#134E3F] transition-colors shadow-xs disabled:opacity-50"
          >
            <Printer className="w-3.5 h-3.5 text-[#39A982]" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Date Filter Bar */}
      <div className="liquid-glass-white p-4 rounded-3xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-stone-500 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-[#176B52]" /> Filter:
          </span>
          {[
            { key: 'all', label: 'All Time' },
            { key: 'today', label: 'Today' },
            { key: '7d', label: 'Last 7 Days' },
            { key: '30d', label: 'Last 30 Days' },
            { key: 'this_month', label: 'This Month' },
            { key: 'this_year', label: 'This Year' },
            { key: 'custom', label: 'Custom Range' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => handlePeriodChange(item.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                period === item.key
                  ? 'bg-[#0B3D2E] text-white shadow-xs'
                  : 'bg-white/80 text-stone-600 hover:bg-stone-100 border border-stone-200/60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {isCustomDateOpen && (
          <form onSubmit={handleApplyCustomDate} className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-stone-200">
            <input
              type="date"
              required
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="px-2.5 py-1 bg-white border border-stone-300 rounded-lg text-xs font-medium"
            />
            <span className="text-xs text-stone-400">to</span>
            <input
              type="date"
              required
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="px-2.5 py-1 bg-white border border-stone-300 rounded-lg text-xs font-medium"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-[#176B52] text-white font-bold text-xs rounded-lg hover:bg-[#0B3D2E]"
            >
              Apply
            </button>
          </form>
        )}
      </div>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-800 text-xs font-bold rounded-2xl border border-rose-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && !reportsData && (
        <div className="py-16 text-center text-stone-400 space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#176B52]" />
          <p className="text-xs font-bold">Compiling real-time business reports...</p>
        </div>
      )}

      {overview && (
        <>
          {/* ══════════════════════════════════════════════════════════════════
              1. BUSINESS OVERVIEW KPI CARDS (Real Financials)
             ══════════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Total Revenue */}
            <div className="liquid-glass-white p-5 rounded-3xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] space-y-2">
              <div className="flex items-center justify-between text-stone-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Total Revenue Received</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="font-serif text-2xl font-bold text-emerald-800">
                {formatPrice(overview.totalRevenue)}
              </div>
              <div className="text-[11px] text-stone-500 flex items-center justify-between pt-1 border-t border-stone-100">
                <span>Month: {formatPrice(overview.revenueThisMonth)}</span>
                <span>Year: {formatPrice(overview.revenueThisYear)}</span>
              </div>
            </div>

            {/* Outstanding / Pending Amount */}
            <div className="liquid-glass-white p-5 rounded-3xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] space-y-2">
              <div className="flex items-center justify-between text-stone-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Outstanding Receivable</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="font-serif text-2xl font-bold text-amber-800">
                {formatPrice(overview.outstandingAmount)}
              </div>
              <div className="text-[11px] text-stone-500 flex items-center justify-between pt-1 border-t border-stone-100">
                <span>Total Expected: {formatPrice(overview.totalExpectedAmount)}</span>
              </div>
            </div>

            {/* Total Bookings & Conversion */}
            <div className="liquid-glass-white p-5 rounded-3xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] space-y-2">
              <div className="flex items-center justify-between text-stone-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Bookings & Conversion</span>
                <TrendingUp className="w-4 h-4 text-[#176B52]" />
              </div>
              <div className="font-serif text-2xl font-bold text-[#062C22] flex items-center gap-2">
                <span>{overview.totalBookings}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  {overview.conversionRate}% Conv.
                </span>
              </div>
              <div className="text-[11px] text-stone-500 flex items-center justify-between pt-1 border-t border-stone-100">
                <span>Confirmed: {overview.confirmedBookings}</span>
                <span>Paid: {overview.paidBookings}</span>
              </div>
            </div>

            {/* Customers & Catalog */}
            <div className="liquid-glass-white p-5 rounded-3xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] space-y-2">
              <div className="flex items-center justify-between text-stone-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Platform Travelers</span>
                <Users className="w-4 h-4 text-[#0B3D2E]" />
              </div>
              <div className="font-serif text-2xl font-bold text-[#062C22]">
                {overview.totalCustomers} Customers
              </div>
              <div className="text-[11px] text-stone-500 flex items-center justify-between pt-1 border-t border-stone-100">
                <span>{overview.totalTours} Active Tours</span>
                <span>{overview.totalDestinations} Destinations</span>
              </div>
            </div>

          </div>

          {/* ══════════════════════════════════════════════════════════════════
              2. PENDING ACTIONS BANNER
             ══════════════════════════════════════════════════════════════════ */}
          {pendingActions && (pendingActions.awaitingConfirmationCount > 0 || pendingActions.unpaidConfirmedCount > 0) && (
            <div className="bg-gradient-to-r from-[#062C22] to-[#0B3D2E] text-white p-6 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#39A982] block">
                  Actionable Business Pipeline
                </span>
                <h3 className="font-serif text-lg font-bold">Pending Administrative Workflows</h3>
                <p className="text-xs text-stone-300">
                  {pendingActions.awaitingConfirmationCount} bookings awaiting review &bull; {pendingActions.unpaidConfirmedCount} confirmed bookings waiting for customer payment.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  to="/admin/bookings"
                  className="px-4 py-2 bg-[#39A982] hover:bg-[#2e8a69] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  Review Bookings ({pendingActions.awaitingConfirmationCount})
                </Link>
                <Link
                  to="/admin/customers"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Customer Profiles
                </Link>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              3. REVENUE BREAKDOWN & PAYMENT METHODS
             ══════════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Revenue Analytics Card */}
            <div className="lg:col-span-2 liquid-glass-white p-6 rounded-3xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-[#062C22] flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#176B52]" />
                  Monthly Revenue & Volume Trend
                </h3>
                <span className="text-[10px] font-bold text-stone-400 uppercase">Real Bookings Data</span>
              </div>

              {monthlySummary.length > 0 ? (
                <div className="space-y-3">
                  {monthlySummary.map((m: any, idx: number) => {
                    const maxRevenue = Math.max(...monthlySummary.map((item: any) => item.revenue), 1);
                    const pct = Math.round((m.revenue / maxRevenue) * 100);

                    return (
                      <div key={idx} className="space-y-1 text-xs">
                        <div className="flex justify-between font-bold text-[#062C22]">
                          <span>{m.month} ({m.bookings} Bookings &bull; {m.paid} Paid)</span>
                          <span className="text-emerald-800">{formatPrice(m.revenue)}</span>
                        </div>
                        <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden flex">
                          <div
                            className="bg-gradient-to-r from-[#176B52] to-[#39A982] rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(5, pct)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-stone-400 py-8 text-center">No monthly historical transactions recorded yet.</p>
              )}
            </div>

            {/* Payment Method Distribution */}
            <div className="liquid-glass-white p-6 rounded-3xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-[#062C22] flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#176B52]" />
                  Payment Channels
                </h3>
              </div>

              <div className="space-y-3">
                {Object.keys(revenueByMethod).length > 0 ? (
                  Object.entries(revenueByMethod).map(([method, amount]: [string, any], idx) => {
                    const totalRev = overview.totalRevenue || 1;
                    const pct = Math.round((amount / totalRev) * 100);

                    return (
                      <div key={idx} className="p-3.5 bg-[#F8F7F2] rounded-2xl border border-stone-200/80 space-y-1.5 text-xs">
                        <div className="flex justify-between font-bold text-[#062C22]">
                          <span>{method}</span>
                          <span>{formatPrice(amount)}</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-stone-500">
                          <span>{pct}% of collected funds</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-stone-400 py-8 text-center">No payment transactions processed yet.</p>
                )}
              </div>

              <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500 flex justify-between font-bold">
                <span>Avg Booking Value:</span>
                <span className="text-[#062C22]">{formatPrice(overview.averageBookingValue)}</span>
              </div>
            </div>

          </div>

          {/* ══════════════════════════════════════════════════════════════════
              4. TOP TOURS & DESTINATIONS PERFORMANCE
             ══════════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Top Tours */}
            <div className="liquid-glass-white p-6 rounded-3xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-[#062C22] flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#176B52]" />
                  Best Performing Tours
                </h3>
                <span className="text-[10px] font-bold text-[#176B52] uppercase">Top 5 by Revenue</span>
              </div>

              {topTours.length > 0 ? (
                <div className="space-y-2.5">
                  {topTours.map((t: any, idx: number) => (
                    <div key={idx} className="p-3.5 bg-[#F8F7F2] rounded-2xl border border-stone-200/80 flex items-center justify-between text-xs">
                      <div className="space-y-0.5 max-w-[240px]">
                        <h4 className="font-bold text-[#062C22] truncate">{t.name}</h4>
                        <p className="text-[10px] text-stone-500">{t.bookingsCount} Total Bookings placed</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-emerald-800">{formatPrice(t.revenue)}</div>
                        <div className="text-[10px] text-stone-400">Avg: {formatPrice(t.averageValue)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-400 py-6 text-center">No tour bookings recorded yet.</p>
              )}
            </div>

            {/* Destination Analytics */}
            <div className="liquid-glass-white p-6 rounded-3xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-[#062C22] flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#176B52]" />
                  Popular Travel Destinations
                </h3>
                <span className="text-[10px] font-bold text-[#176B52] uppercase">Most Itineraries</span>
              </div>

              {topDestinations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {topDestinations.map((d: any, idx: number) => (
                    <div key={idx} className="p-3.5 bg-[#F8F7F2] rounded-2xl border border-stone-200/80 space-y-1">
                      <div className="flex justify-between font-bold text-[#062C22]">
                        <span>{d.name}</span>
                        <span className="text-[#176B52]">{d.bookingsCount} trips</span>
                      </div>
                      <div className="text-[10px] text-stone-500">
                        Revenue: <strong>{formatPrice(d.revenue)}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-400 py-6 text-center">No destination analytics available.</p>
              )}
            </div>

          </div>

          {/* ══════════════════════════════════════════════════════════════════
              5. CUSTOMER ANALYTICS & TOP TRAVELERS
             ══════════════════════════════════════════════════════════════════ */}
          <div className="liquid-glass-white p-6 rounded-3xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#062C22] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#176B52]" />
                  Customer Intelligence & Spending Leaderboard
                </h3>
                <p className="text-xs text-stone-500">
                  {customerAnalytics?.totalCustomers} registered travelers ({customerAnalytics?.verifiedCustomers} email verified &bull; {customerAnalytics?.customersWithBookings} active bookers).
                </p>
              </div>
            </div>

            {/* Top 5 Customers Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F7F2] text-stone-700 font-bold border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Country</th>
                    <th className="py-3 px-4">Trips Booked</th>
                    <th className="py-3 px-4 text-right">Total Paid Spend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-600">
                  {customerAnalytics?.topCustomers?.map((cust: any) => (
                    <tr key={cust.id} className="hover:bg-stone-50/50">
                      <td className="py-3 px-4 font-bold text-[#062C22]">{cust.name}</td>
                      <td className="py-3 px-4 text-stone-500">{cust.email}</td>
                      <td className="py-3 px-4 font-semibold text-[#176B52]">{cust.country}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F8F7F2] border border-stone-200">
                          {cust.bookingsCount} Trips
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-800">
                        {formatPrice(cust.totalSpend)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              6. RECENT BUSINESS ACTIVITY TIMELINE
             ══════════════════════════════════════════════════════════════════ */}
          <div className="liquid-glass-white p-6 rounded-3xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#062C22]">Latest Operational Events</h3>
            
            {recentActivity.length > 0 ? (
              <div className="space-y-2.5">
                {recentActivity.map((act: any) => (
                  <div key={act.id} className="p-3 bg-[#F8F7F2] rounded-xl border border-stone-200/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-[#176B52]">{act.bookingCode}</span>
                      <span className="font-bold text-[#062C22]">{act.customerName}</span>
                      <span className="text-stone-400 hidden sm:inline">&bull; {act.tourTitle}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        act.bookingStatus === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                        act.bookingStatus === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-stone-200 text-stone-700'
                      }`}>
                        {act.bookingStatus}
                      </span>
                      <span className="font-bold text-[#062C22]">{formatPrice(act.totalAmount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-400 text-center py-4">No recent activity recorded.</p>
            )}
          </div>

        </>
      )}

    </div>
  );
};
