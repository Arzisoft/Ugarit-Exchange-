"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type Transaction,
  type TransactionType,
  type TransactionStatus,
  mockTransactions,
} from "@/lib/mock/transactions";

export type TransactionState = {
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  getByType: (type: TransactionType) => Transaction[];
  getByStatus: (status: TransactionStatus) => Transaction[];
};

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [...mockTransactions],

      addTransaction: (tx: Transaction) => {
        set((state) => ({
          transactions: [tx, ...state.transactions],
        }));
      },

      getByType: (type: TransactionType) => {
        return get().transactions.filter((t) => t.type === type);
      },

      getByStatus: (status: TransactionStatus) => {
        return get().transactions.filter((t) => t.status === status);
      },
    }),
    {
      name: "ugarit-transactions",
    }
  )
);
