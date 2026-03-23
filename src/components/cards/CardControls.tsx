"use client";

import { useCallback } from "react";
import type { Card } from "@/lib/mock/cards";
import { useCardStore } from "@/lib/stores/card-store";
import Toggle from "@/components/ui/Toggle";
import Badge from "@/components/ui/Badge";
import UICard from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils/format";

interface CardControlsProps {
  card: Card;
}

export default function CardControls({ card }: CardControlsProps) {
  const freeze = useCardStore((s) => s.freeze);
  const unfreeze = useCardStore((s) => s.unfreeze);
  const toggleOnlinePayments = useCardStore((s) => s.toggleOnlinePayments);
  const toggleContactless = useCardStore((s) => s.toggleContactless);
  const toggleAtm = useCardStore((s) => s.toggleAtm);
  const setLimit = useCardStore((s) => s.setLimit);

  const isFrozen = card.status === "frozen";

  const handleFreezeToggle = useCallback(
    (enabled: boolean) => {
      if (enabled) {
        freeze(card.id);
      } else {
        unfreeze(card.id);
      }
    },
    [card.id, freeze, unfreeze],
  );

  const handleOnlineToggle = useCallback(() => {
    toggleOnlinePayments(card.id);
  }, [card.id, toggleOnlinePayments]);

  const handleContactlessToggle = useCallback(() => {
    toggleContactless(card.id);
  }, [card.id, toggleContactless]);

  const handleAtmToggle = useCallback(() => {
    toggleAtm(card.id);
  }, [card.id, toggleAtm]);

  const handleLimitChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLimit(card.id, Number(e.target.value));
    },
    [card.id, setLimit],
  );

  return (
    <UICard
      header={
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">Card Controls</h3>
          <Badge variant={isFrozen ? "danger" : "success"}>
            {isFrozen ? "Frozen" : "Active"}
          </Badge>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Freeze / Unfreeze */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">
              {isFrozen ? "Unfreeze Card" : "Freeze Card"}
            </p>
            <p className="text-xs text-white/40 mt-0.5">
              {isFrozen
                ? "Re-enable all card transactions"
                : "Temporarily block all transactions"}
            </p>
          </div>
          <Toggle enabled={isFrozen} onChange={handleFreezeToggle} />
        </div>

        <div className="h-px bg-surface-border" />

        {/* Online Payments */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">Online Payments</p>
            <p className="text-xs text-white/40 mt-0.5">
              Allow online and e-commerce purchases
            </p>
          </div>
          <Toggle
            enabled={card.onlinePayments}
            onChange={handleOnlineToggle}
          />
        </div>

        {/* Contactless */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">
              Contactless Payments
            </p>
            <p className="text-xs text-white/40 mt-0.5">
              Enable tap-to-pay at terminals
            </p>
          </div>
          <Toggle
            enabled={card.contactless}
            onChange={handleContactlessToggle}
          />
        </div>

        {/* ATM Withdrawals */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">ATM Withdrawals</p>
            <p className="text-xs text-white/40 mt-0.5">
              Allow cash withdrawals from ATMs
            </p>
          </div>
          <Toggle enabled={card.atmWithdrawals} onChange={handleAtmToggle} />
        </div>

        <div className="h-px bg-surface-border" />

        {/* Spending Limit */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-white">Spending Limit</p>
            <span className="text-sm font-semibold text-gold-400 font-mono">
              {formatCurrency(card.spendingLimit, card.currency)}
            </span>
          </div>
          <input
            type="range"
            min={100}
            max={10000}
            step={100}
            value={card.spendingLimit}
            onChange={handleLimitChange}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/10 accent-gold-500"
          />
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-white/30">
              {formatCurrency(100, card.currency)}
            </span>
            <span className="text-[10px] text-white/30">
              {formatCurrency(10000, card.currency)}
            </span>
          </div>
        </div>
      </div>
    </UICard>
  );
}
