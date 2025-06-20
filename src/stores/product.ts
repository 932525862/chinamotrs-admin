/* // stores/useProductStore.ts
import { axiosInstance } from "@/lib/axiosIntance";
import { create } from "zustand";
import type { Category } from "./category";

export type ProdImage = {
  path: string;
};

export type Product = {
  id: number;
  name: { uz: string; ru: string };
  price: number;
  model: string;
  details: Record<string, string>;
  categoryId: number;
  category: Category;
  images: ProdImage[];
  createdAt?: string;
};

type PaginationMeta = {
  totalPages: number;
  totalItems: number;
  currentPage: number;
};

type ProductState = {
  products: Product[];
  product: Product | null;
  loading: boolean;
  error: string | null;
  meta: PaginationMeta | null;

  fetchProducts: () => Promise<void>;
  fetchPaginatedProducts: (
    page: number
  ) => Promise<{ data: Product[]; meta: PaginationMeta } | undefined>;
  getProductById: (id: number) => Promise<void>;
  createProduct: (formData: FormData) => Promise<boolean>;
  updateProduct: (id: number, formData: FormData) => Promise<boolean>;
  deleteProduct: (id: number) => Promise<boolean>;
};

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  product: null,
  loading: false,
  error: null,
  meta: null,

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get<{ data: Product[] }>("/api/products");
      set({ products: res.data.data || [], loading: false });
    } catch (err: any) {
      set({
        error: err?.message || "Failed to fetch products",
        loading: false,
      });
    }
  },

  fetchPaginatedProducts: async (page: number) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get<{
        data: Product[];
        meta: PaginationMeta;
      }>(`/api/products?page=${page}`);
      set({
        products: res.data.data,
        meta: res.data.meta,
        loading: false,
      });
      return res.data;
    } catch (err: any) {
      set({
        error: err?.message || "Failed to fetch paginated products",
        loading: false,
      });
      return undefined;
    }
  },

  getProductById: async (id) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get<{ data: Product }>(
        `/api/products/${id}`
      );
      set({ product: res.data.data, loading: false });
    } catch (err: any) {
      set({ error: err?.message || "Failed to fetch product", loading: false });
    }
  },

  createProduct: async (formData) => {
    set({ loading: true });
    try {
      await axiosInstance.post("/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set({ loading: false });
      return true;
    } catch (err: any) {
      set({
        error: err?.message || "Failed to create product",
        loading: false,
      });
      return false;
    }
  },

  updateProduct: async (id, formData) => {
    set({ loading: true });
    try {
      await axiosInstance.patch(`/api/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set({ loading: false });
      return true;
    } catch (err: any) {
      set({
        error: err?.message || "Failed to update product",
        loading: false,
      });
      return false;
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      await axiosInstance.delete(`/api/products/${id}`);
      set({ loading: false });
      return true;
    } catch (err: any) {
      set({
        error: err?.message || "Failed to delete product",
        loading: false,
      });
      return false;
    }
  },
}));
 */

// stores/useProductStore.ts
import { axiosInstance } from "@/lib/axiosIntance";
import { create } from "zustand";
import type { Category } from "./category";

export type ProdImage = {
  path: string;
};

export type Product = {
  id: number;
  name: { uz: string; ru: string };
  price: number;
  model: string;
  details: {
    uz: Record<string, string>;
    ru: Record<string, string>;
  };
  categoryId: number;
  category: Category;
  images: ProdImage[];
  createdAt?: string;
};

type PaginationMeta = {
  totalPages: number;
  totalItems: number;
  currentPage: number;
};

type ProductState = {
  products: Product[];
  product: Product | null;
  loading: boolean;
  error: string | null;
  meta: PaginationMeta | null;

  fetchProducts: () => Promise<void>;
  fetchPaginatedProducts: (
    page: number
  ) => Promise<{ data: Product[]; meta: PaginationMeta } | undefined>;
  getProductById: (id: number) => Promise<void>;
  createProduct: (formData: FormData) => Promise<boolean>;
  updateProduct: (id: number, formData: FormData) => Promise<boolean>;
  deleteProduct: (id: number) => Promise<boolean>;
};

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  product: null,
  loading: false,
  error: null,
  meta: null,

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get<{ data: Product[] }>("/api/products");
      set({ products: res.data.data || [], loading: false });
    } catch (err: any) {
      set({
        error: err?.message || "Failed to fetch products",
        loading: false,
      });
    }
  },

  fetchPaginatedProducts: async (page: number) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get<{
        data: Product[];
        meta: PaginationMeta;
      }>(`/api/products?page=${page}`);
      set({
        products: res.data.data,
        meta: res.data.meta,
        loading: false,
      });
      return res.data;
    } catch (err: any) {
      set({
        error: err?.message || "Failed to fetch paginated products",
        loading: false,
      });
      return undefined;
    }
  },

  getProductById: async (id) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get<{ data: Product }>(
        `/api/products/${id}`
      );
      set({ product: res.data.data, loading: false });
    } catch (err: any) {
      set({ error: err?.message || "Failed to fetch product", loading: false });
    }
  },

  createProduct: async (formData) => {
    set({ loading: true });
    try {
      await axiosInstance.post("/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set({ loading: false });
      return true;
    } catch (err: any) {
      set({
        error: err?.message || "Failed to create product",
        loading: false,
      });
      return false;
    }
  },

  updateProduct: async (id, formData) => {
    set({ loading: true });
    try {
      await axiosInstance.patch(`/api/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set({ loading: false });
      return true;
    } catch (err: any) {
      set({
        error: err?.message || "Failed to update product",
        loading: false,
      });
      return false;
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      await axiosInstance.delete(`/api/products/${id}`);
      set({ loading: false });
      return true;
    } catch (err: any) {
      set({
        error: err?.message || "Failed to delete product",
        loading: false,
      });
      return false;
    }
  },
}));
