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
      user: null,
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

          const data = response.data as { accessToken?: string; data?: { id?: string; phoneNumber?: string; accessToken?: string } };
          console.log(data.accessToken, "Response from login");

          // Handle successful response
          const userData = data.data as {
            id?: string;
            phoneNumber?: string;
            accessToken?: string;
          };

          console.log(userData, "User data");

          // Store accessToken if provided
          if (userData.accessToken) {
            localStorage.setItem("auth-token", userData.accessToken);
          }

          set({
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return true;
        } catch (error: any) {
          console.error("Login failed:", error);

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
        // Clear token and storage
        localStorage.removeItem("auth-token");
        localStorage.removeItem("auth-storage");

        set({
          isAuthenticated: false,
          error: null,
        });
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
