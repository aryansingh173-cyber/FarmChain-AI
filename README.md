# FarmChain AI 🌾⛓️

> **Next-Gen Decentralized Agricultural Supply Chain & Provenance Protocol**  
> Powered by Next.js 14, Supabase PostgreSQL, Computer Vision AI Quality Grading, IoT Cold-Chain Oracle Telemetry, and Smart Contract Escrow Settlements.

---

## 🚀 Features

- **🌾 Farmer Harvest Registry**: Mint harvest batches directly to the ledger with geolocation, batch identifiers, and optical certificates.
- **👁️ AI Optical Quality Grading**: Edge & Cloud Computer Vision models (`FarmVision-AgriCV-v4.2-Pro`) detecting ripeness, color distribution, and surface blemishes with fair price premium suggestions.
- **🚚 Cold-Chain IoT Telemetry Gateway**: Real-time temperature, humidity, and shock G monitoring with automated breach alerts.
- **🔒 Smart Contract Multi-Sig Escrow**: Wholesale buyer escrow fund locking and automated release to farmer wallets upon verified delivery.
- **📱 Public QR Provenance Verification**: Consumer-facing authenticity certificate displaying cryptographic Merkle roots, block numbers, and tamper-proof milestone timelines.
- **⚡ Dual-Mode Backend**: Integrated Next.js 14 Route Handlers with Supabase PostgreSQL and resilient local disk fallback.

---

## 🛠️ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Setup Supabase Database
Run the SQL schema in `supabase/schema.sql` inside your Supabase project's **SQL Editor**.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL) + Local ACID JSON fallback
- **Styling**: Tailwind CSS & Lucide Icons
- **Animations**: GSAP & Canvas Confetti
- **Language**: TypeScript
