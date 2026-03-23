"use client";

import Link from "next/link";
import { ArrowLeftRight, Send, PlusCircle, Clock } from "lucide-react";

const actions = [
  { icon: ArrowLeftRight, label: "Exchange", href: "/exchange" },
  { icon: Send, label: "Transfer", href: "/transfer" },
  { icon: PlusCircle, label: "Add Funds", href: "#" },
  { icon: Clock, label: "History", href: "/transactions" },
] as const;

export default function QuickActions() {
  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-4">
      {actions.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          className="group flex flex-col items-center gap-2"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-card border border-surface-border transition-colors group-hover:bg-surface-hover group-hover:border-gold-500/30">
            <action.icon size={22} className="text-gold-500" />
          </div>
          <span className="text-xs font-medium text-white/60 transition-colors group-hover:text-white">
            {action.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
