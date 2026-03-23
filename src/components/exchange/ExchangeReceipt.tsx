"use client";

import { motion } from "framer-motion";
import { CheckCircle, Download, ArrowRight } from "lucide-react";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { formatCurrency, formatDate } from "@/lib/utils/format";

interface ExchangeReceiptData {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  fee: number;
  rate: number;
  refNumber: string;
  date: string;
}

interface ExchangeReceiptProps {
  isOpen: boolean;
  onClose: () => void;
  data: ExchangeReceiptData;
}

export default function ExchangeReceipt({
  isOpen,
  onClose,
  data,
}: ExchangeReceiptProps) {
  function handleDownload() {
    // Mock download action
    console.log("Downloading receipt for:", data.refNumber);
    alert(
      `Receipt for transaction ${data.refNumber} would be downloaded as PDF.`,
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="flex flex-col items-center text-center">
        {/* Success checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
          className="mb-4"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
            <CheckCircle size={36} className="text-success" />
          </div>
        </motion.div>

        <h2 className="text-xl font-bold text-white mb-1">
          Exchange Successful
        </h2>
        <p className="text-sm text-white/50 mb-6">
          Your currency exchange has been processed
        </p>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full rounded-xl border border-surface-border bg-surface-card p-5 text-left space-y-3 mb-6"
        >
          <Row label="From" value={formatCurrency(data.fromAmount, data.fromCurrency)} />
          <Row label="To" value={formatCurrency(data.toAmount, data.toCurrency)} />
          <Row
            label="Rate used"
            value={`1 ${data.fromCurrency} = ${data.rate.toLocaleString("en-US", { maximumFractionDigits: 6 })} ${data.toCurrency}`}
          />
          <Row
            label="Fee charged"
            value={formatCurrency(data.fee, data.fromCurrency)}
          />

          <div className="border-t border-surface-border my-1" />

          <Row label="Reference" value={data.refNumber} mono />
          <Row label="Date / Time" value={formatDate(data.date)} />
        </motion.div>

        {/* Actions */}
        <div className="flex w-full gap-3">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1"
            onClick={handleDownload}
          >
            <Download size={16} />
            Download Receipt
          </Button>
          <Link href="/dashboard" className="flex-1">
            <Button variant="primary" size="lg" className="w-full">
              Back to Dashboard
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </Modal>
  );
}

/* Small helper row component */
function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-white/50">{label}</span>
      <span
        className={`text-white font-medium ${mono ? "font-mono text-xs" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
