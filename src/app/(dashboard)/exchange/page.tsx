"use client";

import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeftRight, AlertTriangle } from "lucide-react";
import ExchangeForm from "@/components/exchange/ExchangeForm";
import RateDisplay from "@/components/exchange/RateDisplay";
import ExchangeReceipt from "@/components/exchange/ExchangeReceipt";
import Button from "@/components/ui/Button";
import { useWalletStore } from "@/lib/stores/wallet-store";
import { useTransactionStore } from "@/lib/stores/transaction-store";
import { calculateFee } from "@/lib/utils/calc";

interface ExchangeData {
  from: string;
  to: string;
  fromAmount: number;
  toAmount: number;
}

export default function ExchangePage() {
  const [exchangeData, setExchangeData] = useState<ExchangeData>({
    from: "USD",
    to: "EGP",
    fromAmount: 0,
    toAmount: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<{
    fromCurrency: string;
    toCurrency: string;
    fromAmount: number;
    toAmount: number;
    fee: number;
    rate: number;
    refNumber: string;
    date: string;
  } | null>(null);

  const getBalance = useWalletStore((s) => s.getBalance);
  const withdraw = useWalletStore((s) => s.withdraw);
  const deposit = useWalletStore((s) => s.deposit);
  const addTransaction = useTransactionStore((s) => s.addTransaction);

  const feeResult = useMemo(
    () => calculateFee(exchangeData.fromAmount, "exchange"),
    [exchangeData.fromAmount],
  );

  const handleExchangeUpdate = useCallback((data: ExchangeData) => {
    setExchangeData(data);
    setError(null);
  }, []);

  function generateRefNumber() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let ref = "UGX-";
    for (let i = 0; i < 8; i++) {
      ref += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return ref;
  }

  async function handleConfirm() {
    const { from, to, fromAmount, toAmount } = exchangeData;

    if (fromAmount <= 0) {
      setError("Please enter an amount to exchange.");
      return;
    }

    const balance = getBalance(from);
    const totalDeducted = feeResult.total;

    if (balance < totalDeducted) {
      setError(
        `Insufficient ${from} balance. You need ${totalDeducted.toLocaleString("en-US", { minimumFractionDigits: 2 })} ${from} but only have ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })} ${from}.`,
      );
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate a small processing delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 1. Withdraw from source wallet (total = amount + fee)
    const success = withdraw(from, totalDeducted);
    if (!success) {
      setError("Withdrawal failed. Please try again.");
      setLoading(false);
      return;
    }

    // 2. Deposit to target wallet
    deposit(to, toAmount);

    // 3. Record the transaction
    const refNumber = generateRefNumber();
    const date = new Date().toISOString();
    const rate = fromAmount > 0 ? toAmount / fromAmount : 0;

    addTransaction({
      id: `txn_${Date.now()}`,
      type: "exchange",
      fromCurrency: from,
      toCurrency: to,
      fromAmount,
      toAmount,
      fee: feeResult.fee,
      status: "completed",
      date,
      description: `${from} to ${to} exchange`,
    });

    // 4. Show receipt
    setReceiptData({
      fromCurrency: from,
      toCurrency: to,
      fromAmount,
      toAmount,
      fee: feeResult.fee,
      rate,
      refNumber,
      date,
    });
    setReceiptOpen(true);
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500/10">
            <ArrowLeftRight size={18} className="text-gold-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">Currency Exchange</h1>
        </div>
        <p className="text-sm text-white/50 ml-12">
          Convert currencies at competitive rates
        </p>
      </div>

      {/* Main layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Left: Exchange form + confirm */}
        <div className="space-y-5">
          <ExchangeForm onExchange={handleExchangeUpdate} />

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2.5 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3"
            >
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-danger" />
              <p className="text-sm text-danger">{error}</p>
            </motion.div>
          )}

          {/* Confirm button */}
          <Button
            variant="primary"
            size="lg"
            className="w-full text-base"
            loading={loading}
            disabled={exchangeData.fromAmount <= 0}
            onClick={handleConfirm}
          >
            <ArrowLeftRight size={18} />
            Confirm Exchange
          </Button>
        </div>

        {/* Right: Rate display + breakdown */}
        <div>
          <RateDisplay
            fromCurrency={exchangeData.from}
            toCurrency={exchangeData.to}
            fromAmount={exchangeData.fromAmount}
            toAmount={exchangeData.toAmount}
            fee={feeResult.fee}
          />
        </div>
      </div>

      {/* Receipt modal */}
      {receiptData && (
        <ExchangeReceipt
          isOpen={receiptOpen}
          onClose={() => setReceiptOpen(false)}
          data={receiptData}
        />
      )}
    </div>
  );
}
