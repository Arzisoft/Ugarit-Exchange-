"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Send,
  CircleCheck,
  ArrowRight,
  Copy,
  ExternalLink,
} from "lucide-react";
import { useBeneficiaryStore } from "@/lib/stores/beneficiary-store";
import { useWalletStore } from "@/lib/stores/wallet-store";
import { useTransactionStore } from "@/lib/stores/transaction-store";
import { formatCurrency } from "@/lib/utils/format";
import StepWizard from "@/components/ui/StepWizard";
import Button from "@/components/ui/Button";
import BeneficiarySelect from "@/components/transfer/BeneficiarySelect";
import TransferForm from "@/components/transfer/TransferForm";
import TransferReview from "@/components/transfer/TransferReview";

const WIZARD_STEPS = [
  "Select Beneficiary",
  "Transfer Details",
  "Review",
  "Confirmation",
];

export default function TransferPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedBenId, setSelectedBenId] = useState<string | null>(null);
  const [transferData, setTransferData] = useState<{
    amount: number;
    currency: string;
    method: string;
    fee: number;
  } | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const beneficiaries = useBeneficiaryStore((s) => s.beneficiaries);
  const withdraw = useWalletStore((s) => s.withdraw);
  const addTransaction = useTransactionStore((s) => s.addTransaction);

  const selectedBeneficiary = beneficiaries.find(
    (b) => b.id === selectedBenId
  );

  function handleBeneficiarySelect(id: string) {
    setSelectedBenId(id);
  }

  function handleBeneficiaryNext() {
    if (selectedBenId) {
      setCurrentStep(1);
    }
  }

  function handleTransferSubmit(data: {
    amount: number;
    currency: string;
    method: string;
    fee: number;
  }) {
    setTransferData(data);
    setCurrentStep(2);
  }

  function handleConfirm() {
    if (!transferData || !selectedBeneficiary) return;

    const total = parseFloat(
      (transferData.amount + transferData.fee).toFixed(2)
    );

    // Withdraw from wallet
    const success = withdraw(transferData.currency, total);
    if (!success) return;

    // Create transaction
    const txId = `txn_${Date.now()}`;
    addTransaction({
      id: txId,
      type: "transfer",
      fromCurrency: transferData.currency,
      toCurrency: transferData.currency,
      fromAmount: transferData.amount,
      toAmount: transferData.amount,
      fee: transferData.fee,
      status: "pending",
      date: new Date().toISOString(),
      beneficiaryName: selectedBeneficiary.name,
      description: `Transfer to ${selectedBeneficiary.name} - ${selectedBeneficiary.country}`,
    });

    setTransactionId(txId);
    setCurrentStep(3);
  }

  function handleCopyId() {
    if (transactionId) {
      navigator.clipboard.writeText(transactionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-500/10">
          <Send size={20} className="text-gold-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Send Money</h1>
          <p className="text-sm text-white/50">
            Transfer funds to your beneficiaries worldwide
          </p>
        </div>
      </div>

      {/* Step wizard - use 1-based for the StepWizard component */}
      <StepWizard steps={WIZARD_STEPS} currentStep={currentStep + 1} />

      {/* Step content */}
      <AnimatePresence mode="wait">
        {currentStep === 0 && (
          <motion.div
            key="step-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">
                Choose a beneficiary
              </h2>
              <BeneficiarySelect
                selected={selectedBenId}
                onSelect={handleBeneficiarySelect}
              />
              <div className="flex justify-end pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleBeneficiaryNext}
                  disabled={!selectedBenId}
                >
                  Continue
                  <ArrowRight size={18} />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  Transfer Details
                </h2>
                <button
                  onClick={() => setCurrentStep(0)}
                  className="text-sm text-gold-500 hover:text-gold-400 transition-colors"
                >
                  Change beneficiary
                </button>
              </div>
              {selectedBeneficiary && (
                <div className="flex items-center gap-2 rounded-lg bg-surface-card px-4 py-2 border border-surface-border">
                  <span className="text-lg">
                    {selectedBeneficiary.countryFlag}
                  </span>
                  <span className="text-sm font-medium text-white">
                    {selectedBeneficiary.name}
                  </span>
                  <span className="text-sm text-white/40">
                    - {selectedBeneficiary.country}
                  </span>
                </div>
              )}
              <TransferForm onSubmit={handleTransferSubmit} />
            </div>
          </motion.div>
        )}

        {currentStep === 2 && selectedBeneficiary && transferData && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="mb-4 text-lg font-semibold text-white">
              Review & Confirm
            </h2>
            <TransferReview
              beneficiary={selectedBeneficiary}
              amount={transferData.amount}
              currency={transferData.currency}
              method={transferData.method}
              fee={transferData.fee}
              onConfirm={handleConfirm}
              onBack={() => setCurrentStep(1)}
            />
          </motion.div>
        )}

        {currentStep === 3 && transactionId && (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mx-auto max-w-md text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.1,
                }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/20"
              >
                <CircleCheck size={44} className="text-success" />
              </motion.div>

              <h2 className="text-2xl font-bold text-white">
                Transfer Initiated!
              </h2>
              <p className="mt-2 text-white/50">
                Your transfer to{" "}
                <span className="font-medium text-white">
                  {selectedBeneficiary?.name}
                </span>{" "}
                has been submitted successfully.
              </p>

              {transferData && (
                <p className="mt-3 text-lg font-semibold text-gold-500">
                  {formatCurrency(transferData.amount, transferData.currency)}
                </p>
              )}

              {/* Transaction ID */}
              <div className="mt-6 rounded-lg border border-surface-border bg-surface-card px-4 py-3">
                <p className="text-xs text-white/40">Transaction ID</p>
                <div className="mt-1 flex items-center justify-center gap-2">
                  <code className="text-sm font-mono text-white">
                    {transactionId}
                  </code>
                  <button
                    onClick={handleCopyId}
                    className="rounded p-1 text-white/40 transition-colors hover:bg-surface-hover hover:text-white"
                    title="Copy ID"
                  >
                    <Copy size={14} />
                  </button>
                </div>
                {copied && (
                  <p className="mt-1 text-xs text-success">Copied!</p>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link href={`/transfer/${transactionId}`}>
                  <Button variant="primary" size="lg">
                    Track Transfer
                    <ExternalLink size={16} />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="secondary" size="lg">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
