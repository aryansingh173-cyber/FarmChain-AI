export type BatchStage = 'Registered' | 'Quality Checked' | 'In Transit' | 'Delivered' | 'Settled';

export type QualityGrade = 'Grade A+' | 'Grade A' | 'Grade B' | 'Grade C' | 'Rejected';

export interface DefectItem {
  name: string;
  confidence: number;
  area: string;
  severity: 'low' | 'medium' | 'high' | 'none';
}

export interface AIQualityReport {
  overallScore: number; // 0 - 100
  grade: QualityGrade;
  ripeness: number; // 0 - 100%
  defectsDetected: DefectItem[];
  colorUniformity: number; // 0 - 100%
  sizeDistribution: 'Small' | 'Medium' | 'Optimal Large' | 'Extra Large';
  shelfLifeEstDays: number;
  scannedAt: string;
  imagePreview: string;
  modelVersion: string;
  recommendedPricePremium: number; // e.g. +12%
}

export interface IoTTelemetry {
  currentTemp: number; // °C
  targetTempMin: number;
  targetTempMax: number;
  humidity: number; // %
  shockG: number; // G force
  batteryPct: number;
  lastUpdated: string;
  locationName: string;
  coordinates: { lat: number; lng: number };
  tempHistory: { time: string; temp: number }[];
}

export interface CheckpointRecord {
  id: string;
  stage: BatchStage;
  title: string;
  location: string;
  timestamp: string;
  verifiedBy: string;
  txHash: string;
  notes?: string;
  status: 'completed' | 'in-progress' | 'pending';
}

export interface ProduceBatch {
  id: string;
  cropName: string;
  category: 'Fruits' | 'Vegetables' | 'Grains' | 'Dairy' | 'Cash Crops';
  variety: string;
  quantityKg: number;
  basePricePerKg: number; // In INR (₹)
  totalPriceINR: number; // Total in INR (₹)
  harvestDate: string;
  farmName: string;
  farmerWallet: string;
  farmLocation: string;
  farmCoordinates: { lat: number; lng: number };
  currentStage: BatchStage;
  aiReport?: AIQualityReport;
  iotTelemetry?: IoTTelemetry;
  checkpoints: CheckpointRecord[];
  buyerWallet?: string;
  buyerName?: string;
  escrowContractAddress: string;
  escrowStatus: 'Locked' | 'Funds Deposited' | 'Released to Farmer' | 'Disputed';
  txHashRegistration: string;
  txHashEscrowRelease?: string;
  createdAt: string;
}

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

export interface DashboardStats {
  totalBatches: number;
  totalVolumeKg: number;
  activeEscrowLockedINR: number;
  totalSettledINR: number;
  avgQualityScore: number;
  activeTransits: number;
  complianceRate: number;
}

export interface TelemetryReadingInput {
  currentTemp?: number;
  humidity?: number;
  shockG?: number;
  batteryPct?: number;
  locationName?: string;
  coordinates?: { lat: number; lng: number };
  note?: string;
}

export interface BackendHealth {
  status: 'healthy' | 'degraded' | 'error';
  timestamp: string;
  version: string;
  database: {
    batchesCount: number;
    notificationsCount: number;
    persistedFilePath: string;
  };
  blockchain: {
    network: string;
    chainHex: string;
    oracleStatus: string;
  };
}
