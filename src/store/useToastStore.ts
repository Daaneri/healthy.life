import { create } from 'zustand';

interface ToastStore {
  message: string | null;
  showToast: (message: string) => void;
  hideToast: () => void;
}

let timeoutId: ReturnType<typeof setTimeout>;

export const useToastStore = create<ToastStore>((set) => ({
  message: null,
  showToast: (message) => {
    clearTimeout(timeoutId);
    set({ message });
    timeoutId = setTimeout(() => set({ message: null }), 2000);
  },
  hideToast: () => set({ message: null }),
}));