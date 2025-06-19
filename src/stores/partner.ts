import { axiosInstance } from "@/lib/axiosIntance";
import { create } from "zustand";

// Define the Partner interface here and export it
export interface Partner {
  id: string;
  logo: string;
  createdAt?: string;
  updatedAt?: string;
}

type PartnerState = {
  partners: Partner[];
  selectedPartner: Partner | null;
  loading: boolean;
  error: string | null;

  fetchPartners: () => Promise<void>;
  getPartnerById: (id: string) => Promise<void>;
  createPartner: (logo: File) => Promise<void>;
  updatePartner: (id: string, logo: File) => Promise<void>;
  deletePartner: (id: string) => Promise<void>;

  setSelectedPartner: (partner: Partner | null) => void;
};

export const usePartnerStore = create<PartnerState>((set, get) => ({
  partners: [],
  selectedPartner: null,
  loading: false,
  error: null,

  setSelectedPartner: (partner) => set({ selectedPartner: partner }),

  fetchPartners: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get<{ data: Partner[] }>("/api/partners");
      set({ partners: res.data.data });
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  getPartnerById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get<{ data: Partner }>(
        `/api/partners/${id}`
      );
      set({ selectedPartner: res.data.data });
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  createPartner: async (logo: File): Promise<void> => {
    // Validate file before processing
    if (!logo || !(logo instanceof File) || logo.size === 0) {
      throw new Error("Please provide a valid logo file");
    }

    // Validate file type
    if (!logo.type.startsWith("image/")) {
      throw new Error("Logo must be an image file");
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (logo.size > maxSize) {
      throw new Error("Logo file size must be less than 5MB");
    }

    const formData = new FormData();
    formData.append("logo", logo);

    set({ loading: true, error: null });
    try {
      await axiosInstance.post("/api/partners", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await get().fetchPartners();
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  updatePartner: async (id: string, logo: File): Promise<void> => {
    // Validate file before processing
    if (!logo || !(logo instanceof File) || logo.size === 0) {
      throw new Error("Please provide a valid logo file");
    }

    // Validate file type
    if (!logo.type.startsWith("image/")) {
      throw new Error("Logo must be an image file");
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (logo.size > maxSize) {
      throw new Error("Logo file size must be less than 5MB");
    }

    const formData = new FormData();
    formData.append("logo", logo);

    set({ loading: true, error: null });
    try {
      await axiosInstance.patch(`/api/partners/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await get().fetchPartners();
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  deletePartner: async (id) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`/api/partners/${id}`);
      await get().fetchPartners();
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));
