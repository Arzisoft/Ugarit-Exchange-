import type { BrandConfig } from "./config";

export const palremitConfig: BrandConfig = {
  id: "palremit",
  name: "Palremit",
  tagline: "Your Digital Wallet for Africa & Beyond",
  logo: "/logos/palremit.svg",
  colors: {
    primary900: "#1A1A2E",
    primary800: "#16213E",
    primary700: "#0F3460",
    gold500: "#E94560",
    gold400: "#FF6B6B",
  },
  supportedCurrencies: [
    "USD", "EUR", "GBP", "AED", "SAR", "EGP", "KES", "NGN", "GHS", "TZS",
    "UGX", "ZAR", "MAD",
  ],
  supportedCrypto: ["BTC", "ETH", "USDT", "USDC"],
  footer: {
    company: "Palremit Technologies Ltd.",
    licenses: ["Registered Money Transfer Operator"],
    builtBy: "Arzisoft — Mahmoud Baassiri",
  },
};
