import { useLocationStore } from "@/store/locationStore";

export const useLocation = () => {
  const {
    location,
    isLoading,
    error,
    requestLocation,
    setLocation,
    clearLocation,
  } = useLocationStore();

  return {
    location,
    isLoading,
    error,
    requestLocation,
    setLocation,
    clearLocation,
  };
};
