import { create } from "zustand";
import axios from "axios";

export type NewsItem = {
  id: number;
  image_url: string;
  text: { uz: string; ru: string };
  title: { uz: string; ru: string } | null;
  createdAt?: string;
  lastUpdatedAt?: string;
};

type TextLang = "uz" | "ru";
type Meta = { total: number; page: number; limit: number; totalPages: number };

type NewsState = {
  news: NewsItem[];
  selectedNews: NewsItem | null;
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

  fetchNews: (page?: number) => Promise<void>;
  getNewsById: (id: number) => Promise<void>;
  createNews: () => Promise<void>;
  updateNews: (id: number) => Promise<void>;
  deleteNews: (id: number) => Promise<void>;
};

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api`;

export const useNewsStore = create<NewsState>((set, get) => ({
  news: [],
  selectedNews: null,
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

  fetchNews: async (page = get().page) => {
    try {
      set({ loading: true });
      const res = await axios.get<{ data: NewsItem[]; meta: Meta }>(
        `${API_BASE}/news?page=${page}`
      );
      const { data, meta } = res.data;
      set({
        news: data,
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

  getNewsById: async (id) => {
    try {
      const res = await axios.get(`${API_BASE}/news/${id}`);
      const news = (res.data as { data: NewsItem }).data;
      set({
        selectedNews: news,
        text: news.text || { uz: "", ru: "" },
        title: news.title || { uz: "", ru: "" },
      });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  createNews: async () => {
    const { text, title, image } = get();
    const formData = new FormData();
    if (image) formData.append("image", image);
    formData.append("text", JSON.stringify(text));
    formData.append("title", JSON.stringify(title));

    try {
      await axios.post(`${API_BASE}/news`, formData);
      await get().fetchNews(1);
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  updateNews: async (id) => {
    const { text, title, image } = get();
    const formData = new FormData();
    if (image?.name) formData.append("image", image);
    formData.append("text", JSON.stringify(text));
    formData.append("title", JSON.stringify(title));

    try {
      await axios.patch(`${API_BASE}/news/${id}`, formData);
      await get().fetchNews();
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  deleteNews: async (id) => {
    try {
      await axios.delete(`${API_BASE}/news/${id}`);
      await get().fetchNews(get().page);
    } catch (err: any) {
      set({ error: err.message });
    }
  },
}));
