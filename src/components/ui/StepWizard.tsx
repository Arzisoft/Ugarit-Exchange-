"use client";

import { Check } from "lucide-react";

interface StepWizardProps {
  steps: string[];
  currentStep: number;
}

export default function StepWizard({ steps, currentStep }: StepWizardProps) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((label, index) => {
        const stepNum = index + 1;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;
        const isPending = stepNum > currentStep;

        return (
          <div key={label} className="flex flex-1 items-center">
            {/* Step circle + label */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                  isCompleted
                    ? "bg-success text-white"
                    : isActive
                      ? "bg-gold-500 text-forest-900"
                      : "bg-white/10 text-white/40"
                }`}
              >
                {isCompleted ? <Check size={18} /> : stepNum}
              </div>
              <span
                className={`whitespace-nowrap text-xs font-medium ${
                  isCompleted
                    ? "text-success"
                    : isActive
                      ? "text-gold-500"
                      : "text-white/40"
                }`}
              >
                {label}
              </span>
            </div>

            {/* Connecting line */}
            {index < steps.length - 1 && (
              <div className="mx-2 mt-[-1.5rem] h-0.5 flex-1">
                <div
                  className={`h-full rounded-full transition-colors ${
                    isCompleted ? "bg-success" : isPending ? "bg-white/10" : "bg-gold-500/40"
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
