import fs from 'fs';
import path from 'path';
import { 
  ProduceBatch, 
  BatchStage, 
  AIQualityReport, 
  CheckpointRecord, 
  UserNotification, 
  DashboardStats, 
  BackendHealth,
  TelemetryReadingInput 
} from '@/types';
import { INITIAL_BATCHES } from '@/lib/mockData';
import { BlockchainService } from './blockchain';
import { IoTTelemetryService } from './iot';
import { getSupabaseClient, isSupabaseConfigured } from './supabase';

interface DatabaseSchema {
  version: string;
  lastUpdated: string;
  batches: ProduceBatch[];
  notifications: UserNotification[];
  systemWalletBalanceINR: number;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE_PATH = path.join(DATA_DIR, 'farmchain.json');

const INITIAL_NOTIFICATIONS: UserNotification[] = [
  {
    id: 'notif-1',
    title: 'Escrow Multi-Sig Deployed',
    message: 'Smart Contract Escrow for Batch #FC-2026-APL-8821 funded with ₹4,50,000 INR on Polygon PoS',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false,
    type: 'success',
  },
  {
    id: 'notif-2',
    title: 'AI Quality Engine Active',
    message: 'Computer Vision Optical Model v4.2 calibrated with 99.4% precision accuracy',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: true,
    type: 'info',
  },
  {
    id: 'notif-3',
    title: 'IoT Cold-Chain Carrier Node Online',
    message: 'Automated temperature & shock telemetry sensors streaming live GPS data',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    read: true,
    type: 'info',
  }
];

export class Database {
  // =========================================================================
  // LOCAL DISK FILE PERSISTENCE HELPERS
  // =========================================================================
  private static ensureDatabaseFile(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (!fs.existsSync(DB_FILE_PATH)) {
        const initialData: DatabaseSchema = {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          batches: INITIAL_BATCHES,
          notifications: INITIAL_NOTIFICATIONS,
          systemWalletBalanceINR: 3540000,
        };
        fs.writeFileSync(DB_FILE_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
        return initialData;
      }

      const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      const parsed: DatabaseSchema = JSON.parse(fileContent);
      return parsed;
    } catch (error) {
      console.error('Error reading/initializing database file:', error);
      return {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        batches: INITIAL_BATCHES,
        notifications: INITIAL_NOTIFICATIONS,
        systemWalletBalanceINR: 3540000,
      };
    }
  }

  private static saveDatabase(data: DatabaseSchema): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      data.lastUpdated = new Date().toISOString();
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error writing to database file:', error);
    }
  }

  // =========================================================================
  // SUPABASE MAPPERS
  // =========================================================================
  private static rowToBatch(row: any): ProduceBatch {
    return {
      id: row.id,
      cropName: row.crop_name,
      category: row.category,
      variety: row.variety,
      quantityKg: Number(row.quantity_kg),
      basePricePerKg: Number(row.base_price_per_kg),
      totalPriceINR: Number(row.total_price_inr),
      harvestDate: row.harvest_date,
      farmName: row.farm_name,
      farmerWallet: row.farmer_wallet,
      farmLocation: row.farm_location,
      farmCoordinates: row.farm_coordinates || { lat: 31.6510, lng: 78.4752 },
      currentStage: row.current_stage,
      escrowContractAddress: row.escrow_contract_address,
      escrowStatus: row.escrow_status,
      buyerWallet: row.buyer_wallet || undefined,
      buyerName: row.buyer_name || undefined,
      txHashRegistration: row.tx_hash_registration,
      txHashEscrowRelease: row.tx_hash_escrow_release || undefined,
      aiReport: row.ai_report || undefined,
      iotTelemetry: row.iot_telemetry || undefined,
      checkpoints: Array.isArray(row.checkpoints) ? row.checkpoints : [],
      createdAt: row.created_at || new Date().toISOString(),
    };
  }

  private static batchToRow(batch: ProduceBatch): any {
    return {
      id: batch.id,
      crop_name: batch.cropName,
      category: batch.category,
      variety: batch.variety,
      quantity_kg: batch.quantityKg,
      base_price_per_kg: batch.basePricePerKg,
      total_price_inr: batch.totalPriceINR,
      harvest_date: batch.harvestDate,
      farm_name: batch.farmName,
      farmer_wallet: batch.farmerWallet,
      farm_location: batch.farmLocation,
      farm_coordinates: batch.farmCoordinates,
      current_stage: batch.currentStage,
      escrow_contract_address: batch.escrowContractAddress,
      escrow_status: batch.escrowStatus,
      buyer_wallet: batch.buyerWallet || null,
      buyer_name: batch.buyerName || null,
      tx_hash_registration: batch.txHashRegistration,
      tx_hash_escrow_release: batch.txHashEscrowRelease || null,
      ai_report: batch.aiReport || null,
      iot_telemetry: batch.iotTelemetry || null,
      checkpoints: batch.checkpoints || [],
      created_at: batch.createdAt,
    };
  }

  // =========================================================================
  // PUBLIC DATABASE METHODS (WITH SUPABASE + FALLBACK)
  // =========================================================================

  /**
   * Retrieves all produce batches with optional filtering
   */
  public static async getBatches(filter?: {
    stage?: string;
    category?: string;
    escrowStatus?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<ProduceBatch[]> {
    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        let query = supabase.from('batches').select('*').order('created_at', { ascending: false });

        if (filter?.stage && filter.stage !== 'all') {
          query = query.eq('current_stage', filter.stage);
        }
        if (filter?.category && filter.category !== 'all') {
          query = query.eq('category', filter.category);
        }
        if (filter?.escrowStatus && filter.escrowStatus !== 'all') {
          if (filter.escrowStatus === 'active') {
            query = query.in('escrow_status', ['Funds Deposited', 'Locked']);
          } else if (filter.escrowStatus === 'settled') {
            query = query.eq('escrow_status', 'Released to Farmer');
          } else {
            query = query.eq('escrow_status', filter.escrowStatus);
          }
        }
        if (filter?.search) {
          query = query.or(`crop_name.ilike.%${filter.search}%,id.ilike.%${filter.search}%,farm_name.ilike.%${filter.search}%`);
        }

        const { data, error } = await query;
        if (!error && Array.isArray(data) && data.length > 0) {
          return data.map(this.rowToBatch);
        }
      } catch (err) {
        console.warn('Supabase query failed, falling back to local storage:', err);
      }
    }

    // Local Disk Fallback
    const localData = this.ensureDatabaseFile();
    let result = [...localData.batches];

    if (filter?.stage && filter.stage !== 'all') {
      result = result.filter(b => b.currentStage.toLowerCase() === filter.stage?.toLowerCase());
    }
    if (filter?.category && filter.category !== 'all') {
      result = result.filter(b => b.category.toLowerCase() === filter.category?.toLowerCase());
    }
    if (filter?.escrowStatus && filter.escrowStatus !== 'all') {
      if (filter.escrowStatus === 'active') {
        result = result.filter(b => b.escrowStatus === 'Funds Deposited' || b.escrowStatus === 'Locked');
      } else if (filter.escrowStatus === 'settled') {
        result = result.filter(b => b.escrowStatus === 'Released to Farmer');
      } else {
        result = result.filter(b => b.escrowStatus.toLowerCase() === filter.escrowStatus?.toLowerCase());
      }
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        b =>
          b.cropName.toLowerCase().includes(q) ||
          b.id.toLowerCase().includes(q) ||
          b.farmName.toLowerCase().includes(q) ||
          b.farmLocation.toLowerCase().includes(q)
      );
    }

    if (typeof filter?.offset === 'number') {
      result = result.slice(filter.offset);
    }
    if (typeof filter?.limit === 'number') {
      result = result.slice(0, filter.limit);
    }

    return result;
  }

  /**
   * Retrieves a single batch by its unique ID
   */
  public static async getBatchById(id: string): Promise<ProduceBatch | null> {
    const cleanId = id.trim();
    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('batches')
          .select('*')
          .ilike('id', cleanId)
          .maybeSingle();

        if (!error && data) {
          return this.rowToBatch(data);
        }
      } catch (err) {
        console.warn('Supabase getBatchById failed, using local DB:', err);
      }
    }

    const localData = this.ensureDatabaseFile();
    const batch = localData.batches.find(b => b.id.toLowerCase() === cleanId.toLowerCase());
    return batch || null;
  }

  /**
   * Registers a new produce batch on the immutable ledger
   */
  public static async createBatch(
    batchData: Omit<ProduceBatch, 'id' | 'createdAt' | 'checkpoints' | 'escrowContractAddress' | 'escrowStatus' | 'txHashRegistration'>,
    aiReport?: AIQualityReport
  ): Promise<ProduceBatch> {
    const batchId = BlockchainService.generateBatchId(batchData.cropName);
    const txReg = BlockchainService.generateTxHash(`reg-${batchId}`);
    const escrowAddr = BlockchainService.generateContractAddress(`escrow-${batchId}`);
    const nowIso = new Date().toISOString();
    const nowReadable = nowIso.replace('T', ' ').substring(0, 19) + ' UTC';

    const checkpoints: CheckpointRecord[] = [
      {
        id: `cp-${Date.now()}-1`,
        stage: 'Registered',
        title: 'Harvest Registered & Minted on Chain',
        location: batchData.farmLocation,
        timestamp: nowReadable,
        verifiedBy: `Farm Node (${batchData.farmName})`,
        txHash: txReg,
        notes: `Batch of ${batchData.quantityKg.toLocaleString('en-IN')}kg ${batchData.cropName} registered into decentralized ledger.`,
        status: 'completed',
      }
    ];

    if (aiReport) {
      const aiTx = BlockchainService.generateTxHash(`ai-${batchId}`);
      checkpoints.push({
        id: `cp-${Date.now()}-2`,
        stage: 'Quality Checked',
        title: 'AI Computer Vision Inspection Passed',
        location: `${batchData.farmLocation} - Edge AI Lab`,
        timestamp: nowReadable,
        verifiedBy: `FarmChain AI Scanner (${aiReport.modelVersion})`,
        txHash: aiTx,
        notes: `Quality Score: ${aiReport.overallScore}/100 (${aiReport.grade}). Ripeness: ${aiReport.ripeness}%. Color Uniformity: ${aiReport.colorUniformity}%.`,
        status: 'completed',
      });
    }

    const initialTelemetry = IoTTelemetryService.createInitialTelemetry(
      batchData.farmLocation,
      batchData.farmCoordinates || { lat: 28.7041, lng: 77.1025 }
    );

    const newBatch: ProduceBatch = {
      ...batchData,
      id: batchId,
      createdAt: nowIso,
      currentStage: aiReport ? 'Quality Checked' : 'Registered',
      aiReport,
      checkpoints,
      escrowContractAddress: escrowAddr,
      escrowStatus: 'Locked',
      txHashRegistration: txReg,
      iotTelemetry: initialTelemetry,
    };

    // Save to Supabase if configured
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('batches').insert(this.batchToRow(newBatch));
        await supabase.from('notifications').insert({
          id: `notif-${Date.now()}`,
          title: `Batch Registered: ${batchId}`,
          message: `New produce batch ${batchId} (${newBatch.cropName} - ${newBatch.quantityKg}kg) registered and minted on Polygon ledger.`,
          type: 'success',
          read: false,
          created_at: nowIso,
        });
      } catch (err) {
        console.warn('Supabase batch insert error:', err);
      }
    }

    // Always mirror to local file for offline resilience
    const localData = this.ensureDatabaseFile();
    localData.batches.unshift(newBatch);
    localData.notifications.unshift({
      id: `notif-${Date.now()}`,
      title: `Batch Registered: ${batchId}`,
      message: `New produce batch ${batchId} (${newBatch.cropName} - ${newBatch.quantityKg}kg) registered and minted on Polygon ledger.`,
      timestamp: nowIso,
      read: false,
      type: 'success',
    });
    this.saveDatabase(localData);

    return newBatch;
  }

  /**
   * Appends a checkpoint and advances the batch stage
   */
  public static async addCheckpoint(
    batchId: string,
    stage: BatchStage,
    location: string,
    notes?: string,
    verifiedBy?: string
  ): Promise<ProduceBatch | null> {
    const existing = await this.getBatchById(batchId);
    if (!existing) return null;

    const txHash = BlockchainService.generateTxHash(`cp-${existing.id}-${stage}-${Date.now()}`);
    const nowIso = new Date().toISOString();
    const nowReadable = nowIso.replace('T', ' ').substring(0, 19) + ' UTC';

    const newCp: CheckpointRecord = {
      id: `cp-${Date.now()}`,
      stage: stage,
      title: `Milestone: ${stage}`,
      location: location || existing.farmLocation,
      timestamp: nowReadable,
      verifiedBy: verifiedBy || 'Carrier Logistics Oracle & Telemetry Gateway',
      txHash,
      notes: notes || `Batch state verified and progressed to ${stage}`,
      status: 'completed',
    };

    const updatedCheckpoints = [...existing.checkpoints, newCp];
    let updatedTelemetry = existing.iotTelemetry;
    if (updatedTelemetry) {
      updatedTelemetry = {
        ...updatedTelemetry,
        lastUpdated: 'Just now',
        locationName: location || updatedTelemetry.locationName,
      };
    }

    const updatedBatch: ProduceBatch = {
      ...existing,
      currentStage: stage,
      checkpoints: updatedCheckpoints,
      iotTelemetry: updatedTelemetry,
    };

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase
          .from('batches')
          .update({
            current_stage: stage,
            checkpoints: updatedCheckpoints,
            iot_telemetry: updatedTelemetry,
          })
          .eq('id', existing.id);
      } catch (err) {
        console.warn('Supabase checkpoint update failed:', err);
      }
    }

    // Mirror to local DB
    const localData = this.ensureDatabaseFile();
    const idx = localData.batches.findIndex(b => b.id.toLowerCase() === batchId.toLowerCase());
    if (idx !== -1) {
      localData.batches[idx] = updatedBatch;
      this.saveDatabase(localData);
    }

    return updatedBatch;
  }

  /**
   * Releases smart contract escrow payment directly to the farmer
   */
  public static async releaseEscrow(
    batchId: string,
    buyerWallet?: string
  ): Promise<{ batch: ProduceBatch; txHash: string; settledAmount: number } | null> {
    const existing = await this.getBatchById(batchId);
    if (!existing) return null;

    const settlement = BlockchainService.executeEscrowSettlement(existing);

    const settlementCp: CheckpointRecord = {
      id: `cp-settle-${Date.now()}`,
      stage: 'Settled',
      title: 'Smart Contract Escrow Released',
      location: 'Polygon Smart Contract (Multi-Sig Oracle)',
      timestamp: settlement.timestamp,
      verifiedBy: `Buyer Multi-Sig Cryptographic Release (${buyerWallet || existing.buyerWallet || 'Authorized Buyer'})`,
      txHash: settlement.txHash,
      notes: `Verified physical inspection passed. Escrow funds of ₹${existing.totalPriceINR.toLocaleString('en-IN')} released to Farmer (${existing.farmerWallet}).`,
      status: 'completed',
    };

    const updatedCheckpoints = [...existing.checkpoints, settlementCp];
    const updatedBatch: ProduceBatch = {
      ...existing,
      currentStage: 'Delivered',
      escrowStatus: 'Released to Farmer',
      txHashEscrowRelease: settlement.txHash,
      checkpoints: updatedCheckpoints,
    };

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase
          .from('batches')
          .update({
            current_stage: 'Delivered',
            escrow_status: 'Released to Farmer',
            tx_hash_escrow_release: settlement.txHash,
            checkpoints: updatedCheckpoints,
          })
          .eq('id', existing.id);
      } catch (err) {
        console.warn('Supabase escrow release update failed:', err);
      }
    }

    // Mirror to local file
    const localData = this.ensureDatabaseFile();
    const idx = localData.batches.findIndex(b => b.id.toLowerCase() === batchId.toLowerCase());
    if (idx !== -1) {
      localData.batches[idx] = updatedBatch;
      localData.systemWalletBalanceINR = Math.max(0, localData.systemWalletBalanceINR - existing.totalPriceINR);
      this.saveDatabase(localData);
    }

    return {
      batch: updatedBatch,
      txHash: settlement.txHash,
      settledAmount: existing.totalPriceINR,
    };
  }

  /**
   * Ingests IoT telemetry metrics from sensors
   */
  public static async updateTelemetry(
    batchId: string,
    input: TelemetryReadingInput
  ): Promise<ProduceBatch | null> {
    const existing = await this.getBatchById(batchId);
    if (!existing) return null;

    const { telemetry, alert } = IoTTelemetryService.updateTelemetry(existing.iotTelemetry, input);
    const updatedBatch: ProduceBatch = {
      ...existing,
      iotTelemetry: telemetry,
    };

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase
          .from('batches')
          .update({ iot_telemetry: telemetry })
          .eq('id', existing.id);
      } catch (err) {
        console.warn('Supabase telemetry update failed:', err);
      }
    }

    const localData = this.ensureDatabaseFile();
    const idx = localData.batches.findIndex(b => b.id.toLowerCase() === batchId.toLowerCase());
    if (idx !== -1) {
      localData.batches[idx] = updatedBatch;
      this.saveDatabase(localData);
    }

    return updatedBatch;
  }

  /**
   * Retrieves high-level agro-chain platform statistics
   */
  public static async getStats(): Promise<DashboardStats> {
    const batches = await this.getBatches();

    const totalBatches = batches.length;
    const totalVolumeKg = batches.reduce((acc, b) => acc + (b.quantityKg || 0), 0);
    const activeEscrowLockedINR = batches
      .filter(b => b.escrowStatus === 'Funds Deposited' || b.escrowStatus === 'Locked')
      .reduce((acc, b) => acc + (b.totalPriceINR || 0), 0);
    const totalSettledINR = batches
      .filter(b => b.escrowStatus === 'Released to Farmer')
      .reduce((acc, b) => acc + (b.totalPriceINR || 0), 0);
    
    const validScores = batches.filter(b => b.aiReport?.overallScore).map(b => b.aiReport!.overallScore);
    const avgQualityScore = validScores.length > 0 
      ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) 
      : 94;

    const activeTransits = batches.filter(b => b.currentStage === 'In Transit').length;
    const complianceRate = 99.2;

    return {
      totalBatches,
      totalVolumeKg,
      activeEscrowLockedINR,
      totalSettledINR,
      avgQualityScore,
      activeTransits,
      complianceRate,
    };
  }

  /**
   * Retrieves notifications
   */
  public static async getNotifications(): Promise<UserNotification[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        if (!error && Array.isArray(data) && data.length > 0) {
          return data.map(n => ({
            id: n.id,
            title: n.title,
            message: n.message,
            timestamp: n.created_at,
            read: n.read,
            type: n.type,
          }));
        }
      } catch (err) {
        console.warn('Supabase notifications query failed:', err);
      }
    }

    const localData = this.ensureDatabaseFile();
    return localData.notifications.slice(0, 20);
  }

  /**
   * Adds a notification
   */
  public static async addNotification(
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' = 'info'
  ): Promise<UserNotification> {
    const notif: UserNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      type,
    };

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('notifications').insert({
          id: notif.id,
          title: notif.title,
          message: notif.message,
          type: notif.type,
          read: false,
          created_at: notif.timestamp,
        });
      } catch (err) {
        console.warn('Supabase notification insert failed:', err);
      }
    }

    const localData = this.ensureDatabaseFile();
    localData.notifications.unshift(notif);
    this.saveDatabase(localData);

    return notif;
  }

  /**
   * Resets database back to default seed data
   */
  public static async seedDatabase(customBatches?: ProduceBatch[]): Promise<ProduceBatch[]> {
    const seedBatches = customBatches && customBatches.length > 0 ? customBatches : INITIAL_BATCHES;

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('batches').delete().neq('id', '___');
        const rows = seedBatches.map(this.batchToRow);
        await supabase.from('batches').insert(rows);
      } catch (err) {
        console.warn('Supabase seed failed:', err);
      }
    }

    const localData: DatabaseSchema = {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      batches: seedBatches,
      notifications: [
        {
          id: `notif-reset-${Date.now()}`,
          title: 'Ledger Reset to Seed State',
          message: 'FarmChain database and blockchain contracts re-initialized with sample verified batches.',
          timestamp: new Date().toISOString(),
          read: false,
          type: 'info',
        },
        ...INITIAL_NOTIFICATIONS,
      ],
      systemWalletBalanceINR: 3540000,
    };
    this.saveDatabase(localData);

    return seedBatches;
  }

  /**
   * Returns health status of server, database, and Supabase integration
   */
  public static async getHealth(): Promise<BackendHealth & { supabase: { connected: boolean; configured: boolean } }> {
    const localData = this.ensureDatabaseFile();
    const supabaseConfigured = isSupabaseConfigured();
    let supabaseConnected = false;

    if (supabaseConfigured) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const { count, error } = await supabase.from('batches').select('*', { count: 'exact', head: true });
          supabaseConnected = !error;
        } catch {
          supabaseConnected = false;
        }
      }
    }

    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      database: {
        batchesCount: localData.batches.length,
        notificationsCount: localData.notifications.length,
        persistedFilePath: DB_FILE_PATH,
      },
      blockchain: {
        network: 'Polygon PoS Mainnet (AgriOracle)',
        chainHex: '0x89',
        oracleStatus: 'Synced & Active',
      },
      supabase: {
        configured: supabaseConfigured,
        connected: supabaseConnected,
      },
    };
  }
}
