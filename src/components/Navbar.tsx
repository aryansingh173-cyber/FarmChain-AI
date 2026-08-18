'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sprout, 
  Layers, 
  Truck, 
  ShoppingBag, 
  QrCode, 
  Bell, 
  Wallet, 
  Menu, 
  X, 
  ExternalLink,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { useFarmChain } from '@/lib/store';

export default function Navbar() {
  const pathname = usePathname();
  const { activeWallet, notifications, resetToDefault } = useFarmChain();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const navLinks = [
    { name: 'Overview', href: '/', icon: Layers },
    { name: 'Farmer Portal', href: '/farmer', icon: Sprout },
    { name: 'Logistics Portal', href: '/logistics', icon: Truck },
    { name: 'Buyer Escrow', href: '/buyer', icon: ShoppingBag },
    { name: 'Public QR Verify', href: '/verify/FC-2026-APL-8821', icon: QrCode },
  ];

  const handleReset = () => {
    resetToDefault();
    setShowResetConfirm(true);
    setTimeout(() => setShowResetConfirm(false), 2000);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#030d08]/85 border-b border-emerald-900/40 transition-all shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-lime-400 p-[1px] shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all duration-300">
              <div className="w-full h-full bg-[#04140d] rounded-[11px] flex items-center justify-center">
                <Sprout className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                FarmChain <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">AI</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-emerald-400/80 -mt-1">
                Decentralized Agro-Trust
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#04150e]/80 p-1.5 rounded-full border border-emerald-900/50 shadow-inner">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Reset Seed Data Button */}
            <button
              onClick={handleReset}
              title="Reset Demo Data"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all text-xs flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {showResetConfirm ? (
                <span className="text-emerald-400 text-xs">Reset!</span>
              ) : (
                <span className="text-xs text-slate-400">Seed</span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition relative"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-400 rounded-full" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-sm font-semibold text-white flex items-center gap-2">
                      <Bell className="w-4 h-4 text-emerald-400" /> Live Chain Events
                    </span>
                    <span className="text-xs text-slate-400">{notifications.length} updates</span>
                  </div>
                  <div className="mt-3 space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {notifications.map((notif, idx) => (
                      <div key={idx} className="text-xs p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/40 text-slate-300 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <div className="flex-1 leading-relaxed">{notif}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Simulated Web3 Wallet Badge */}
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-emerald-500/30 shadow-inner">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Polygon</span>
              </div>
              <div className="h-4 w-[1px] bg-slate-800" />
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
                <Wallet className="w-3.5 h-3.5 text-slate-400" />
                <span>{activeWallet.substring(0, 6)}...{activeWallet.substring(activeWallet.length - 4)}</span>
              </div>
            </div>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900/95 border-b border-slate-800 px-4 pt-3 pb-6 space-y-2 backdrop-blur-2xl animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-2">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Polygon Mainnet: {activeWallet.substring(0, 6)}...{activeWallet.substring(activeWallet.length - 4)}
            </div>
            <button
              onClick={handleReset}
              className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-400 hover:text-white"
            >
              Reset Seed
            </button>
          </div>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5 text-emerald-400" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
