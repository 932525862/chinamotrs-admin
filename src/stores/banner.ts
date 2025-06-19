import { create } from "zustand";
import { axiosInstance } from "@/lib/axiosIntance";

export type Banner = {
  id: number;
  image_url: string;
  title: { uz: string; ru: string };
  text: { uz: string; ru: string };
  createdAt?: string;
};

type TextLang = "uz" | "ru";

type BannerState = {
  banners: Banner[];
  selectedBanner: Banner | null;
  image: File | null;
  title: { uz: string; ru: string };
  text: { uz: string; ru: string };
  loading: boolean;
  error: string | null;

  setText: (lang: TextLang, value: string) => void;
  setTitle: (lang: TextLang, value: string) => void;
  setImage: (file: File | null) => void;
  clearForm: () => void;
  clearError: () => void;

  fetchBanners: () => Promise<void>;
  getBannerById: (id: number) => Promise<void>;
  createBanner: () => Promise<void>;
  updateBanner: (id: number) => Promise<void>;
  deleteBanner: (id: number) => Promise<void>;
};

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api`;

export const useBannerStore = create<BannerState>((set, get) => ({
  banners: [],
  selectedBanner: null,
  image: null,
  title: { uz: "", ru: "" },
  text: { uz: "", ru: "" },
  loading: false,
  error: null,

  setText: (lang, value) =>
    set((state) => ({
      text: { ...state.text, [lang]: value },
    })),
  setTitle: (lang, value) =>
    set((state) => ({
      title: { ...state.title, [lang]: value },
    })),
  setImage: (file) => set({ image: file }),

  clearForm: () =>
    set({
      image: null,
      title: { uz: "", ru: "" },
      text: { uz: "", ru: "" },
    }),

  clearError: () => set({ error: null }),

  fetchBanners: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get<{ data: Banner[] }>(
        `${API_BASE}/banners`
      );
      set({ banners: res.data.data });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  getBannerById: async (id) => {
    try {
      set({ error: null });
      const res = await axiosInstance.get<{ data: Banner }>(
        `${API_BASE}/banners/${id}`
      );
      const banner = res.data.data;
      set({
        selectedBanner: banner,
        title: banner.title,
        text: banner.text,
      });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  createBanner: async () => {
    const { title, text, image } = get();

    if (!image || image.size === 0) {
      set({ error: "Please select an image" });
      return;
    }

    if (!title.uz.trim() || !title.ru.trim()) {
      set({ error: "Please provide titles in both languages" });
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", JSON.stringify(title));
    formData.append("text", JSON.stringify(text));

    try {
      set({ loading: true, error: null });
      await axiosInstance.post(`${API_BASE}/banners`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await get().fetchBanners();
      get().clearForm();
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  updateBanner: async (id) => {
    const { title, text, image } = get();

    if (!title.uz.trim() || !title.ru.trim()) {
      set({ error: "Please provide titles in both languages" });
      return;
    }

    const formData = new FormData();
    if (image && image.size > 0) {
      formData.append("image", image);
    }
    formData.append("title", JSON.stringify(title));
    formData.append("text", JSON.stringify(text));

    try {
      set({ loading: true, error: null });
      await axiosInstance.patch(`${API_BASE}/banners/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await get().fetchBanners();
      get().clearForm();
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  deleteBanner: async (id) => {
    try {
      set({ loading: true, error: null });
      await axiosInstance.delete(`${API_BASE}/banners/${id}`);
      await get().fetchBanners();
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },
}));
