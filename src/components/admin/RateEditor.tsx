"use client";

import { useState } from "react";
import { RefreshCw, Save } from "lucide-react";
import { useRateStore } from "@/lib/stores/rate-store";
import Button from "@/components/ui/Button";
import Toggle from "@/components/ui/Toggle";

export default function RateEditor() {
  const rates = useRateStore((s) => s.rates);
  const lastUpdated = useRateStore((s) => s.lastUpdated);
  const refresh = useRateStore((s) => s.refresh);

  const [autoFeed, setAutoFeed] = useState(true);
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{
    buy: string;
    sell: string;
  }>({ buy: "", sell: "" });
  const [refreshing, setRefreshing] = useState(false);

  const handleEdit = (pair: string, buy: number, sell: number) => {
    setEditingRow(pair);
    setEditValues({ buy: String(buy), sell: String(sell) });
  };

  const handleSave = (pair: string) => {
    alert(`Rates saved for ${pair}: Buy ${editValues.buy}, Sell ${editValues.sell}`);
    setEditingRow(null);
  };

  const handleCancel = () => {
    setEditingRow(null);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    refresh();
    setTimeout(() => setRefreshing(false), 600);
  };

  const calcMargin = (buy: number, sell: number) => {
    const mid = (buy + sell) / 2;
    return ((buy - sell) / mid * 100).toFixed(3);
  };

  const calcSpread = (buy: number, sell: number) => {
    return (buy - sell).toPrecision(4);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Toggle enabled={autoFeed} onChange={setAutoFeed} label="Auto Feed" />
          <span className="text-xs text-white/40">
            Last updated: {new Date(lastUpdated).toLocaleTimeString()}
          </span>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleRefresh}
          loading={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw size={14} />
          Refresh Rates
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-[var(--radius-card)] border border-surface-border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-surface-border bg-surface-card">
              <th className="px-4 py-3 font-medium text-white/50">Pair</th>
              <th className="px-4 py-3 font-medium text-white/50">Buy Rate</th>
              <th className="px-4 py-3 font-medium text-white/50">Sell Rate</th>
              <th className="px-4 py-3 font-medium text-white/50">Margin %</th>
              <th className="px-4 py-3 font-medium text-white/50">Spread</th>
              <th className="px-4 py-3 font-medium text-white/50">24h Change</th>
              <th className="px-4 py-3 font-medium text-white/50">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rates.map((rate) => {
              const isEditing = editingRow === rate.pair;
              return (
                <tr
                  key={rate.pair}
                  className="border-b border-surface-border transition-colors hover:bg-surface-hover"
                >
                  <td className="px-4 py-3 font-medium text-white">{rate.pair}</td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        type="number"
                        step="any"
                        value={editValues.buy}
                        onChange={(e) =>
                          setEditValues((v) => ({ ...v, buy: e.target.value }))
                        }
                        className="w-28 rounded-lg border border-gold-500/50 bg-surface-card px-2 py-1 text-sm text-white outline-none focus:border-gold-500"
                      />
                    ) : (
                      <span className="text-white/80">{rate.buy}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        type="number"
                        step="any"
                        value={editValues.sell}
                        onChange={(e) =>
                          setEditValues((v) => ({ ...v, sell: e.target.value }))
                        }
                        className="w-28 rounded-lg border border-gold-500/50 bg-surface-card px-2 py-1 text-sm text-white outline-none focus:border-gold-500"
                      />
                    ) : (
                      <span className="text-white/80">{rate.sell}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-white/60">
                    {calcMargin(
                      isEditing ? Number(editValues.buy) || rate.buy : rate.buy,
                      isEditing ? Number(editValues.sell) || rate.sell : rate.sell
                    )}%
                  </td>
                  <td className="px-4 py-3 text-white/60">
                    {calcSpread(
                      isEditing ? Number(editValues.buy) || rate.buy : rate.buy,
                      isEditing ? Number(editValues.sell) || rate.sell : rate.sell
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-sm font-medium ${
                        rate.change24h >= 0 ? "text-success" : "text-danger"
                      }`}
                    >
                      {rate.change24h >= 0 ? "+" : ""}
                      {rate.change24h}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleSave(rate.pair)}
                          className="flex items-center gap-1"
                        >
                          <Save size={12} />
                          Save
                        </Button>
                        <Button variant="secondary" size="sm" onClick={handleCancel}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(rate.pair, rate.buy, rate.sell)}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-gold-500 transition-colors hover:bg-gold-500/10"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
