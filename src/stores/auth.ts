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
          console.log("Attempting login with:", { phoneNumber }); // Debug log

          const response = await axiosInstance.post<{
            data: { accessToken?: string };
          }>("/api/auth/login", {
            phoneNumber,
            password,
          });

          console.log("Login response:", response); // Debug log

          const userData = response.data.data;

          if (userData?.accessToken) {
            localStorage.setItem("auth-token", userData.accessToken);

            set({
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            return true;
          } else {
            throw new Error("No access token received");
          }
        } catch (error: any) {
          console.error("Login error:", error); // Debug log

          let errorMessage = "Login failed. Please try again.";

          // Better error handling
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.message) {
            errorMessage = error.message;
          }

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
