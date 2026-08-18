'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ProduceBatch } from '@/types';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Loader2, 
  DollarSign, 
  FileCheck2, 
  Wallet, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useFarmChain } from '@/lib/store';

interface EscrowReleaseModalProps {
  batch: ProduceBatch;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function EscrowReleaseModal({ batch, isOpen, onClose, onSuccess }: EscrowReleaseModalProps) {
  const { releaseEscrow } = useFarmChain();
  const [isProcessing, setIsProcessing] = useState(false);
  const [settledTxHash, setSettledTxHash] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirmRelease = async () => {
    setIsProcessing(true);
    try {
      const result = await releaseEscrow(batch.id);
      setIsProcessing(false);
      setSettledTxHash(result.txHash);

      // Trigger Confetti celebration
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#84cc16', '#f59e0b']
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {settledTxHash ? (
          // Success State
          <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-extrabold text-white">
              Escrow Released Successfully!
            </h3>

            <p className="text-sm text-slate-300">
              <span className="text-emerald-400 font-bold">₹{(batch.totalPriceINR || 0).toLocaleString('en-IN')} INR</span> has been instantly transferred from smart contract escrow to farmer <span className="font-semibold text-white">{batch.farmName}</span>.
            </p>

            {/* Cryptographic Proof Hash */}
            <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-left space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Polygon PoS Transaction Receipt
              </div>
              <div className="text-xs font-mono text-emerald-400 break-all bg-black/50 p-2 rounded">
                {settledTxHash}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold text-sm shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          // Confirmation Form
          <div className="space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Execute Smart Contract Release</h3>
                <p className="text-xs text-slate-400">Multi-Sig Escrow Settlement for {batch.cropName}</p>
              </div>
            </div>

            {/* Escrow Details */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Batch ID:</span>
                <span className="font-mono text-cyan-400 font-bold">{batch.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Producer / Farm:</span>
                <span className="text-slate-200">{batch.farmName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Farmer Wallet:</span>
                <span className="font-mono text-slate-300">{batch.farmerWallet.substring(0, 10)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">AI Quality Inspection:</span>
                <span className="text-emerald-400 font-bold">
                  {batch.aiReport ? `${batch.aiReport.overallScore}/100 (${batch.aiReport.grade})` : 'Grade A'}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                <span className="text-slate-300 font-semibold">Total Escrow Payout:</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  ₹{(batch.totalPriceINR || 0).toLocaleString('en-IN')} INR
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-slate-300 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                By clicking Confirm, your cryptographic signature will authorize the escrow smart contract to disburse 100% of funds directly to the farmer wallet.
              </span>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmRelease}
                disabled={isProcessing}
                className="py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Signing &amp; Releasing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Confirm &amp; Release Funds
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
