"use client";

import { useState, useCallback } from "react";
import { Bitcoin } from "lucide-react";
import Portfolio from "@/components/crypto/Portfolio";
import PriceChart from "@/components/crypto/PriceChart";
import CryptoTrader from "@/components/crypto/CryptoTrader";

export default function CryptoPage() {
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");

  const handleSelectCrypto = useCallback((code: string) => {
    setSelectedCrypto(code);
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500/10">
            <Bitcoin size={18} className="text-gold-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">Crypto Trading</h1>
        </div>
        <p className="text-sm text-white/50 ml-12">
          Buy, sell, and track your cryptocurrency portfolio
        </p>
      </div>

      {/* Portfolio overview - full width */}
      <Portfolio
        selectedCrypto={selectedCrypto}
        onSelectCrypto={handleSelectCrypto}
      />

      {/* Chart + Trader grid */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <PriceChart
          currency={selectedCrypto}
          pair={`USD/${selectedCrypto}`}
        />
        <CryptoTrader
          selectedCrypto={selectedCrypto}
          onSelectCrypto={handleSelectCrypto}
        />
      </div>
    </div>
  );
}
