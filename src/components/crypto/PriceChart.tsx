"use client";

import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import Card from "@/components/ui/Card";
import Tabs from "@/components/ui/Tabs";
import { useRateStore } from "@/lib/stores/rate-store";
import { generateHistoricalRates } from "@/lib/mock/rates";
import { formatCurrency, formatPercent } from "@/lib/utils/format";

const TIME_RANGES = [
  { id: "7", label: "7D" },
  { id: "30", label: "30D" },
  { id: "90", label: "90D" },
];

interface PriceChartProps {
  currency: string;
  pair: string;
}

export default function PriceChart({ currency, pair }: PriceChartProps) {
  const [range, setRange] = useState("7");
  const rates = useRateStore((s) => s.rates);

  const currentRate = rates.find((r) => r.pair === pair);
  // rate.buy = units of crypto per 1 USD, so price in USD = 1 / rate.buy
  const currentPrice =
    currentRate && currentRate.buy > 0 ? 1 / currentRate.buy : 0;
  const change24h = currentRate?.change24h ?? 0;
  const isPositive = change24h >= 0;

  const data = useMemo(() => {
    const historical = generateHistoricalRates(pair, Number(range));
    // rate field = units of crypto per 1 USD, so invert for USD price
    return historical.map((d) => ({
      date: d.date,
      price: d.rate > 0 ? 1 / d.rate : 0,
    }));
  }, [pair, range]);

  return (
    <Card>
      <div className="space-y-4">
        {/* Header with price */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-white/50">{currency}/USD</p>
            <p className="mt-1 text-3xl font-bold text-white">
              {formatCurrency(currentPrice, "USD")}
            </p>
            <div className="mt-1 flex items-center gap-1">
              {isPositive ? (
                <TrendingUp size={14} className="text-success" />
              ) : (
                <TrendingDown size={14} className="text-danger" />
              )}
              <span
                className={`text-sm font-medium ${
                  isPositive ? "text-success" : "text-danger"
                }`}
              >
                {formatPercent(change24h)} (24h)
              </span>
            </div>
          </div>

          {/* Time range tabs */}
          <Tabs tabs={TIME_RANGES} activeTab={range} onChange={setRange} />
        </div>

        {/* Chart */}
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 4, right: 4, bottom: 0, left: 4 }}
            >
              <defs>
                <linearGradient
                  id={`priceGradient-${currency}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#D4A843" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#D4A843" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }}
                tickFormatter={(val) => {
                  const d = new Date(String(val));
                  return d.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis
                domain={["dataMin * 0.999", "dataMax * 1.001"]}
                hide
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#083D1F",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#fff",
                }}
                labelFormatter={(label) => {
                  const d = new Date(String(label));
                  return d.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                }}
                formatter={(value) => [
                  formatCurrency(Number(value), "USD"),
                  "Price",
                ]}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#D4A843"
                strokeWidth={2}
                fill={`url(#priceGradient-${currency})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
