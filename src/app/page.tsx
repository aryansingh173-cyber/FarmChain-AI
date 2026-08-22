'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sprout, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Truck, 
  ShoppingBag, 
  QrCode, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp, 
  Activity,
  Lock,
  ChevronRight,
  Database,
  Search
} from 'lucide-react';
import gsap from 'gsap';
import WorkflowSection from '@/components/WorkflowSection';
import TargetUsers from '@/components/TargetUsers';
import { useFarmChain } from '@/lib/store';

export default function LandingPage() {
  const { batches } = useFarmChain();
  const heroHeadingRef = useRef<HTMLHeadingElement>(null);
  const heroSubRef = useRef<HTMLParagraphElement>(null);
  const heroBadgesRef = useRef<HTMLDivElement>(null);
  const heroCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const timer = setTimeout(() => {
      if (heroHeadingRef.current && heroSubRef.current && heroBadgesRef.current && heroCardRef.current) {
        gsap.fromTo(
          heroHeadingRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
        );
        gsap.fromTo(
          heroSubRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, delay: 0.15, ease: 'power3.out' }
        );
        gsap.fromTo(
          heroBadgesRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.7, delay: 0.25, ease: 'power3.out' }
        );
        gsap.fromTo(
          heroCardRef.current,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.8, delay: 0.35, ease: 'power3.out' }
        );
      }
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="pt-8 sm:pt-16 pb-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Top Pill Badge */}
            <div
              ref={heroBadgesRef}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider shadow-lg shadow-emerald-500/10"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Next-Gen Agricultural Blockchain Protocol</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-slate-400 normal-case font-normal font-mono">Polygon PoS &amp; Edge AI</span>
            </div>

            {/* Main Headline */}
            <h1
              ref={heroHeadingRef}
              className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]"
            >
              From Farm to Market — <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Verified, Transparent, and Fair
              </span>
            </h1>

            {/* Subheading */}
            <p
              ref={heroSubRef}
              className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
            >
              Bridging regenerative growers and global wholesale buyers with instant computer vision AI quality grading, immutable cold-chain telemetry, and trustless smart contract escrow.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/farmer"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-extrabold text-sm sm:text-base flex items-center gap-2 shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition duration-200"
              >
                <Sprout className="w-5 h-5" /> Launch Farmer Portal <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/buyer"
                className="px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm sm:text-base border border-slate-700 hover:border-slate-600 transition flex items-center gap-2"
              >
                <ShoppingBag className="w-5 h-5 text-cyan-400" /> Buyer Escrow Vault
              </Link>
              <Link
                href="/verify/FC-2026-APL-8821"
                className="px-6 py-4 rounded-2xl bg-slate-900/40 hover:bg-slate-900 text-slate-400 hover:text-emerald-400 font-semibold text-sm border border-slate-800 transition flex items-center gap-2"
              >
                <QrCode className="w-4 h-4" /> Try Consumer QR Scan
              </Link>
            </div>

            {/* Live Stats Row */}
            <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">₹35 Cr+</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Escrow Funds Settled</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
                <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">18,500+</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Tons Produce Verified</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
                <div className="text-2xl sm:text-3xl font-black text-teal-400 font-mono">99.4%</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">AI Grading Accuracy</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
                <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">0.00s</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Payment Dispute Lag</div>
              </div>
            </div>
          </div>

          {/* Interactive Live Hero Showcase Card */}
          <div ref={heroCardRef} className="mt-14 max-w-5xl mx-auto">
            <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-emerald-500/30 relative overflow-hidden shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      Live Blockchain Produce Pipeline
                    </h3>
                    <p className="text-xs text-slate-400">
                      Real-time synchronized state across Farmer, Logistics &amp; Buyer portals
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono text-emerald-400 font-semibold">Active Batches: {batches.length}</span>
                </div>
              </div>

              {/* Sample Batch Snapshot Row */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {batches.slice(0, 3).map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition space-y-3 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-cyan-400">{b.id}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                        {b.currentStage}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0">
                        <Image
                          src={b.aiReport?.imagePreview || 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80'}
                          alt={b.cropName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white group-hover:text-emerald-300 transition">
                          {b.cropName}
                        </div>
                        <div className="text-xs text-slate-400">{b.farmName}</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Escrow Value:</span>
                      <span className="font-mono font-bold text-white">₹{(b.totalPriceINR || 0).toLocaleString('en-IN')}</span>
                    </div>

                    <Link
                      href={`/verify/${b.id}`}
                      className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <QrCode className="w-3.5 h-3.5 text-emerald-400" /> Verify Provenance
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7-Step Visual Workflow Section */}
      <WorkflowSection />

      {/* Target Users Section */}
      <TargetUsers />

      {/* Trust & Architecture Showcase */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-800">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" /> Zero Middleman Extraction
                </div>
                <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
                  Why Agricultural Blockchain Matters
                </h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Traditional agricultural supply chains lose up to 30% of value to intermediaries, delayed payments, and arbitrary quality rejections. FarmChain AI replaces uncertainty with immutable smart contracts and algorithmic computer vision verification.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Instant escrow release directly to farmer upon delivery receipt</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Real-time Cold-chain IoT threshold validation with GPS oracles</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Public consumer QR verification without requiring wallet or apps</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <Cpu className="w-7 h-7 text-cyan-400" />
                  <h4 className="text-base font-bold text-white">Computer Vision AI</h4>
                  <p className="text-xs text-slate-400">
                    Deep neural models analyze optical harvest imagery for blemish, caliber, and ripeness.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <Lock className="w-7 h-7 text-purple-400" />
                  <h4 className="text-base font-bold text-white">Smart Escrow Vaults</h4>
                  <p className="text-xs text-slate-400">
                    Multi-sig smart contracts lock buyer deposits and disburse funds with zero latency.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <Activity className="w-7 h-7 text-amber-400" />
                  <h4 className="text-base font-bold text-white">IoT Cold Oracles</h4>
                  <p className="text-xs text-slate-400">
                    Sensors stream temperature and humidity telemetry directly to the blockchain ledger.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <QrCode className="w-7 h-7 text-emerald-400" />
                  <h4 className="text-base font-bold text-white">Dynamic QR Tags</h4>
                  <p className="text-xs text-slate-400">
                    Every batch receives a dynamic cryptographically anchored label for retail scanning.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-cyan-950/80 p-8 sm:p-14 border border-emerald-500/30 text-center space-y-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-cyber-grid bg-[size:24px_24px] opacity-20 pointer-events-none" />
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              Ready to Experience Decentralized Agriculture?
            </h3>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
              Test out the Farmer harvest registration, Logistics checkpoint advancing, Buyer escrow release, and Public QR verification right now.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/farmer"
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold text-sm shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition"
              >
                Register a Harvest Batch
              </Link>
              <Link
                href="/logistics"
                className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition"
              >
                Track Logistics Fleet
              </Link>
              <Link
                href="/buyer"
                className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-sm font-semibold border border-slate-700 transition"
              >
                Review Buyer Escrow
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
