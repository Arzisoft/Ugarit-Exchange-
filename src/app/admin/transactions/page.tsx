"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Download,
  ChevronDown,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRightLeft,
  ArrowUpRight,
  ArrowDownLeft,
  Coins,
} from "lucide-react";
import { useTransactionStore } from "@/lib/stores/transaction-store";
import type { TransactionType, TransactionStatus, Transaction } from "@/lib/mock/transactions";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils/format";

const typeOptions: { value: TransactionType | "all"; label: string }[] = [
  { value: "all", label: "All Types" },
  { value: "exchange", label: "Exchange" },
  { value: "transfer", label: "Transfer" },
  { value: "deposit", label: "Deposit" },
  { value: "withdrawal", label: "Withdrawal" },
  { value: "crypto_buy", label: "Crypto Buy" },
  { value: "crypto_sell", label: "Crypto Sell" },
];

const statusOptions: { value: TransactionStatus | "all"; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "completed", label: "Completed" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
];

const statusBadge: Record<TransactionStatus, "success" | "warning" | "danger"> = {
  completed: "success",
  pending: "warning",
  failed: "danger",
};

const typeIcon: Record<TransactionType, React.ElementType> = {
  exchange: ArrowRightLeft,
  transfer: ArrowUpRight,
  deposit: ArrowDownLeft,
  withdrawal: ArrowUpRight,
  crypto_buy: Coins,
  crypto_sell: Coins,
};

interface AuditEntry {
  timestamp: string;
  action: string;
  actor: string;
}

function getAuditLog(tx: Transaction): AuditEntry[] {
  const baseDate = new Date(tx.date);
  const entries: AuditEntry[] = [
    {
      timestamp: new Date(baseDate.getTime() - 120000).toISOString(),
      action: "Transaction created",
      actor: "System",
    },
    {
      timestamp: new Date(baseDate.getTime() - 60000).toISOString(),
      action: "Compliance check passed",
      actor: "AML Engine",
    },
    {
      timestamp: new Date(baseDate.getTime() - 30000).toISOString(),
      action: "Processing started",
      actor: "Payment Processor",
    },
  ];

  if (tx.status === "completed") {
    entries.push({
      timestamp: tx.date,
      action: "Transaction completed successfully",
      actor: "System",
    });
  } else if (tx.status === "failed") {
    entries.push({
      timestamp: tx.date,
      action: "Transaction failed: " + tx.description,
      actor: "System",
    });
  } else {
    entries.push({
      timestamp: tx.date,
      action: "Awaiting processing",
      actor: "Queue",
    });
  }

  return entries;
}

export default function AdminTransactionsPage() {
  const transactions = useTransactionStore((s) => s.transactions);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TransactionType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "all">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (search) {
        const q = search.toLowerCase();
        const match =
          tx.id.toLowerCase().includes(q) ||
          tx.description.toLowerCase().includes(q) ||
          (tx.beneficiaryName?.toLowerCase().includes(q) ?? false);
        if (!match) return false;
      }
      if (typeFilter !== "all" && tx.type !== typeFilter) return false;
      if (statusFilter !== "all" && tx.status !== statusFilter) return false;
      if (dateFrom && new Date(tx.date) < new Date(dateFrom)) return false;
      if (dateTo && new Date(tx.date) > new Date(dateTo + "T23:59:59")) return false;
      if (minAmount && tx.fromAmount < Number(minAmount)) return false;
      if (maxAmount && tx.fromAmount > Number(maxAmount)) return false;
      return true;
    });
  }, [transactions, search, typeFilter, statusFilter, dateFrom, dateTo, minAmount, maxAmount]);

  const handleExport = () => {
    alert("Export started. Your file will be ready for download shortly.");
  };

  const auditLog = selectedTx ? getAuditLog(selectedTx) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">All Transactions</h2>
          <p className="text-sm text-white/50">
            View and audit all platform transactions
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={handleExport} className="flex items-center gap-2">
          <Download size={14} />
          Export
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        <div className="sm:col-span-2">
          <Input
            placeholder="Search by ID, description, beneficiary..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Type Filter */}
        <div className="relative">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => { setTypeDropdownOpen(!typeDropdownOpen); setStatusDropdownOpen(false); }}
            className="flex w-full items-center justify-between gap-2"
          >
            {typeOptions.find((t) => t.value === typeFilter)?.label}
            <ChevronDown size={14} />
          </Button>
          {typeDropdownOpen && (
            <div className="absolute left-0 top-full z-20 mt-1 w-full rounded-lg border border-surface-border bg-forest-900 py-1 shadow-xl">
              {typeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setTypeFilter(opt.value); setTypeDropdownOpen(false); }}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-surface-hover ${
                    typeFilter === opt.value ? "text-gold-500" : "text-white/70"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => { setStatusDropdownOpen(!statusDropdownOpen); setTypeDropdownOpen(false); }}
            className="flex w-full items-center justify-between gap-2"
          >
            {statusOptions.find((s) => s.value === statusFilter)?.label}
            <ChevronDown size={14} />
          </Button>
          {statusDropdownOpen && (
            <div className="absolute left-0 top-full z-20 mt-1 w-full rounded-lg border border-surface-border bg-forest-900 py-1 shadow-xl">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setStatusFilter(opt.value); setStatusDropdownOpen(false); }}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-surface-hover ${
                    statusFilter === opt.value ? "text-gold-500" : "text-white/70"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date From */}
        <Input
          type="date"
          placeholder="From"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          label="From"
        />
        {/* Date To */}
        <Input
          type="date"
          placeholder="To"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          label="To"
        />
      </div>

      {/* Amount range row */}
      <div className="flex gap-3">
        <div className="w-40">
          <Input
            type="number"
            placeholder="Min amount"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
          />
        </div>
        <div className="w-40">
          <Input
            type="number"
            placeholder="Max amount"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-[var(--radius-card)] border border-surface-border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-surface-border bg-surface-card">
              <th className="px-4 py-3 font-medium text-white/50">ID</th>
              <th className="px-4 py-3 font-medium text-white/50">Type</th>
              <th className="px-4 py-3 font-medium text-white/50">Description</th>
              <th className="px-4 py-3 font-medium text-white/50">From</th>
              <th className="px-4 py-3 font-medium text-white/50">To</th>
              <th className="px-4 py-3 font-medium text-white/50">Fee</th>
              <th className="px-4 py-3 font-medium text-white/50">Status</th>
              <th className="px-4 py-3 font-medium text-white/50">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tx) => {
              const Icon = typeIcon[tx.type];
              return (
                <tr
                  key={tx.id}
                  onClick={() => setSelectedTx(tx)}
                  className="cursor-pointer border-b border-surface-border transition-colors hover:bg-surface-hover"
                >
                  <td className="px-4 py-3 font-mono text-xs text-white/60">{tx.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Icon size={14} className="text-gold-500" />
                      <span className="capitalize text-white/80">
                        {tx.type.replace("_", " ")}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/70 max-w-[200px] truncate">
                    {tx.description}
                  </td>
                  <td className="px-4 py-3 text-white">
                    {tx.fromAmount.toLocaleString()} {tx.fromCurrency}
                  </td>
                  <td className="px-4 py-3 text-white">
                    {tx.toAmount.toLocaleString()} {tx.toCurrency}
                  </td>
                  <td className="px-4 py-3 text-white/60">${tx.fee.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusBadge[tx.status]}>
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-white/50 whitespace-nowrap">
                    {formatDate(tx.date)}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-white/40">
                  No transactions found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-white/40">
        Showing {filtered.length} of {transactions.length} transactions
      </div>

      {/* Transaction Detail Modal */}
      <Modal
        isOpen={selectedTx !== null}
        onClose={() => setSelectedTx(null)}
        title="Transaction Details"
        size="lg"
      >
        {selectedTx && (
          <div className="space-y-5">
            {/* Summary */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-white/50">Transaction ID</span>
                <p className="font-mono text-white">{selectedTx.id}</p>
              </div>
              <div>
                <span className="text-white/50">Type</span>
                <p className="capitalize text-white">{selectedTx.type.replace("_", " ")}</p>
              </div>
              <div>
                <span className="text-white/50">From</span>
                <p className="text-white">
                  {selectedTx.fromAmount.toLocaleString()} {selectedTx.fromCurrency}
                </p>
              </div>
              <div>
                <span className="text-white/50">To</span>
                <p className="text-white">
                  {selectedTx.toAmount.toLocaleString()} {selectedTx.toCurrency}
                </p>
              </div>
              <div>
                <span className="text-white/50">Fee</span>
                <p className="text-white">${selectedTx.fee.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-white/50">Status</span>
                <div className="mt-0.5">
                  <Badge variant={statusBadge[selectedTx.status]}>
                    {selectedTx.status.charAt(0).toUpperCase() + selectedTx.status.slice(1)}
                  </Badge>
                </div>
              </div>
              {selectedTx.beneficiaryName && (
                <div className="col-span-2">
                  <span className="text-white/50">Beneficiary</span>
                  <p className="text-white">{selectedTx.beneficiaryName}</p>
                </div>
              )}
              <div className="col-span-2">
                <span className="text-white/50">Description</span>
                <p className="text-white">{selectedTx.description}</p>
              </div>
            </div>

            {/* Audit Log */}
            <div>
              <h4 className="mb-3 text-sm font-semibold text-white">Audit Log</h4>
              <div className="space-y-0">
                {auditLog.map((entry, idx) => (
                  <div key={idx} className="flex gap-3 pb-4 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-hover">
                        {idx === auditLog.length - 1 ? (
                          selectedTx.status === "completed" ? (
                            <CheckCircle size={12} className="text-success" />
                          ) : selectedTx.status === "failed" ? (
                            <XCircle size={12} className="text-danger" />
                          ) : (
                            <Clock size={12} className="text-gold-500" />
                          )
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-white/30" />
                        )}
                      </div>
                      {idx < auditLog.length - 1 && (
                        <div className="w-px flex-1 bg-surface-border" />
                      )}
                    </div>
                    <div className="pb-1">
                      <p className="text-sm text-white/80">{entry.action}</p>
                      <div className="flex items-center gap-2 text-xs text-white/40">
                        <span>{entry.actor}</span>
                        <span>&middot;</span>
                        <span>{formatDate(entry.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
