'use client';

import React from 'react';
import Link from 'next/link';
import { Sprout, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 text-center">
      <div className="glass-panel-glow rounded-3xl p-8 sm:p-12 max-w-lg w-full space-y-6 border border-emerald-500/30">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
          <ShieldAlert className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest">404 Error</div>
          <h2 className="text-3xl font-black text-white">Page Not Found</h2>
          <p className="text-sm text-slate-300">
            The page or batch route you are looking for does not exist on the FarmChain AI network.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Sprout className="w-4 h-4" /> Go to Home
          </Link>
          <Link
            href="/farmer"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Farmer Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
