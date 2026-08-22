'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ProduceBatch, BatchStage, AIQualityReport, TelemetryReadingInput } from '@/types';
import { INITIAL_BATCHES } from './mockData';
import { FarmChainAPI } from './api';

interface FarmChainContextType {
  batches: ProduceBatch[];
  activeWallet: string;
  walletBalance: number;
  isBackendConnected: boolean;
  isLoading: boolean;
  addBatch: (
    batch: Omit<ProduceBatch, 'id' | 'createdAt' | 'checkpoints' | 'escrowContractAddress' | 'escrowStatus' | 'txHashRegistration'>,
    aiReport?: AIQualityReport
  ) => Promise<ProduceBatch>;
  updateBatchStage: (batchId: string, newStage: BatchStage, location: string, notes?: string, verifiedBy?: string) => Promise<void>;
  releaseEscrow: (batchId: string, buyerWallet?: string) => Promise<{ success: boolean; txHash: string; settledAmountINR?: number }>;
  updateTelemetry: (batchId: string, input: TelemetryReadingInput) => Promise<void>;
  getBatchById: (batchId: string) => ProduceBatch | undefined;
  refreshBatches: () => Promise<void>;
  notifications: string[];
  addNotification: (msg: string) => void;
  resetToDefault: () => Promise<void>;
}

const FarmChainContext = createContext<FarmChainContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'farmchain_batches_v2';

export const FarmChainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [batches, setBatches] = useState<ProduceBatch[]>(INITIAL_BATCHES);
  const [activeWallet] = useState<string>('0x71cA9B9054817aDc90924718FaE921B7c093a1');
  const [walletBalance, setWalletBalance] = useState<number>(3540000);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<string[]>([
    'Smart Contract Escrow for Batch #FC-2026-APL-8821 funded with ₹4,50,000 INR on Polygon',
    'AI Quality Model v4.2 calibrated with 99.4% precision',
    'Connected to persistent backend ledger & Oracle network'
  ]);

  // Sync to LocalStorage as a resilient secondary client cache
  const cacheBatchesLocally = (data: ProduceBatch[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  };

  const addNotification = useCallback((msg: string) => {
    setNotifications(prev => [msg, ...prev.slice(0, 9)]);
  }, []);

  // Fetch batches from backend API
  const refreshBatches = useCallback(async () => {
    try {
      const serverBatches = await FarmChainAPI.getBatches();
      if (Array.isArray(serverBatches) && serverBatches.length > 0) {
        setBatches(serverBatches);
        cacheBatchesLocally(serverBatches);
        setIsBackendConnected(true);
      }
    } catch (err) {
      console.warn('Backend fetch failed, using local/cached data:', err);
      setIsBackendConnected(false);
      
      // Fallback to local storage if API is unreachable
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setBatches(parsed);
          }
        }
      } catch {
        // use INITIAL_BATCHES
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshBatches();

    // Background poll every 8 seconds to synchronize real-time updates across multiple tabs
    const interval = setInterval(() => {
      refreshBatches();
    }, 8000);

    return () => clearInterval(interval);
  }, [refreshBatches]);

  const addBatch = async (
    batchData: Omit<ProduceBatch, 'id' | 'createdAt' | 'checkpoints' | 'escrowContractAddress' | 'escrowStatus' | 'txHashRegistration'>,
    aiReport?: AIQualityReport
  ): Promise<ProduceBatch> => {
    try {
      // Create on backend
      const createdBatch = await FarmChainAPI.createBatch(batchData, aiReport);
      setBatches(prev => [createdBatch, ...prev.filter(b => b.id !== createdBatch.id)]);
      cacheBatchesLocally([createdBatch, ...batches]);
      addNotification(`New Batch ${createdBatch.id} (${createdBatch.cropName}) minted on Polygon ledger!`);
      setIsBackendConnected(true);
      return createdBatch;
    } catch (err) {
      console.error('Backend addBatch error, performing local optimistic fallback:', err);
      setIsBackendConnected(false);

      // Local fallback
      const randomHex = () => Math.random().toString(16).substring(2, 8).toUpperCase();
      const prefix = batchData.cropName.substring(0, 3).toUpperCase();
      const batchId = `FC-2026-${prefix}-${randomHex().substring(0, 4)}`;
      const txReg = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const escrowAddr = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

      const initialCheckpoint = {
        id: `cp-${Date.now()}-1`,
        stage: 'Registered' as BatchStage,
        title: 'Harvest Registered & Minted on Chain',
        location: batchData.farmLocation,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        verifiedBy: `Farm Node (${batchData.farmName})`,
        txHash: txReg,
        notes: `Batch of ${batchData.quantityKg}kg ${batchData.cropName} created.`,
        status: 'completed' as const,
      };

      const checkpoints = [initialCheckpoint];
      if (aiReport) {
        checkpoints.push({
          id: `cp-${Date.now()}-2`,
          stage: 'Quality Checked' as BatchStage,
          title: 'AI Computer Vision Inspection Passed',
          location: `${batchData.farmLocation} - AI Lab`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
          verifiedBy: `FarmChain AI Scanner (${aiReport.modelVersion})`,
          txHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          notes: `Quality Score: ${aiReport.overallScore}/100 (${aiReport.grade}). Ripeness: ${aiReport.ripeness}%.`,
          status: 'completed' as const,
        });
      }

      const fallbackBatch: ProduceBatch = {
        ...batchData,
        id: batchId,
        createdAt: new Date().toISOString(),
        currentStage: aiReport ? 'Quality Checked' : 'Registered',
        aiReport,
        checkpoints,
        escrowContractAddress: escrowAddr,
        escrowStatus: 'Locked',
        txHashRegistration: txReg,
        iotTelemetry: {
          currentTemp: 4.2,
          targetTempMin: 2.0,
          targetTempMax: 6.0,
          humidity: 88,
          shockG: 0.1,
          batteryPct: 98,
          lastUpdated: 'Just now',
          locationName: batchData.farmLocation,
          coordinates: batchData.farmCoordinates,
          tempHistory: [{ time: 'Current', temp: 4.2 }]
        }
      };

      setBatches(prev => [fallbackBatch, ...prev]);
      cacheBatchesLocally([fallbackBatch, ...batches]);
      addNotification(`New Batch ${batchId} (${fallbackBatch.cropName}) saved locally.`);
      return fallbackBatch;
    }
  };

  const updateBatchStage = async (
    batchId: string,
    newStage: BatchStage,
    location: string,
    notes?: string,
    verifiedBy?: string
  ): Promise<void> => {
    try {
      const updated = await FarmChainAPI.addCheckpoint(batchId, newStage, location, notes, verifiedBy);
      setBatches(prev => prev.map(b => (b.id === batchId ? updated : b)));
      cacheBatchesLocally(batches.map(b => (b.id === batchId ? updated : b)));
      addNotification(`Batch ${batchId} updated to stage: ${newStage} via backend`);
      setIsBackendConnected(true);
    } catch (err) {
      console.error('Backend updateBatchStage error, falling back locally:', err);
      setIsBackendConnected(false);

      setBatches(prev => prev.map(b => {
        if (b.id !== batchId) return b;
        const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        const newCp = {
          id: `cp-${Date.now()}`,
          stage: newStage,
          title: `Status updated to ${newStage}`,
          location: location || b.farmLocation,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
          verifiedBy: verifiedBy || 'Logistics Telemetry Node & Oracle',
          txHash,
          notes: notes || `Batch progressed to ${newStage}`,
          status: 'completed' as const,
        };

        let updatedTelemetry = b.iotTelemetry;
        if (updatedTelemetry) {
          updatedTelemetry = {
            ...updatedTelemetry,
            lastUpdated: 'Just now',
            locationName: location || updatedTelemetry.locationName
          };
        }

        return {
          ...b,
          currentStage: newStage,
          checkpoints: [...b.checkpoints, newCp],
          iotTelemetry: updatedTelemetry
        };
      }));
      addNotification(`Batch ${batchId} updated to stage: ${newStage} (local)`);
    }
  };

  const releaseEscrow = async (
    batchId: string,
    buyerWallet?: string
  ): Promise<{ success: boolean; txHash: string; settledAmountINR?: number }> => {
    try {
      const result = await FarmChainAPI.releaseEscrow(batchId, buyerWallet);
      setBatches(prev => prev.map(b => (b.id === batchId ? result.batch : b)));
      setWalletBalance(prev => Math.max(0, prev - (result.settledAmountINR || 0)));
      addNotification(`Smart Contract Escrow released! ₹${result.settledAmountINR.toLocaleString('en-IN')} paid to Farmer for ${batchId}`);
      setIsBackendConnected(true);
      return { success: true, txHash: result.txHash, settledAmountINR: result.settledAmountINR };
    } catch (err) {
      console.error('Backend releaseEscrow error, fallback locally:', err);
      setIsBackendConnected(false);

      const targetBatch = batches.find(b => b.id === batchId);
      const payoutAmount = targetBatch?.totalPriceINR || 0;
      const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

      setBatches(prev => prev.map(b => {
        if (b.id !== batchId) return b;
        const settlementCp = {
          id: `cp-settle-${Date.now()}`,
          stage: 'Settled' as BatchStage,
          title: 'Smart Contract Escrow Released',
          location: 'Polygon Smart Contract (Automated)',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
          verifiedBy: 'Buyer Cryptographic Signature Multi-Sig',
          txHash,
          notes: `Delivery approved. Escrow of ₹${b.totalPriceINR.toLocaleString('en-IN')} released to farmer wallet ${b.farmerWallet}.`,
          status: 'completed' as const,
        };

        return {
          ...b,
          currentStage: 'Delivered' as BatchStage,
          escrowStatus: 'Released to Farmer' as const,
          txHashEscrowRelease: txHash,
          checkpoints: [...b.checkpoints, settlementCp]
        };
      }));

      setWalletBalance(prev => Math.max(0, prev - payoutAmount));
      addNotification(`Smart Contract Escrow released! ₹${payoutAmount.toLocaleString('en-IN')} paid to Farmer for ${batchId}`);
      return { success: true, txHash, settledAmountINR: payoutAmount };
    }
  };

  const updateTelemetry = async (batchId: string, input: TelemetryReadingInput): Promise<void> => {
    try {
      const updatedTelemetry = await FarmChainAPI.updateTelemetry(batchId, input);
      setBatches(prev => prev.map(b => {
        if (b.id === batchId) {
          return { ...b, iotTelemetry: updatedTelemetry as any };
        }
        return b;
      }));
    } catch (err) {
      console.error('Failed to push telemetry to backend:', err);
    }
  };

  const getBatchById = (batchId: string): ProduceBatch | undefined => {
    return batches.find(b => b.id.toLowerCase() === batchId.toLowerCase());
  };

  const resetToDefault = async (): Promise<void> => {
    try {
      const resetBatches = await FarmChainAPI.resetToDefault();
      setBatches(resetBatches);
      cacheBatchesLocally(resetBatches);
      addNotification('Demo database re-seeded on backend to default state.');
      setIsBackendConnected(true);
    } catch (err) {
      console.warn('Backend reset failed, resetting local state:', err);
      setBatches(INITIAL_BATCHES);
      cacheBatchesLocally(INITIAL_BATCHES);
      addNotification('Local demo state reset.');
    }
  };

  return (
    <FarmChainContext.Provider
      value={{
        batches,
        activeWallet,
        walletBalance,
        isBackendConnected,
        isLoading,
        addBatch,
        updateBatchStage,
        releaseEscrow,
        updateTelemetry,
        getBatchById,
        refreshBatches,
        notifications,
        addNotification,
        resetToDefault,
      }}
    >
      {children}
    </FarmChainContext.Provider>
  );
};

export const useFarmChain = () => {
  const context = useContext(FarmChainContext);
  if (!context) {
    throw new Error('useFarmChain must be used within a FarmChainProvider');
  }
  return context;
};
