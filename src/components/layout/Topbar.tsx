"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, ChevronDown, User, Settings, LogOut } from "lucide-react";
import Badge from "@/components/ui/Badge";

interface TopbarProps {
  title?: string;
}

export default function Topbar({ title = "Dashboard" }: TopbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // TODO: Replace with real user data
  const user = {
    name: "John Doe",
    kycStatus: "verified" as const,
  };

  const notificationCount = 3;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const kycBadgeVariant =
    user.kycStatus === "verified"
      ? "success"
      : user.kycStatus === "pending"
        ? "warning"
        : "danger";

  return (
    <header className="flex h-16 items-center justify-between border-b border-surface-border bg-forest-900/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Left: Page title */}
      <h1 className="text-lg font-semibold text-white">{title}</h1>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <button className="relative rounded-lg p-2 text-white/60 transition-colors hover:bg-surface-hover hover:text-white">
          <Bell size={20} />
          {notificationCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
              {notificationCount}
            </span>
          )}
        </button>

        {/* User dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-hover"
          >
            {/* Avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-500/20 text-gold-500">
              <User size={16} />
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-sm font-medium text-white">
                {user.name}
              </span>
              <Badge variant={kycBadgeVariant}>
                {user.kycStatus.charAt(0).toUpperCase() +
                  user.kycStatus.slice(1)}
              </Badge>
            </div>

            <ChevronDown
              size={16}
              className={`hidden text-white/40 transition-transform sm:block ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-[var(--radius-card)] border border-surface-border bg-forest-900 py-1 shadow-2xl">
              <a
                href="/profile"
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 transition-colors hover:bg-surface-hover hover:text-white"
              >
                <User size={16} />
                Profile
              </a>
              <a
                href="/settings"
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 transition-colors hover:bg-surface-hover hover:text-white"
              >
                <Settings size={16} />
                Settings
              </a>
              <div className="my-1 border-t border-surface-border" />
              <button className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-danger transition-colors hover:bg-surface-hover">
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
