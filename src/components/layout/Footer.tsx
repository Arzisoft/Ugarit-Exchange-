import Link from "next/link";
import Image from "next/image";
import { getBrand } from "@/lib/brand/config";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/exchange", label: "Exchange" },
  { href: "/transfer", label: "Transfer" },
  { href: "/cards", label: "Cards" },
];

const legalLinks = [
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/terms", label: "Terms of Service" },
  { href: "/legal/aml", label: "AML/KYC Policy" },
];

export default function Footer() {
  const brand = getBrand();

  return (
    <footer className="border-t border-surface-border bg-forest-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <Image
                src={brand.logo}
                alt={brand.name}
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="text-lg font-bold text-white">{brand.name}</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed">
              {brand.tagline}
            </p>
            <div className="flex flex-col gap-1">
              {brand.footer.licenses.map((license) => (
                <span key={license} className="text-xs text-white/30">
                  {license}
                </span>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/40">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/40">
              Legal
            </h3>
            <ul className="flex flex-col gap-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/40">
              Contact
            </h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a
                  href="mailto:support@ugarit.com"
                  className="text-sm text-white/60 transition-colors hover:text-white"
                >
                  support@ugarit.com
                </a>
              </li>
              <li className="text-sm text-white/60">24/7 Support</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-surface-border pt-6 sm:flex-row">
          <p className="text-xs text-white/30">
            &copy; 2024 {brand.footer.company}
          </p>
          <p className="text-xs text-white/30">
            Built by {brand.footer.builtBy}
          </p>
        </div>
      </div>
    </footer>
  );
}
