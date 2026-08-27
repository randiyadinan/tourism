import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  MapPin, 
  Car, 
  ArrowRight,
  Plane,
  Compass,
  Users,
  RefreshCw,
  CreditCard,
  BarChart3,
  AlertCircle
} from 'lucide-react';
import { tourService } from '../../services/tourService';
import { destinationTicketService } from '../../services/destinationTicketService';
import { vehiclePricingService } from '../../services/vehiclePricingService';
import { adminService } from '../../services/adminService';
import { formatPrice } from '../../utils/formatters';

export const AdminDashboardPage: React.FC = () => {
  // Website Controls Quick Stats
  const [toursCount, setToursCount] = useState(0);
  const [destCount, setDestCount] = useState(0);
  const [carDailyRate, setCarDailyRate] = useState(15000);
  const [vanDailyRate, setVanDailyRate] = useState(20000);

  // Business Reports & Analytics State
  const [period, setPeriod] = useState<string>('all'); // '7d' | '30d' | 'this_month' | 'this_year' | 'all'
  const [reportsData, setReportsData] = useState<any>(null);
  const [reportsLoading, setReportsLoading] = useState<boolean>(true);
  const [reportsError, setReportsError] = useState<string | null>(null);

  const loadDashboardReports = async (selectedPeriod = period) => {
    setReportsLoading(true);
    setReportsError(null);
    try {
      const data = await adminService.fetchReports(selectedPeriod);
      if (data) {
        setReportsData(data);
      }
    } catch (err: any) {
      setReportsError(err.message || 'Failed to load business analytics');
    } finally {
      setReportsLoading(false);
    }
  };

  useEffect(() => {
    // Quick Controls setup
    const tours = tourService.getAllTours();
    const dests = destinationTicketService.getAllDestinations();
    const vehCar = vehiclePricingService.getVehicleById('car');
    const vehVan = vehiclePricingService.getVehicleById('van');

    setToursCount(tours.length);
    setDestCount(dests.length);
    if (vehCar) setCarDailyRate(vehCar.dailyPriceLKR);
    if (vehVan) setVanDailyRate(vehVan.dailyPriceLKR);

    loadDashboardReports(period);
  }, [period]);

  const overview = reportsData?.overview;
  const topTours = reportsData?.topTours || [];
  const monthlySummary = reportsData?.monthlySummary || [];
  const recentActivity = reportsData?.recentActivity || [];
  const pendingActions = reportsData?.pendingActions;
  const revenueByMethod = reportsData?.revenueByMethod || {};

  return (
    <div className="space-y-8">
      
      {/* 1. Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#062C22]">Website Management Console</h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time business performance analytics, commercial revenue, traveler directory, and catalog operations.
          </p>
        </div>

        {/* Live Period Selector */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase px-2 hidden sm:inline">Range:</span>
          {[
            { key: 'all', label: 'All Time' },
            { key: '7d', label: '7 Days' },
            { key: '30d', label: '30 Days' },
            { key: 'this_month', label: 'This Month' },
            { key: 'this_year', label: 'This Year' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setPeriod(item.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                period === item.key
                  ? 'bg-[#0B3D2E] text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => loadDashboardReports(period)}
            disabled={reportsLoading}
            className="p-1.5 text-stone-400 hover:text-[#0B3D2E] rounded-lg transition-colors"
            title="Refresh analytics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${reportsLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {reportsError && (
        <div className="p-3.5 bg-rose-50 text-rose-800 text-xs font-bold rounded-2xl border border-rose-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{reportsError}</span>
        </div>
      )}

      {/* 2. Top Summary KPI Cards (All 8 Core Metrics) */}
      {overview && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Total Customers */}
          <div className="liquid-glass-white p-4 rounded-2xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] space-y-1">
            <span className="text-[10px] text-stone-400 font-bold uppercase block">1. Total Customers</span>
            <span className="font-serif text-2xl font-bold text-[#062C22] block">
              {overview.totalCustomers}
            </span>
            <p className="text-[10px] text-stone-500">Registered Travelers</p>
          </div>

          {/* 2. Total Bookings */}
          <div className="liquid-glass-white p-4 rounded-2xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] space-y-1">
            <span className="text-[10px] text-stone-400 font-bold uppercase block">2. Total Bookings</span>
            <span className="font-serif text-2xl font-bold text-[#062C22] block">
              {overview.totalBookings}
            </span>
            <p className="text-[10px] text-emerald-700 font-bold">{overview.conversionRate}% Conversion</p>
          </div>

          {/* 3. Total Revenue */}
          <div className="liquid-glass-white p-4 rounded-2xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] space-y-1">
            <span className="text-[10px] text-stone-400 font-bold uppercase block">3. Total Revenue</span>
            <span className="font-serif text-2xl font-bold text-[#0B3D2E] block truncate">
              {formatPrice(overview.totalExpectedAmount || overview.totalRevenue)}
            </span>
            <p className="text-[10px] text-stone-500">Gross Booking Value</p>
          </div>

          {/* 4. Paid Revenue */}
          <div className="liquid-glass-white p-4 rounded-2xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] space-y-1">
            <span className="text-[10px] text-stone-400 font-bold uppercase block">4. Paid Revenue</span>
            <span className="font-serif text-2xl font-bold text-emerald-800 block truncate">
              {formatPrice(overview.totalRevenue)}
            </span>
            <p className="text-[10px] text-emerald-700 font-bold">Collected Funds</p>
          </div>

          {/* 5. Outstanding Amount */}
          <div className="liquid-glass-white p-4 rounded-2xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] space-y-1">
            <span className="text-[10px] text-stone-400 font-bold uppercase block">5. Outstanding Amount</span>
            <span className="font-serif text-2xl font-bold text-amber-800 block truncate">
              {formatPrice(overview.outstandingAmount)}
            </span>
            <p className="text-[10px] text-stone-500">Uncollected Balance</p>
          </div>

          {/* 6. Pending Bookings */}
          <div className="liquid-glass-white p-4 rounded-2xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] space-y-1">
            <span className="text-[10px] text-stone-400 font-bold uppercase block">6. Pending Bookings</span>
            <span className="font-serif text-2xl font-bold text-amber-700 block">
              {overview.pendingBookings}
            </span>
            <p className="text-[10px] text-stone-500">Awaiting Admin Review</p>
          </div>

          {/* 7. Confirmed Bookings */}
          <div className="liquid-glass-white p-4 rounded-2xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] space-y-1">
            <span className="text-[10px] text-stone-400 font-bold uppercase block">7. Confirmed Bookings</span>
            <span className="font-serif text-2xl font-bold text-[#176B52] block">
              {overview.confirmedBookings}
            </span>
            <p className="text-[10px] text-stone-500">Payment Unlocked</p>
          </div>

          {/* 8. Rejected Bookings */}
          <div className="liquid-glass-white p-4 rounded-2xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] space-y-1">
            <span className="text-[10px] text-stone-400 font-bold uppercase block">8. Rejected Bookings</span>
            <span className="font-serif text-2xl font-bold text-rose-700 block">
              {overview.rejectedBookings}
            </span>
            <p className="text-[10px] text-stone-500">Declined Requests</p>
          </div>

        </div>
      )}

      {/* 3. Pending Admin Actions Banner */}
      {pendingActions && (pendingActions.awaitingConfirmationCount > 0 || pendingActions.unpaidConfirmedCount > 0) && (
        <div className="bg-gradient-to-r from-[#062C22] to-[#0B3D2E] text-white p-5 rounded-3xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#39A982] block">
              Action Required
            </span>
            <h3 className="font-serif text-base font-bold">Pending Administrative Workflows</h3>
            <p className="text-xs text-stone-300">
              {pendingActions.awaitingConfirmationCount} booking request(s) awaiting review &bull; {pendingActions.unpaidConfirmedCount} confirmed booking(s) pending customer checkout.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              to="/admin/bookings"
              className="px-4 py-2 bg-[#39A982] hover:bg-[#2e8a69] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Manage Bookings ({pendingActions.awaitingConfirmationCount})
            </Link>
            <Link
              to="/admin/customers"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Customer Directory
            </Link>
          </div>
        </div>
      )}

      {/* 4. Business Revenue & Booking Analytics Visual Charts */}
      {overview && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Revenue Analytics Timeline */}
          <div className="lg:col-span-8 liquid-glass-white p-6 rounded-3xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#062C22] flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#176B52]" />
                  Revenue Analytics
                </h3>
                <p className="text-xs text-stone-400">Monthly gross total, collected revenue, and outstanding balance</p>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-bold">
                <span className="flex items-center gap-1 text-emerald-800">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#176B52]" /> Paid
                </span>
                <span className="flex items-center gap-1 text-amber-700">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" /> Outstanding
                </span>
              </div>
            </div>

            {monthlySummary.length > 0 ? (
              <div className="space-y-4 pt-2">
                {monthlySummary.map((m: any, idx: number) => {
                  const maxRevenue = Math.max(...monthlySummary.map((item: any) => item.totalRevenue || item.revenue), 1);
                  const paidPct = Math.round(((m.paidRevenue || m.revenue) / maxRevenue) * 100);
                  const outstandingPct = Math.round(((m.outstandingRevenue || 0) / maxRevenue) * 100);

                  return (
                    <div key={idx} className="space-y-1.5 text-xs">
                      <div className="flex justify-between font-bold text-[#062C22]">
                        <span className="flex items-center gap-2">
                          <span className="font-serif">{m.month}</span>
                          <span className="text-[11px] font-normal text-stone-500">
                            ({m.bookings} total &bull; {m.paid} paid &bull; {m.unpaid || 0} unpaid)
                          </span>
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-emerald-800 font-bold">{formatPrice(m.paidRevenue || m.revenue)}</span>
                          {m.outstandingRevenue > 0 && (
                            <span className="text-amber-700 text-[11px]">({formatPrice(m.outstandingRevenue)} due)</span>
                          )}
                        </div>
                      </div>
                      <div className="h-3 bg-stone-100 rounded-full overflow-hidden flex gap-1 p-0.5">
                        <div
                          className="bg-[#176B52] rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(4, paidPct)}%` }}
                          title={`Paid: ${formatPrice(m.paidRevenue || m.revenue)}`}
                        />
                        {outstandingPct > 0 && (
                          <div
                            className="bg-amber-400 rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(4, outstandingPct)}%` }}
                            title={`Outstanding: ${formatPrice(m.outstandingRevenue)}`}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-stone-400 py-8 text-center">No monthly revenue data available.</p>
            )}
          </div>

          {/* Booking Analytics Breakdown */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Booking Analytics */}
            <div className="liquid-glass-white p-6 rounded-3xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] space-y-3">
              <h3 className="font-serif text-base font-bold text-[#062C22]">Booking Analytics</h3>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 font-bold">
                  <span>Pending</span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-200/60">{overview.pendingBookings}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 font-bold">
                  <span>Confirmed</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-200/60">{overview.confirmedBookings}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-900 font-bold">
                  <span>Rejected</span>
                  <span className="px-2 py-0.5 rounded-md bg-rose-200/60">{overview.rejectedBookings}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-teal-50 border border-teal-200/80 text-teal-900 font-bold">
                  <span>Paid</span>
                  <span className="px-2 py-0.5 rounded-md bg-teal-200/60">{overview.paidBookings}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-700 font-bold">
                  <span>Unpaid</span>
                  <span className="px-2 py-0.5 rounded-md bg-stone-200">{overview.unpaidBookings}</span>
                </div>
              </div>
            </div>

            {/* Payment Channel Breakdown */}
            <div className="liquid-glass-white p-6 rounded-3xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] space-y-3">
              <h3 className="font-serif text-base font-bold text-[#062C22] flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-[#176B52]" />
                Payment Channels
              </h3>

              <div className="space-y-2 text-xs">
                {Object.keys(revenueByMethod).length > 0 ? (
                  Object.entries(revenueByMethod).map(([method, amount]: [string, any], idx) => (
                    <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl bg-[#F8F7F2] border border-stone-200/80 font-medium">
                      <span className="text-[#062C22] font-bold">{method}</span>
                      <span className="text-emerald-800 font-bold">{formatPrice(amount)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-stone-400 text-center py-2">No payment methods recorded yet.</p>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 5. Popular Tours & Popular Destinations */}
      {overview && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Top 5 Popular Tours */}
          <div className="liquid-glass-white p-6 rounded-3xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#062C22] flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#176B52]" />
                Popular Tours (Top 5)
              </h3>
              <Link to="/admin/tours" className="text-xs font-bold text-[#176B52] hover:underline">
                Manage Tours &rarr;
              </Link>
            </div>

            {topTours.length > 0 ? (
              <div className="space-y-2.5">
                {topTours.map((t: any, idx: number) => (
                  <div key={idx} className="p-3.5 bg-[#F8F7F2] rounded-2xl border border-stone-200/80 flex items-center justify-between text-xs">
                    <div className="space-y-0.5 max-w-[260px]">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#062C22] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-[#062C22] truncate">{t.name}</h4>
                      </div>
                      <p className="text-[10px] text-stone-500 pl-7">{t.bookingsCount} Bookings</p>
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

          {/* Popular Destinations */}
          <div className="liquid-glass-white p-6 rounded-3xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#062C22] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#176B52]" />
                Popular Destinations
              </h3>
              <Link to="/admin/destinations" className="text-xs font-bold text-[#176B52] hover:underline">
                Manage Destinations &rarr;
              </Link>
            </div>

            {reportsData?.topDestinations && reportsData.topDestinations.length > 0 ? (
              <div className="space-y-2.5">
                {reportsData.topDestinations.map((d: any, idx: number) => (
                  <div key={idx} className="p-3.5 bg-[#F8F7F2] rounded-2xl border border-stone-200/80 flex items-center justify-between text-xs">
                    <div className="space-y-0.5 max-w-[260px]">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#176B52] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-[#062C22] truncate">{d.name}</h4>
                      </div>
                      <p className="text-[10px] text-stone-500 pl-7">{d.bookingsCount} Traveler Bookings</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-800">{formatPrice(d.revenue)}</div>
                      <div className="text-[10px] text-stone-400">Revenue Share</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-400 py-6 text-center">No destination booking data recorded yet.</p>
            )}
          </div>

        </div>
      )}

      {/* 6. Recent Business Activity (Bookings, Payments, Customer Registrations) */}
      {recentActivity.length > 0 && (
        <div className="liquid-glass-white p-6 rounded-3xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#062C22]">Recent Business Activity</h3>
            <Link to="/admin/bookings" className="text-xs font-bold text-[#176B52] hover:underline">
              View All Bookings &rarr;
            </Link>
          </div>

          <div className="space-y-2">
            {recentActivity.map((act: any) => (
              <div key={act.id} className="p-3 bg-[#F8F7F2] rounded-xl border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                    act.type === 'PAYMENT' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                    act.type === 'CUSTOMER' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' :
                    'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {act.type || 'BOOKING'}
                  </span>
                  <div>
                    <span className="font-bold text-[#062C22]">{act.title || act.customerName}</span>
                    <span className="text-stone-500 ml-2">{act.description || act.tourTitle}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  {act.amount !== undefined && (
                    <span className="font-bold text-emerald-800">{formatPrice(act.amount)}</span>
                  )}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    act.status === 'Confirmed' || act.status === 'PAID' || act.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' :
                    act.status === 'Pending' || act.status === 'Pending Verification' ? 'bg-amber-100 text-amber-800' : 'bg-stone-200 text-stone-700'
                  }`}>
                    {act.status}
                  </span>
                  <span className="text-[10px] text-stone-400">
                    {act.timestamp ? new Date(act.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Core Management Navigation Cards (Preserved) */}
      <div className="space-y-4 pt-2">
        <h3 className="font-serif text-xl font-bold text-[#062C22]">Website Operations & Catalogs</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* 1. Customer Bookings */}
          <div className="liquid-glass-card glass-card-interactive p-6 rounded-3xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0B3D2E] text-white flex items-center justify-center font-bold shadow-md">
                <Compass className="w-6 h-6 text-[#39A982]" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#062C22]">Customer Bookings</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Review all traveler bookings, confirm pending requests, and manage vouchers.
              </p>
            </div>
            <Link
              to="/admin/bookings"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#176B52] hover:text-[#0B3D2E] pt-2"
            >
              <span>Manage Customer Bookings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 2. Customer Profiles */}
          <div className="liquid-glass-card glass-card-interactive p-6 rounded-3xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#176B52] text-white flex items-center justify-center font-bold shadow-md">
                <Users className="w-6 h-6 text-[#DDEFE8]" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#062C22]">Customer Profiles</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Registered traveler profiles, contact files, passport data, and spend history.
              </p>
            </div>
            <Link
              to="/admin/customers"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#176B52] hover:text-[#0B3D2E] pt-2"
            >
              <span>View Customer Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 3. Tours */}
          <div className="liquid-glass-card glass-card-interactive p-6 rounded-3xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#062C22] text-white flex items-center justify-center font-bold shadow-md">
                <BookOpen className="w-6 h-6 text-[#39A982]" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#062C22]">Tour Catalog</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                {toursCount} active tours with fixed day-by-day itineraries and destination photos.
              </p>
            </div>
            <Link
              to="/admin/tours"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#176B52] hover:text-[#0B3D2E] pt-2"
            >
              <span>Manage Tours</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 4. Vehicle Daily Pricing */}
          <div className="liquid-glass-card glass-card-interactive p-6 rounded-3xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#176B52] text-white flex items-center justify-center font-bold shadow-md">
                <Car className="w-6 h-6 text-[#DDEFE8]" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#062C22]">Vehicle Daily Rates</h3>
              <div className="text-xs text-stone-600 space-y-0.5">
                <div>Car: <strong>{formatPrice(carDailyRate)} / day</strong></div>
                <div>Van: <strong>{formatPrice(vanDailyRate)} / day</strong></div>
              </div>
            </div>
            <Link
              to="/admin/vehicles"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#176B52] hover:text-[#0B3D2E] pt-2"
            >
              <span>Edit Daily Rates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 5. Destinations & Tickets */}
          <div className="liquid-glass-card glass-card-interactive p-6 rounded-3xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#39A982] text-white flex items-center justify-center font-bold shadow-md">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#062C22]">Destination Tickets</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                {destCount} destinations with Adult and Child ticket rates for Home page calculator.
              </p>
            </div>
            <Link
              to="/admin/destinations"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#176B52] hover:text-[#0B3D2E] pt-2"
            >
              <span>Manage Destinations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 6. Airport Transfer Rates */}
          <div className="liquid-glass-card glass-card-interactive p-6 rounded-3xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#062C22] text-white flex items-center justify-center font-bold shadow-md">
                <Plane className="w-6 h-6 text-[#39A982]" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#062C22]">Airport Transfers</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                CMB airport distance rate per km and base meet fees for Car and Van.
              </p>
            </div>
            <Link
              to="/admin/airport-transfers"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#176B52] hover:text-[#0B3D2E] pt-2"
            >
              <span>Edit Transfer Rates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};
