import { axiosInstance } from "@/lib/axiosIntance";
import { create } from "zustand";

type NewsText = {
  uz: string;
  ru: string;
};

export type NewsItem = {
  id: string;
  imageUrl: string;
  text: NewsText;
  createdAt?: string;
};

type NewsState = {
  news: NewsItem[];
  selectedNews: NewsItem | null;
  image: File | null;
  text: NewsText;
  loading: boolean;
  error: string | null;

  // Setters
  setImage: (file: File) => void;
  setText: (lang: keyof NewsText, value: string) => void;

  // CRUD Operations
  fetchNews: () => Promise<void>;
  getNewsById: (id: string) => Promise<void>;
  createNews: () => Promise<void>;
  updateNews: (id: string) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;
};

export const useNewsStore = create<NewsState>((set, get) => ({
  news: [],
  selectedNews: null,
  image: null,
  text: { uz: "", ru: "" },
  loading: false,
  error: null,

  setImage: (file) => set({ image: file }),
  setText: (lang, value) =>
    set((state) => ({
      text: { ...state.text, [lang]: value },
    })),

  fetchNews: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get<{ data: NewsItem[] }>("/api/news");
      set({ news: res.data.data });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  getNewsById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get<{ data: NewsItem }>(
        `/api/news/${id}`
      );
      set({
        selectedNews: res.data.data, // <- adjusted here
        text: res.data.data.text,
        image: null,
      });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  createNews: async () => {
    const { image, text } = get();
    if (!image || !text.uz || !text.ru) {
      throw new Error("All fields are required");
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("text", JSON.stringify(text));

    set({ loading: true, error: null });
    try {
      await axiosInstance.post("/api/news", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await get().fetchNews();
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  updateNews: async (id) => {
    const { image, text } = get();

    const formData = new FormData();
    if (image) formData.append("image", image);
    formData.append("text", JSON.stringify(text));

    set({ loading: true, error: null });
    try {
      await axiosInstance.patch<Partial<NewsItem>>(
        `/api/news/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      await get().fetchNews(); // refresh list
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  deleteNews: async (id) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`/api/news/${id}`);
      set((state) => ({
        news: state.news.filter((n) => n.id !== id),
      }));
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },
}));
