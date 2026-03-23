"use client";

import { useMemo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import Card from "@/components/ui/Card";
import { useWalletStore } from "@/lib/stores/wallet-store";
import { useRateStore } from "@/lib/stores/rate-store";
import { formatCurrency, formatPercent } from "@/lib/utils/format";

const CRYPTO_META: Record<string, { icon: string; name: string }> = {
  BTC: { icon: "\u20BF", name: "Bitcoin" },
  ETH: { icon: "\u039E", name: "Ethereum" },
  USDT: { icon: "\u20AE", name: "Tether" },
  USDC: { icon: "$", name: "USD Coin" },
};

const CRYPTO_CODES = ["BTC", "ETH", "USDT", "USDC"] as const;

interface PortfolioProps {
  selectedCrypto?: string;
  onSelectCrypto?: (code: string) => void;
}

export default function Portfolio({
  selectedCrypto,
  onSelectCrypto,
}: PortfolioProps) {
  const wallets = useWalletStore((s) => s.wallets);
  const rates = useRateStore((s) => s.rates);

  const holdings = useMemo(() => {
    return CRYPTO_CODES.map((code) => {
      const wallet = wallets.find((w) => w.currency === code);
      const balance = wallet?.balance ?? 0;
      const rate = rates.find((r) => r.pair === `USD/${code}`);
      // rate.buy = how many units of crypto per 1 USD
      // So 1 unit of crypto = 1 / rate.buy USD
      const usdPrice = rate && rate.buy > 0 ? 1 / rate.buy : 0;
      const usdValue = balance * usdPrice;
      const change24h = rate?.change24h ?? 0;

      return {
        code,
        ...CRYPTO_META[code],
        balance,
        usdValue,
        change24h,
      };
    });
  }, [wallets, rates]);

  const totalValue = useMemo(
    () => holdings.reduce((sum, h) => sum + h.usdValue, 0),
    [holdings],
  );

  return (
    <div className="space-y-4">
      {/* Total portfolio value */}
      <div className="flex items-baseline gap-3">
        <h2 className="text-sm font-medium text-white/50">Portfolio Value</h2>
        <span className="text-2xl font-bold text-white">
          {formatCurrency(totalValue, "USD")}
        </span>
      </div>

      {/* Grid of crypto cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {holdings.map((holding) => {
          const isPositive = holding.change24h >= 0;
          const isSelected = selectedCrypto === holding.code;

          return (
            <Card
              key={holding.code}
              onClick={() => onSelectCrypto?.(holding.code)}
              className={`transition-all ${
                isSelected
                  ? "ring-2 ring-gold-500 ring-offset-0"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between">
                {/* Icon + name */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-500/10 text-lg font-bold text-gold-500">
                    {holding.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {holding.name}
                    </p>
                    <p className="text-xs text-white/40">{holding.code}</p>
                  </div>
                </div>

                {/* 24h change */}
                <div
                  className={`flex items-center gap-0.5 text-xs font-medium ${
                    isPositive ? "text-success" : "text-danger"
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp size={12} />
                  ) : (
                    <TrendingDown size={12} />
                  )}
                  {formatPercent(holding.change24h)}
                </div>
              </div>

              {/* Balance + USD value */}
              <div className="mt-4 space-y-1">
                <p className="text-lg font-bold text-white">
                  {formatCurrency(holding.balance, holding.code)}
                </p>
                <p className="text-xs text-white/40">
                  {formatCurrency(holding.usdValue, "USD")}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
