import { create } from "zustand";
import { axiosInstance } from "@/lib/axiosIntance";

export type TranslatedName = {
  uz: string;
  ru: string;
};

export type Category = {
  id: string;
  name: {
    uz: string;
    ru: string;
  };
};

type CategoryState = {
  categories: Category[];
  selectedCategory: Category | null;
  name: TranslatedName;
  loading: boolean;
  error: string | null;

  setName: (lang: keyof TranslatedName, value: string) => void;
  fetchCategories: () => Promise<void>;
  createCategory: () => Promise<void>;
  updateCategory: (id: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  getCategoryById: (id: string) => Promise<void>;
};

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  selectedCategory: null,
  name: { uz: "", ru: "" },
  loading: false,
  error: null,

  setName: (lang, value) =>
    set((state) => ({
      name: { ...state.name, [lang]: value },
    })),

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get<{ data: Category[] }>(
        "/api/categories"
      );
      set({ categories: res.data.data });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  createCategory: async () => {
    const { name } = get();
    if (!name.uz || !name.ru) throw new Error("All fields are required");

    set({ loading: true, error: null });
    try {
      await axiosInstance.post("/api/categories", { name });
      await get().fetchCategories();
      set({ name: { uz: "", ru: "" } });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  updateCategory: async (id) => {
    const { name } = get();
    set({ loading: true, error: null });
    try {
      await axiosInstance.patch(`/api/categories/${id}`, { name });
      await get().fetchCategories();
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  deleteCategory: async (id) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`/api/categories/${id}`);
      set((state) => ({
        categories: state.categories.filter((cat) => cat.id !== id),
      }));
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  getCategoryById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get<{ data: Category }>(
        `/api/categories/${id}`
      );
      set({
        selectedCategory: res.data.data,
        name: res.data.data.name,
      });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },
}));
