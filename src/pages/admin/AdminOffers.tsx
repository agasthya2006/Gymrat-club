// src/pages/admin/AdminOffers.tsx
import React, { useState } from 'react';
import { Percent, Plus, CheckCircle2, Tag } from 'lucide-react';

export const AdminOffers: React.FC = () => {
  const [offers, setOffers] = useState([
    { id: 'ofr-1', name: 'WARRIOR WELCOME - 20% OFF FIRST 3 MONTHS', code: 'TITAN20', discount: 20, status: 'ACTIVE', expiry: '2026-10-31' },
    { id: 'ofr-2', name: 'ANNUAL LOCK-IN DISCOUNT (2 MONTHS FREE)', code: 'ANNUALVIP', discount: 17, status: 'ACTIVE', expiry: '2026-12-31' },
    { id: 'ofr-3', name: 'OLYMPIC SPRINT FALL SPECIAL', code: 'OLYMPIC15', discount: 15, status: 'ACTIVE', expiry: '2026-11-15' }
  ]);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [discount, setDiscount] = useState(15);
  const [expiry, setExpiry] = useState('2026-11-30');
  const [notice, setNotice] = useState<string | null>(null);

  const handleAddOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const newOffer = {
      id: `ofr-${Date.now()}`,
      name,
      code: code.toUpperCase(),
      discount: Number(discount),
      status: 'ACTIVE',
      expiry
    };
    setOffers(prev => [newOffer, ...prev]);
    setCode('');
    setName('');
    setNotice(`OFFER CAMPAIGN DEPLOYED // Code "${newOffer.code}" is active.`);
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-mono text-[#E1601B] uppercase tracking-widest block mb-1">
          PROMOTIONS & DISCOUNT PROTOCOLS
        </span>
        <h1 className="font-display text-3xl font-bold uppercase text-white tracking-tight">
          MEMBERSHIP OFFERS & PROMOS
        </h1>
        <p className="text-xs text-zinc-400">
          Create promotional voucher codes and seasonal athlete acquisition incentives.
        </p>
      </div>

      {notice && (
        <div className="p-4 bg-emerald-950/50 border border-emerald-500 rounded-xl flex items-center gap-3 text-emerald-300 font-mono text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Add Offer Form */}
      <div className="bg-[#14151C] border border-[#27272A] rounded-xl p-6 font-mono text-xs">
        <h2 className="font-display text-lg font-bold uppercase text-white mb-4 flex items-center gap-2">
          <Tag className="w-4 h-4 text-[#E1601B]" /> LAUNCH NEW PROMOTIONAL OFFER
        </h2>

        <form onSubmit={handleAddOffer} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div className="sm:col-span-2">
            <label className="block text-zinc-400 uppercase mb-1">CAMPAIGN TITLE</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="e.g. WINTER BULK CYCLE SPECIAL"
              className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-zinc-400 uppercase mb-1">PROMO CODE</label>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              required
              placeholder="e.g. BULK25"
              className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-white focus:outline-none uppercase"
            />
          </div>

          <div>
            <label className="block text-zinc-400 uppercase mb-1">DISCOUNT (%)</label>
            <input
              type="number"
              value={discount}
              onChange={e => setDiscount(Number(e.target.value))}
              className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-white focus:outline-none"
            />
          </div>

          <div className="sm:col-span-4 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#E1601B] hover:bg-[#FF7728] text-black font-display font-bold uppercase tracking-wider text-xs rounded transition-all"
            >
              DEPLOY CAMPAIGN
            </button>
          </div>
        </form>
      </div>

      {/* Offers List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
        {offers.map(o => (
          <div key={o.id} className="p-5 bg-[#14151C] border border-[#27272A] rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[10px] mb-2">
                <span className="px-2 py-0.5 bg-[#E1601B]/20 text-[#E1601B] font-bold rounded">
                  {o.discount}% DISCOUNT
                </span>
                <span className="text-emerald-400 font-bold">{o.status}</span>
              </div>
              <h3 className="font-display text-base font-bold text-white uppercase mb-2">
                {o.name}
              </h3>
              <div className="p-2.5 bg-[#0D0D11] border border-[#27272A] rounded text-center my-3">
                <span className="text-zinc-500 text-[10px] block">CODE</span>
                <span className="font-bold text-lg text-white tracking-widest">{o.code}</span>
              </div>
            </div>
            <div className="text-[10px] text-zinc-500 pt-2 border-t border-[#27272A]">
              EXPIRATION: {o.expiry}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
