"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowDownUp, ChevronDown, Search } from "lucide-react";
import { currencies, getCurrency } from "@/lib/mock/currencies";
import { useRateStore } from "@/lib/stores/rate-store";
import { useWalletStore } from "@/lib/stores/wallet-store";
import { formatCurrency } from "@/lib/utils/format";

interface ExchangeFormProps {
  onExchange: (data: {
    from: string;
    to: string;
    fromAmount: number;
    toAmount: number;
  }) => void;
}

/* ---------- Currency Dropdown ---------- */

function CurrencyDropdown({
  value,
  onChange,
  excludeCode,
  label,
}: {
  value: string;
  onChange: (code: string) => void;
  excludeCode?: string;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    return currencies.filter((c) => {
      if (c.code === excludeCode) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q)
      );
    });
  }, [search, excludeCode]);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus search when opened
  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  const selected = getCurrency(value);

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-xs font-medium uppercase tracking-wider text-white/40 mb-1.5">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface-card px-3 py-2.5 text-sm text-white transition-colors hover:bg-surface-hover focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500/30 w-full"
      >
        <span className="text-lg leading-none">{selected?.flag}</span>
        <span className="font-semibold">{value}</span>
        <span className="text-white/50 hidden sm:inline truncate">
          {selected?.name}
        </span>
        <ChevronDown
          size={16}
          className={`ml-auto text-white/40 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full min-w-[260px] rounded-lg border border-surface-border bg-forest-900 shadow-2xl">
          {/* Search */}
          <div className="border-b border-surface-border p-2">
            <div className="relative">
              <Search
                size={14}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40"
              />
              <input
                ref={searchRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search currency..."
                className="w-full rounded-md border border-surface-border bg-surface-card py-1.5 pl-8 pr-3 text-sm text-white placeholder-white/30 outline-none focus:border-gold-500"
              />
            </div>
          </div>

          {/* List */}
          <div className="max-h-56 overflow-y-auto p-1">
            {filtered.length === 0 && (
              <p className="px-3 py-2 text-xs text-white/40">
                No currencies found
              </p>
            )}
            {filtered.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  onChange(c.code);
                  setOpen(false);
                  setSearch("");
                }}
                className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors hover:bg-surface-hover ${
                  c.code === value ? "bg-surface-hover text-gold-400" : "text-white"
                }`}
              >
                <span className="text-base leading-none">{c.flag}</span>
                <span className="font-semibold">{c.code}</span>
                <span className="text-white/50 truncate">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Exchange Form ---------- */

export default function ExchangeForm({ onExchange }: ExchangeFormProps) {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EGP");
  const [fromAmount, setFromAmount] = useState<string>("100");
  const [swapRotation, setSwapRotation] = useState(0);

  const rates = useRateStore((s) => s.rates);
  const getBalance = useWalletStore((s) => s.getBalance);

  // Resolve the effective sell rate for fromCurrency -> toCurrency
  const getEffectiveRate = useCallback(
    (from: string, to: string): number | null => {
      // Direct pair: USD/XXX
      const directPair = rates.find((r) => r.pair === `USD/${to}`);
      const inversePair = rates.find((r) => r.pair === `USD/${from}`);

      if (from === "USD" && directPair) {
        return directPair.sell;
      }
      if (to === "USD" && inversePair) {
        return 1 / inversePair.buy;
      }
      // Cross-pair: go through USD
      if (inversePair && directPair) {
        // fromCurrency -> USD -> toCurrency
        const fromToUsd = 1 / inversePair.buy;
        const usdToTo = directPair.sell;
        return fromToUsd * usdToTo;
      }
      return null;
    },
    [rates],
  );

  const effectiveRate = useMemo(
    () => getEffectiveRate(fromCurrency, toCurrency),
    [fromCurrency, toCurrency, getEffectiveRate],
  );

  const parsedFromAmount = parseFloat(fromAmount) || 0;

  const toAmount = useMemo(() => {
    if (!effectiveRate || parsedFromAmount <= 0) return 0;
    return parseFloat((parsedFromAmount * effectiveRate).toPrecision(8));
  }, [parsedFromAmount, effectiveRate]);

  const fromBalance = getBalance(fromCurrency);

  function handleSwap() {
    setSwapRotation((prev) => prev + 180);
    const prevFrom = fromCurrency;
    const prevTo = toCurrency;
    setFromCurrency(prevTo);
    setToCurrency(prevFrom);
  }

  function handleAmountChange(value: string) {
    // Allow empty, digits, and a single decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFromAmount(value);
    }
  }

  // Expose current exchange data to parent via callback on every relevant change
  useEffect(() => {
    if (parsedFromAmount > 0 && toAmount > 0) {
      onExchange({
        from: fromCurrency,
        to: toCurrency,
        fromAmount: parsedFromAmount,
        toAmount,
      });
    }
  }, [fromCurrency, toCurrency, parsedFromAmount, toAmount, onExchange]);

  return (
    <div className="space-y-1">
      {/* Source section */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
          <div className="sm:w-48">
            <CurrencyDropdown
              value={fromCurrency}
              onChange={setFromCurrency}
              excludeCode={toCurrency}
              label="You send"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium uppercase tracking-wider text-white/40 mb-1.5">
              Amount
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={fromAmount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-lg border border-surface-border bg-surface px-4 py-2.5 text-lg font-semibold text-white placeholder-white/30 outline-none transition-colors focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30"
            />
          </div>
        </div>
        <p className="mt-2 text-xs text-white/40">
          Available:{" "}
          <span className="text-white/60 font-medium">
            {formatCurrency(fromBalance, fromCurrency)}
          </span>
        </p>
      </div>

      {/* Swap button */}
      <div className="flex justify-center -my-4 relative z-10">
        <motion.button
          type="button"
          onClick={handleSwap}
          animate={{ rotate: swapRotation }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-surface-border bg-forest-800 text-gold-500 shadow-lg transition-colors hover:bg-forest-700 hover:border-gold-500/40"
        >
          <ArrowDownUp size={18} />
        </motion.button>
      </div>

      {/* Target section */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
          <div className="sm:w-48">
            <CurrencyDropdown
              value={toCurrency}
              onChange={setToCurrency}
              excludeCode={fromCurrency}
              label="They receive"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium uppercase tracking-wider text-white/40 mb-1.5">
              Converted amount
            </label>
            <input
              type="text"
              readOnly
              value={
                toAmount > 0
                  ? toAmount.toLocaleString("en-US", {
                      maximumFractionDigits: 8,
                    })
                  : "0.00"
              }
              className="w-full rounded-lg border border-surface-border bg-surface px-4 py-2.5 text-lg font-semibold text-white/70 outline-none cursor-default"
            />
          </div>
        </div>
        {effectiveRate !== null && (
          <p className="mt-2 text-xs text-white/40">
            Rate:{" "}
            <span className="text-white/60">
              1 {fromCurrency} ={" "}
              {effectiveRate.toLocaleString("en-US", {
                maximumFractionDigits: 6,
              })}{" "}
              {toCurrency}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
