"use client";

import { useMemo } from "react";
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
import { useRateStore } from "@/lib/stores/rate-store";
import { generateHistoricalRates } from "@/lib/mock/rates";
import { formatPercent } from "@/lib/utils/format";

export default function RateChart() {
  const rates = useRateStore((s) => s.rates);

  const usdEgp = rates.find((r) => r.pair === "USD/EGP");
  const currentRate = usdEgp?.buy ?? 0;
  const change24h = usdEgp?.change24h ?? 0;
  const isPositive = change24h >= 0;

  const data = useMemo(() => generateHistoricalRates("USD/EGP", 7), []);

  return (
    <Card
      header={
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Exchange Rate</h3>
          <span className="text-xs text-white/40">USD/EGP - 7 days</span>
        </div>
      }
    >
      {/* Current rate */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white">
            {currentRate.toFixed(2)}
          </span>
          <span className="text-sm text-white/40">EGP</span>
        </div>
        <div className="mt-1 flex items-center gap-1">
          {isPositive ? (
            <TrendingUp size={14} className="text-success" />
          ) : (
            <TrendingDown size={14} className="text-danger" />
          )}
          <span
            className={`text-xs font-medium ${
              isPositive ? "text-success" : "text-danger"
            }`}
          >
            {formatPercent(change24h)} (24h)
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[160px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 4, right: 4, bottom: 0, left: 4 }}
          >
            <defs>
              <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22C55E" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }}
              tickFormatter={(val: string) => {
                const d = new Date(val);
                return d.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              domain={["dataMin - 0.1", "dataMax + 0.1"]}
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
              formatter={(value) => [Number(value).toFixed(2), "Rate"]}
            />
            <Area
              type="monotone"
              dataKey="rate"
              stroke="#22C55E"
              strokeWidth={2}
              fill="url(#rateGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
