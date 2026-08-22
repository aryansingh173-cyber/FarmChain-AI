'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sprout, 
  Truck, 
  ShoppingBag, 
  QrCode, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Award 
} from 'lucide-react';

interface UserRole {
  id: string;
  title: string;
  badge: string;
  headline: string;
  description: string;
  icon: React.ElementType;
  color: string;
  ctaText: string;
  ctaHref: string;
  benefits: string[];
  metric: {
    label: string;
    value: string;
  };
}

const USER_ROLES: UserRole[] = [
  {
    id: 'farmers',
    title: 'Farmers & Co-operatives',
    badge: 'Origin Producers',
    headline: 'Eliminate middleman deductions and earn true quality premiums',
    description: 'Use instant optical AI camera grading to prove Grade-A quality and lock guaranteed payments into automated smart contracts before dispatch.',
    icon: Sprout,
    color: 'emerald',
    ctaText: 'Open Farmer Dashboard',
    ctaHref: '/farmer',
    benefits: [
      'Instant AI crop quality certification in seconds',
      '+12% to +25% fair price premiums for Grade A produce',
      'Direct smart contract escrow payout (0 middleman cut)',
      'Automated dynamic QR batch labeling'
    ],
    metric: {
      label: 'Avg. Revenue Increase',
      value: '+22.4%'
    }
  },
  {
    id: 'logistics',
    title: 'Logistics & Fleet Carriers',
    badge: 'Cold-Chain Operators',
    headline: 'Automated IoT proof of temperature and friction-free handoffs',
    description: 'Connect IoT temperature and GPS sensors directly to blockchain oracles. Eliminate disputed spoilage claims with cryptographically sealed telemetry.',
    icon: Truck,
    color: 'amber',
    ctaText: 'Access Logistics Portal',
    ctaHref: '/logistics',
    benefits: [
      'Zero-dispute cold-chain compliance proof',
      'Real-time automated checkpoint updates',
      'Automated milestone settlement triggers',
      'Live IoT telemetry graphing and alert thresholds'
    ],
    metric: {
      label: 'Spoilage Claims Reduced',
      value: '-94%'
    }
  },
  {
    id: 'buyers',
    title: 'Wholesale Buyers & Supermarkets',
    badge: 'Commercial Buyers',
    headline: 'Guaranteed provenance and programmatic multi-sig escrow protection',
    description: 'Inspect exact farm origins, high-res AI defect maps, and cold-chain compliance before releasing smart contract funds with one click.',
    icon: ShoppingBag,
    color: 'cyan',
    ctaText: 'Enter Buyer Escrow Portal',
    ctaHref: '/buyer',
    benefits: [
      'Complete pre-dispatch AI inspection audit history',
      'Smart contract escrow locks funds safely',
      'Single-click delivery acceptance and settlement',
      'Complete traceability for organic & GI certifications'
    ],
    metric: {
      label: 'Procurement Time Saved',
      value: '4.8x Faster'
    }
  },
  {
    id: 'consumers',
    title: 'Everyday Consumers',
    badge: 'End Shoppers',
    headline: 'Total transparency: scan any fruit to know its complete journey',
    description: 'Scan packaging QR codes with any smartphone camera to see harvest date, origin farm satellite coordinates, and carbon footprint in 100ms.',
    icon: QrCode,
    color: 'teal',
    ctaText: 'Try Live Consumer Scan',
    ctaHref: '/verify/FC-2026-APL-8821',
    benefits: [
      'Zero app download required — instant web verification',
      'True farm origin, grower bio, and harvest timestamp',
      'Un-tamperable AI quality certificate',
      'Verifiable pesticide-free and organic status'
    ],
    metric: {
      label: 'Consumer Trust Index',
      value: '99.8%'
    }
  }
];

export default function TargetUsers() {
  const [activeTab, setActiveTab] = useState<string>('farmers');
  const activeRole = USER_ROLES.find(r => r.id === activeTab) || USER_ROLES[0];
  const Icon = activeRole.icon;

  return (
    <section className="py-24 relative overflow-hidden" id="target-users">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Award className="w-3.5 h-3.5" /> Built for the Entire Agricultural Value Chain
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Tailored Solutions for Every Stakeholder
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            From the farmer in the field to the family at the grocery store, FarmChain AI builds transparent trust at each step.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {USER_ROLES.map((role) => {
            const RoleIcon = role.icon;
            const isSelected = activeTab === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setActiveTab(role.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                  isSelected
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800'
                }`}
              >
                <RoleIcon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{role.title}</span>
              </button>
            );
          })}
        </div>

        {/* Highlight Card for Active Role */}
        <div className="glass-panel-glow rounded-3xl p-6 sm:p-10 border border-slate-700/60">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs uppercase font-bold tracking-widest text-emerald-400 font-mono">
                    {activeRole.badge}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {activeRole.title}
                  </h3>
                </div>
              </div>

              <p className="text-lg font-medium text-slate-200">
                {activeRole.headline}
              </p>

              <p className="text-sm text-slate-400 leading-relaxed">
                {activeRole.description}
              </p>

              {/* Benefits Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {activeRole.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <Link
                  href={activeRole.ctaHref}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-sm transition shadow-lg shadow-emerald-500/20 group"
                >
                  <span>{activeRole.ctaText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right Metric Stat Box */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
              <div className="bg-slate-950/90 rounded-2xl p-8 border border-slate-800 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                  Proven Field Impact
                </div>
                <div className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 my-4 font-mono">
                  {activeRole.metric.value}
                </div>
                <div className="text-sm font-semibold text-slate-200">
                  {activeRole.metric.label}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Measured across 1,200+ verified farm batches in 2026.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Tamper-Proof Audit
                </span>
                <span className="font-mono text-slate-300">Polygon Contract Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
