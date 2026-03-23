"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import Card from "@/components/ui/Card";
import { useRateStore } from "@/lib/stores/rate-store";
import { formatCurrency } from "@/lib/utils/format";
import { getCurrency } from "@/lib/mock/currencies";

interface RateDisplayProps {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  fee: number;
}

const LOCK_DURATION = 30; // seconds

export default function RateDisplay({
  fromCurrency,
  toCurrency,
  fromAmount,
  toAmount,
  fee,
}: RateDisplayProps) {
  const [countdown, setCountdown] = useState(LOCK_DURATION);
  const rates = useRateStore((s) => s.rates);
  const refresh = useRateStore((s) => s.refresh);

  // Resolve display rate
  const getDisplayRate = useCallback(() => {
    const directPair = rates.find((r) => r.pair === `USD/${toCurrency}`);
    const inversePair = rates.find((r) => r.pair === `USD/${fromCurrency}`);

    if (fromCurrency === "USD" && directPair) {
      return directPair.sell;
    }
    if (toCurrency === "USD" && inversePair) {
      return 1 / inversePair.buy;
    }
    if (inversePair && directPair) {
      return (1 / inversePair.buy) * directPair.sell;
    }
    return null;
  }, [rates, fromCurrency, toCurrency]);

  const displayRate = getDisplayRate();

  // Countdown timer
  useEffect(() => {
    setCountdown(LOCK_DURATION);
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          refresh();
          return LOCK_DURATION;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [refresh]);

  // SVG circle properties for the countdown ring
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const progress = countdown / LOCK_DURATION;
  const strokeDashoffset = circumference * (1 - progress);

  const total = fromAmount + fee;

  const fromSymbol = getCurrency(fromCurrency)?.symbol ?? fromCurrency;
  const toSymbol = getCurrency(toCurrency)?.symbol ?? toCurrency;

  return (
    <div className="space-y-4">
      {/* Current Rate */}
      <Card>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-white/40 mb-1">
              Current Rate
            </p>
            {displayRate !== null ? (
              <p className="text-xl font-bold text-white">
                1 {fromCurrency} ={" "}
                {displayRate.toLocaleString("en-US", {
                  maximumFractionDigits: 6,
                })}{" "}
                {toCurrency}
              </p>
            ) : (
              <p className="text-lg text-white/50">Rate unavailable</p>
            )}
          </div>

          {/* Circular countdown */}
          <div className="relative flex flex-col items-center shrink-0">
            <svg
              width="56"
              height="56"
              className="-rotate-90"
            >
              {/* Background circle */}
              <circle
                cx="28"
                cy="28"
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="3"
              />
              {/* Progress circle */}
              <motion.circle
                cx="28"
                cy="28"
                r={radius}
                fill="none"
                stroke="var(--color-gold-500)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={circumference}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.5, ease: "linear" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-gold-400">
                {countdown}s
              </span>
            </div>
            <p className="mt-1 text-[10px] text-white/40 text-center whitespace-nowrap">
              Rate locks in
            </p>
          </div>
        </div>
      </Card>

      {/* Fee Breakdown */}
      <Card
        header={
          <div className="flex items-center gap-2">
            <RefreshCw size={14} className="text-gold-500" />
            <span className="text-sm font-semibold text-white">
              Fee Breakdown
            </span>
          </div>
        }
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/50">Exchange amount</span>
            <span className="text-white font-medium">
              {formatCurrency(fromAmount, fromCurrency)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-white/50">Exchange fee</span>
            <span className="text-white font-medium">
              {fromSymbol}
              {fee.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="border-t border-surface-border my-1" />

          <div className="flex items-center justify-between text-sm">
            <span className="text-white/50">Total deducted</span>
            <span className="text-white font-semibold">
              {fromSymbol}
              {total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-white/50">Amount received</span>
            <span className="text-gold-400 font-bold text-base">
              {toAmount > 0
                ? formatCurrency(toAmount, toCurrency)
                : `${toSymbol}0.00`}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
