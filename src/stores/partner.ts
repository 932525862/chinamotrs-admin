import { axiosInstance } from "@/lib/axiosIntance";
import { create } from "zustand";

// Define the Partner interface here and export it
export interface Partner {
  id: string;
  logo: string;
  // Add other fields as needed
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

  setSelectedPartner: (partner: Partner | null) => void; // ✅ Add this
};

export const usePartnerStore = create<PartnerState>((set, get) => ({
  partners: [],
  selectedPartner: null,
  loading: false,
  error: null,

  setSelectedPartner: (partner) => set({ selectedPartner: partner }), // ✅ Implementation

  fetchPartners: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get<{ data: Partner[] }>("/api/partners");
      set({ partners: res.data.data });
    } catch (err: any) {
      set({ error: err.message });
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
    } finally {
      set({ loading: false });
    }
  },

  createPartner: async (logo: File): Promise<void> => {
    if (!logo || !(logo instanceof File)) return;

    const formData: FormData = new FormData();
    formData.append("logo", logo);

    set({ loading: true, error: null });
    try {
      await axiosInstance.post("/api/partners", formData);
      await get().fetchPartners();
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  updatePartner: async (id: string, logo: File): Promise<void> => {
    if (!logo || !(logo instanceof File)) return;

    const formData = new FormData();
    formData.append("logo", logo);

    set({ loading: true, error: null });
    try {
      await axiosInstance.patch(`/api/partners/${id}`, formData);
      await get().fetchPartners();
    } catch (err: any) {
      set({ error: err.message });
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
    } finally {
      set({ loading: false });
    }
  },
}));
