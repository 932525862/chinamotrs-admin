import { axiosInstance } from "@/lib/axiosIntance";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id?: string;
  phoneNumber: string;
  password: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  user: User | null;
  login: (phoneNumber: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
  clearError: () => void;
  updateProfile: (
    data: {
      phoneNumber?: string;
      password?: string;
    },
    id: string
  ) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,

      login: async (phoneNumber: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.post<{
            data: { accessToken?: string; user?: User };
          }>("/api/auth/login", {
            phoneNumber,
            password,
          });

          console.log(response.data, "user from auth");

          const { accessToken, user } = response.data.data;

          if (!accessToken || !user) {
            throw new Error("Invalid login response");
          }

          localStorage.setItem("auth-token", accessToken);

          set({
            isAuthenticated: true,
            isLoading: false,
            error: null,
            user,
          });

          return true;
        } catch (error: any) {
          console.error("Login error:", error);

          let errorMessage = "Login failed. Please try again.";

          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.message) {
            errorMessage = error.message;
          }

          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
            user: null,
          });

          return false;
        }
      },

      updateProfile: async (
        data: {
          phoneNumber?: string;
          password?: string;
        },
        id: string
      ) => {
        set({ isLoading: true, error: null });

        try {
          const token = localStorage.getItem("auth-token");
          if (!token) throw new Error("No authentication token found");

          const response = await axiosInstance.patch<{ data: Partial<User> }>(
            `/api/auth/${id}`,
            data,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const updatedData = response.data?.data;

          set((state) => {
            const mergedUser = {
              ...state.user,
              ...updatedData,
            };
            return {
              isLoading: false,
              error: null,
              user:
                mergedUser && mergedUser.phoneNumber && mergedUser.password
                  ? {
                      ...mergedUser,
                      phoneNumber: mergedUser.phoneNumber,
                      password: mergedUser.password,
                    }
                  : state.user,
            };
          });

          return true;
        } catch (error: any) {
          console.error("Profile update error:", error);

          let errorMessage = "Profile update failed. Please try again.";
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.message) {
            errorMessage = error.message;
          }

          set({
            isLoading: false,
            error: errorMessage,
          });

          return false;
        }
      },

      logout: () => {
        localStorage.removeItem("auth-token");

        set({
          isAuthenticated: false,
          error: null,
          user: null,
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
        user: state.user,
      }),
    }
  )
);
