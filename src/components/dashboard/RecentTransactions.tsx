"use client";

import Link from "next/link";
import {
  ArrowLeftRight,
  Send,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { useTransactionStore } from "@/lib/stores/transaction-store";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import type { TransactionType, TransactionStatus } from "@/lib/mock/transactions";

const typeIcons: Record<TransactionType, LucideIcon> = {
  exchange: ArrowLeftRight,
  transfer: Send,
  deposit: ArrowDownLeft,
  withdrawal: ArrowUpRight,
  crypto_buy: TrendingUp,
  crypto_sell: TrendingDown,
};

const typeColors: Record<TransactionType, string> = {
  exchange: "text-gold-400",
  transfer: "text-blue-400",
  deposit: "text-success",
  withdrawal: "text-danger",
  crypto_buy: "text-success",
  crypto_sell: "text-danger",
};

const statusVariants: Record<TransactionStatus, "success" | "warning" | "danger"> = {
  completed: "success",
  pending: "warning",
  failed: "danger",
};

export default function RecentTransactions() {
  const transactions = useTransactionStore((s) => s.transactions);
  const recent = transactions.slice(0, 5);

  return (
    <Card
      header={
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">
            Recent Transactions
          </h3>
          <Link
            href="/transactions"
            className="text-xs font-medium text-gold-500 hover:text-gold-400 transition-colors"
          >
            View All
          </Link>
        </div>
      }
    >
      {recent.length === 0 ? (
        <p className="py-8 text-center text-sm text-white/40">
          No transactions yet
        </p>
      ) : (
        <div className="space-y-3">
          {recent.map((tx) => {
            const Icon = typeIcons[tx.type];
            const iconColor = typeColors[tx.type];

            return (
              <div
                key={tx.id}
                className="flex items-center gap-3"
              >
                {/* Type icon */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-hover">
                  <Icon size={16} className={iconColor} />
                </div>

                {/* Description */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {tx.description}
                  </p>
                  <p className="text-xs text-white/40">
                    {formatDate(tx.date)}
                  </p>
                </div>

                {/* Amount & status */}
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-white">
                    {tx.type === "deposit" || tx.type === "crypto_sell"
                      ? "+"
                      : "-"}
                    {formatCurrency(tx.fromAmount, tx.fromCurrency)}
                  </p>
                  <Badge variant={statusVariants[tx.status]} className="mt-0.5">
                    {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
