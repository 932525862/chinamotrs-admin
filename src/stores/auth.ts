// stores/useAuthStore.ts
import { axiosInstance } from "@/lib/axiosIntance";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (phoneNumber: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (phoneNumber: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.post("/api/auth/login", {
            phoneNumber,
            password,
          });

          const userData = (response.data as { data: any }).data;

          if (userData?.accessToken) {
            localStorage.setItem("auth-token", userData.accessToken);
          }

          set({
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return true;
        } catch (error: any) {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Login failed. Please try again.";

          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
          });

          return false;
        }
      },

      logout: () => {
        localStorage.removeItem("auth-token");
        localStorage.removeItem("auth-storage");

        set({
          isAuthenticated: false,
          error: null,
        });

        window.location.href = "/login";
      },

      checkAuth: () => {
        const token = localStorage.getItem("auth-token");
        set({
          isAuthenticated: !!token,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
