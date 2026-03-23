"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftRight,
  Send,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Search,
  FileX2,
} from "lucide-react";
import type { ElementType } from "react";

import { useTransactionStore } from "@/lib/stores/transaction-store";
import type {
  Transaction,
  TransactionType,
  TransactionStatus,
} from "@/lib/mock/transactions";
import { formatCurrency, formatDate } from "@/lib/utils/format";

import Tabs from "@/components/ui/Tabs";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const typeIcons: Record<TransactionType, ElementType> = {
  exchange: ArrowLeftRight,
  transfer: Send,
  deposit: ArrowDownLeft,
  withdrawal: ArrowUpRight,
  crypto_buy: TrendingUp,
  crypto_sell: TrendingDown,
};

const typeLabels: Record<TransactionType, string> = {
  exchange: "Exchange",
  transfer: "Transfer",
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  crypto_buy: "Crypto Buy",
  crypto_sell: "Crypto Sell",
};

const statusBadgeVariant: Record<
  TransactionStatus,
  "success" | "warning" | "danger"
> = {
  completed: "success",
  pending: "warning",
  failed: "danger",
};

const typeTabs = [
  { id: "all", label: "All" },
  { id: "exchange", label: "Exchange" },
  { id: "transfer", label: "Transfer" },
  { id: "deposit", label: "Deposit" },
  { id: "withdrawal", label: "Withdrawal" },
  { id: "crypto", label: "Crypto" },
];

const statusTabs = [
  { id: "all", label: "All" },
  { id: "completed", label: "Completed" },
  { id: "pending", label: "Pending" },
  { id: "failed", label: "Failed" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function TransactionsPage() {
  const transactions = useTransactionStore((s) => s.transactions);

  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  /* Filtered + sorted transactions */
  const filtered = useMemo(() => {
    let list = [...transactions];

    /* Type filter */
    if (typeFilter !== "all") {
      if (typeFilter === "crypto") {
        list = list.filter(
          (t) => t.type === "crypto_buy" || t.type === "crypto_sell",
        );
      } else {
        list = list.filter((t) => t.type === typeFilter);
      }
    }

    /* Status filter */
    if (statusFilter !== "all") {
      list = list.filter((t) => t.status === statusFilter);
    }

    /* Search */
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          (t.beneficiaryName && t.beneficiaryName.toLowerCase().includes(q)),
      );
    }

    /* Sort by date descending */
    list.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return list;
  }, [transactions, typeFilter, statusFilter, search]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Transaction History</h2>
        <p className="mt-1 text-sm text-white/50">
          View and search all your past transactions
        </p>
      </div>

      {/* Filter bar */}
      <div className="space-y-4">
        {/* Type filter */}
        <Tabs tabs={typeTabs} activeTab={typeFilter} onChange={setTypeFilter} />

        {/* Status + Search row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          {/* Status pills */}
          <div className="flex gap-2">
            {statusTabs.map((s) => (
              <button
                key={s.id}
                onClick={() => setStatusFilter(s.id)}
                className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  statusFilter === s.id
                    ? "border-gold-500/40 bg-gold-500/15 text-gold-400"
                    : "border-surface-border bg-surface-card text-white/50 hover:text-white/80"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="sm:ml-auto sm:w-72">
            <Input
              placeholder="Search transactions..."
              icon={Search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {filtered.length > 0 ? (
        <div className="overflow-x-auto rounded-[var(--radius-card)] border border-surface-border bg-surface-card">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-surface-border">
                {["Type", "Description", "From", "To", "Fee", "Status", "Date"].map(
                  (h) => (
                    <th
                      key={h}
                      className="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white/50"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              <AnimatePresence mode="popLayout">
                {filtered.map((tx) => {
                  const Icon = typeIcons[tx.type];
                  return (
                    <motion.tr
                      key={tx.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      onClick={() => setSelectedTx(tx)}
                      className="cursor-pointer transition-colors hover:bg-surface-hover"
                    >
                      {/* Type */}
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-500/10 text-gold-400">
                            <Icon size={16} />
                          </div>
                          <span className="hidden text-white/70 sm:inline">
                            {typeLabels[tx.type]}
                          </span>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="max-w-[200px] truncate px-5 py-3.5 text-white">
                        {tx.description}
                        {tx.beneficiaryName && (
                          <span className="ml-1 text-white/40">
                            ({tx.beneficiaryName})
                          </span>
                        )}
                      </td>

                      {/* From */}
                      <td className="whitespace-nowrap px-5 py-3.5 text-white/80">
                        {formatCurrency(tx.fromAmount, tx.fromCurrency)}
                      </td>

                      {/* To */}
                      <td className="whitespace-nowrap px-5 py-3.5 text-white/80">
                        {formatCurrency(tx.toAmount, tx.toCurrency)}
                      </td>

                      {/* Fee */}
                      <td className="whitespace-nowrap px-5 py-3.5 text-white/50">
                        {tx.fee > 0
                          ? formatCurrency(tx.fee, tx.fromCurrency)
                          : "Free"}
                      </td>

                      {/* Status */}
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <Badge variant={statusBadgeVariant[tx.status]}>
                          {tx.status.charAt(0).toUpperCase() +
                            tx.status.slice(1)}
                        </Badge>
                      </td>

                      {/* Date */}
                      <td className="whitespace-nowrap px-5 py-3.5 text-white/50">
                        {formatDate(tx.date)}
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center rounded-[var(--radius-card)] border border-surface-border bg-surface-card py-20">
          <FileX2 size={48} className="text-white/20" />
          <p className="mt-4 text-lg font-medium text-white/50">
            No transactions found
          </p>
          <p className="mt-1 text-sm text-white/30">
            Try adjusting your filters or search query
          </p>
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        title="Transaction Details"
        size="md"
      >
        {selectedTx && <TransactionDetail tx={selectedTx} />}
      </Modal>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Transaction Detail (shown inside modal)                            */
/* ------------------------------------------------------------------ */

function TransactionDetail({ tx }: { tx: Transaction }) {
  const Icon = typeIcons[tx.type];

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Transaction ID", value: tx.id },
    {
      label: "Type",
      value: (
        <span className="inline-flex items-center gap-1.5">
          <Icon size={14} />
          {typeLabels[tx.type]}
        </span>
      ),
    },
    { label: "Description", value: tx.description },
    ...(tx.beneficiaryName
      ? [{ label: "Beneficiary", value: tx.beneficiaryName }]
      : []),
    {
      label: "From",
      value: formatCurrency(tx.fromAmount, tx.fromCurrency),
    },
    {
      label: "To",
      value: formatCurrency(tx.toAmount, tx.toCurrency),
    },
    {
      label: "Fee",
      value:
        tx.fee > 0
          ? formatCurrency(tx.fee, tx.fromCurrency)
          : "Free",
    },
    {
      label: "Status",
      value: (
        <Badge variant={statusBadgeVariant[tx.status]}>
          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
        </Badge>
      ),
    },
    { label: "Date", value: formatDate(tx.date) },
  ];

  return (
    <div className="space-y-4">
      {/* Icon header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400">
          <Icon size={20} />
        </div>
        <div>
          <p className="font-semibold text-white">{tx.description}</p>
          <p className="text-xs text-white/40">{formatDate(tx.date)}</p>
        </div>
      </div>

      {/* Detail rows */}
      <div className="divide-y divide-surface-border rounded-lg border border-surface-border">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between px-4 py-3"
          >
            <span className="text-sm text-white/50">{row.label}</span>
            <span className="text-sm font-medium text-white">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
