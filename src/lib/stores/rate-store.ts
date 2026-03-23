"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Rate, generateRates } from "@/lib/mock/rates";

export type RateState = {
  rates: Rate[];
  lastUpdated: string;
  refresh: () => void;
};

export const useRateStore = create<RateState>()(
  persist(
    (set) => ({
      rates: generateRates(),
      lastUpdated: new Date().toISOString(),

      refresh: () => {
        set({
          rates: generateRates(),
          lastUpdated: new Date().toISOString(),
        });
      },
    }),
    {
      name: "ugarit-rates",
    }
  )
);
