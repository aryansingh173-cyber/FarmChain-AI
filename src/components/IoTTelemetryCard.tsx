'use client';

import React from 'react';
import { Thermometer, Droplets, Activity, Battery, MapPin, AlertCircle, ShieldCheck } from 'lucide-react';
import { IoTTelemetry } from '@/types';

interface IoTTelemetryCardProps {
  telemetry: IoTTelemetry;
  cropName: string;
}

export default function IoTTelemetryCard({ telemetry, cropName }: IoTTelemetryCardProps) {
  const isTempNormal = telemetry.currentTemp >= telemetry.targetTempMin && telemetry.currentTemp <= telemetry.targetTempMax;

  return (
    <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Live IoT Cold-Chain Gateway
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-500">Updated: {telemetry.lastUpdated}</span>
      </div>

      {/* Grid of Telemetry Sensors */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Temperature */}
        <div className={`p-3 rounded-xl border ${
          isTempNormal 
            ? 'bg-emerald-500/10 border-emerald-500/30' 
            : 'bg-rose-500/10 border-rose-500/30'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-cyan-400" /> Temp
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              {telemetry.targetTempMin}-{telemetry.targetTempMax}°C
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-white flex items-baseline gap-1">
            {telemetry.currentTemp}°C
            {isTempNormal ? (
              <span className="text-[10px] text-emerald-400 font-sans font-semibold">Optimal</span>
            ) : (
              <span className="text-[10px] text-rose-400 font-sans font-semibold">Excursion</span>
            )}
          </div>
        </div>

        {/* Humidity */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Humidity
            </span>
            <span className="text-[10px] font-mono text-slate-500">RH%</span>
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {telemetry.humidity}%
          </div>
        </div>

        {/* Shock & Vibration */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-amber-400" /> Shock
            </span>
            <span className="text-[10px] font-mono text-slate-500">Max 1.0G</span>
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {telemetry.shockG} G
          </div>
        </div>

        {/* Battery & Beacon */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Battery className="w-3.5 h-3.5 text-emerald-400" /> Sensor
            </span>
            <span className="text-[10px] font-mono text-emerald-400">{telemetry.batteryPct}%</span>
          </div>
          <div className="text-xs font-semibold text-emerald-400 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Oracle Synced
          </div>
        </div>
      </div>

      {/* GPS Location & Waypoint History */}
      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate">{telemetry.locationName}</span>
        </div>
        <span className="font-mono text-cyan-400 shrink-0 text-[11px]">
          {telemetry.coordinates.lat.toFixed(4)}°N, {telemetry.coordinates.lng.toFixed(4)}°W
        </span>
      </div>

      {/* Mini Temperature Trend Bars */}
      <div>
        <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center justify-between">
          <span>Cold-Chain Log (Last Recorded Readings)</span>
          <span className="text-emerald-400 font-mono">100% In-Spec</span>
        </div>
        <div className="grid grid-cols-6 gap-1.5 h-14 items-end bg-slate-950/80 p-2 rounded-xl border border-slate-800">
          {telemetry.tempHistory.map((h, i) => {
            const heightPercent = Math.min(100, Math.max(20, (h.temp / 8) * 100));
            return (
              <div key={i} className="flex flex-col items-center gap-1 h-full justify-end">
                <div 
                  className="w-full rounded-t bg-gradient-to-t from-cyan-500 to-emerald-400 transition-all"
                  style={{ height: `${heightPercent}%` }}
                  title={`${h.time}: ${h.temp}°C`}
                />
                <span className="text-[9px] font-mono text-slate-500">{h.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
