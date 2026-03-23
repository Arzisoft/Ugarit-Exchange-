"use client";

import { Check, Clock, AlertTriangle, ShieldOff } from "lucide-react";
import Badge from "@/components/ui/Badge";

type KycStatusValue = "not_started" | "pending" | "approved" | "rejected";

interface KYCStatusProps {
  status: string;
}

const statusConfig: Record<
  KycStatusValue,
  {
    label: string;
    badgeVariant: "success" | "warning" | "danger" | "neutral";
    icon: typeof Check;
    stepIndex: number;
  }
> = {
  not_started: {
    label: "Not Started",
    badgeVariant: "neutral",
    icon: ShieldOff,
    stepIndex: 0,
  },
  pending: {
    label: "Pending Review",
    badgeVariant: "warning",
    icon: Clock,
    stepIndex: 2,
  },
  approved: {
    label: "Approved",
    badgeVariant: "success",
    icon: Check,
    stepIndex: 3,
  },
  rejected: {
    label: "Rejected",
    badgeVariant: "danger",
    icon: AlertTriangle,
    stepIndex: 0,
  },
};

const steps = [
  "Not Started",
  "Documents Submitted",
  "Under Review",
  "Approved",
];

export default function KYCStatus({ status }: KYCStatusProps) {
  const config = statusConfig[status as KycStatusValue] ?? statusConfig.not_started;
  const Icon = config.icon;

  return (
    <div className="space-y-6">
      {/* Status badge row */}
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
            config.badgeVariant === "success"
              ? "bg-success/15 text-success"
              : config.badgeVariant === "warning"
                ? "bg-gold-500/15 text-gold-400"
                : config.badgeVariant === "danger"
                  ? "bg-danger/15 text-danger"
                  : "bg-white/10 text-white/50"
          }`}
        >
          <Icon size={20} />
        </div>
        <div>
          <p className="text-sm font-medium text-white">KYC Verification</p>
          <Badge variant={config.badgeVariant}>{config.label}</Badge>
        </div>
      </div>

      {/* Horizontal step tracker */}
      <div className="flex items-center">
        {steps.map((label, index) => {
          const isCompleted = index < config.stepIndex;
          const isActive = index === config.stepIndex;
          const isRejectedStep = status === "rejected" && index === 0;

          return (
            <div key={label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    isRejectedStep
                      ? "bg-danger text-white"
                      : isCompleted
                        ? "bg-success text-white"
                        : isActive
                          ? "bg-gold-500 text-forest-900"
                          : "bg-white/10 text-white/40"
                  }`}
                >
                  {isCompleted ? (
                    <Check size={14} />
                  ) : isRejectedStep ? (
                    <AlertTriangle size={14} />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`whitespace-nowrap text-[10px] font-medium sm:text-xs ${
                    isRejectedStep
                      ? "text-danger"
                      : isCompleted
                        ? "text-success"
                        : isActive
                          ? "text-gold-500"
                          : "text-white/40"
                  }`}
                >
                  {label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div className="mx-1 mt-[-1.25rem] h-0.5 flex-1 sm:mx-2">
                  <div
                    className={`h-full rounded-full transition-colors ${
                      isCompleted ? "bg-success" : "bg-white/10"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
