import { create } from "zustand";
import { axiosInstance } from "@/lib/axiosIntance";

export type Order = {
  id: string;
  firstName: string;
  phoneNumber: string;
  modelName: string;
  createdAt: string;
  status: string;
};

type Meta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type OrderState = {
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  meta: Meta | null;

  setPage: (page: number) => void;
  fetchOrders: (page?: number) => Promise<void>;
  updateOrder: (id: string, data: Partial<Order>) => Promise<void>;
};

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api`;

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,
  meta: null,

  setPage: (page) => set({ page }),

  fetchOrders: async (page = get().page) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.get<{ data: Order[]; meta: Meta }>(
        `${API_BASE}/orders?page=${page}`
      );
      const { data, meta } = res.data;
      set({
        orders: data,
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

  updateOrder: async (id, data) => {
    try {
      set({ loading: true });
      await axiosInstance.patch(`${API_BASE}/orders/${id}`, {
        ...data,
        status: "CALLED",
      });
      await get().fetchOrders(get().page);
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },
}));
