'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProduceBatch, BatchStage, AIQualityReport } from '@/types';
import { INITIAL_BATCHES } from './mockData';

interface FarmChainContextType {
  batches: ProduceBatch[];
  activeWallet: string;
  walletBalance: number;
  addBatch: (batch: Omit<ProduceBatch, 'id' | 'createdAt' | 'checkpoints' | 'escrowContractAddress' | 'escrowStatus' | 'txHashRegistration'>, aiReport?: AIQualityReport) => ProduceBatch;
  updateBatchStage: (batchId: string, newStage: BatchStage, location: string, notes?: string) => void;
  releaseEscrow: (batchId: string) => Promise<{ success: boolean; txHash: string }>;
  getBatchById: (batchId: string) => ProduceBatch | undefined;
  notifications: string[];
  addNotification: (msg: string) => void;
  resetToDefault: () => void;
}

const FarmChainContext = createContext<FarmChainContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'farmchain_batches_v1';

export const FarmChainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [batches, setBatches] = useState<ProduceBatch[]>(INITIAL_BATCHES);
  const [activeWallet] = useState<string>('0x71cA9B9054817aDc90924718FaE921B7c093a1');
  const [walletBalance, setWalletBalance] = useState<number>(3540000);
  const [notifications, setNotifications] = useState<string[]>([
    'Smart Contract Escrow for Batch #FC-2026-APL-8821 funded with ₹4,50,000 INR',
    'AI Quality Model v4.2 calibrated with 99.4% precision'
  ]);

  // Load from LocalStorage on mount with automatic data migration
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalized = parsed.map((b: any) => {
            const price = b.totalPriceINR ?? b.totalPriceUSD ?? (b.quantityKg * (b.basePricePerKg || 100));
            return {
              ...b,
              totalPriceINR: typeof price === 'number' && !isNaN(price) ? price : 100000,
              basePricePerKg: b.basePricePerKg || 100,
            };
          });
          setBatches(normalized);
        }
      }
    } catch (e) {
      console.error('Failed to load batches from localStorage', e);
    }
  }, []);

  // Sync to LocalStorage
  const saveBatches = (newBatches: ProduceBatch[]) => {
    setBatches(newBatches);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newBatches));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  };

  const addNotification = (msg: string) => {
    setNotifications(prev => [msg, ...prev.slice(0, 7)]);
  };

  const addBatch = (
    batchData: Omit<ProduceBatch, 'id' | 'createdAt' | 'checkpoints' | 'escrowContractAddress' | 'escrowStatus' | 'txHashRegistration'>,
    aiReport?: AIQualityReport
  ): ProduceBatch => {
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

    const newBatch: ProduceBatch = {
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

    const updated = [newBatch, ...batches];
    saveBatches(updated);
    addNotification(`New Batch ${batchId} (${newBatch.cropName}) minted on Polygon!`);
    return newBatch;
  };

  const updateBatchStage = (batchId: string, newStage: BatchStage, location: string, notes?: string) => {
    const updated = batches.map(b => {
      if (b.id !== batchId) return b;

      const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const newCp = {
        id: `cp-${Date.now()}`,
        stage: newStage,
        title: `Status updated to ${newStage}`,
        location: location || b.farmLocation,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        verifiedBy: 'Logistics Telemetry Node & Oracle',
        txHash,
        notes: notes || `Batch progressed to ${newStage}`,
        status: 'completed' as const,
      };

      const updatedCheckpoints = [...b.checkpoints, newCp];

      // If moved to in transit or delivered, update telemetry
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
        checkpoints: updatedCheckpoints,
        iotTelemetry: updatedTelemetry
      };
    });

    saveBatches(updated);
    addNotification(`Batch ${batchId} updated to stage: ${newStage}`);
  };

  const releaseEscrow = async (batchId: string): Promise<{ success: boolean; txHash: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        let payoutAmount = 0;

        const updated = batches.map(b => {
          if (b.id !== batchId) return b;
          payoutAmount = b.totalPriceINR;

          const settlementCp = {
            id: `cp-settle-${Date.now()}`,
            stage: 'Settled' as BatchStage,
            title: 'Smart Contract Escrow Released',
            location: 'Polygon Smart Contract (Automated)',
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
            verifiedBy: 'Buyer Cryptographic Signature Multi-Sig',
            txHash,
            notes: `Delivery approved. Escrow of ₹${b.totalPriceINR.toLocaleString('en-IN')} released directly to farmer wallet ${b.farmerWallet}.`,
            status: 'completed' as const,
          };

          return {
            ...b,
            currentStage: 'Delivered' as BatchStage,
            escrowStatus: 'Released to Farmer' as const,
            txHashEscrowRelease: txHash,
            checkpoints: [...b.checkpoints, settlementCp]
          };
        });

        saveBatches(updated);
        setWalletBalance(prev => prev - payoutAmount);
        addNotification(`Smart Contract Escrow released! ₹${payoutAmount.toLocaleString('en-IN')} paid to Farmer for ${batchId}`);
        resolve({ success: true, txHash });
      }, 1400);
    });
  };

  const getBatchById = (batchId: string): ProduceBatch | undefined => {
    return batches.find(b => b.id.toLowerCase() === batchId.toLowerCase());
  };

  const resetToDefault = () => {
    saveBatches(INITIAL_BATCHES);
    addNotification('Demo data reset to default seed state.');
  };

  return (
    <FarmChainContext.Provider
      value={{
        batches,
        activeWallet,
        walletBalance,
        addBatch,
        updateBatchStage,
        releaseEscrow,
        getBatchById,
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
