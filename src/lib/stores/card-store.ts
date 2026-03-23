"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Card, mockCards } from "@/lib/mock/cards";

export type CardState = {
  cards: Card[];
  freeze: (id: string) => void;
  unfreeze: (id: string) => void;
  setLimit: (id: string, limit: number) => void;
  toggleOnlinePayments: (id: string) => void;
  toggleContactless: (id: string) => void;
  toggleAtm: (id: string) => void;
};

export const useCardStore = create<CardState>()(
  persist(
    (set) => ({
      cards: [...mockCards],

      freeze: (id: string) => {
        set((state) => ({
          cards: state.cards.map((c) =>
            c.id === id ? { ...c, status: "frozen" as const } : c
          ),
        }));
      },

      unfreeze: (id: string) => {
        set((state) => ({
          cards: state.cards.map((c) =>
            c.id === id ? { ...c, status: "active" as const } : c
          ),
        }));
      },

      setLimit: (id: string, limit: number) => {
        set((state) => ({
          cards: state.cards.map((c) =>
            c.id === id ? { ...c, spendingLimit: limit } : c
          ),
        }));
      },

      toggleOnlinePayments: (id: string) => {
        set((state) => ({
          cards: state.cards.map((c) =>
            c.id === id ? { ...c, onlinePayments: !c.onlinePayments } : c
          ),
        }));
      },

      toggleContactless: (id: string) => {
        set((state) => ({
          cards: state.cards.map((c) =>
            c.id === id ? { ...c, contactless: !c.contactless } : c
          ),
        }));
      },

      toggleAtm: (id: string) => {
        set((state) => ({
          cards: state.cards.map((c) =>
            c.id === id ? { ...c, atmWithdrawals: !c.atmWithdrawals } : c
          ),
        }));
      },
    }),
    {
      name: "ugarit-cards",
    }
  )
);
