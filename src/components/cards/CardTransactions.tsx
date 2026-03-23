"use client";

import { useMemo } from "react";
import { Receipt } from "lucide-react";
import { useTransactionStore } from "@/lib/stores/transaction-store";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import Badge from "@/components/ui/Badge";
import UICard from "@/components/ui/Card";

interface CardTransactionsProps {
  cardId: string;
}

const statusVariant = {
  completed: "success",
  pending: "warning",
  failed: "danger",
} as const;

export default function CardTransactions({ cardId }: CardTransactionsProps) {
  const transactions = useTransactionStore((s) => s.transactions);

  // Show the last 8 transactions (mock filter — no per-card tracking)
  const recentTransactions = useMemo(
    () => transactions.slice(0, 8),
    [transactions],
  );

  return (
    <UICard
      header={
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">
            Recent Transactions
          </h3>
          <span className="text-xs text-white/40">
            Last {recentTransactions.length} transactions
          </span>
        </div>
      }
    >
      {recentTransactions.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 mb-3">
            <Receipt size={20} className="text-white/30" />
          </div>
          <p className="text-sm font-medium text-white/50">
            No transactions yet
          </p>
          <p className="text-xs text-white/30 mt-1">
            Transactions made with this card will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {recentTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-surface-hover"
            >
              {/* Merchant icon placeholder */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white/70">
                {tx.description.charAt(0).toUpperCase()}
              </div>

              {/* Description + date */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {tx.description}
                </p>
                <p className="text-xs text-white/40 mt-0.5">
                  {formatDate(tx.date)}
                </p>
              </div>

              {/* Amount + status */}
              <div className="text-right shrink-0">
                <p
                  className={`text-sm font-semibold font-mono ${
                    tx.type === "deposit" || tx.type === "crypto_sell"
                      ? "text-success"
                      : "text-white"
                  }`}
                >
                  {tx.type === "deposit" || tx.type === "crypto_sell"
                    ? "+"
                    : "-"}
                  {formatCurrency(tx.fromAmount, tx.fromCurrency)}
                </p>
                <Badge variant={statusVariant[tx.status]} className="mt-1">
                  {tx.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </UICard>
  );
}
