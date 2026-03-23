"use client";

import { forwardRef, type InputHTMLAttributes, type ElementType } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ElementType;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon: Icon, className = "", id, ...props }, ref) => {
    const inputId = id || props.name || undefined;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-white/70"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-white/40">
              <Icon size={18} />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full rounded-lg border bg-surface-card px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 disabled:opacity-50 disabled:cursor-not-allowed ${
              Icon ? "pl-10" : ""
            } ${
              error
                ? "border-danger focus:border-danger focus:ring-danger/30"
                : "border-surface-border"
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
