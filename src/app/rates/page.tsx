"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import { generateRates, generateHistoricalRates, type Rate } from "@/lib/mock/rates";
import { currencies } from "@/lib/mock/currencies";
import { formatPercent } from "@/lib/utils/format";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function getCurrencyInfo(code: string) {
  return currencies.find((c) => c.code === code);
}

export default function RatesPage() {
  const [selectedPair, setSelectedPair] = useState("USD/EGP");
  const [rates] = useState<Rate[]>(() => generateRates());

  const historicalData = useMemo(
    () => generateHistoricalRates(selectedPair, 30),
    [selectedPair]
  );

  const selectedRate = rates.find((r) => r.pair === selectedPair);
  const targetCode = selectedPair.split("/")[1];
  const targetCurrency = getCurrencyInfo(targetCode);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Title Section */}
        <section className="border-b border-surface-border bg-forest-900">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white sm:text-4xl">
                  Live Exchange Rates
                </h1>
                <p className="mt-2 text-white/50">
                  Updated every 30 seconds
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/40">
                <RefreshCw size={14} className="animate-spin" style={{ animationDuration: "3s" }} />
                <span>Live</span>
              </div>
            </div>
          </div>
        </section>

        {/* Rate Table */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Card>
            <div className="-mx-6 -my-4 overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-surface-border">
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/40">
                      Currency
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-white/40">
                      Buy Rate
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-white/40">
                      Sell Rate
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-white/40">
                      24h Change
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-white/40">
                      Spread
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rates.map((rate) => {
                    const code = rate.pair.split("/")[1];
                    const currency = getCurrencyInfo(code);
                    const spread = (
                      ((rate.buy - rate.sell) / rate.sell) *
                      100
                    ).toFixed(2);
                    const isSelected = rate.pair === selectedPair;
                    const isPositive = rate.change24h >= 0;

                    return (
                      <tr
                        key={rate.pair}
                        onClick={() => setSelectedPair(rate.pair)}
                        className={`cursor-pointer border-b border-surface-border transition-colors last:border-b-0 ${
                          isSelected
                            ? "bg-gold-500/10"
                            : "hover:bg-surface-hover"
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{currency?.flag}</span>
                            <div>
                              <p className="font-medium text-white">
                                {rate.pair}
                              </p>
                              <p className="text-xs text-white/40">
                                {currency?.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-sm text-white">
                          {rate.buy.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 6,
                          })}
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-sm text-white">
                          {rate.sell.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 6,
                          })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className={`inline-flex items-center gap-1 text-sm font-medium ${
                              isPositive ? "text-success" : "text-danger"
                            }`}
                          >
                            {isPositive ? (
                              <ArrowUpRight size={14} />
                            ) : (
                              <ArrowDownRight size={14} />
                            )}
                            {formatPercent(rate.change24h)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-sm text-white/60">
                          {spread}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* Historical Chart */}
        {selectedRate && (
          <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            <Card
              header={
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{targetCurrency?.flag}</span>
                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        {selectedPair} — 30 Day History
                      </h2>
                      <p className="text-sm text-white/40">
                        {targetCurrency?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-white/40">Current Rate</p>
                      <p className="font-mono text-lg font-semibold text-white">
                        {selectedRate.buy.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 6,
                        })}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                        selectedRate.change24h >= 0
                          ? "bg-success/15 text-success"
                          : "bg-danger/15 text-danger"
                      }`}
                    >
                      {selectedRate.change24h >= 0 ? (
                        <TrendingUp size={12} />
                      ) : (
                        <TrendingDown size={12} />
                      )}
                      {formatPercent(selectedRate.change24h)}
                    </span>
                  </div>
                </div>
              }
            >
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={historicalData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="rateGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="var(--color-gold-500)"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="100%"
                          stopColor="var(--color-gold-500)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.06)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                      tickLine={false}
                      axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                      tickFormatter={(value: string) => {
                        const d = new Date(value);
                        return d.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        });
                      }}
                      interval="preserveStartEnd"
                      minTickGap={40}
                    />
                    <YAxis
                      tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      domain={["auto", "auto"]}
                      tickFormatter={(value: number) =>
                        value.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 4,
                        })
                      }
                      width={80}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(10, 20, 15, 0.95)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "13px",
                      }}
                      labelFormatter={(label) => {
                        const d = new Date(String(label));
                        return d.toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        });
                      }}
                      formatter={(value) => [
                        Number(value ?? 0).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 6,
                        }),
                        "Rate",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="rate"
                      stroke="var(--color-gold-500)"
                      strokeWidth={2}
                      fill="url(#rateGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
