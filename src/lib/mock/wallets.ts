export type Wallet = {
  currency: string;
  balance: number;
  type: "fiat" | "crypto";
};

export const mockWallets: Wallet[] = [
  { currency: "USD", balance: 4850, type: "fiat" },
  { currency: "EUR", balance: 2300, type: "fiat" },
  { currency: "AED", balance: 12500, type: "fiat" },
  { currency: "EGP", balance: 235000, type: "fiat" },
  { currency: "GBP", balance: 1200, type: "fiat" },
  { currency: "BTC", balance: 0.15, type: "crypto" },
  { currency: "ETH", balance: 2.5, type: "crypto" },
  { currency: "USDT", balance: 5000, type: "crypto" },
];
