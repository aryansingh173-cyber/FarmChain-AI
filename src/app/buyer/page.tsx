'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShoppingBag, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  ExternalLink, 
  Scan, 
  Truck, 
  Lock, 
  Unlock, 
  FileCheck2, 
  Sparkles, 
  Search, 
  Filter,
  Check
} from 'lucide-react';
import { useFarmChain } from '@/lib/store';
import { ProduceBatch } from '@/types';
import EscrowReleaseModal from '@/components/EscrowReleaseModal';

export default function BuyerPortal() {
  const { batches, walletBalance } = useFarmChain();
  const [selectedBatchForRelease, setSelectedBatchForRelease] = useState<ProduceBatch | null>(null);
  const [filterTab, setFilterTab] = useState<'all' | 'escrow-active' | 'settled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBatches = batches.filter((b) => {
    const matchesSearch = b.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.farmName.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterTab === 'escrow-active') return b.escrowStatus === 'Funds Deposited' || b.escrowStatus === 'Locked';
    if (filterTab === 'settled') return b.escrowStatus === 'Released to Farmer';
    return true;
  });

  const totalInEscrow = batches
    .filter((b) => b.escrowStatus === 'Funds Deposited' || b.escrowStatus === 'Locked')
    .reduce((acc, b) => acc + b.totalPriceINR, 0);

  const totalSettledFunds = batches
    .filter((b) => b.escrowStatus === 'Released to Farmer')
    .reduce((acc, b) => acc + b.totalPriceINR, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <ShoppingBag className="w-4 h-4" /> Wholesale Buyer &amp; Supermarket Portal
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            Smart Contract Escrow &amp; Procurement
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Audit harvest provenance and release escrow payments directly to farmers upon verified delivery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Buyer Treasury Balance</div>
            <div className="text-base font-black text-emerald-400 font-mono">
              ₹{walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })} INR
            </div>
          </div>
        </div>
      </div>

      {/* Summary Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Active Escrow Locked</div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">
            ₹{totalInEscrow.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <Lock className="w-3 h-3 text-cyan-400" /> Multi-Sig Protection Active
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Total Payouts Settled</div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            ₹{totalSettledFunds.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Direct Farmer Settlement
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Avg. AI Acceptance Rate</div>
          <div className="text-2xl sm:text-3xl font-black text-teal-400 font-mono">
            100%
          </div>
          <div className="text-[11px] text-teal-400">Zero Spoilage Disputes</div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              filterTab === 'all'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Orders ({batches.length})
          </button>
          <button
            onClick={() => setFilterTab('escrow-active')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              filterTab === 'escrow-active'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Escrow Active
          </button>
          <button
            onClick={() => setFilterTab('settled')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              filterTab === 'settled'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Settled &amp; Delivered
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search crop, ID, or farm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBatches.map((batch) => {
          const isSettled = batch.escrowStatus === 'Released to Farmer';

          return (
            <div
              key={batch.id}
              className={`glass-card rounded-3xl p-6 border flex flex-col justify-between space-y-6 ${
                isSettled ? 'border-emerald-500/30 bg-slate-900/40' : 'border-slate-800'
              }`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                    {batch.id}
                  </span>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 ${
                      isSettled
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    }`}
                  >
                    {isSettled ? (
                      <>
                        <Check className="w-3 h-3" /> Settled
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3" /> Escrow Locked
                      </>
                    )}
                  </span>
                </div>

                {/* Crop & Origin */}
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden relative shrink-0 border border-slate-700">
                    <Image
                      src={batch.aiReport?.imagePreview || 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80'}
                      alt={batch.cropName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{batch.cropName}</h4>
                    <p className="text-xs text-slate-400">{batch.farmName}</p>
                    <p className="text-[11px] text-slate-500">{batch.farmLocation}</p>
                  </div>
                </div>

                {/* AI Quality & Cold-Chain Specs */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400">AI Quality Grade</div>
                    <div className="font-bold text-emerald-400 font-mono mt-0.5">
                      {batch.aiReport ? `${batch.aiReport.overallScore}/100` : '95/100'} ({batch.aiReport?.grade || 'Grade A+'})
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Cold-Chain Temp</div>
                    <div className="font-bold text-cyan-400 font-mono mt-0.5">
                      {batch.iotTelemetry?.currentTemp || '3.8'}°C (Ideal)
                    </div>
                  </div>
                </div>

                {/* Escrow Value */}
                <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Escrow Value:</span>
                  <span className="text-base font-black text-white font-mono">
                    ₹{(batch.totalPriceINR || 0).toLocaleString('en-IN')} INR
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-3 border-t border-slate-800/80">
                {isSettled ? (
                  <div className="py-2.5 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Escrow Released to Farmer
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedBatchForRelease(batch)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition"
                  >
                    <Unlock className="w-4 h-4" /> Confirm Delivery &amp; Release Funds
                  </button>
                )}

                <Link
                  href={`/verify/${batch.id}`}
                  className="w-full py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" /> Inspect Provenance Ledger
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Escrow Release Modal */}
      {selectedBatchForRelease && (
        <EscrowReleaseModal
          batch={selectedBatchForRelease}
          isOpen={!!selectedBatchForRelease}
          onClose={() => setSelectedBatchForRelease(null)}
        />
      )}
    </div>
  );
}
