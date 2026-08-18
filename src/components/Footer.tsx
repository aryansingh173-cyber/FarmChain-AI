import React from 'react';
import Link from 'next/link';
import { Sprout, ShieldCheck, Cpu, Database, Github, Twitter, Linkedin, Activity, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-emerald-900/40 bg-[#020906] text-slate-400 mt-20 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-lime-400 p-[1px] shadow-lg shadow-emerald-500/20">
                <div className="w-full h-full bg-[#090e17] rounded-[11px] flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                FarmChain <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">AI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Empowering global agriculture with tamper-proof blockchain provenance, computer vision AI grading, and trustless smart contract escrow payments.
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-emerald-400">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <Activity className="w-3 h-3 animate-pulse text-emerald-400" /> Polygon PoS Contract Live
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Sparkles className="w-3 h-3 text-cyan-400" /> AgriCV Model 4.2 Active
              </span>
            </div>
          </div>

          {/* Col 3: Portals */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Portals</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/farmer" className="hover:text-emerald-400 transition">Farmer Dashboard</Link>
              </li>
              <li>
                <Link href="/logistics" className="hover:text-emerald-400 transition">Logistics Gateway</Link>
              </li>
              <li>
                <Link href="/buyer" className="hover:text-emerald-400 transition">Buyer Escrow Portal</Link>
              </li>
              <li>
                <Link href="/verify/FC-2026-APL-8821" className="hover:text-emerald-400 transition">Consumer QR Verification</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Technology */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Tech Ecosystem</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Smart Escrow Contracts</span>
              </li>
              <li className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Edge AI Defect Vision</span>
              </li>
              <li className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-amber-400" />
                <span>Cold-Chain IoT Oracles</span>
              </li>
              <li className="flex items-center gap-2">
                <Sprout className="w-3.5 h-3.5 text-lime-400" />
                <span>Fair Trade FairPrice Algo</span>
              </li>
            </ul>
          </div>

          {/* Col 5: Security & Transparency */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Protocol Security</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              All batch hashes are cryptographically signed at harvest point and verified by multi-sig buyer release conditions.
            </p>
            <div className="pt-2">
              <div className="text-[11px] font-mono text-slate-500 bg-slate-900/90 p-2 rounded-lg border border-slate-800 break-all">
                Contract: 0x8849F0cB4916a2E4e78a635DeB96564C3dF39c6B
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FarmChain AI Protocol. All rights reserved. Open-source agro-chain standard.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 transition cursor-pointer">Security Audits</span>
            <span className="hover:text-slate-300 transition cursor-pointer">Whitepaper</span>
            <span className="hover:text-slate-300 transition cursor-pointer">Developer Docs</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
