'use client';

import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Activity, 
  Thermometer, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Send, 
  Layers, 
  Search, 
  Sparkles,
  AlertTriangle,
  Navigation
} from 'lucide-react';
import { useFarmChain } from '@/lib/store';
import { BatchStage, ProduceBatch } from '@/types';
import IoTTelemetryCard from '@/components/IoTTelemetryCard';

export default function LogisticsPortal() {
  const { batches, updateBatchStage } = useFarmChain();
  const [selectedBatchId, setSelectedBatchId] = useState<string>(batches[0]?.id || 'FC-2026-APL-8821');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Checkpoint Updater Form State
  const [newStage, setNewStage] = useState<BatchStage>('In Transit');
  const [checkpointLocation, setCheckpointLocation] = useState('Chicago Central Cold Depot Hub #4');
  const [checkpointNotes, setCheckpointNotes] = useState('IoT Cold-chain threshold verified at 3.8°C. Seals intact.');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccessMsg, setUpdateSuccessMsg] = useState<string | null>(null);

  const selectedBatch = batches.find(b => b.id === selectedBatchId) || batches[0];

  const filteredBatches = batches.filter(b => 
    b.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.farmLocation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdateCheckpoint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatch) return;

    setIsUpdating(true);
    try {
      await updateBatchStage(selectedBatch.id, newStage, checkpointLocation, checkpointNotes);
      setUpdateSuccessMsg(`Batch ${selectedBatch.id} checkpoint updated to "${newStage}"!`);
      setTimeout(() => setUpdateSuccessMsg(null), 3500);
    } catch (err) {
      console.error('Error updating checkpoint:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleQuickAdvance = async (batch: ProduceBatch) => {
    let nextStage: BatchStage = 'In Transit';
    let loc = 'Cold-Chain Logistics Freight Hub';
    let note = 'Automated IoT Gateway Checkpoint';

    if (batch.currentStage === 'Registered') {
      nextStage = 'Quality Checked';
      loc = `${batch.farmLocation} - AI Inspection Terminal`;
      note = 'Optical grading approved.';
    } else if (batch.currentStage === 'Quality Checked') {
      nextStage = 'In Transit';
      loc = 'Highway Interstate Cold Transport';
      note = 'Refrigerated container dispatched.';
    } else if (batch.currentStage === 'In Transit') {
      nextStage = 'Delivered';
      loc = 'Wholesale Buyer Receiving Dock';
      note = 'Shipment arrived at destination.';
    }

    try {
      await updateBatchStage(batch.id, nextStage, loc, note);
    } catch (err) {
      console.error('Error advancing batch:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
            <Truck className="w-4 h-4" /> Cold-Chain Carrier &amp; Logistics Gateway
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            Logistics &amp; Checkpoint Tracker
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Transmit automated IoT telemetry, record transit milestones, and advance batches along the blockchain pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>Oracle Carrier Feed: ACTIVE</span>
        </div>
      </div>

      {/* Main Grid: Left Fleet Table, Right Selected Batch IoT & Checkpoint Updater */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Active Batches Table (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" /> Active Fleet Batches
            </h3>
            <span className="text-xs font-mono text-slate-400">{batches.length} Tracked</span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Batch ID, Crop or Location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          {/* Batches List */}
          <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
            {filteredBatches.map((batch) => {
              const isSelected = batch.id === selectedBatch?.id;
              return (
                <div
                  key={batch.id}
                  onClick={() => setSelectedBatchId(batch.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500/50 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400">{batch.id}</span>
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                        batch.currentStage === 'In Transit'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse'
                          : batch.currentStage === 'Delivered'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {batch.currentStage}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline">
                    <div>
                      <div className="text-sm font-bold text-white">{batch.cropName}</div>
                      <div className="text-xs text-slate-400">{batch.farmLocation}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono text-slate-200">{batch.quantityKg} kg</div>
                      <div className="text-[10px] text-emerald-400 font-mono">₹{batch.totalPriceINR.toLocaleString('en-IN')}</div>
                    </div>
                  </div>

                  {/* Quick Stage Advance Action Button */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px] font-mono">
                      Checkpoints: {batch.checkpoints.length} logged
                    </span>
                    {batch.currentStage !== 'Delivered' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickAdvance(batch);
                        }}
                        className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 hover:underline"
                      >
                        Advance Stage <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Checkpoint Updater & Live Telemetry (7 cols) */}
        {selectedBatch && (
          <div className="lg:col-span-7 space-y-6">
            {/* Success Alert Banner */}
            {updateSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{updateSuccessMsg}</span>
              </div>
            )}

            {/* Selected Batch IoT Telemetry Card */}
            {selectedBatch.iotTelemetry && (
              <IoTTelemetryCard
                telemetry={selectedBatch.iotTelemetry}
                cropName={selectedBatch.cropName}
              />
            )}

            {/* Checkpoint Status Updater Form */}
            <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-amber-500/30 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-amber-400" /> Log Checkpoint for #{selectedBatch.id}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Write verified milestone data and temperature oracle snapshot to Polygon smart contract.
                  </p>
                </div>
                <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Current: {selectedBatch.currentStage}
                </span>
              </div>

              <form onSubmit={handleUpdateCheckpoint} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Select New Stage */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">Target Stage</label>
                    <select
                      value={newStage}
                      onChange={(e) => setNewStage(e.target.value as BatchStage)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                    >
                      <option value="Registered">Registered</option>
                      <option value="Quality Checked">Quality Checked (AI Lab)</option>
                      <option value="In Transit">In Transit (Cold-Chain Active)</option>
                      <option value="Delivered">Delivered (Market / Warehouse)</option>
                    </select>
                  </div>

                  {/* Checkpoint Location */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">Checkpoint Facility / Geo Location</label>
                    <input
                      type="text"
                      required
                      value={checkpointLocation}
                      onChange={(e) => setCheckpointLocation(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                      placeholder="e.g. I-90 Transit Gate or Chicago Depot"
                    />
                  </div>
                </div>

                {/* Inspection / Sensor Notes */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">IoT &amp; Inspection Telemetry Notes</label>
                  <textarea
                    rows={2}
                    required
                    value={checkpointNotes}
                    onChange={(e) => setCheckpointNotes(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none resize-none"
                    placeholder="Provide telemetry remarks or seal confirmation numbers..."
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isUpdating ? 'Sealing on Blockchain...' : 'Commit Checkpoint to Chain'}
                  </button>
                </div>
              </form>
            </div>

            {/* Checkpoints History Log */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" /> Immutable Checkpoint Ledger ({selectedBatch.checkpoints.length})
              </h4>

              <div className="space-y-3">
                {selectedBatch.checkpoints.map((cp, idx) => (
                  <div key={cp.id} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {cp.title}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">{cp.timestamp}</span>
                    </div>
                    <div className="text-slate-300">{cp.location}</div>
                    {cp.notes && <div className="text-slate-400 text-[11px]">{cp.notes}</div>}
                    <div className="text-[10px] font-mono text-slate-500 truncate pt-1 border-t border-slate-900">
                      Tx: {cp.txHash}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
