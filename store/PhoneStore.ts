import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PhoneState {
  phone: {
    summary?: string;
    [key: string]: any;
  } | null;
  video: any | null;
  setPhone: (data: any) => void;
  resetPhone: () => void;
  setVideo: (data: any) => void;
}

export const usePhoneStore = create<PhoneState>()(
  persist(
    (set) => ({
      phone: null,
      video: null,

      setPhone: (data) => set({ phone: data }),

      resetPhone: () => set({ phone: null, video: null }),

      setVideo: (data) => set({ video: data }),
    }),
    {
      name: "phone-storage", 
    }
  )
);
