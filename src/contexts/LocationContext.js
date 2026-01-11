"use client";

import { createContext, useContext, useState, useEffect } from "react";

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load saved location from localStorage on mount
    const savedLocation = localStorage.getItem("userLocation");
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation);
        setLocation(parsedLocation);
        setIsInitialized(true);
      } catch (error) {
        setIsInitialized(true);
      }
    } else {
      // No location found, open mandatory modal
      setIsInitialized(true);
      setIsLocationModalOpen(true);
    }
  }, []);

  const updateLocation = (newLocation) => {
    setLocation(newLocation);
    if (newLocation) {
      localStorage.setItem("userLocation", JSON.stringify(newLocation));
      // Close modal after location is set
      setIsLocationModalOpen(false);
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
        isInitialized,
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
