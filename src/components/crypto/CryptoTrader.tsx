"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowDownUp } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useWalletStore } from "@/lib/stores/wallet-store";
import { useRateStore } from "@/lib/stores/rate-store";
import { useTransactionStore } from "@/lib/stores/transaction-store";
import { calculateFee } from "@/lib/utils/calc";
import { formatCurrency } from "@/lib/utils/format";

const CRYPTO_CODES = ["BTC", "ETH", "USDT", "USDC"] as const;

interface CryptoTraderProps {
  selectedCrypto?: string;
  onSelectCrypto?: (code: string) => void;
}

export default function CryptoTrader({
  selectedCrypto,
  onSelectCrypto,
}: CryptoTraderProps) {
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [crypto, setCrypto] = useState(selectedCrypto ?? "BTC");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const rates = useRateStore((s) => s.rates);
  const deposit = useWalletStore((s) => s.deposit);
  const withdraw = useWalletStore((s) => s.withdraw);
  const getBalance = useWalletStore((s) => s.getBalance);
  const addTransaction = useTransactionStore((s) => s.addTransaction);

  // Sync external selection
  const activeCrypto = selectedCrypto ?? crypto;

  const handleCryptoSelect = useCallback(
    (code: string) => {
      setCrypto(code);
      onSelectCrypto?.(code);
      setError(null);
      setSuccess(null);
    },
    [onSelectCrypto],
  );

  const rate = rates.find((r) => r.pair === `USD/${activeCrypto}`);
  // rate.buy = units of crypto per 1 USD
  // rate.sell = units of crypto per 1 USD (sell price - slightly less)
  // Price in USD per 1 crypto unit = 1 / rate value
  const buyPrice = rate && rate.buy > 0 ? 1 / rate.buy : 0; // price to buy crypto (user pays more)
  const sellPrice = rate && rate.sell > 0 ? 1 / rate.sell : 0; // price to sell crypto (user gets less)

  const numericAmount = parseFloat(amount) || 0;

  const feeResult = useMemo(() => {
    if (side === "buy") {
      // User enters USD amount
      return calculateFee(numericAmount, "crypto");
    }
    // User enters crypto amount, fee is on the USD equivalent
    const usdEquivalent = numericAmount * sellPrice;
    return calculateFee(usdEquivalent, "crypto");
  }, [numericAmount, side, sellPrice]);

  const receiveAmount = useMemo(() => {
    if (side === "buy") {
      // User pays USD, receives crypto
      // Net USD after fee goes to buying crypto
      if (buyPrice <= 0) return 0;
      return numericAmount / buyPrice;
    }
    // User sells crypto, receives USD
    const grossUsd = numericAmount * sellPrice;
    return grossUsd - feeResult.fee;
  }, [numericAmount, side, buyPrice, sellPrice, feeResult.fee]);

  const displayRate = side === "buy" ? buyPrice : sellPrice;

  async function handleConfirm() {
    setError(null);
    setSuccess(null);

    if (numericAmount <= 0) {
      setError("Please enter an amount.");
      return;
    }

    if (side === "buy") {
      // Check USD balance - user needs amount + fee
      const totalUsd = feeResult.total;
      const usdBalance = getBalance("USD");
      if (usdBalance < totalUsd) {
        setError(
          `Insufficient USD balance. You need ${formatCurrency(totalUsd, "USD")} but only have ${formatCurrency(usdBalance, "USD")}.`,
        );
        return;
      }

      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 600));

      const ok = withdraw("USD", totalUsd);
      if (!ok) {
        setError("Withdrawal failed. Please try again.");
        setLoading(false);
        return;
      }

      deposit(activeCrypto, receiveAmount);

      addTransaction({
        id: `txn_${Date.now()}`,
        type: "crypto_buy",
        fromCurrency: "USD",
        toCurrency: activeCrypto,
        fromAmount: numericAmount,
        toAmount: receiveAmount,
        fee: feeResult.fee,
        status: "completed",
        date: new Date().toISOString(),
        description: `${activeCrypto} purchase`,
      });

      setSuccess(
        `Bought ${formatCurrency(receiveAmount, activeCrypto)} for ${formatCurrency(numericAmount, "USD")}`,
      );
    } else {
      // Sell: check crypto balance
      const cryptoBalance = getBalance(activeCrypto);
      if (cryptoBalance < numericAmount) {
        setError(
          `Insufficient ${activeCrypto} balance. You have ${formatCurrency(cryptoBalance, activeCrypto)}.`,
        );
        return;
      }

      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 600));

      const ok = withdraw(activeCrypto, numericAmount);
      if (!ok) {
        setError("Withdrawal failed. Please try again.");
        setLoading(false);
        return;
      }

      deposit("USD", receiveAmount);

      addTransaction({
        id: `txn_${Date.now()}`,
        type: "crypto_sell",
        fromCurrency: activeCrypto,
        toCurrency: "USD",
        fromAmount: numericAmount,
        toAmount: receiveAmount,
        fee: feeResult.fee,
        status: "completed",
        date: new Date().toISOString(),
        description: `${activeCrypto} sale`,
      });

      setSuccess(
        `Sold ${formatCurrency(numericAmount, activeCrypto)} for ${formatCurrency(receiveAmount, "USD")}`,
      );
    }

    setLoading(false);
    setAmount("");
  }

  return (
    <Card>
      <div className="space-y-5">
        {/* Buy / Sell toggle */}
        <div className="flex rounded-lg bg-surface p-1">
          <button
            onClick={() => {
              setSide("buy");
              setError(null);
              setSuccess(null);
              setAmount("");
            }}
            className={`flex-1 rounded-md py-2 text-sm font-semibold transition-colors cursor-pointer ${
              side === "buy"
                ? "bg-success text-white"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => {
              setSide("sell");
              setError(null);
              setSuccess(null);
              setAmount("");
            }}
            className={`flex-1 rounded-md py-2 text-sm font-semibold transition-colors cursor-pointer ${
              side === "sell"
                ? "bg-danger text-white"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            Sell
          </button>
        </div>

        {/* Crypto selector */}
        <div>
          <label className="mb-2 block text-xs font-medium text-white/50">
            Select Crypto
          </label>
          <div className="grid grid-cols-4 gap-2">
            {CRYPTO_CODES.map((code) => (
              <button
                key={code}
                onClick={() => handleCryptoSelect(code)}
                className={`rounded-lg border py-2 text-xs font-semibold transition-colors cursor-pointer ${
                  activeCrypto === code
                    ? "border-gold-500 bg-gold-500/10 text-gold-500"
                    : "border-surface-border bg-surface text-white/60 hover:text-white hover:border-white/20"
                }`}
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        {/* Amount input */}
        <div>
          <label className="mb-2 block text-xs font-medium text-white/50">
            {side === "buy" ? "Amount (USD)" : `Amount (${activeCrypto})`}
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError(null);
                setSuccess(null);
              }}
              placeholder="0.00"
              className="w-full rounded-lg border border-surface-border bg-surface px-4 py-3 text-white placeholder:text-white/30 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/40">
              {side === "buy" ? "USD" : activeCrypto}
            </span>
          </div>
          {/* Balance hint */}
          <p className="mt-1 text-xs text-white/30">
            Balance:{" "}
            {side === "buy"
              ? formatCurrency(getBalance("USD"), "USD")
              : formatCurrency(getBalance(activeCrypto), activeCrypto)}
          </p>
        </div>

        {/* Receive display */}
        <div className="flex items-center justify-between rounded-lg bg-surface px-4 py-3">
          <span className="text-xs text-white/50">
            {"You'll receive"}
          </span>
          <span className="text-sm font-semibold text-white">
            {side === "buy"
              ? formatCurrency(receiveAmount, activeCrypto)
              : formatCurrency(receiveAmount, "USD")}
          </span>
        </div>

        {/* Rate + fee */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between text-white/50">
            <span className="flex items-center gap-1">
              <ArrowDownUp size={12} />
              Rate
            </span>
            <span className="text-white/70">
              1 {activeCrypto} = {formatCurrency(displayRate, "USD")}
            </span>
          </div>
          <div className="flex items-center justify-between text-white/50">
            <span>Fee (0.5%)</span>
            <span className="text-white/70">
              {formatCurrency(feeResult.fee, "USD")}
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2"
          >
            <AlertTriangle
              size={14}
              className="mt-0.5 shrink-0 text-danger"
            />
            <p className="text-xs text-danger">{error}</p>
          </motion.div>
        )}

        {/* Success */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-success/30 bg-success/10 px-3 py-2"
          >
            <p className="text-xs text-success">{success}</p>
          </motion.div>
        )}

        {/* Confirm button */}
        <Button
          variant={side === "buy" ? "primary" : "danger"}
          size="lg"
          className="w-full"
          loading={loading}
          disabled={numericAmount <= 0}
          onClick={handleConfirm}
        >
          {side === "buy" ? `Buy ${activeCrypto}` : `Sell ${activeCrypto}`}
        </Button>
      </div>
    </Card>
  );
}
