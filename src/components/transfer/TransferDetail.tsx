"use client";

import Link from "next/link";
import { ArrowLeft, Send, CircleX } from "lucide-react";
import { useTransactionStore } from "@/lib/stores/transaction-store";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import TransferTracker from "@/components/transfer/TransferTracker";

interface TransferDetailProps {
  id: string;
}

const statusBadge: Record<string, { variant: "success" | "warning" | "danger"; label: string }> = {
  completed: { variant: "success", label: "Completed" },
  pending: { variant: "warning", label: "Pending" },
  failed: { variant: "danger", label: "Failed" },
};

export default function TransferDetail({ id }: TransferDetailProps) {
  const transactions = useTransactionStore((s) => s.transactions);
  const transaction = transactions.find((t) => t.id === id);

  if (!transaction) {
    return (
      <div className="mx-auto max-w-2xl text-center py-20">
        <CircleX size={48} className="mx-auto text-white/20" />
        <h2 className="mt-4 text-xl font-semibold text-white">
          Transfer Not Found
        </h2>
        <p className="mt-2 text-white/50">
          The transaction with ID &ldquo;{id}&rdquo; could not be found.
        </p>
        <Link href="/transfer" className="mt-6 inline-block">
          <Button variant="secondary">
            <ArrowLeft size={16} />
            Back to Transfers
          </Button>
        </Link>
      </div>
    );
  }

  const badge = statusBadge[transaction.status] ?? statusBadge.pending;

  // Map transaction status to tracker status
  const trackerStatus =
    transaction.status === "completed"
      ? "delivered"
      : transaction.status === "failed"
        ? "initiated"
        : "processing";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Back link */}
      <Link
        href="/transfer"
        className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to Transfers
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-500/10">
          <Send size={20} className="text-gold-500" />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">Transfer Details</h1>
          <p className="text-xs text-white/40 font-mono">{transaction.id}</p>
        </div>
        <Badge variant={badge.variant}>{badge.label}</Badge>
      </div>

      {/* Transfer summary card */}
      <Card>
        <div className="space-y-4">
          {transaction.beneficiaryName && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">Beneficiary</span>
              <span className="font-medium text-white">
                {transaction.beneficiaryName}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/50">Amount</span>
            <span className="font-medium text-white">
              {formatCurrency(transaction.fromAmount, transaction.fromCurrency)}
            </span>
          </div>
          {transaction.fromCurrency !== transaction.toCurrency && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">Recipient Gets</span>
              <span className="font-medium text-white">
                {formatCurrency(transaction.toAmount, transaction.toCurrency)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/50">Fee</span>
            <span className="font-medium text-white">
              {formatCurrency(transaction.fee, transaction.fromCurrency)}
            </span>
          </div>
          <div className="border-t border-surface-border pt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">
                Total Deducted
              </span>
              <span className="text-lg font-bold text-gold-500">
                {formatCurrency(
                  transaction.fromAmount + transaction.fee,
                  transaction.fromCurrency
                )}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/50">Date</span>
            <span className="text-sm text-white/70">
              {formatDate(transaction.date)}
            </span>
          </div>
          {transaction.description && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">Description</span>
              <span className="text-sm text-white/70">
                {transaction.description}
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Transfer tracker */}
      {transaction.type === "transfer" && (
        <Card
          header={
            <h3 className="text-sm font-semibold text-white">
              Transfer Progress
            </h3>
          }
        >
          <TransferTracker
            status={trackerStatus}
            createdAt={transaction.date}
          />
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Link href="/transfer" className="flex-1">
          <Button variant="secondary" size="lg" className="w-full">
            Send Another
          </Button>
        </Link>
        <Link href="/dashboard/transactions" className="flex-1">
          <Button variant="primary" size="lg" className="w-full">
            View All Transactions
          </Button>
        </Link>
      </div>
    </div>
  );
}
