import type { Metadata } from "next";
import "./globals.css";
import { FarmChainProvider } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "FarmChain AI — Verified, Transparent & Fair Agricultural Blockchain",
  description: "Next-generation agricultural provenance platform combining AI computer vision quality grading, IoT cold-chain telemetry, and automated smart contract escrow on blockchain.",
  keywords: ["agricultural blockchain", "AI crop grading", "smart contract escrow", "farm to table", "produce provenance", "IoT cold chain"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#030c08] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-black relative">
        <FarmChainProvider>
          {/* Layered Modern Dark Green Ambient Atmosphere */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Top Emerald Aurora Glow */}
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-b from-emerald-500/20 via-teal-600/15 to-transparent rounded-full blur-[100px]" />
            
            {/* Ambient Corner & Center Orbs */}
            <div className="absolute top-1/4 -left-32 w-[550px] h-[550px] bg-emerald-600/15 rounded-full blur-[120px]" />
            <div className="absolute top-2/3 -right-32 w-[600px] h-[600px] bg-teal-500/15 rounded-full blur-[130px]" />
            <div className="absolute -bottom-32 left-1/3 w-[700px] h-[700px] bg-lime-500/10 rounded-full blur-[140px]" />
            
            {/* Cyber Agro Grid Pattern */}
            <div className="absolute inset-0 bg-cyber-grid bg-[size:36px_36px] opacity-45" />
          </div>

          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </FarmChainProvider>
      </body>
    </html>
  );
}
