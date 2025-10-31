"use client";

import { MapPin, ChevronDown, X } from "lucide-react";
import { useLocation } from "@/contexts/LocationContext";
import LocationModal from "@/components/modals/LocationModal";

export default function LocationSelector({ className = "" }) {
  const {
    location,
    setLocation,
    openLocationModal,
    closeLocationModal,
    isLocationModalOpen,
    clearLocation,
  } = useLocation();

  const handleLocationSelect = (newLocation) => {
    setLocation(newLocation);
  };

  return (
    <>
      <div className={`flex items-center justify-center ${className}`}>
        <button
          onClick={openLocationModal}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border-2 border-blue-600 dark:border-blue-500 rounded-full shadow-md hover:shadow-lg transition-all duration-200 group"
        >
          <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <span className="text-sm font-medium text-gray-900 dark:text-white max-w-[200px] sm:max-w-xs truncate">
            {location ? (
              <>
                {location.city}
                {location.state && `, ${location.state}`}
              </>
            ) : (
              "Select Location"
            )}
          </span>
          {location ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearLocation();
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                title="Clear location"
              >
                <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </>
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          )}
        </button>
      </div>

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={closeLocationModal}
        onLocationSelect={handleLocationSelect}
      />
    </>
  );
}
