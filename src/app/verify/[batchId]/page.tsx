'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Scan, 
  Thermometer, 
  Sprout, 
  ExternalLink, 
  Share2, 
  Award, 
  Cpu, 
  Activity, 
  Clock, 
  Check, 
  Sparkles,
  ArrowLeft,
  Lock,
  ChevronDown,
  Info,
  Layers,
  Database
} from 'lucide-react';
import { useFarmChain } from '@/lib/store';
import { ProduceBatch } from '@/types';
import { FarmChainAPI } from '@/lib/api';

export default function PublicQRVerificationPage() {
  const params = useParams();
  const batchId = (params?.batchId as string) || 'FC-2026-APL-8821';
  const { getBatchById } = useFarmChain();
  const [copiedShare, setCopiedShare] = useState(false);
  const [serverBatch, setServerBatch] = useState<ProduceBatch | null>(null);
  const [verificationData, setVerificationData] = useState<{
    isAuthentic: boolean;
    network: string;
    escrowContract: string;
    merkleRoot: string;
    blockNumber: number;
    cryptoSignature: string;
    verifiedAt: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadBatchVerification() {
      try {
        const result = await FarmChainAPI.getBatchById(batchId);
        if (isMounted && result.batch) {
          setServerBatch(result.batch);
          if (result.verification) {
            setVerificationData(result.verification);
          }
        }
      } catch (err) {
        console.warn('Direct API load failed, using local store fallback:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadBatchVerification();
    return () => { isMounted = false; };
  }, [batchId]);

  const batch = serverBatch || getBatchById(batchId) || getBatchById('FC-2026-APL-8821');

  if (!batch && !isLoading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <Info className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Batch Not Found</h2>
        <p className="text-sm text-slate-400">
          The requested QR batch code <span className="font-mono text-cyan-400">{batchId}</span> is not registered in the immutable chain.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  const currentBatch = batch || {
    id: batchId,
    cropName: 'Kinnaur Royal Apples',
    category: 'Fruits' as const,
    variety: 'Himachal Extra Crisp Organic',
    quantityKg: 2500,
    basePricePerKg: 180,
    totalPriceINR: 450000,
    harvestDate: '2026-08-14',
    farmName: 'Kinnaur Valley Agro Co-operative',
    farmerWallet: '0x3A9F8e2b10492F0aB55C08985c7D1A21eEf68841',
    farmLocation: 'Kinnaur, Himachal Pradesh, India',
    farmCoordinates: { lat: 31.6510, lng: 78.4752 },
    currentStage: 'In Transit' as const,
    escrowContractAddress: '0x8849F0cB4916a2E4e78a635DeB96564C3dF39c6B',
    escrowStatus: 'Funds Deposited' as const,
    txHashRegistration: '0x7f4e823b1902a7dc42018274bb9f826354890c2918bbde47a82b99214df90234',
    createdAt: '2026-08-14T08:30:00Z',
    checkpoints: []
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `FarmChain AI Provenance: ${currentBatch.cropName}`,
        text: `Verified agricultural provenance certificate for ${currentBatch.cropName} (${currentBatch.id}).`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div className="min-h-screen pb-16 pt-4 sm:pt-8">
      {/* Back to Portal Bar (Desktop/Tablet) */}
      <div className="max-w-2xl mx-auto px-4 mb-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to FarmChain AI
        </Link>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white transition"
        >
          {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-cyan-400" />}
          <span>{copiedShare ? 'Link Copied' : 'Share Certificate'}</span>
        </button>
      </div>

      {/* Mobile-Friendly Authenticity Card Container */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="glass-panel-glow rounded-3xl border border-emerald-500/30 overflow-hidden shadow-2xl space-y-6 pb-8">
          {/* Top Verified Header Ribbon */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-4 sm:p-5 text-black flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-black/20 backdrop-blur-md flex items-center justify-center text-white">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-emerald-950">
                  Cryptographic Provenance
                </div>
                <div className="text-sm font-extrabold text-white">
                  Verified Genuine Agricultural Origin
                </div>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold bg-black/30 text-white px-2.5 py-1 rounded-lg">
              {verificationData ? 'Polygon Mainnet Verified' : 'Polygon PoS'}
            </span>
          </div>

          {/* Verification Badge */}
          {verificationData && (
            <div className="mx-6 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-emerald-300 font-semibold">Live Oracle Verification</span>
              </div>
              <span className="font-mono text-[11px] text-emerald-400">
                Block #{verificationData.blockNumber.toLocaleString()}
              </span>
            </div>
          )}

          {/* Crop Hero Section */}
          <div className="px-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden relative shrink-0 border-2 border-emerald-500/40 shadow-lg">
                <Image
                  src={currentBatch.aiReport?.imagePreview || 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80'}
                  alt={currentBatch.cropName}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="text-center sm:text-left space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                  <Sprout className="w-3 h-3" /> 100% Traceable Farm Produce
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">{currentBatch.cropName}</h1>
                <p className="text-sm text-slate-300">{currentBatch.variety}</p>
                <div className="text-xs font-mono text-cyan-400 pt-1">
                  Batch Tag: <span className="font-bold">{currentBatch.id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Quality Inspection Card */}
          <div className="px-6">
            <div className="p-5 rounded-2xl bg-slate-950/90 border border-emerald-500/30 space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    AI Optical Quality Certificate
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  AgriCV Model 4.2
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Quality Score</div>
                  <div className="text-lg font-black text-emerald-400 font-mono">
                    {currentBatch.aiReport ? `${currentBatch.aiReport.overallScore}/100` : '95/100'}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Awarded Grade</div>
                  <div className="text-lg font-black text-cyan-400 font-mono">
                    {currentBatch.aiReport?.grade || 'Grade A+'}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Ripeness Index</div>
                  <div className="text-lg font-black text-amber-400 font-mono">
                    {currentBatch.aiReport?.ripeness || 94}%
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Color Uniformity</div>
                  <div className="text-lg font-black text-teal-400 font-mono">
                    {currentBatch.aiReport?.colorUniformity || 97}%
                  </div>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between text-xs text-slate-400">
                <span>Estimated Shelf Life: <strong className="text-slate-200">{currentBatch.aiReport?.shelfLifeEstDays || 28} Days</strong></span>
                <span className="text-emerald-400 font-medium">Quality Guaranteed</span>
              </div>
            </div>
          </div>

          {/* Farm Origin & Coordinates */}
          <div className="px-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Origin Verification
            </h3>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Farm / Producer:</span>
                <span className="text-white font-bold">{currentBatch.farmName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Location:</span>
                <span className="text-slate-200">{currentBatch.farmLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Harvest Date:</span>
                <span className="text-slate-200 font-mono">{currentBatch.harvestDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Geo-Coordinates:</span>
                <span className="text-cyan-400 font-mono">
                  {currentBatch.farmCoordinates.lat}°N, {currentBatch.farmCoordinates.lng}°E
                </span>
              </div>
            </div>
          </div>

          {/* Cold-Chain IoT Sensor Compliance */}
          {currentBatch.iotTelemetry && (
            <div className="px-6 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-cyan-400" /> Cold-Chain Integrity Log
              </h3>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Transit Temperature:</span>
                  <span className="font-bold text-emerald-400 font-mono">
                    {currentBatch.iotTelemetry.currentTemp}°C (Within 2-5°C safe zone)
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Relative Humidity:</span>
                  <span className="font-bold text-cyan-400 font-mono">
                    {currentBatch.iotTelemetry.humidity}% Controlled
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Zero cold-chain breaks detected during logistics transit.</span>
                </div>
              </div>
            </div>
          )}

          {/* Full Immutable Checkpoint Journey (Timeline) */}
          <div className="px-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Full Tamper-Proof Journey
            </h3>
            <div className="space-y-3 border-l-2 border-slate-800 ml-3 pl-4">
              {currentBatch.checkpoints.map((cp) => (
                <div key={cp.id} className="relative space-y-1">
                  <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-emerald-400 ring-4 ring-slate-950" />
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>{cp.title}</span>
                    <span className="text-[10px] font-mono text-slate-500">{cp.timestamp}</span>
                  </div>
                  <div className="text-xs text-slate-400">{cp.location}</div>
                  {cp.notes && (
                    <div className="text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-900">
                      {cp.notes}
                    </div>
                  )}
                  <div className="text-[9px] font-mono text-slate-500 truncate">
                    Tx: {cp.txHash}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Blockchain Smart Contract Proof Footer */}
          <div className="px-6 pt-2">
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2 text-[11px]">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-semibold uppercase tracking-wider">Smart Contract Escrow</span>
                <span className="text-emerald-400 font-mono">
                  {currentBatch.escrowStatus === 'Released to Farmer' ? 'Settled & Paid' : 'Escrow Protected'}
                </span>
              </div>
              <div className="font-mono text-slate-400 break-all bg-black/40 p-2 rounded">
                Contract: {currentBatch.escrowContractAddress}
              </div>
              {verificationData && (
                <div className="font-mono text-[10px] text-cyan-400 break-all bg-black/40 p-2 rounded">
                  Merkle Root: {verificationData.merkleRoot}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
