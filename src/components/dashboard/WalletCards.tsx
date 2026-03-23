"use client";

import { useMemo } from "react";
import { useWalletStore } from "@/lib/stores/wallet-store";
import { getCurrency } from "@/lib/mock/currencies";
import { formatCurrency } from "@/lib/utils/format";
import Button from "@/components/ui/Button";

export default function WalletCards() {
  const wallets = useWalletStore((s) => s.wallets);

  const sorted = useMemo(() => {
    const fiat = wallets
      .filter((w) => w.type === "fiat")
      .sort((a, b) => b.balance - a.balance);
    const crypto = wallets
      .filter((w) => w.type === "crypto")
      .sort((a, b) => b.balance - a.balance);
    return [...fiat, ...crypto];
  }, [wallets]);

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin">
      {sorted.map((wallet) => {
        const currency = getCurrency(wallet.currency);
        return (
          <div
            key={wallet.currency}
            className="relative min-w-[260px] shrink-0 snap-start rounded-[var(--radius-card)] border border-surface-border bg-surface-card overflow-hidden"
          >
            {/* Green gradient top border */}
            <div className="h-[2px] bg-gradient-to-r from-forest-700 via-forest-500 to-forest-700" />

            <div className="px-5 py-4">
              {/* Currency header */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl leading-none">
                  {currency?.flag ?? wallet.currency}
                </span>
                <span className="text-sm font-semibold text-white/80">
                  {wallet.currency}
                </span>
              </div>

              {/* Label */}
              <p className="text-[10px] font-medium uppercase tracking-wider text-white/40 mb-1">
                Available Balance
              </p>

              {/* Balance */}
              <p className="text-xl font-bold text-white mb-4">
                {formatCurrency(wallet.balance, wallet.currency)}
              </p>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1 text-xs">
                  Deposit
                </Button>
                <Button variant="secondary" size="sm" className="flex-1 text-xs">
                  Withdraw
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
