import React, { useState } from 'react';
import {  Plus } from 'lucide-react';
import { INITIAL_DISCOUNTS } from '../../data/initialBookings';
import type { DiscountCoupon } from '../../types';
import { Modal } from '../../components/common/Modal';

export const ManageDiscountsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<DiscountCoupon[]>(INITIAL_DISCOUNTS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed_usd'>('percentage');
  const [discountValue, setDiscountValue] = useState(10);
  const [minSpendUSD, setMinSpendUSD] = useState(500);
  const [validUntil, setValidUntil] = useState('2026-12-31');

  const handleToggleActive = (cCode: string) => {
    setCoupons(coupons.map(c => c.code === cCode ? { ...c, isActive: !c.isActive } : c));
  };

  const handleDelete = (cCode: string) => {
    if (confirm('Delete discount coupon?')) {
      setCoupons(coupons.filter(c => c.code !== cCode));
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newCoupon: DiscountCoupon = {
      code: code.toUpperCase().trim(),
      description,
      discountType,
      discountValue: Number(discountValue),
      minSpendUSD: Number(minSpendUSD),
      validUntil,
      isActive: true,
      usageCount: 0
    };
    setCoupons([...coupons, newCoupon]);
    setIsModalOpen(false);
    setCode('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#082F24]">Promotions & Discount Codes</h1>
          <p className="text-xs text-stone-500">Configure seasonal promo campaigns and early bird percentage savings.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#0D3B2E] text-white hover:bg-[#134E3F] text-xs font-bold rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-[#E5C378]" />
          <span>Create Coupon Code</span>
        </button>
      </div>

      {/* Grid of Coupons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div
            key={c.code}
            className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-base font-bold text-[#082F24] bg-[#FAF8F5] px-3 py-1 rounded-xl border border-stone-200">
                  {c.code}
                </span>
                <button
                  onClick={() => handleToggleActive(c.code)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-400'
                  }`}
                >
                  {c.isActive ? 'Active' : 'Disabled'}
                </button>
              </div>

              <h4 className="font-serif font-bold text-lg text-[#082F24]">
                {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `$${c.discountValue} USD OFF`}
              </h4>

              <p className="text-xs text-stone-600">{c.description}</p>
            </div>

            <div className="space-y-1.5 text-xs text-stone-400 pt-3 border-t border-stone-100">
              <div className="flex justify-between">
                <span>Min Spend:</span>
                <strong className="text-stone-600">${c.minSpendUSD || 0} USD</strong>
              </div>
              <div className="flex justify-between">
                <span>Valid Until:</span>
                <strong className="text-stone-600">{c.validUntil}</strong>
              </div>
              <div className="flex justify-between">
                <span>Times Used:</span>
                <strong className="text-[#0D3B2E]">{c.usageCount} bookings</strong>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => handleDelete(c.code)}
                className="text-rose-600 hover:text-rose-800 text-xs font-semibold"
              >
                Delete Promo
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Promotional Discount Code"
        maxWidth="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Promo Code (All Caps)</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. CEYLON2026"
              className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono uppercase text-[#082F24]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#082F24]"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed_usd">Fixed Amount ($ USD)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Discount Value</label>
              <input
                type="number"
                required
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#082F24]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Min Spend ($)</label>
              <input
                type="number"
                value={minSpendUSD}
                onChange={(e) => setMinSpendUSD(Number(e.target.value))}
                className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#082F24]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Expiry Date</label>
              <input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#082F24]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Description</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. 10% off all tours booked before December"
              className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#082F24]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#0D3B2E] text-white font-bold text-xs rounded-xl shadow-md hover:bg-[#134E3F] transition-colors"
          >
            Create & Activate Coupon
          </button>
        </form>
      </Modal>

    </div>
  );
};
