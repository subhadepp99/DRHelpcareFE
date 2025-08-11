/**
 * Global UI / App-wide flags that don’t belong in any other slice.
 * (Drawer, toast queue length, online/offline state, etc.)
 */
import { create } from "zustand";

export const useAppStore = create((set) => ({
  /** ---- GLOBAL FLAGS ---- */
  isDrawerOpen: false,
  isOffline: false,
  /** ---- ACTIONS ---- */
  toggleDrawer() {
    set((s) => ({ isDrawerOpen: !s.isDrawerOpen }));
  },
  setOffline(offline) {
    set({ isOffline: offline });
  },
}));
