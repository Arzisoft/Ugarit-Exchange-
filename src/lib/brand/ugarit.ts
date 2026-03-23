import type { BrandConfig } from "./config";

export const ugaritConfig: BrandConfig = {
  id: "ugarit",
  name: "Ugarit Exchange",
  tagline: "Send Money Across Middle East & Africa",
  logo: "/logos/ugarit.svg",
  colors: {
    primary900: "#083D1F",
    primary800: "#0A5C2E",
    primary700: "#0D7C3E",
    gold500: "#D4A843",
    gold400: "#E0BE6A",
  },
  supportedCurrencies: [
    "USD", "EUR", "GBP", "AED", "SAR", "EGP", "KWD", "QAR", "BHD", "OMR",
    "JOD", "TRY", "KES", "NGN", "GHS", "TZS", "UGX", "ZAR", "MAD",
  ],
  supportedCrypto: ["BTC", "ETH", "USDT", "USDC"],
  footer: {
    company: "Ugarit Exchange Ltd.",
    licenses: ["Licensed by Central Bank", "AML Compliant"],
    builtBy: "Arzisoft — Mahmoud Baassiri",
  },
};
