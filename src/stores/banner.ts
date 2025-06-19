import { create } from "zustand";
import axios from "axios";

export type BannerItem = {
  id: number;
  image_url: string;
  text: { uz: string; ru: string };
  title: { uz: string; ru: string } | null;
  createdAt?: string;
  lastUpdatedAt?: string;
};

type TextLang = "uz" | "ru";
type Meta = { total: number; page: number; limit: number; totalPages: number };

type BannerState = {
  banners: BannerItem[];
  selectedBanners: BannerItem | null;
  image: File | null;
  text: { uz: string; ru: string };
  title: { uz: string; ru: string };
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  meta: Meta | null;

  setText: (lang: TextLang, value: string) => void;
  setTitle: (lang: TextLang, value: string) => void;
  setImage: (file: File) => void;
  setPage: (page: number) => void;

  fetchBanners: (page?: number) => Promise<void>;
  getBannersById: (id: number) => Promise<void>;
  createBanners: () => Promise<void>;
  updateBanners: (id: number) => Promise<void>;
  deleteBanners: (id: number) => Promise<void>;
};

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api`;

export const useBannersStore = create<BannerState>((set, get) => ({
  banners: [],
  selectedBanners: null,
  image: null,
  text: { uz: "", ru: "" },
  title: { uz: "", ru: "" },
  page: 1,
  totalPages: 1,
  loading: false,
  error: null,
  meta: null,

  setText: (lang, value) =>
    set((state) => ({
      text: { ...state.text, [lang]: value },
    })),
  setTitle: (lang, value) =>
    set((state) => ({
      title: { ...state.title, [lang]: value },
    })),
  setImage: (file) => set({ image: file }),
  setPage: (page) => set({ page }),

  fetchBanners: async () => {
    try {
      set({ loading: true });
      const res = await axios.get<{ data: BannerItem[]; meta: Meta }>(
        `${API_BASE}/banners`
      );
      const { data, meta } = res.data;
      set({
        banners: data,
        meta,
        page: meta.page,
        totalPages: meta.totalPages,
        error: null,
      });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  getBannersById: async (id) => {
    try {
      const res = await axios.get(`${API_BASE}/banners/${id}`);
      const banners = (res.data as { data: BannerItem }).data;
      set({
        selectedBanners: banners,
        text: banners.text || { uz: "", ru: "" },
        title: banners.title || { uz: "", ru: "" },
      });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  createBanners: async () => {
    const { text, title, image } = get();
    const formData = new FormData();
    if (image) formData.append("image", image);
    formData.append("text", JSON.stringify(text));
    formData.append("title", JSON.stringify(title));

    try {
      await axios.post(`${API_BASE}/banners`, formData);
      await get().fetchBanners(1);
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  updateBanners: async (id) => {
    const { text, title, image } = get();
    const formData = new FormData();
    if (image?.name) formData.append("image", image);
    formData.append("text", JSON.stringify(text));
    formData.append("title", JSON.stringify(title));

    try {
      await axios.patch(`${API_BASE}/banners/${id}`, formData);
      await get().fetchBanners();
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  deleteBanners: async (id) => {
    try {
      await axios.delete(`${API_BASE}/banners/${id}`);
      await get().fetchBanners();
    } catch (err: any) {
      set({ error: err.message });
    }
  },
}));
