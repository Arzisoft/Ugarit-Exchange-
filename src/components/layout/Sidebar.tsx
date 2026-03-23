"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Send,
  CreditCard,
  Bitcoin,
  History,
  User,
  Settings,
  Shield,
} from "lucide-react";
import { getBrand } from "@/lib/brand/config";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/exchange", icon: ArrowLeftRight, label: "Exchange" },
  { href: "/transfer", icon: Send, label: "Transfer" },
  { href: "/cards", icon: CreditCard, label: "Cards" },
  { href: "/crypto", icon: Bitcoin, label: "Crypto" },
  { href: "/transactions", icon: History, label: "Transactions" },
  { href: "/profile", icon: User, label: "Profile" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const brand = getBrand();

  // TODO: Replace with real auth check
  const isAdmin = true;

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop / Tablet sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-30 flex-col border-r border-surface-border bg-forest-900 lg:w-64 md:w-[72px]">
        {/* Brand */}
        <div className="flex h-16 items-center gap-2.5 border-b border-surface-border px-4 lg:px-5">
          <img
            src={brand.logo}
            alt={brand.name}
            width={32}
            height={32}
            className="h-8 w-8 shrink-0"
          />
          <span className="hidden text-lg font-bold text-white lg:block">
            Ugarit
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="flex flex-col gap-1 px-2 lg:px-3">
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
                    } md:justify-center lg:justify-start`}
                  >
                    <item.icon size={20} className="shrink-0" />
                    <span className="hidden lg:inline">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Admin link */}
        {isAdmin && (
          <div className="border-t border-surface-border p-2 lg:p-3">
            <Link
              href="/admin"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                pathname.startsWith("/admin")
                  ? "border-l-2 border-gold-500 bg-gold-500/10 text-gold-500"
                  : "text-white/60 hover:bg-surface-hover hover:text-white"
              } md:justify-center lg:justify-start`}
            >
              <Shield size={20} className="shrink-0" />
              <span className="hidden lg:inline">Admin</span>
            </Link>
          </div>
        )}
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-surface-border bg-forest-900 md:hidden">
        {navItems.slice(0, 5).map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors ${
                active ? "text-gold-500" : "text-white/50"
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
