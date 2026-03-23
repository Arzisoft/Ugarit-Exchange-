"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { Shield, ArrowDownUp } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { generateRates, getBaseRate } from "@/lib/mock/rates";
import { fiatCurrencies } from "@/lib/mock/currencies";

const POPULAR_CURRENCIES = ["USD", "EUR", "GBP", "AED", "SAR", "EGP", "KES", "NGN", "TRY", "ZAR"];

export default function Hero() {
  const [sendAmount, setSendAmount] = useState(1000);
  const [sendCurrency, setSendCurrency] = useState("USD");
  const [receiveCurrency, setReceiveCurrency] = useState("EGP");

  const rates = useMemo(() => generateRates(), []);

  const availableCurrencies = fiatCurrencies.filter((c) =>
    POPULAR_CURRENCIES.includes(c.code)
  );

  const convertAmount = useCallback(
    (amount: number, from: string, to: string): number => {
      if (from === to) return amount;

      // All rates are USD-based
      const fromRate = from === "USD" ? 1 : getBaseRate(from);
      const toRate = to === "USD" ? 1 : getBaseRate(to);

      if (!fromRate || !toRate) return 0;

      // Convert from source to USD, then to target
      const usdAmount = amount / fromRate;
      return usdAmount * toRate;
    },
    []
  );

  const receiveAmount = convertAmount(sendAmount, sendCurrency, receiveCurrency);

  // Determine the display rate
  const displayRate = useMemo(() => {
    if (sendCurrency === receiveCurrency) return 1;
    const rate = convertAmount(1, sendCurrency, receiveCurrency);
    return rate;
  }, [sendCurrency, receiveCurrency, convertAmount]);

  const formatDisplayRate = (rate: number): string => {
    if (rate >= 100) return rate.toFixed(2);
    if (rate >= 1) return rate.toFixed(4);
    return rate.toPrecision(6);
  };

  return (
    <section className="relative overflow-hidden bg-forest-900">
      {/* Background gradient orb */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-gold-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-[300px] w-[300px] rounded-full bg-forest-700/20 blur-3xl" />

      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-4 py-16 sm:px-6 lg:flex-row lg:gap-16 lg:px-8 lg:py-24">
        {/* Left: Copy */}
        <motion.div
          className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5">
            <Shield size={14} className="text-gold-500" />
            <span className="text-xs font-semibold text-gold-400">
              Licensed & Regulated
            </span>
          </div>

          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Send Money Across{" "}
            <span className="text-gold-400">Middle East & Africa</span>
          </h1>

          <p className="mb-8 max-w-xl text-lg leading-relaxed text-white/60">
            Fast, secure, and affordable international transfers. Exchange
            currencies, send remittances, and manage your digital wallet — all
            in one platform.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/auth/register">
              <Button variant="primary" size="lg">
                Get Started
              </Button>
            </Link>
            <Link href="/rates">
              <Button variant="secondary" size="lg">
                View Rates
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Right: Converter Card */}
        <motion.div
          className="w-full max-w-md flex-shrink-0"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          <div className="rounded-2xl border border-surface-border bg-surface-card p-6 backdrop-blur-xl">
            <h3 className="mb-5 text-lg font-semibold text-white">
              Currency Converter
            </h3>

            {/* You Send */}
            <div className="mb-1">
              <label className="mb-2 block text-sm font-medium text-white/50">
                You Send
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-surface-border bg-surface-hover p-3">
                <input
                  type="number"
                  value={sendAmount}
                  onChange={(e) =>
                    setSendAmount(parseFloat(e.target.value) || 0)
                  }
                  min={0}
                  className="w-full bg-transparent text-xl font-semibold text-white outline-none placeholder:text-white/30 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  placeholder="0.00"
                />
                <select
                  value={sendCurrency}
                  onChange={(e) => setSendCurrency(e.target.value)}
                  className="cursor-pointer rounded-lg border border-surface-border bg-forest-900 px-3 py-2 text-sm font-semibold text-white outline-none"
                >
                  {availableCurrencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Indicator */}
            <div className="flex items-center justify-center py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-surface-border bg-forest-900 text-gold-500">
                <ArrowDownUp size={18} />
              </div>
            </div>

            {/* They Receive */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-white/50">
                They Receive
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-surface-border bg-surface-hover p-3">
                <div className="w-full text-xl font-semibold text-white">
                  {receiveAmount >= 100
                    ? receiveAmount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : receiveAmount.toFixed(4)}
                </div>
                <select
                  value={receiveCurrency}
                  onChange={(e) => setReceiveCurrency(e.target.value)}
                  className="cursor-pointer rounded-lg border border-surface-border bg-forest-900 px-3 py-2 text-sm font-semibold text-white outline-none"
                >
                  {availableCurrencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Exchange rate display */}
            <p className="mb-5 text-center text-sm text-white/40">
              1 {sendCurrency} = {formatDisplayRate(displayRate)}{" "}
              {receiveCurrency}
            </p>

            {/* Send Now button */}
            <Link href="/auth/register" className="block">
              <Button variant="primary" size="lg" className="w-full">
                Send Now
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
