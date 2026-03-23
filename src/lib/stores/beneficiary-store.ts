"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Beneficiary, mockBeneficiaries } from "@/lib/mock/beneficiaries";

export type BeneficiaryState = {
  beneficiaries: Beneficiary[];
  add: (beneficiary: Beneficiary) => void;
  remove: (id: string) => void;
  update: (id: string, data: Partial<Omit<Beneficiary, "id">>) => void;
};

export const useBeneficiaryStore = create<BeneficiaryState>()(
  persist(
    (set) => ({
      beneficiaries: [...mockBeneficiaries],

      add: (beneficiary: Beneficiary) => {
        set((state) => ({
          beneficiaries: [...state.beneficiaries, beneficiary],
        }));
      },

      remove: (id: string) => {
        set((state) => ({
          beneficiaries: state.beneficiaries.filter((b) => b.id !== id),
        }));
      },

      update: (id: string, data: Partial<Omit<Beneficiary, "id">>) => {
        set((state) => ({
          beneficiaries: state.beneficiaries.map((b) =>
            b.id === id ? { ...b, ...data } : b
          ),
        }));
      },
    }),
    {
      name: "ugarit-beneficiaries",
    }
  )
);
