import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  phone_number: number;
  password: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone_number: number, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (phone_number: number, password: string) => {
        set({ isLoading: true });

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Simple validation - in real app, this would be an API call
        if (phone_number === Number(931004027) && password === "password") {
          const user: User = {
            id: "1",
            phone_number: Number(931004027),
            password: "password",
          };

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } else {
          set({ isLoading: false });
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      checkAuth: () => {
        const { user } = get();
        set({ isAuthenticated: !!user });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
