import { 
  ProduceBatch, 
  BatchStage, 
  AIQualityReport, 
  UserNotification, 
  DashboardStats, 
  BackendHealth,
  TelemetryReadingInput 
} from '@/types';

/**
 * Type-Safe Frontend Client SDK for FarmChain AI Backend
 */
export const FarmChainAPI = {
  /**
   * Fetch all batches with optional filters
   */
  async getBatches(filter?: {
    stage?: string;
    category?: string;
    escrowStatus?: string;
    search?: string;
  }): Promise<ProduceBatch[]> {
    const params = new URLSearchParams();
    if (filter?.stage) params.append('stage', filter.stage);
    if (filter?.category) params.append('category', filter.category);
    if (filter?.escrowStatus) params.append('escrowStatus', filter.escrowStatus);
    if (filter?.search) params.append('search', filter.search);

    const qs = params.toString();
    const res = await fetch(`/api/batches${qs ? `?${qs}` : ''}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch batches: ${res.statusText}`);
    }
    const json = await res.json();
    return json.data || [];
  },

  /**
   * Fetch single batch details with cryptographic verification proof
   */
  async getBatchById(id: string): Promise<{
    batch: ProduceBatch;
    verification?: {
      isAuthentic: boolean;
      network: string;
      escrowContract: string;
      merkleRoot: string;
      blockNumber: number;
      cryptoSignature: string;
      verifiedAt: string;
    };
  }> {
    const res = await fetch(`/api/batches/${encodeURIComponent(id)}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error(`Batch ${id} not found`);
    }
    const json = await res.json();
    return {
      batch: json.data,
      verification: json.verification,
    };
  },

  /**
   * Register and mint a new produce batch
   */
  async createBatch(
    batchData: Omit<ProduceBatch, 'id' | 'createdAt' | 'checkpoints' | 'escrowContractAddress' | 'escrowStatus' | 'txHashRegistration'>,
    aiReport?: AIQualityReport
  ): Promise<ProduceBatch> {
    const res = await fetch('/api/batches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ batchData, aiReport }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create batch');
    }
    const json = await res.json();
    return json.data;
  },

  /**
   * Advance batch checkpoint / stage
   */
  async addCheckpoint(
    batchId: string,
    stage: BatchStage,
    location: string,
    notes?: string,
    verifiedBy?: string
  ): Promise<ProduceBatch> {
    const res = await fetch(`/api/batches/${encodeURIComponent(batchId)}/checkpoints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage, location, notes, verifiedBy }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to advance checkpoint');
    }
    const json = await res.json();
    return json.data;
  },

  /**
   * Release smart contract escrow funds directly to farmer
   */
  async releaseEscrow(
    batchId: string,
    buyerWallet?: string
  ): Promise<{ success: boolean; txHash: string; settledAmountINR: number; batch: ProduceBatch }> {
    const res = await fetch(`/api/batches/${encodeURIComponent(batchId)}/escrow-release`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ buyerWallet }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to release escrow');
    }
    const json = await res.json();
    return {
      success: true,
      txHash: json.txHash,
      settledAmountINR: json.settledAmountINR,
      batch: json.data,
    };
  },

  /**
   * Push new IoT telemetry sensor reading
   */
  async updateTelemetry(batchId: string, input: TelemetryReadingInput): Promise<ProduceBatch> {
    const res = await fetch(`/api/batches/${encodeURIComponent(batchId)}/telemetry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update telemetry');
    }
    const json = await res.json();
    return json.telemetry;
  },

  /**
   * Run server-side Computer Vision AI inference on crop image
   */
  async analyzeCropQuality(payload: {
    cropName?: string;
    category?: string;
    imageDataUri?: string;
    presetIndex?: number;
  }): Promise<AIQualityReport> {
    const res = await fetch('/api/ai/grade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to analyze crop quality');
    }
    const json = await res.json();
    return json.data;
  },

  /**
   * Fetch aggregated analytics and dashboard stats
   */
  async getStats(): Promise<DashboardStats> {
    const res = await fetch('/api/stats', { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }
    const json = await res.json();
    return json.data;
  },

  /**
   * Fetch system/blockchain notifications
   */
  async getNotifications(): Promise<UserNotification[]> {
    const res = await fetch('/api/notifications', { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Failed to fetch notifications');
    }
    const json = await res.json();
    return json.data || [];
  },

  /**
   * Add a notification
   */
  async addNotification(title: string, message: string, type: 'info' | 'success' | 'warning' = 'info'): Promise<UserNotification> {
    const res = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, message, type }),
    });
    if (!res.ok) {
      throw new Error('Failed to create notification');
    }
    const json = await res.json();
    return json.data;
  },

  /**
   * Reset persistent database to seed state
   */
  async resetToDefault(): Promise<ProduceBatch[]> {
    const res = await fetch('/api/seed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    if (!res.ok) {
      throw new Error('Failed to reset database');
    }
    const json = await res.json();
    return json.data || [];
  },

  /**
   * Check backend health
   */
  async checkHealth(): Promise<BackendHealth> {
    const res = await fetch('/api/health', { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Backend is unreachable');
    }
    return await res.json();
  }
};
