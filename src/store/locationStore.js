import { create } from "zustand";
import { reverseGeocode } from "@/lib/location";

export const useLocationStore = create((set, get) => ({
  location: null, // {lat,lng,city,state,country}
  isLoading: false,
  error: null,

  /* Called from UI */
  async requestLocation() {
    set({ isLoading: true, error: null });

    // already cached?
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("userLocation");
      if (cached) {
        set({ location: JSON.parse(cached), isLoading: false });
        return;
      }
    }

    try {
      const pos = await new Promise((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, {
          enableHighAccuracy: true,
          timeout: 10000,
        })
      );
      const { latitude: lat, longitude: lng } = pos.coords;

      const details = await reverseGeocode(lat, lng); // city/state

      const location = { lat, lng, ...details };
      set({ location, isLoading: false });
      if (typeof window !== "undefined")
        localStorage.setItem("userLocation", JSON.stringify(location));
    } catch (e) {
      set({ error: e.message || "Location blocked", isLoading: false });
    }
  },

  setLocation(loc) {
    set({ location: loc });
  },
  clearLocation() {
    set({ location: null });
    localStorage.removeItem("userLocation");
  },
}));
