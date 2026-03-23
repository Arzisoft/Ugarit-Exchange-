"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type User, mockUsers, getUserByEmail, getUserById } from "@/lib/mock/users";

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string) => boolean;
  logout: () => void;
  switchUser: (id: string) => void;
};

// Default: logged in as the regular user (Sarah Johnson)
const defaultUser = mockUsers.find((u) => u.email === "sarah@example.com") ?? mockUsers[1];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: defaultUser,
      isAuthenticated: true,
      isAdmin: defaultUser.role === "admin",

      login: (email: string) => {
        const found = getUserByEmail(email);
        if (found) {
          set({
            user: found,
            isAuthenticated: true,
            isAdmin: found.role === "admin",
          });
          return true;
        }
        return false;
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      },

      switchUser: (id: string) => {
        const found = getUserById(id);
        if (found) {
          set({
            user: found,
            isAuthenticated: true,
            isAdmin: found.role === "admin",
          });
        }
      },
    }),
    {
      name: "ugarit-auth",
    }
  )
);
