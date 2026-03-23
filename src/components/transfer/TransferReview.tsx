"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Landmark,
  Phone,
  MapPin,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import type { Beneficiary } from "@/lib/mock/beneficiaries";
import { formatCurrency } from "@/lib/utils/format";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface TransferReviewProps {
  beneficiary: Beneficiary;
  amount: number;
  currency: string;
  method: string;
  fee: number;
  onConfirm: () => void;
  onBack: () => void;
}

const methodConfig: Record<
  string,
  { label: string; icon: typeof Landmark; time: string }
> = {
  bank: { label: "Bank Transfer", icon: Landmark, time: "2-3 business days" },
  cash_pickup: { label: "Cash Pickup", icon: MapPin, time: "Same day" },
  mobile_wallet: { label: "Mobile Wallet", icon: Phone, time: "Instant" },
};

export default function TransferReview({
  beneficiary,
  amount,
  currency,
  method,
  fee,
  onConfirm,
  onBack,
}: TransferReviewProps) {
  const [loading, setLoading] = useState(false);
  const total = parseFloat((amount + fee).toFixed(2));
  const methodDef = methodConfig[method] ?? methodConfig.bank;
  const MethodIcon = methodDef.icon;

  async function handleConfirm() {
    setLoading(true);
    // Simulate brief processing delay
    await new Promise((resolve) => setTimeout(resolve, 1200));
    onConfirm();
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Card>
        <div className="space-y-5">
          {/* Beneficiary section */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">
              Sending To
            </p>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{beneficiary.countryFlag}</span>
              <div>
                <p className="font-semibold text-white">{beneficiary.name}</p>
                <p className="text-sm text-white/50">{beneficiary.country}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-surface-border" />

          {/* Amount details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">Amount</span>
              <span className="font-medium text-white">
                {formatCurrency(amount, currency)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">Fee</span>
              <span className="font-medium text-white">
                {formatCurrency(fee, currency)}
              </span>
            </div>
            <div className="border-t border-surface-border pt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">
                  Total Deducted
                </span>
                <span className="text-xl font-bold text-gold-500">
                  {formatCurrency(total, currency)}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-surface-border" />

          {/* Delivery method */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">
              Delivery Method
            </p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-500/10">
                <MethodIcon size={20} className="text-gold-500" />
              </div>
              <div>
                <p className="font-medium text-white">{methodDef.label}</p>
                <p className="text-sm text-white/50">
                  Estimated delivery: {methodDef.time}
                </p>
              </div>
            </div>
          </div>

          {/* Beneficiary details */}
          {beneficiary.method === "bank" && beneficiary.bankName && (
            <>
              <div className="border-t border-surface-border" />
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">
                  Bank Details
                </p>
                <p className="text-sm text-white/70">{beneficiary.bankName}</p>
                {beneficiary.accountNumber && (
                  <p className="mt-0.5 text-sm text-white/50">
                    {beneficiary.accountNumber}
                  </p>
                )}
              </div>
            </>
          )}
          {beneficiary.method === "mobile_wallet" &&
            beneficiary.mobileNumber && (
              <>
                <div className="border-t border-surface-border" />
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">
                    Mobile Number
                  </p>
                  <p className="text-sm text-white/70">
                    {beneficiary.mobileNumber}
                  </p>
                </div>
              </>
            )}
        </div>
      </Card>

      {/* Security note */}
      <div className="flex items-center gap-2 rounded-lg bg-success/10 px-4 py-3">
        <ShieldCheck size={18} className="shrink-0 text-success" />
        <p className="text-xs text-success/80">
          This transfer is protected by bank-level encryption and compliant with
          AML regulations.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="secondary"
          size="lg"
          className="flex-1"
          onClick={onBack}
          disabled={loading}
        >
          Go Back
        </Button>
        <motion.div className="flex-1" whileTap={{ scale: 0.98 }}>
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
            onClick={handleConfirm}
          >
            Confirm & Send
            <ArrowRight size={18} />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
