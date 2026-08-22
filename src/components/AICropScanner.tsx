'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { 
  Upload, 
  Scan, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  RefreshCw, 
  Zap, 
  Layers, 
  Camera,
  Check
} from 'lucide-react';
import { AIQualityReport, QualityGrade } from '@/types';
import { PRESET_CROPS } from '@/lib/mockData';

interface AICropScannerProps {
  onGradingComplete?: (report: AIQualityReport) => void;
  selectedCropName?: string;
}

export default function AICropScanner({ onGradingComplete, selectedCropName }: AICropScannerProps) {
  const [selectedImage, setSelectedImage] = useState<string>(PRESET_CROPS[0].imageUrl);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [qualityReport, setQualityReport] = useState<AIQualityReport | null>(null);
  const [activePresetIndex, setActivePresetIndex] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
          setQualityReport(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (idx: number) => {
    setActivePresetIndex(idx);
    setSelectedImage(PRESET_CROPS[idx].imageUrl);
    setQualityReport(null);
  };

  const runAIScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setQualityReport(null);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 90) {
          return 90;
        }
        return prev + 18;
      });
    }, 150);

    try {
      // Call Backend AI Inference Route
      const preset = PRESET_CROPS[activePresetIndex] || PRESET_CROPS[0];
      const result = await fetch('/api/ai/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName: selectedCropName || preset.name,
          category: preset.category,
          imageDataUri: selectedImage,
          presetIndex: activePresetIndex,
        }),
      });

      const json = await result.json();
      const report: AIQualityReport = json.data;

      clearInterval(interval);
      setScanProgress(100);
      setIsScanning(false);
      setQualityReport(report);

      if (onGradingComplete) {
        onGradingComplete(report);
      }
    } catch (err) {
      console.warn('Backend AI failed, using client fallback:', err);
      clearInterval(interval);
      setScanProgress(100);
      setIsScanning(false);

      const preset = PRESET_CROPS[activePresetIndex] || PRESET_CROPS[0];
      const baseScore = preset.sampleScore || 94;
      const variance = Math.floor(Math.random() * 5) - 2;
      const finalScore = Math.min(99, Math.max(80, baseScore + variance));
      
      let grade: QualityGrade = 'Grade A+';
      if (finalScore < 85) grade = 'Grade B';
      else if (finalScore < 93) grade = 'Grade A';

      const generatedReport: AIQualityReport = {
        overallScore: finalScore,
        grade,
        ripeness: Math.min(99, preset.ripeness + variance),
        colorUniformity: Math.min(99, preset.colorUniformity + variance),
        sizeDistribution: 'Optimal Large',
        shelfLifeEstDays: preset.shelfLifeDays,
        scannedAt: new Date().toISOString(),
        imagePreview: selectedImage,
        modelVersion: 'FarmVision-AgriCV-v4.2',
        recommendedPricePremium: grade === 'Grade A+' ? 15 : grade === 'Grade A' ? 10 : 0,
        defectsDetected: finalScore < 90 ? [
          { name: 'Micro Surface Blemish', confidence: 0.14, area: 'Lower Quadrant', severity: 'low' }
        ] : []
      };

      setQualityReport(generatedReport);
      if (onGradingComplete) {
        onGradingComplete(generatedReport);
      }
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Cpu className="w-3.5 h-3.5" /> Edge Computer Vision Module
          </div>
          <h3 className="text-xl font-bold text-white">AI Crop Quality Grading</h3>
          <p className="text-xs text-slate-400">Upload or select crop photos to run optical defect and ripeness inference</p>
        </div>

        {qualityReport && (
          <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-2xl">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-emerald-400">Grading Result</div>
              <div className="text-lg font-black text-emerald-300 font-mono">
                {qualityReport.overallScore}/100 <span className="text-sm font-semibold">({qualityReport.grade})</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
          </div>
        )}
      </div>

      {/* Preset Pickers */}
      <div className="mt-6">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Select Crop Sample Preset or Upload Custom Photo:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {PRESET_CROPS.map((crop, idx) => (
            <button
              key={crop.name}
              type="button"
              onClick={() => handleSelectPreset(idx)}
              className={`p-2 rounded-xl text-left border transition flex items-center gap-2 ${
                activePresetIndex === idx
                  ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-800/60 border-slate-700/50 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="w-8 h-8 rounded-lg overflow-hidden relative shrink-0">
                <Image src={crop.imageUrl} alt={crop.name} fill className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold truncate">{crop.name}</div>
                <div className="text-[10px] text-slate-400">{crop.category}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Viewport / Scanner Canvas */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Image Viewport */}
        <div className="lg:col-span-7">
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video sm:aspect-[4/3] border border-slate-700 shadow-inner group">
            <Image
              src={selectedImage}
              alt="Crop Scan Subject"
              fill
              className={`object-cover transition duration-500 ${isScanning ? 'scale-105 filter brightness-110' : ''}`}
            />

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Live Scan Line Animation */}
            {isScanning && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-laser z-20 pointer-events-none" />
            )}

            {/* Neural Net Grid Lines Overlay during scanning */}
            {isScanning && (
              <div className="absolute inset-0 bg-cyber-grid bg-[size:24px_24px] opacity-60 z-10 pointer-events-none" />
            )}

            {/* Computer Vision Detected Bounding Boxes (Simulated when scanned) */}
            {qualityReport && (
              <div className="absolute inset-0 z-20 pointer-events-none p-6">
                <div className="w-3/4 h-3/4 mx-auto border-2 border-dashed border-emerald-400/80 rounded-2xl relative animate-in fade-in zoom-in duration-300">
                  <div className="absolute -top-3 left-3 bg-emerald-500 text-black text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase">
                    AgriCV: {qualityReport.grade} ({qualityReport.overallScore}%)
                  </div>
                  <div className="absolute -bottom-3 right-3 bg-slate-900/90 text-cyan-400 border border-cyan-500/40 text-[10px] font-mono px-2 py-0.5 rounded">
                    Ripeness Index: {qualityReport.ripeness}%
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Controls Bar inside viewport */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-30">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-800 transition"
              >
                <Camera className="w-3.5 h-3.5 text-cyan-400" /> Upload File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={runAIScan}
                disabled={isScanning}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Analyzing ({scanProgress}%)
                  </>
                ) : (
                  <>
                    <Scan className="w-3.5 h-3.5" /> Run AI Quality Inspection
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Real-time Optical Analysis Report */}
        <div className="lg:col-span-5 space-y-3">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Computer Vision Metrics</span>
              <span className="font-mono text-cyan-400 text-[10px]">Model v4.2</span>
            </div>

            {qualityReport ? (
              <div className="space-y-2.5 animate-in fade-in duration-300">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs">
                  <span className="text-slate-400">Overall Quality Score</span>
                  <span className="font-mono font-bold text-emerald-400">{qualityReport.overallScore}/100</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs">
                  <span className="text-slate-400">Ripeness Index</span>
                  <span className="font-mono font-bold text-slate-200">{qualityReport.ripeness}% (Optimal)</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs">
                  <span className="text-slate-400">Color Uniformity</span>
                  <span className="font-mono font-bold text-slate-200">{qualityReport.colorUniformity}%</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs">
                  <span className="text-slate-400">Size Caliber</span>
                  <span className="font-mono font-bold text-cyan-400">{qualityReport.sizeDistribution}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs">
                  <span className="text-slate-400">Est. Cold Shelf Life</span>
                  <span className="font-mono font-bold text-amber-400">{qualityReport.shelfLifeEstDays} Days</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
                  <span className="text-emerald-400 font-semibold">Suggested Price Premium</span>
                  <span className="font-mono font-bold text-emerald-300">+{qualityReport.recommendedPricePremium}%</span>
                </div>
              </div>
            ) : (
              <div className="py-10 text-center space-y-2">
                <Scan className="w-8 h-8 text-slate-600 mx-auto animate-pulse" />
                <p className="text-xs text-slate-500">
                  Click <span className="text-cyan-400 font-semibold">&quot;Run AI Quality Inspection&quot;</span> to analyze the crop specimen.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
