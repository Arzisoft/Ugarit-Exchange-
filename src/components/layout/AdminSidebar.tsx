"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  History,
  Shield,
  BarChart3,
  ArrowLeft,
} from "lucide-react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/rates", icon: TrendingUp, label: "Rates" },
  { href: "/admin/transactions", icon: History, label: "Transactions" },
  { href: "/admin/compliance", icon: Shield, label: "Compliance" },
  { href: "/admin/reports", icon: BarChart3, label: "Reports" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-surface-border bg-forest-900">
      {/* Brand */}
      <div className="flex h-16 items-center gap-2.5 border-b border-surface-border px-5">
        <Image
          src="/logos/ugarit.svg"
          alt="Ugarit Exchange"
          width={32}
          height={32}
          className="h-8 w-8"
        />
        <div className="flex flex-col">
          <span className="text-sm font-bold text-white">Ugarit</span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-gold-500">
            Admin Panel
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "border-l-2 border-gold-500 bg-gold-500/10 text-gold-500"
                      : "text-white/60 hover:bg-surface-hover hover:text-white"
                  }`}
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Back to App */}
      <div className="border-t border-surface-border p-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-surface-hover hover:text-white"
        >
          <ArrowLeft size={20} />
          Back to App
        </Link>
      </div>
    </aside>
  );
}
