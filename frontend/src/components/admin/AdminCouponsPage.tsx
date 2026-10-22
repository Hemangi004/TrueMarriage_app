import React, { useEffect, useState } from 'react';
import { Ticket, Plus, Tag, RefreshCw } from 'lucide-react';
import { getAdminCouponsApi, createAdminCouponApi } from '../../services/apiService';

export const AdminCouponsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('20');
  const [maxUses, setMaxUses] = useState('1000');
  const [validTill, setValidTill] = useState('2026-12-31');

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await getAdminCouponsApi();
      setCoupons(data.coupons || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    try {
      const res = await createAdminCouponApi({
        code,
        discountPercent: parseInt(discount),
        maxUses: parseInt(maxUses),
        validTill,
      });
      if (res.success) {
        setShowModal(false);
        setCode('');
        fetchCoupons();
      }
    } catch (err) {
      alert('Failed to create coupon');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-pink-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Discounts & Promo Coupons</h1>
            <p className="text-xs text-slate-500">Generate, manage, and monitor promotional discount coupons</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-[#F01472] hover:bg-pink-600 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-md transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create Coupon
          </button>
          <button
            onClick={fetchCoupons}
            className="px-4 py-2 bg-pink-50 hover:bg-pink-100 text-[#F01472] font-bold text-xs rounded-xl flex items-center gap-2 border border-pink-200 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Coupon List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {coupons.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl border border-pink-100 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-50 text-orange-700 font-black text-sm border border-orange-200">
                <Tag className="w-3.5 h-3.5" /> {c.code}
              </span>
              <span className={`text-xs font-black px-2.5 py-1 rounded-full ${c.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                {c.active ? 'ACTIVE' : 'EXPIRED'}
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-2">
              <span className="text-2xl font-black text-slate-900">{c.discountPercent}% OFF</span>
              <span className="text-xs text-slate-400 font-medium">Expires {c.validTill}</span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                style={{ width: `${Math.min(100, (c.uses / c.maxUses) * 100)}%` }}
                className="bg-orange-500 h-full rounded-full"
              />
            </div>
            <div className="flex justify-between text-[11px] font-bold text-slate-500">
              <span>{c.uses} Uses</span>
              <span>Max: {c.maxUses}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <form onSubmit={handleCreate} className="bg-white rounded-2xl p-6 max-w-md w-full border border-pink-100 space-y-4 shadow-xl">
            <h3 className="text-lg font-black text-slate-900">Create New Coupon</h3>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Coupon Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. FESTIVE30"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold uppercase focus:ring-2 focus:ring-pink-500 outline-none"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Discount %</label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-pink-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Max Redemptions</label>
                <input
                  type="number"
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-pink-500 outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Valid Till Date</label>
              <input
                type="date"
                value={validTill}
                onChange={(e) => setValidTill(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-pink-500 outline-none"
                required
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#F01472] hover:bg-pink-600 text-white font-extrabold text-xs shadow-md cursor-pointer"
              >
                Create Coupon
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
