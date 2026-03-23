"use client";

import { TrendingUp, TrendingDown, Users, FileCheck, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface StatCard {
  label: string;
  value: string;
  change: string;
  changeValue: number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  positive: boolean;
}

const stats: StatCard[] = [
  {
    label: "Daily Volume",
    value: "$125,450",
    change: "+12.5%",
    changeValue: 12.5,
    icon: TrendingUp,
    iconBg: "bg-success/15",
    iconColor: "text-success",
    positive: true,
  },
  {
    label: "Active Users",
    value: "1,247",
    change: "+5.2%",
    changeValue: 5.2,
    icon: Users,
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-400",
    positive: true,
  },
  {
    label: "Pending KYC",
    value: "23",
    change: "-8%",
    changeValue: -8,
    icon: FileCheck,
    iconBg: "bg-gold-500/15",
    iconColor: "text-gold-500",
    positive: true, // fewer is better
  },
  {
    label: "Flagged Transactions",
    value: "5",
    change: "+2",
    changeValue: 2,
    icon: AlertTriangle,
    iconBg: "bg-danger/15",
    iconColor: "text-danger",
    positive: false,
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="rounded-[var(--radius-card)] border border-surface-border bg-surface-card p-5"
        >
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-white/50">{stat.label}</span>
              <span className="text-2xl font-bold text-white">{stat.value}</span>
            </div>
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg}`}>
              <stat.icon size={20} className={stat.iconColor} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            {stat.positive ? (
              <TrendingUp size={14} className="text-success" />
            ) : (
              <TrendingDown size={14} className="text-danger" />
            )}
            <span className={`text-sm font-medium ${stat.positive ? "text-success" : "text-danger"}`}>
              {stat.change}
            </span>
            <span className="text-xs text-white/40">vs last period</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
