import type { ReactNode } from "react";

type BadgeVariant = "success" | "warning" | "danger" | "neutral";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-success/15 text-success border-success/20",
  warning: "bg-gold-500/15 text-gold-400 border-gold-500/20",
  danger: "bg-danger/15 text-danger border-danger/20",
  neutral: "bg-white/10 text-white/70 border-white/10",
};

export default function Badge({
  variant = "neutral",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
