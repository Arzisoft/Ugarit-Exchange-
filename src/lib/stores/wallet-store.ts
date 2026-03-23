"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Wallet, mockWallets } from "@/lib/mock/wallets";

export type WalletState = {
  wallets: Wallet[];
  deposit: (currency: string, amount: number) => void;
  withdraw: (currency: string, amount: number) => boolean;
  getBalance: (currency: string) => number;
};

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      wallets: structuredClone(mockWallets),

      deposit: (currency: string, amount: number) => {
        set((state) => {
          const existing = state.wallets.find((w) => w.currency === currency);
          if (existing) {
            return {
              wallets: state.wallets.map((w) =>
                w.currency === currency
                  ? { ...w, balance: parseFloat((w.balance + amount).toFixed(8)) }
                  : w
              ),
            };
          }
          // Create new wallet if currency doesn't exist yet
          const isCrypto = ["BTC", "ETH", "USDT", "USDC"].includes(currency);
          return {
            wallets: [
              ...state.wallets,
              {
                currency,
                balance: amount,
                type: isCrypto ? "crypto" as const : "fiat" as const,
              },
            ],
          };
        });
      },

      withdraw: (currency: string, amount: number) => {
        const wallet = get().wallets.find((w) => w.currency === currency);
        if (!wallet || wallet.balance < amount) {
          return false;
        }
        set((state) => ({
          wallets: state.wallets.map((w) =>
            w.currency === currency
              ? { ...w, balance: parseFloat((w.balance - amount).toFixed(8)) }
              : w
          ),
        }));
        return true;
      },

      getBalance: (currency: string) => {
        const wallet = get().wallets.find((w) => w.currency === currency);
        return wallet?.balance ?? 0;
      },
    }),
    {
      name: "ugarit-wallets",
    }
  )
);
