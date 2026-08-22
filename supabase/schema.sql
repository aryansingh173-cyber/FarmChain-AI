-- =========================================================================
-- FARMCHAIN AI - SUPABASE POSTGRESQL SCHEMA & INITIAL DATA SEED
-- =========================================================================
-- Copy and run this script inside your Supabase Project -> SQL Editor
-- =========================================================================

-- 1. Create Produce Batches Table
CREATE TABLE IF NOT EXISTS public.batches (
    id TEXT PRIMARY KEY,
    crop_name TEXT NOT NULL,
    category TEXT NOT NULL,
    variety TEXT NOT NULL,
    quantity_kg NUMERIC NOT NULL,
    base_price_per_kg NUMERIC NOT NULL,
    total_price_inr NUMERIC NOT NULL,
    harvest_date TEXT NOT NULL,
    farm_name TEXT NOT NULL,
    farmer_wallet TEXT NOT NULL,
    farm_location TEXT NOT NULL,
    farm_coordinates JSONB NOT NULL DEFAULT '{"lat": 31.6510, "lng": 78.4752}'::jsonb,
    current_stage TEXT NOT NULL DEFAULT 'Registered',
    escrow_contract_address TEXT NOT NULL,
    escrow_status TEXT NOT NULL DEFAULT 'Locked',
    buyer_wallet TEXT,
    buyer_name TEXT,
    tx_hash_registration TEXT NOT NULL,
    tx_hash_escrow_release TEXT,
    ai_report JSONB,
    iot_telemetry JSONB,
    checkpoints JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info',
    read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create System Settings Table
CREATE TABLE IF NOT EXISTS public.system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- 5. Create Permissive Policies for Web3 / Public Demo API
CREATE POLICY "Allow public read access on batches" 
    ON public.batches FOR SELECT USING (true);

CREATE POLICY "Allow public insert access on batches" 
    ON public.batches FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access on batches" 
    ON public.batches FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access on batches" 
    ON public.batches FOR DELETE USING (true);

CREATE POLICY "Allow public all access on notifications" 
    ON public.notifications FOR ALL USING (true);

CREATE POLICY "Allow public all access on system_settings" 
    ON public.system_settings FOR ALL USING (true);

-- 6. Insert Initial System Settings
INSERT INTO public.system_settings (key, value)
VALUES ('treasury', '{"walletBalanceINR": 3540000}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 7. Seed Initial Produce Batches
INSERT INTO public.batches (
    id, crop_name, category, variety, quantity_kg, base_price_per_kg, total_price_inr,
    harvest_date, farm_name, farmer_wallet, farm_location, farm_coordinates,
    current_stage, escrow_contract_address, escrow_status, buyer_wallet, buyer_name,
    tx_hash_registration, ai_report, iot_telemetry, checkpoints
)
VALUES 
(
    'FC-2026-APL-8821',
    'Kinnaur Royal Apples',
    'Fruits',
    'Himachal Extra Crisp Organic',
    2500,
    180,
    450000,
    '2026-08-14',
    'Kinnaur Valley Agro Co-operative',
    '0x3A9F8e2b10492F0aB55C08985c7D1A21eEf68841',
    'Kinnaur, Himachal Pradesh, India',
    '{"lat": 31.6510, "lng": 78.4752}'::jsonb,
    'In Transit',
    '0x8849F0cB4916a2E4e78a635DeB96564C3dF39c6B',
    'Funds Deposited',
    '0x99B355aC465e6E19E703B0D38234B5927D3A11C4',
    'Reliance Fresh Direct Supply Chain',
    '0x7f4e823b1902a7dc42018274bb9f826354890c2918bbde47a82b99214df90234',
    '{
      "overallScore": 95,
      "grade": "Grade A+",
      "ripeness": 94,
      "colorUniformity": 97,
      "sizeDistribution": "Optimal Large",
      "shelfLifeEstDays": 28,
      "scannedAt": "2026-08-14T09:15:22Z",
      "imagePreview": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80",
      "modelVersion": "FarmVision-AgriCV-v4.2",
      "recommendedPricePremium": 14,
      "defectsDetected": [
        { "name": "Minor natural blemish", "confidence": 0.12, "area": "Top Calyx", "severity": "low" }
      ]
    }'::jsonb,
    '{
      "currentTemp": 3.8,
      "targetTempMin": 2.0,
      "targetTempMax": 5.0,
      "humidity": 89,
      "shockG": 0.2,
      "batteryPct": 88,
      "lastUpdated": "12 minutes ago",
      "locationName": "NH-44 Cold Corridor (Ambala Logistics Gateway)",
      "coordinates": { "lat": 30.3782, "lng": 76.7767 },
      "tempHistory": [
        { "time": "08:00", "temp": 3.5 },
        { "time": "11:00", "temp": 3.7 },
        { "time": "14:00", "temp": 3.9 },
        { "time": "17:00", "temp": 4.1 },
        { "time": "20:00", "temp": 3.8 }
      ]
    }'::jsonb,
    '[
      {
        "id": "cp-1",
        "stage": "Registered",
        "title": "Harvest Minted on Ledger",
        "location": "Kinnaur, Himachal Pradesh",
        "timestamp": "2026-08-14 08:30:00 UTC",
        "verifiedBy": "Farm Node (Kinnaur Co-op)",
        "txHash": "0x7f4e823b1902a7dc42018274bb9f826354890c2918bbde47a82b99214df90234",
        "notes": "Harvest certified organic.",
        "status": "completed"
      },
      {
        "id": "cp-2",
        "stage": "Quality Checked",
        "title": "Computer Vision AI Grading Passed",
        "location": "Shimla Sorting & AI Hub",
        "timestamp": "2026-08-14 09:15:22 UTC",
        "verifiedBy": "FarmVision Optical AI v4.2",
        "txHash": "0x4b9a12c83ef02918471629837492817264829103948572615483920194857261",
        "notes": "Score: 95/100 (Grade A+)",
        "status": "completed"
      },
      {
        "id": "cp-3",
        "stage": "In Transit",
        "title": "Loaded into Cold Chain Fleet",
        "location": "Ambala Freight Gateway Hub #2",
        "timestamp": "2026-08-14 13:40:00 UTC",
        "verifiedBy": "ColdCarrier Logistics Gateway",
        "txHash": "0x9928174659281746284910294857261548392019485726154839201948572610",
        "notes": "Temp calibrated at 3.8°C.",
        "status": "completed"
      }
    ]'::jsonb
),
(
    'FC-2026-MNG-4402',
    'Ratnagiri Alphonso Mangoes',
    'Fruits',
    'Devgad Geographical Indication (GI)',
    1200,
    450,
    540000,
    '2026-08-15',
    'Ratnagiri Coastal Orchards Estate',
    '0x68B3465e6E19E703B0D38234B5927D3A11C499A2',
    'Ratnagiri, Maharashtra, India',
    '{"lat": 16.9902, "lng": 73.3120}'::jsonb,
    'Quality Checked',
    '0x12A9B8e2b10492F0aB55C08985c7D1A21eEf6899',
    'Funds Deposited',
    '0x88F09aB55C08985c7D1A21eEf688410492F0aB3A',
    'Nature Basket Premium Gourmet',
    '0x55c08985c7d1a21eef688410492f0ab3a9f8e2b11902a7dc42018274bb9f8263',
    '{
      "overallScore": 98,
      "grade": "Grade A+",
      "ripeness": 96,
      "colorUniformity": 95,
      "sizeDistribution": "Optimal Large",
      "shelfLifeEstDays": 12,
      "scannedAt": "2026-08-15T11:00:00Z",
      "imagePreview": "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80",
      "modelVersion": "FarmVision-AgriCV-v4.2",
      "recommendedPricePremium": 18,
      "defectsDetected": []
    }'::jsonb,
    '{
      "currentTemp": 12.4,
      "targetTempMin": 10.0,
      "targetTempMax": 14.0,
      "humidity": 82,
      "shockG": 0.1,
      "batteryPct": 94,
      "lastUpdated": "25 minutes ago",
      "locationName": "Devgad Pre-Cooling Terminal",
      "coordinates": { "lat": 16.3725, "lng": 73.3768 },
      "tempHistory": [
        { "time": "10:00", "temp": 12.2 },
        { "time": "12:00", "temp": 12.4 }
      ]
    }'::jsonb,
    '[
      {
        "id": "cp-m1",
        "stage": "Registered",
        "title": "Harvest Minted on Ledger",
        "location": "Devgad, Ratnagiri, Maharashtra",
        "timestamp": "2026-08-15 07:00:00 UTC",
        "verifiedBy": "Orchard Node #12",
        "txHash": "0x55c08985c7d1a21eef688410492f0ab3a9f8e2b11902a7dc42018274bb9f8263",
        "notes": "Certified Geographical Indication (GI) crop.",
        "status": "completed"
      },
      {
        "id": "cp-m2",
        "stage": "Quality Checked",
        "title": "AI Brix & Optical Grading Passed",
        "location": "Ratnagiri Post-Harvest AI Lab",
        "timestamp": "2026-08-15 11:00:00 UTC",
        "verifiedBy": "FarmVision Optical AI v4.2",
        "txHash": "0x33b1902a7dc42018274bb9f826354890c2918bbde47a82b99214df902341234a",
        "notes": "Supreme export grade.",
        "status": "completed"
      }
    ]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 8. Seed Initial Notifications
INSERT INTO public.notifications (id, title, message, type, read)
VALUES
('notif-1', 'Escrow Multi-Sig Deployed', 'Smart Contract Escrow for Batch #FC-2026-APL-8821 funded with ₹4,50,000 INR on Polygon PoS', 'success', false),
('notif-2', 'AI Quality Engine Active', 'Computer Vision Optical Model v4.2 calibrated with 99.4% precision accuracy', 'info', true),
('notif-3', 'IoT Cold-Chain Carrier Node Online', 'Automated temperature & shock telemetry sensors streaming live GPS data', 'info', true)
ON CONFLICT (id) DO NOTHING;
