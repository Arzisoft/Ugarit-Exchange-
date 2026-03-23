"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import Button from "@/components/ui/Button";
import WalletCards from "@/components/dashboard/WalletCards";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import RateChart from "@/components/dashboard/RateChart";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Welcome banner */}
      <div>
        <h2 className="text-2xl font-bold text-white">
          Welcome back, {user?.name ?? "User"}!
        </h2>
        <p className="mt-1 text-sm text-white/50">{today}</p>
      </div>

      {/* KYC alert */}
      {user && user.kycStatus !== "approved" && (
        <div className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-gold-500/20 bg-gold-500/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="shrink-0 text-gold-500" />
            <p className="text-sm text-gold-300">
              Complete your KYC verification to unlock all features
            </p>
          </div>
          <Link href="/profile">
            <Button variant="primary" size="sm">
              Start Verification
            </Button>
          </Link>
        </div>
      )}

      {/* Wallet cards */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-white/60">
          Your Wallets
        </h3>
        <WalletCards />
      </section>

      {/* Quick actions */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-white/60">
          Quick Actions
        </h3>
        <QuickActions />
      </section>

      {/* Transactions + Rate chart grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RecentTransactions />
        </div>
        <div className="lg:col-span-2">
          <RateChart />
        </div>
      </div>
    </div>
  );
}
