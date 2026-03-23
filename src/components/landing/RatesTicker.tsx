"use client";

import { useMemo } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { generateRates } from "@/lib/mock/rates";
import { formatPercent } from "@/lib/utils/format";

const TICKER_PAIRS = ["USD/EGP", "USD/AED", "EUR/USD", "GBP/USD", "BTC/USD"];

export default function RatesTicker() {
  const rates = useMemo(() => generateRates(), []);

  const tickerRates = TICKER_PAIRS.map((pair) => {
    // Handle reverse pairs like EUR/USD -> need to invert USD/EUR
    const found = rates.find((r) => r.pair === pair);
    if (found) return found;

    // Check if the inverted pair exists (e.g., USD/EUR for EUR/USD)
    const [base, quote] = pair.split("/");
    const inverted = rates.find((r) => r.pair === `${quote}/${base}`);
    if (inverted) {
      return {
        pair,
        buy: parseFloat((1 / inverted.sell).toPrecision(6)),
        sell: parseFloat((1 / inverted.buy).toPrecision(6)),
        change24h: -inverted.change24h,
      };
    }

    return null;
  }).filter(Boolean);

  // Duplicate for seamless loop
  const items = [...tickerRates, ...tickerRates];

  return (
    <section className="overflow-hidden border-y border-surface-border bg-forest-900/80">
      <div className="relative">
        <div className="animate-ticker flex w-max gap-0">
          {items.map((rate, i) => {
            if (!rate) return null;
            const isPositive = rate.change24h >= 0;
            return (
              <div
                key={`${rate.pair}-${i}`}
                className="flex items-center gap-4 border-r border-surface-border px-8 py-4"
              >
                <span className="text-sm font-semibold text-white">
                  {rate.pair}
                </span>
                <span className="text-sm font-medium text-white/80">
                  {rate.buy >= 100
                    ? rate.buy.toFixed(2)
                    : rate.buy >= 1
                      ? rate.buy.toFixed(4)
                      : rate.buy.toPrecision(6)}
                </span>
                <span
                  className={`flex items-center gap-1 text-xs font-medium ${
                    isPositive ? "text-success" : "text-danger"
                  }`}
                >
                  {isPositive ? (
                    <ArrowUp size={12} />
                  ) : (
                    <ArrowDown size={12} />
                  )}
                  {formatPercent(rate.change24h)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
