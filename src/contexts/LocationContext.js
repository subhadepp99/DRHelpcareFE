"use client";

import { createContext, useContext, useState, useEffect } from "react";

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  useEffect(() => {
    // Load saved location from localStorage on mount
    const savedLocation = localStorage.getItem("userLocation");
    if (savedLocation) {
      try {
        setLocation(JSON.parse(savedLocation));
      } catch (error) {
      }
    }
  }, []);

  const updateLocation = (newLocation) => {
    setLocation(newLocation);
    if (newLocation) {
      localStorage.setItem("userLocation", JSON.stringify(newLocation));
    } else {
      localStorage.removeItem("userLocation");
    }
  };

  const clearLocation = () => {
    setLocation(null);
    localStorage.removeItem("userLocation");
  };

  const openLocationModal = () => {
    setIsLocationModalOpen(true);
  };

  const closeLocationModal = () => {
    setIsLocationModalOpen(false);
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        setLocation: updateLocation,
        clearLocation,
        isLocationModalOpen,
        openLocationModal,
        closeLocationModal,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}
