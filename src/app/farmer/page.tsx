'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Sprout, 
  PlusCircle, 
  Scan, 
  QrCode, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  MapPin, 
  Calendar, 
  Scale, 
  FileText,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { useFarmChain } from '@/lib/store';
import { AIQualityReport, ProduceBatch, BatchStage } from '@/types';
import AICropScanner from '@/components/AICropScanner';
import BatchQRModal from '@/components/BatchQRModal';

export default function FarmerDashboard() {
  const { batches, addBatch, activeWallet } = useFarmChain();
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [selectedBatchForQR, setSelectedBatchForQR] = useState<ProduceBatch | null>(null);

  // Form State
  const [cropName, setCropName] = useState('Kinnaur Royal Apples');
  const [category, setCategory] = useState<'Fruits' | 'Vegetables' | 'Grains' | 'Dairy' | 'Cash Crops'>('Fruits');
  const [variety, setVariety] = useState('Himachal Extra Crisp Organic');
  const [quantityKg, setQuantityKg] = useState<number>(2000);
  const [basePricePerKg, setBasePricePerKg] = useState<number>(180);
  const [farmName, setFarmName] = useState('Kinnaur Valley Agro Co-op');
  const [farmLocation, setFarmLocation] = useState('Kinnaur, Himachal Pradesh, India');
  const [harvestDate, setHarvestDate] = useState('2026-08-18');
  const [aiReport, setAiReport] = useState<AIQualityReport | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdSuccessBatch, setCreatedSuccessBatch] = useState<ProduceBatch | null>(null);

  const totalPriceINR = quantityKg * basePricePerKg;

  // Handle AI Report callback from scanner
  const handleGradingComplete = (report: AIQualityReport) => {
    setAiReport(report);
  };

  const handleRegisterBatch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newBatch = addBatch(
        {
          cropName,
          category,
          variety,
          quantityKg: Number(quantityKg),
          basePricePerKg: Number(basePricePerKg),
          totalPriceINR,
          harvestDate,
          farmName,
          farmerWallet: activeWallet,
          farmLocation,
          farmCoordinates: { lat: 31.6510, lng: 78.4752 },
          currentStage: aiReport ? 'Quality Checked' : 'Registered',
        },
        aiReport || undefined
      );

      setIsSubmitting(false);
      setCreatedSuccessBatch(newBatch);
      setShowRegisterForm(false);
    }, 600);
  };

  // Farmer metrics
  const totalVolumeKg = batches.reduce((acc, b) => acc + b.quantityKg, 0);
  const pendingEscrow = batches
    .filter(b => b.escrowStatus === 'Funds Deposited' || b.escrowStatus === 'Locked')
    .reduce((acc, b) => acc + b.totalPriceINR, 0);
  const totalSettled = batches
    .filter(b => b.escrowStatus === 'Released to Farmer')
    .reduce((acc, b) => acc + b.totalPriceINR, 0);
  const avgQuality = Math.round(
    batches.reduce((acc, b) => acc + (b.aiReport?.overallScore || 90), 0) / (batches.length || 1)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
            <Sprout className="w-4 h-4" /> Origin Farmer Portal
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            Farmer Harvest &amp; Produce Hub
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Mint immutable crop batches, run real-time AI computer vision quality inspections, and generate dynamic retail QR tags.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setShowRegisterForm(!showRegisterForm);
              setCreatedSuccessBatch(null);
            }}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition"
          >
            <PlusCircle className="w-4 h-4" />
            {showRegisterForm ? 'Close Registration Form' : 'Register New Harvest'}
          </button>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Total Registered Batches</div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">{batches.length}</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Polygon Verified
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Avg. AI Quality Score</div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">
            {avgQuality}/100 <span className="text-sm font-semibold text-cyan-300">Grade A</span>
          </div>
          <div className="text-[11px] text-cyan-400">Optimum Export Grade</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Pending Escrow Lock</div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
            ₹{pendingEscrow.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400">Locked in smart contract</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Settled &amp; Paid Direct</div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            ₹{totalSettled.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-400">100% Payout Complete</div>
        </div>
      </div>

      {/* Success Banner when batch is created */}
      {createdSuccessBatch && (
        <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                Batch #{createdSuccessBatch.id} Successfully Minted on Chain!
              </h4>
              <p className="text-xs text-slate-300">
                {createdSuccessBatch.cropName} ({createdSuccessBatch.quantityKg.toLocaleString()} kg) is registered with AI Grade: {createdSuccessBatch.aiReport?.grade || 'Grade A'}.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedBatchForQR(createdSuccessBatch)}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-1.5 shadow"
          >
            <QrCode className="w-4 h-4" /> View Dynamic QR Code
          </button>
        </div>
      )}

      {/* Produce Registration Section (With AI Computer Vision Grading) */}
      {showRegisterForm && (
        <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-emerald-500/30 space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-400" /> New Produce Registration Form
              </h3>
              <p className="text-xs text-slate-400">
                Step 1: Perform AI quality inspection. Step 2: Seal metadata into Polygon blockchain.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
              Gas Estimate: ~0.0018 MATIC
            </span>
          </div>

          {/* AI Crop Scanner Integrated Component */}
          <div>
            <AICropScanner onGradingComplete={handleGradingComplete} selectedCropName={cropName} />
          </div>

          {/* Form Fields */}
          <form onSubmit={handleRegisterBatch} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Crop Name */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Crop Name</label>
                <input
                  type="text"
                  required
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  placeholder="e.g. Organic Gala Apples"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Fruits">Fruits</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Grains">Grains</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Cash Crops">Cash Crops</option>
                </select>
              </div>

              {/* Variety */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Cultivar / Variety</label>
                <input
                  type="text"
                  required
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  placeholder="e.g. Royal Gala Heritage Crisp"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Quantity (kg)</label>
                <input
                  type="number"
                  min="10"
                  step="10"
                  required
                  value={quantityKg}
                  onChange={(e) => setQuantityKg(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>

              {/* Base Price per kg */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Base Price / kg (₹ INR)</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={basePricePerKg}
                  onChange={(e) => setBasePricePerKg(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>

              {/* Total Calculation */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Expected Escrow Payout</label>
                <div className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 font-mono font-bold text-sm">
                  ₹{totalPriceINR.toLocaleString('en-IN')} INR
                </div>
              </div>

              {/* Farm Name */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Farm / Co-op Name</label>
                <input
                  type="text"
                  required
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Farm Location */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Origin Location (City/Region)</label>
                <input
                  type="text"
                  required
                  value={farmLocation}
                  onChange={(e) => setFarmLocation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Harvest Date */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Harvest Date</label>
                <input
                  type="date"
                  required
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Submission Actions */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowRegisterForm(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition"
              >
                <ShieldCheck className="w-4 h-4" />
                {isSubmitting ? 'Minting Polygon Token...' : 'Mint Batch & Seal Provenance'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Batch Status Cards List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" /> Active Produce Batches
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Displaying {batches.length} Registered Lots
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map((batch) => {
            const stages: BatchStage[] = ['Registered', 'Quality Checked', 'In Transit', 'Delivered'];
            const currentStageIndex = stages.indexOf(batch.currentStage as any);

            return (
              <div
                key={batch.id}
                className="glass-card rounded-3xl p-6 space-y-5 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: ID and QR Button */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-mono font-bold text-cyan-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                      {batch.id}
                    </span>
                    <button
                      onClick={() => setSelectedBatchForQR(batch)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 border border-slate-700 transition"
                      title="Open Dynamic QR Code"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Crop Header */}
                  <div className="mt-4 flex items-center gap-3">
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
                      <p className="text-xs text-slate-400">{batch.variety}</p>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        {batch.quantityKg.toLocaleString()} kg @ ₹{batch.basePricePerKg}/kg
                      </span>
                    </div>
                  </div>

                  {/* AI Quality Score Badge */}
                  <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Scan className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs text-slate-400">AI Quality Score</span>
                    </div>
                    <span className="text-xs font-bold font-mono text-emerald-400">
                      {batch.aiReport ? `${batch.aiReport.overallScore}/100 (${batch.aiReport.grade})` : '92/100 Grade A'}
                    </span>
                  </div>

                  {/* 4-Stage Timeline Tracking */}
                  <div className="mt-5 space-y-2">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Provenance Stage Timeline
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {stages.map((stageName, idx) => {
                        const isDone = currentStageIndex >= idx || batch.currentStage === 'Settled';
                        const isCurrent = stages[currentStageIndex] === stageName;

                        return (
                          <div key={stageName} className="flex flex-col items-center gap-1">
                            <div
                              className={`w-full h-1.5 rounded-full transition-all ${
                                isDone
                                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                                  : 'bg-slate-800'
                              }`}
                            />
                            <span
                              className={`text-[9px] text-center font-medium leading-tight ${
                                isCurrent
                                  ? 'text-emerald-400 font-bold'
                                  : isDone
                                  ? 'text-slate-300'
                                  : 'text-slate-600'
                              }`}
                            >
                              {stageName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Expected Payment & Links */}
                <div className="pt-4 border-t border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Expected Escrow Payout:</span>
                    <span className="font-mono font-bold text-base text-white">
                      ₹{(batch.totalPriceINR || 0).toLocaleString('en-IN')} INR
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedBatchForQR(batch)}
                      className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <QrCode className="w-3.5 h-3.5 text-emerald-400" /> QR Label
                    </button>
                    <Link
                      href={`/verify/${batch.id}`}
                      className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Provenance
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* QR Code Modal */}
      {selectedBatchForQR && (
        <BatchQRModal
          batch={selectedBatchForQR}
          isOpen={!!selectedBatchForQR}
          onClose={() => setSelectedBatchForQR(null)}
        />
      )}
    </div>
  );
}
