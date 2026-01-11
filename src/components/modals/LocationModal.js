"use client";

import { useState, useEffect } from "react";
import { X, MapPin, Loader2, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { pincodeToLocation } from "@/utils/locationUtils";

export default function LocationModal({ isOpen, onClose, onLocationSelect, mandatory = false }) {
  const [selectedTab, setSelectedTab] = useState("detect"); // detect or pincode or city
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [detecting, setDetecting] = useState(false);
  const [searching, setSearching] = useState(false);
  const [recentLocations, setRecentLocations] = useState([]);

  useEffect(() => {
    // Load recent locations from localStorage
    const stored = localStorage.getItem("recentLocations");
    if (stored) {
      try {
        setRecentLocations(JSON.parse(stored));
      } catch (error) {
      }
    }
    
    // Reset form when modal opens
    if (isOpen) {
      setPincode("");
      setCity("");
      setState("");
    }
  }, [isOpen]);

  const handleDetectLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setDetecting(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // Reverse geocoding using Nominatim (free OpenStreetMap service)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch location details");
          }

          const data = await response.json();
          const address = data.address || {};

          const locationData = {
            city:
              address.city ||
              address.town ||
              address.village ||
              address.suburb ||
              "Unknown",
            state: address.state || "Unknown",
            pincode: address.postcode || "",
            country: address.country || "India",
            latitude,
            longitude,
            formattedAddress: data.display_name || "Current Location",
          };

          // Save to recent locations - this shouldn't throw, but handle gracefully
          try {
            saveToRecentLocations(locationData);
          } catch (saveError) {
            console.error("Error saving to recent locations:", saveError);
            // Continue even if saving fails
          }

          // Location detection was successful, show success toast first
          toast.success(`Location set to ${locationData.city}`);
          
          // Handle location selection - wrap in try-catch to prevent errors from showing wrong toast
          try {
            onLocationSelect(locationData);
            setDetecting(false);
            onClose();
          } catch (selectionError) {
            // If location selection fails, log it but don't show error toast
            // since location detection was successful
            console.error("Error during location selection:", selectionError);
            setDetecting(false);
            // Still close the modal even if selection had an error
            try {
              onClose();
            } catch (closeError) {
              console.error("Error closing modal:", closeError);
            }
          }
        } catch (error) {
          // Only show error toast if location detection itself fails
          setDetecting(false);
          toast.error(
            "Failed to detect location. Please try entering pincode."
          );
        }
      },
      (error) => {
        setDetecting(false);

        if (error.code === error.PERMISSION_DENIED) {
          toast.error(
            "Location permission denied. Please enter pincode manually."
          );
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          toast.error("Location unavailable. Please enter pincode manually.");
        } else {
          toast.error(
            "Failed to detect location. Please enter pincode manually."
          );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handlePincodeSubmit = async (e) => {
    e.preventDefault();

    // Validate: Either pincode or city must be provided
    if (!pincode && !city) {
      toast.error("Please enter either a pincode or city name");
      return;
    }

    setSearching(true);

    try {
      // If pincode is provided, search by pincode
      if (pincode && pincode.length >= 5) {
        // Try Google Maps API first if available
        const googleLocation = await pincodeToLocation(pincode);
        
        if (googleLocation) {
          const locationData = {
            city: city || googleLocation.city,
            state: state || googleLocation.state,
            pincode: pincode,
            country: googleLocation.country || "India",
            latitude: googleLocation.lat,
            longitude: googleLocation.lng,
            lat: googleLocation.lat,
            lng: googleLocation.lng,
            formattedAddress: googleLocation.formatted_address || `${googleLocation.city}, ${googleLocation.state}`,
          };

          saveToRecentLocations(locationData);
          onLocationSelect(locationData);
          toast.success(`Location set to ${locationData.city}`);
          onClose();
          setSearching(false);
          return;
        }

        // Fallback to Nominatim for pincode
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=India&format=json&addressdetails=1&limit=1`
        );

        if (response.ok) {
          const data = await response.json();

          if (data && data.length > 0) {
            const result = data[0];
            const address = result.address || {};

            const locationData = {
              city:
                city ||
                address.city ||
                address.town ||
                address.village ||
                address.suburb ||
                "Unknown",
              state: state || address.state || "Unknown",
              pincode: pincode,
              country: "India",
              latitude: parseFloat(result.lat),
              longitude: parseFloat(result.lon),
              lat: parseFloat(result.lat),
              lng: parseFloat(result.lon),
              formattedAddress: result.display_name || `${city}, ${state}`,
            };

            saveToRecentLocations(locationData);
            onLocationSelect(locationData);
            toast.success(`Location set to ${locationData.city}`);
            onClose();
            setSearching(false);
            return;
          }
        }
      }

      // If city is provided (with or without state), search by city name
      if (city) {
        const searchQuery = state ? `${city}, ${state}, India` : `${city}, India`;
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&addressdetails=1&limit=1`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch location details");
        }

        const data = await response.json();

        if (!data || data.length === 0) {
          toast.error("Location not found. Please check your city name.");
          setSearching(false);
          return;
        }

        const result = data[0];
        const address = result.address || {};

        const locationData = {
          city:
            city ||
            address.city ||
            address.town ||
            address.village ||
            address.suburb ||
            "Unknown",
          state: state || address.state || "Unknown",
          pincode: pincode || address.postcode || "",
          country: "India",
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          formattedAddress: result.display_name || `${city}${state ? ', ' + state : ''}`,
        };

        saveToRecentLocations(locationData);
        onLocationSelect(locationData);
        toast.success(`Location set to ${locationData.city}`);
        onClose();
        setSearching(false);
        return;
      }

      toast.error("Failed to find location. Please try again.");
    } catch (error) {
      toast.error("Failed to find location. Please check your input.");
    } finally {
      setSearching(false);
    }
  };

  const saveToRecentLocations = (location) => {
    try {
      let recent = [...recentLocations];

      // Remove duplicate if exists
      recent = recent.filter(
        (loc) => loc.pincode !== location.pincode && loc.city !== location.city
      );

      // Add to beginning
      recent.unshift(location);

      // Keep only last 5
      recent = recent.slice(0, 5);

      localStorage.setItem("recentLocations", JSON.stringify(recent));
      setRecentLocations(recent);
    } catch (error) {
    }
  };

  const handleRecentLocationClick = (location) => {
    onLocationSelect(location);
    toast.success(`Location set to ${location.city}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={mandatory ? undefined : onClose}
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm z-[9998] ${mandatory ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden z-[9999]"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <MapPin className="w-6 h-6 mr-2 text-blue-600" />
              {mandatory ? "Please Select Your Location" : "Select Location"}
            </h2>
            {!mandatory && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setSelectedTab("detect")}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  selectedTab === "detect"
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Detect Location
              </button>
              <button
                onClick={() => setSelectedTab("pincode")}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  selectedTab === "pincode"
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Enter Location
              </button>
            </div>

            <div className="p-6">
              {selectedTab === "detect" ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                      <MapPin className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Use Current Location
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                      Allow location access to find doctors, clinics, and
                      services near you
                    </p>
                    <button
                      onClick={handleDetectLocation}
                      disabled={detecting}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      {detecting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Detecting...</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-5 h-5" />
                          <span>Detect My Location</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handlePincodeSubmit} className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Enter either a pincode OR city name to search for a location
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Pincode
                    </label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) =>
                        setPincode(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="Enter 6-digit pincode"
                      maxLength={6}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
                    <span className="px-3 text-gray-500 dark:text-gray-400 text-sm">OR</span>
                    <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      City Name
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Mumbai, Delhi, Kolkata"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      State (Optional)
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="e.g. Maharashtra, West Bengal"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={searching}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    {searching ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Searching...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        <span>Search Location</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Recent Locations */}
              {recentLocations.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Recent Locations
                  </h4>
                  <div className="space-y-2">
                    {recentLocations.map((location, index) => (
                      <button
                        key={index}
                        onClick={() => handleRecentLocationClick(location)}
                        className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 group"
                      >
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-400 group-hover:text-blue-600 mr-3 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {location.city}
                              {location.state && `, ${location.state}`}
                            </div>
                            {location.pincode && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {location.pincode}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
