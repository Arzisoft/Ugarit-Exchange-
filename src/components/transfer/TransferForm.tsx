"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Landmark, Phone, MapPin, DollarSign } from "lucide-react";
import { useWalletStore } from "@/lib/stores/wallet-store";
import { calculateFee } from "@/lib/utils/calc";
import { formatCurrency } from "@/lib/utils/format";
import { fiatCurrencies } from "@/lib/mock/currencies";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface TransferFormProps {
  onSubmit: (data: {
    amount: number;
    currency: string;
    method: string;
    fee: number;
  }) => void;
}

const deliveryMethods = [
  {
    id: "bank",
    label: "Bank Transfer",
    icon: Landmark,
    time: "2-3 business days",
    feeAdjust: 0,
  },
  {
    id: "cash_pickup",
    label: "Cash Pickup",
    icon: MapPin,
    time: "Same day",
    feeAdjust: 3,
  },
  {
    id: "mobile_wallet",
    label: "Mobile Wallet",
    icon: Phone,
    time: "Instant",
    feeAdjust: -2,
  },
] as const;

export default function TransferForm({ onSubmit }: TransferFormProps) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [method, setMethod] = useState("bank");
  const [error, setError] = useState("");

  const getBalance = useWalletStore((s) => s.getBalance);
  const balance = getBalance(currency);

  const numericAmount = parseFloat(amount) || 0;

  const feeDetails = useMemo(() => {
    if (numericAmount <= 0) return { fee: 0, total: 0 };

    const baseFee = calculateFee(numericAmount, "transfer");
    const methodDef = deliveryMethods.find((m) => m.id === method);
    const adjustment = methodDef?.feeAdjust ?? 0;
    const adjustedFee = Math.max(0, parseFloat((baseFee.fee + adjustment).toFixed(2)));
    const total = parseFloat((numericAmount + adjustedFee).toFixed(2));

    return { fee: adjustedFee, total };
  }, [numericAmount, method]);

  function handleSubmit() {
    setError("");

    if (numericAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (feeDetails.total > balance) {
      setError(
        `Insufficient balance. You have ${formatCurrency(balance, currency)} available.`
      );
      return;
    }

    onSubmit({
      amount: numericAmount,
      currency,
      method,
      fee: feeDetails.fee,
    });
  }

  return (
    <div className="space-y-6">
      {/* Amount input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/70">
          Send Amount
        </label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-white/40">
              <DollarSign size={20} />
            </div>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError("");
              }}
              className="w-full rounded-lg border border-surface-border bg-surface-card py-4 pl-12 pr-4 text-2xl font-semibold text-white placeholder-white/20 outline-none transition-colors focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30"
            />
          </div>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="rounded-lg border border-surface-border bg-surface-card px-4 py-4 text-sm font-medium text-white outline-none transition-colors focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30"
          >
            {fiatCurrencies.map((c) => (
              <option key={c.code} value={c.code} className="bg-forest-900">
                {c.flag} {c.code}
              </option>
            ))}
          </select>
        </div>
        <p className="text-xs text-white/40">
          Available: {formatCurrency(balance, currency)}
        </p>
        {error && <p className="text-sm text-danger">{error}</p>}
      </div>

      {/* Delivery method selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/70">
          Delivery Method
        </label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {deliveryMethods.map((m) => {
            const isSelected = method === m.id;
            const methodFee =
              numericAmount > 0
                ? Math.max(
                    0,
                    parseFloat(
                      (calculateFee(numericAmount, "transfer").fee + m.feeAdjust).toFixed(2)
                    )
                  )
                : 0;

            return (
              <motion.div
                key={m.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  type="button"
                  onClick={() => setMethod(m.id)}
                  className={`w-full rounded-xl border p-4 text-left transition-all ${
                    isSelected
                      ? "border-gold-500 bg-gold-500/10 ring-1 ring-gold-500/30"
                      : "border-surface-border bg-surface-card hover:border-white/20 hover:bg-surface-hover"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        isSelected
                          ? "bg-gold-500/20 text-gold-500"
                          : "bg-white/5 text-white/40"
                      }`}
                    >
                      <m.icon size={20} />
                    </div>
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          isSelected ? "text-gold-500" : "text-white"
                        }`}
                      >
                        {m.label}
                      </p>
                      <p className="text-xs text-white/40">{m.time}</p>
                    </div>
                  </div>
                  {numericAmount > 0 && (
                    <p className="mt-3 text-xs text-white/50">
                      Fee:{" "}
                      <span
                        className={
                          isSelected
                            ? "font-medium text-gold-400"
                            : "font-medium text-white/70"
                        }
                      >
                        {formatCurrency(methodFee, currency)}
                      </span>
                    </p>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Fee summary */}
      {numericAmount > 0 && (
        <Card>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/50">Amount</span>
              <span className="font-medium text-white">
                {formatCurrency(numericAmount, currency)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/50">Fee</span>
              <span className="font-medium text-white">
                {formatCurrency(feeDetails.fee, currency)}
              </span>
            </div>
            <div className="border-t border-surface-border pt-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-white">Total</span>
                <span className="text-lg font-bold text-gold-500">
                  {formatCurrency(feeDetails.total, currency)}
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={handleSubmit}
        disabled={numericAmount <= 0}
      >
        Continue to Review
      </Button>
    </div>
  );
}
