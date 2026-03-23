"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { getBrand } from "@/lib/brand/config";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/rates", label: "Rates" },
  { href: "/about", label: "About" },
  { href: "/cards", label: "Cards" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const brand = getBrand();

  return (
    <nav className="sticky top-0 z-40 border-b border-surface-border bg-forest-900/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <img
            src={brand.logo}
            alt={brand.name}
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="text-lg font-bold text-white">
            Ugarit Exchange
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-surface-hover hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/auth/login">
            <Button variant="secondary" size="sm">
              Login
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button variant="primary" size="sm">
              Sign Up
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-white/70 transition-colors hover:bg-surface-hover hover:text-white md:hidden"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-surface-border bg-forest-900 px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-surface-hover hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-3 flex flex-col gap-2 border-t border-surface-border pt-3">
            <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
              <Button variant="secondary" size="md" className="w-full">
                Login
              </Button>
            </Link>
            <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
              <Button variant="primary" size="md" className="w-full">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
