'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sprout, 
  Scan, 
  Blocks, 
  Truck, 
  FileCode2, 
  Store, 
  QrCode, 
  ArrowRight, 
  CheckCircle, 
  Sparkles, 
  Cpu, 
  ShieldCheck, 
  Activity, 
  ChevronRight,
  Play,
  Pause
} from 'lucide-react';
import gsap from 'gsap';

export interface WorkflowStep {
  step: number;
  title: string;
  shortDesc: string;
  detailedDesc: string;
  icon: React.ElementType;
  badgeColor: string;
  accentColor: string;
  technicalDetails: {
    protocol: string;
    throughput: string;
    verifiableProof: string;
  };
  metrics: {
    label: string;
    value: string;
  }[];
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    step: 1,
    title: 'Harvest & Geotag',
    shortDesc: 'Produce harvested and geo-tagged at origin farm',
    detailedDesc: 'Farmer logs batch yield, crop variety, and GPS coordinates directly at harvest. Origin timestamp and farm identity are cryptographically sealed.',
    icon: Sprout,
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    accentColor: '#10b981',
    technicalDetails: {
      protocol: 'ERC-1155 Batch Metadata Minting',
      throughput: '< 1.2s local cryptographic sign',
      verifiableProof: 'GPS Geofence + Farmer Wallet Sig'
    },
    metrics: [
      { label: 'Origin GPS', value: '46.6021° N, 120.5059° W' },
      { label: 'Field Brix', value: '14.2° Optimal Sugar' },
      { label: 'Harvest Date', value: 'Aug 14, 2026 08:30 UTC' }
    ]
  },
  {
    step: 2,
    title: 'AI Quality Check',
    shortDesc: 'Edge Computer Vision scans ripeness & defects',
    detailedDesc: 'Optical sensors and neural nets analyze color distribution, size uniformity, and surface blemishes. An unbiased AI Grade (A/B/C) and score (0-100) are generated.',
    icon: Scan,
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    accentColor: '#06b6d4',
    technicalDetails: {
      protocol: 'AgriVision YOLOv10-Agro Neural Model',
      throughput: '42 FPS real-time conveyor grading',
      verifiableProof: 'IPFS Hash of Inference Snapshot'
    },
    metrics: [
      { label: 'AI Score', value: '95/100 Grade A+' },
      { label: 'Blemish Detection', value: '0.0% Fungal / 0.1% Cosmetic' },
      { label: 'Fair Premium', value: '+14% Farmer Bonus' }
    ]
  },
  {
    step: 3,
    title: 'Blockchain Record',
    shortDesc: 'Immutable batch token minted on Polygon',
    detailedDesc: 'AI grade score, batch size, and farm credentials are tokenized into an immutable on-chain smart contract record. Zero tampering possible.',
    icon: Blocks,
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    accentColor: '#6366f1',
    technicalDetails: {
      protocol: 'Polygon PoS / Ethereum State Bridge',
      throughput: '0.002 MATIC average gas cost',
      verifiableProof: '0x7f4e823b...4df90234 Block #592019'
    },
    metrics: [
      { label: 'Chain State', value: 'Polygon Finalized' },
      { label: 'Block Time', value: '2.1s confirmation' },
      { label: 'Tamper Index', value: '0.00% Immutable' }
    ]
  },
  {
    step: 4,
    title: 'Logistics & IoT Cold-Chain',
    shortDesc: 'Live temperature, humidity & GPS telemetry',
    detailedDesc: 'Refrigerated carrier trucks transmit continuous telemetry data to smart contract oracles. If temperature exceeds 6°C threshold, alert triggers automatically.',
    icon: Truck,
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    accentColor: '#f59e0b',
    technicalDetails: {
      protocol: 'Chainlink IoT Oracle Gateway',
      throughput: '5-minute heartbeat telemetry telemetry',
      verifiableProof: 'Sensirion SHT40 Cryptographic Sensor'
    },
    metrics: [
      { label: 'Cold Temp', value: '3.8°C (Ideal: 2-5°C)' },
      { label: 'Humidity', value: '89% Controlled RH' },
      { label: 'Transit G-Force', value: '0.2G Smooth Route' }
    ]
  },
  {
    step: 5,
    title: 'Smart Contract Escrow',
    shortDesc: 'Buyer payment securely locked in escrow',
    detailedDesc: 'Wholesale buyer deposits purchase funds into a transparent smart contract escrow. Funds are strictly programmatic and immune to unauthorized withholding.',
    icon: FileCode2,
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    accentColor: '#a855f7',
    technicalDetails: {
      protocol: 'Multi-Sig Escrow Vault Contract v2.4',
      throughput: 'Instant lock upon dispatch',
      verifiableProof: '0x8849F0...39c6B Escrow Locked'
    },
    metrics: [
      { label: 'Escrow Locked', value: '₹4,50,000.00 INR' },
      { label: 'Intermediary Cut', value: '0.0% (Zero Broker Fee)' },
      { label: 'Release Trigger', value: 'Buyer Receipt & QC' }
    ]
  },
  {
    step: 6,
    title: 'Market & Delivery',
    shortDesc: 'Physical batch arrives at wholesale market/supermarket',
    detailedDesc: 'Supermarket receiving docks scan the incoming batch. Proof of physical condition is validated against initial harvest AI snapshot, releasing payment.',
    icon: Store,
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    accentColor: '#10b981',
    technicalDetails: {
      protocol: 'Instant Token Settlement & Burn/Distribute',
      throughput: 'Instantaneous Automated Payout',
      verifiableProof: 'Multi-Sig Confirmation Signature'
    },
    metrics: [
      { label: 'Settlement Time', value: '< 3 seconds' },
      { label: 'Farmer Direct Pay', value: '100% Net Proceeds' },
      { label: 'Freshness Shelf-Life', value: '28 Days Remaining' }
    ]
  },
  {
    step: 7,
    title: 'Consumer QR Scan',
    shortDesc: 'Shoppers scan QR on packaging for complete truth',
    detailedDesc: 'Consumers scan the dynamic QR code on the fruit label to view farm origin story, date picked, real AI grading report, and carbon offset certificate.',
    icon: QrCode,
    badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    accentColor: '#14b8a6',
    technicalDetails: {
      protocol: 'Public Web3 Verifier App (Zero Web3 App required)',
      throughput: 'Sub-300ms mobile edge response',
      verifiableProof: 'Public Polygon Blockchain Explorer Link'
    },
    metrics: [
      { label: 'Consumer Trust', value: '100% Cryptographic Proof' },
      { label: 'Carbon Trace', value: '0.14 kg CO2e / kg' },
      { label: 'Authenticity', value: 'Certified Organic GI' }
    ]
  }
];

export default function WorkflowSection() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const cardRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);

  const currentStepData = WORKFLOW_STEPS[activeStep - 1];

  // Auto progression timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev % WORKFLOW_STEPS.length) + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // GSAP animation when active step changes
  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0.4, y: 15, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [activeStep]);

  return (
    <section className="py-24 relative overflow-hidden" id="workflow">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Complete 7-Step Provenance Lifecycle
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            How Produce Moves from <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Farm Seed to Consumer Table
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            A seamless, cryptographically verified pipeline eliminating intermediaries, preventing food fraud, and ensuring fair price discovery at every milestone.
          </p>

          {/* Autoplay toggle */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-emerald-400 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 transition"
            >
              {isPlaying ? <Pause className="w-3 h-3 text-emerald-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
              <span>{isPlaying ? 'Auto-Advancing (Click to Pause)' : 'Paused (Click to Auto-Play)'}</span>
            </button>
          </div>
        </div>

        {/* 7-Step Horizontal Progress Pipeline Bar */}
        <div className="mb-12">
          {/* Desktop/Tablet Stepper */}
          <div className="relative">
            {/* Background connecting track */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0 hidden lg:block rounded-full" />
            
            {/* Animated Active Track */}
            <div 
              className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-teal-400 -translate-y-1/2 z-0 hidden lg:block rounded-full transition-all duration-500"
              style={{ width: `${((activeStep - 1) / (WORKFLOW_STEPS.length - 1)) * 100}%` }}
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 relative z-10">
              {WORKFLOW_STEPS.map((s) => {
                const Icon = s.icon;
                const isActive = activeStep === s.step;
                const isPassed = activeStep > s.step;

                return (
                  <button
                    key={s.step}
                    onClick={() => {
                      setActiveStep(s.step);
                      setIsPlaying(false);
                    }}
                    className={`flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl transition-all duration-300 relative group ${
                      isActive
                        ? 'bg-slate-900 border-2 border-emerald-400 shadow-xl shadow-emerald-500/20 scale-105'
                        : isPassed
                        ? 'bg-slate-900/90 border border-emerald-500/40 hover:border-emerald-400/80'
                        : 'bg-slate-900/40 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Step Number & Icon Circle */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2.5 transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-tr from-emerald-500 to-cyan-500 text-black font-bold shadow-lg shadow-emerald-500/40'
                          : isPassed
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                      }`}
                    >
                      {isPassed ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>

                    {/* Step label */}
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Step 0{s.step}
                    </span>
                    <span
                      className={`text-xs font-semibold mt-0.5 line-clamp-1 ${
                        isActive ? 'text-emerald-300' : 'text-slate-300'
                      }`}
                    >
                      {s.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dynamic Step Detail Card (GSAP Animated) */}
        <div
          ref={cardRef}
          className="glass-panel-glow rounded-3xl p-6 sm:p-8 lg:p-10 border border-emerald-500/30 relative overflow-hidden"
        >
          {/* Top accent bar */}
          <div
            className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Step Overview & Description */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest font-mono">
                  PHASE 0{currentStepData.step} OF 07
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {currentStepData.technicalDetails.protocol}
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {currentStepData.title}
                </h3>
                <p className="text-emerald-400 font-medium text-sm sm:text-base mt-1">
                  {currentStepData.shortDesc}
                </p>
                <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
                  {currentStepData.detailedDesc}
                </p>
              </div>

              {/* Verified Proof Badges */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Cryptographic Verification Anchor
                </div>
                <div className="text-xs font-mono text-emerald-300 bg-black/40 p-2.5 rounded-lg border border-slate-800 break-all">
                  {currentStepData.technicalDetails.verifiableProof}
                </div>
              </div>

              {/* Step Navigation Controls */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setActiveStep((prev) => (prev === 1 ? WORKFLOW_STEPS.length : prev - 1));
                    setIsPlaying(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Previous Step
                </button>
                <button
                  onClick={() => {
                    setActiveStep((prev) => (prev % WORKFLOW_STEPS.length) + 1);
                    setIsPlaying(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                  Next Step <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right: Live Simulated Metrics & Telemetry Display */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-950/80 rounded-2xl p-6 border border-slate-800 shadow-2xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Live Step Telemetry
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400">Node Sync: 100%</span>
                </div>

                <div className="mt-4 space-y-3.5">
                  {currentStepData.metrics.map((m, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/70 border border-slate-800/80">
                      <span className="text-xs text-slate-400">{m.label}</span>
                      <span className="text-xs font-semibold text-slate-100 font-mono">{m.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>Throughput:</span>
                  <span className="text-cyan-400 font-mono">{currentStepData.technicalDetails.throughput}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
