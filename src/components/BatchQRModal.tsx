'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ProduceBatch } from '@/types';
import { 
  X, 
  Download, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  QrCode, 
  Share2 
} from 'lucide-react';
import Link from 'next/link';

interface BatchQRModalProps {
  batch: ProduceBatch;
  isOpen: boolean;
  onClose: () => void;
}

export default function BatchQRModal({ batch, isOpen, onClose }: BatchQRModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Origin verification link
  const verifyUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/verify/${batch.id}` 
    : `https://farmchain.ai/verify/${batch.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById(`qr-svg-${batch.id}`);
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width + 40;
        canvas.height = img.height + 40;
        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 20, 20);
          const pngFile = canvas.toDataURL("image/png");
          const downloadLink = document.createElement("a");
          downloadLink.download = `FarmChain-QR-${batch.id}.png`;
          downloadLink.href = pngFile;
          downloadLink.click();
        }
      };
      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1 pb-4 border-b border-slate-800">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" /> Provenance Certificate QR
          </div>
          <h3 className="text-lg font-bold text-white">{batch.cropName}</h3>
          <p className="text-xs font-mono text-cyan-400">{batch.id}</p>
        </div>

        {/* QR Code Container with High Contrast styling for easy physical scanning */}
        <div className="my-6 flex flex-col items-center justify-center">
          <div className="p-4 bg-white rounded-2xl shadow-xl border-4 border-emerald-500/30">
            <QRCodeSVG
              id={`qr-svg-${batch.id}`}
              value={verifyUrl}
              size={200}
              level="H"
              includeMargin={false}
              fgColor="#060b13"
              bgColor="#ffffff"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-3 text-center">
            Scan with smartphone camera to view full harvest journey & AI report
          </p>
        </div>

        {/* Batch Metadata summary */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Farm:</span>
            <span className="text-slate-200 font-medium">{batch.farmName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">AI Quality:</span>
            <span className="text-emerald-400 font-bold font-mono">
              {batch.aiReport ? `${batch.aiReport.overallScore}/100 (${batch.aiReport.grade})` : 'Pending Grade'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Stage:</span>
            <span className="text-cyan-400 font-semibold">{batch.currentStage}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={handleDownloadQR}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" /> Download PNG
          </button>

          <button
            onClick={handleCopyLink}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-cyan-400" /> Copy URL
              </>
            )}
          </button>
        </div>

        <div className="mt-3">
          <Link
            href={`/verify/${batch.id}`}
            onClick={onClose}
            className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Open Public Provenance Page
          </Link>
        </div>
      </div>
    </div>
  );
}
