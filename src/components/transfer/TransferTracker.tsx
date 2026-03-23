"use client";

import { motion } from "framer-motion";
import { Check, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils/format";

interface TransferTrackerProps {
  status: string;
  createdAt: string;
}

const steps = [
  { key: "initiated", label: "Initiated" },
  { key: "processing", label: "Processing" },
  { key: "sent", label: "Sent" },
  { key: "delivered", label: "Delivered" },
];

// Determine which steps are completed based on status
function getStepState(
  stepKey: string,
  status: string
): "completed" | "current" | "pending" {
  const statusOrder = ["initiated", "processing", "sent", "delivered"];
  const currentIndex = statusOrder.indexOf(status);
  const stepIndex = statusOrder.indexOf(stepKey);

  // Map common status values
  let effectiveIndex = currentIndex;
  if (status === "pending") effectiveIndex = 0; // "initiated" equivalent
  if (status === "completed") effectiveIndex = 3; // "delivered" equivalent

  if (stepIndex < effectiveIndex) return "completed";
  if (stepIndex === effectiveIndex) return "current";
  return "pending";
}

function getTimestamp(
  stepKey: string,
  status: string,
  createdAt: string
): string | null {
  const state = getStepState(stepKey, status);
  if (state === "pending") return null;

  // For demo purposes, offset timestamps from createdAt
  const base = new Date(createdAt).getTime();
  const offsets: Record<string, number> = {
    initiated: 0,
    processing: 5 * 60 * 1000, // +5 minutes
    sent: 2 * 60 * 60 * 1000, // +2 hours
    delivered: 24 * 60 * 60 * 1000, // +24 hours
  };

  const offset = offsets[stepKey] ?? 0;
  return new Date(base + offset).toISOString();
}

export default function TransferTracker({
  status,
  createdAt,
}: TransferTrackerProps) {
  return (
    <div className="relative pl-4">
      {steps.map((step, index) => {
        const state = getStepState(step.key, status);
        const timestamp = getTimestamp(step.key, status, createdAt);
        const isLast = index === steps.length - 1;

        return (
          <div key={step.key} className="relative flex gap-4 pb-8 last:pb-0">
            {/* Vertical connecting line */}
            {!isLast && (
              <div
                className={`absolute left-[15px] top-[36px] h-[calc(100%-28px)] w-0.5 ${
                  state === "completed"
                    ? "bg-success"
                    : state === "current"
                      ? "bg-gradient-to-b from-gold-500 to-white/10"
                      : "bg-white/10"
                }`}
              />
            )}

            {/* Step circle */}
            <div className="relative z-10 shrink-0">
              {state === "completed" ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-success"
                >
                  <Check size={16} className="text-white" />
                </motion.div>
              ) : state === "current" ? (
                <div className="relative flex h-8 w-8 items-center justify-center">
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gold-500/30"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gold-500">
                    <Clock size={14} className="text-forest-900" />
                  </div>
                </div>
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white/10 bg-transparent">
                  <div className="h-2 w-2 rounded-full bg-white/20" />
                </div>
              )}
            </div>

            {/* Step content */}
            <div className="pt-1">
              <p
                className={`text-sm font-semibold ${
                  state === "completed"
                    ? "text-success"
                    : state === "current"
                      ? "text-gold-500"
                      : "text-white/30"
                }`}
              >
                {step.label}
              </p>
              {timestamp && (
                <p className="mt-0.5 text-xs text-white/40">
                  {formatDate(timestamp)}
                </p>
              )}
              {state === "current" && (
                <p className="mt-0.5 text-xs text-gold-400/70">In progress</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
