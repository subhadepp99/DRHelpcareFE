"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Filter, Loader, X, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchSection({
  searchQuery = "",
  setSearchQuery = () => {},
  searchType = "all",
  setSearchType = () => {},
  onSearch = () => {},
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [filters, setFilters] = useState({
    specialization: "",
    experience: "",
    fee: "",
    rating: "",
    distance: "25",
  });

  const searchRef = useRef(null);
  const locationRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowLocationSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const searchTypes = [
    { value: "all", label: "All", icon: "🔍" },
    { value: "doctors", label: "Doctors", icon: "👨‍⚕️" },
    { value: "clinics", label: "Clinics", icon: "🏥" },
    // { value: "pharmacies", label: "Pharmacies", icon: "💊" },
    { value: "ambulance", label: "Ambulance", icon: "🚑" },
  ];

  const specializations = [
    "Cardiology",
    "Dermatology",
    "Neurology",
    "Pediatrics",
    "Orthopedics",
    "Gynecology",
    "Psychiatry",
    "Radiology",
    "Anesthesiology",
    "Pathology",
  ];

  const experienceRanges = [
    { value: "0-2", label: "0-2 years" },
    { value: "3-5", label: "3-5 years" },
    { value: "6-10", label: "6-10 years" },
    { value: "10+", label: "10+ years" },
  ];

  const feeRanges = [
    { value: "0-500", label: "₹0 - ₹500" },
    { value: "500-1000", label: "₹500 - ₹1000" },
    { value: "1000-2000", label: "₹1000 - ₹2000" },
    { value: "2000+", label: "₹2000+" },
  ];

  const ratings = [
    { value: "4", label: "4+ Stars" },
    { value: "3", label: "3+ Stars" },
    { value: "2", label: "2+ Stars" },
    { value: "1", label: "1+ Stars" },
  ];

  const distances = [
    { value: "5", label: "5 km" },
    { value: "10", label: "10 km" },
    { value: "25", label: "25 km" },
    { value: "50", label: "50 km" },
  ];

  const [locationInput, setLocationInput] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  // Handle location input change
  const handleLocationInput = (e) => {
    const value = e.target.value;
    setLocationInput(value);
    setSelectedLocation("");
    if (allLocations.length === 0) return;
    if (value.trim().length === 0) {
      setLocationSuggestions(allLocations);
      return;
    }
    const filtered = allLocations.filter((loc) =>
      String(loc).toLowerCase().includes(value.toLowerCase())
    );
    setLocationSuggestions(filtered);
  };

  const handleLocationSelect = (loc) => {
    setLocationInput(loc);
    setSelectedLocation(loc);
    setShowLocationSuggestions(false);
  };

  // Fetch search suggestions (supports empty string for defaults)
  const fetchSuggestions = async (query) => {
    try {
      const response = await fetch(
        `/api/search/suggestions?q=${encodeURIComponent(query)}&type=${
          searchType || "all"
        }`
      );
      debugger;
      const data = await response.json();
      setSuggestions(data.suggestions || []);
      setShowSuggestions((data.suggestions || []).length > 0);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  // Fetch location suggestions
  const fetchLocationSuggestions = async () => {
    try {
      const response = await fetch("/api/search/locations");
      const data = await response.json();
      debugger;
      const list = Array.isArray(data.locations) ? data.locations : [];
      setAllLocations(list);
      // Initialize suggestion list based on current input
      const base = (locationInput || "").trim();
      if (base) {
        const filtered = list.filter((loc) =>
          String(loc).toLowerCase().includes(base.toLowerCase())
        );
        setLocationSuggestions(filtered);
      } else {
        setLocationSuggestions(list);
      }
      setShowLocationSuggestions(true);
    } catch (error) {
      console.error("Error fetching locations:", error);
      setLocationSuggestions([]);
    }
  };

  // Handle search input change with suggestions from 1+ chars, defaults on empty
  const handleSearchChange = (value) => {
    if (setSearchQuery) {
      setSearchQuery(value);
    }

    if (value.length >= 1) {
      fetchSuggestions(value);
    } else {
      fetchSuggestions("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((searchQuery || "").trim() && (searchQuery || "").length >= 3) {
      if (onSearch) {
        onSearch({ selectedLocation });
      }
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      specialization: "",
      experience: "",
      fee: "",
      rating: "",
      distance: "25",
    });
  };

  const hasActiveFilters = Object.values(filters).some(
    (filter) => filter !== "" && filter !== "25"
  );
  const isSearchDisabled = !(searchQuery || "").trim() && !hasActiveFilters;

  const specialtyPills = [
    "Dentist",
    "Dermatologist",
    "Gynecologist",
    "Pediatrician",
    "Orthopedic",
    "Cardiologist",
    "ENT",
  ];
  const topCities = [
    "Delhi",
    "Mumbai",
    "Bengaluru",
    "Hyderabad",
    "Chennai",
    "Pune",
    "Kolkata",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="max-w-4xl mx-auto relative z-50"
    >
      {/* Search Type Tabs - Made Sticky */}
      <div className="sticky z-40 bg-white/10 dark:bg-gray-800/95 backdrop-blur-md rounded-lg p-2 shadow-lg mb-6">
        <div className="flex flex-wrap justify-center gap-2">
          {searchTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setSearchType && setSearchType(type.value)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                (searchType || "all") === type.value
                  ? "bg-primary-600 text-white shadow-lg transform scale-105"
                  : "text-gray-600 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900 hover:text-primary-600 dark:hover:text-primary-400"
              }`}
            >
              <span>{type.icon}</span>
              <span className="hidden sm:inline">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Search Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex flex-col gap-4">
          {/* Main Search Bar (text) */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative" ref={searchRef}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery || ""}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => {
                    fetchSuggestions(searchQuery || "");
                  }}
                  placeholder={`Search for ${
                    (searchType || "all") === "all"
                      ? "healthcare services"
                      : searchType || "all"
                  }...`}
                  className="w-full pl-10 pr-10 py-2 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-gray-900 placeholder-gray-500 dark:placeholder-gray-400"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery && setSearchQuery("");
                      setShowSuggestions(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : null}

                {/* Search Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50 mt-1 max-h-60 overflow-y-auto text-left">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className={`px-4 py-3 text-left ${
                          suggestion.type === "info"
                            ? "cursor-default bg-blue-50 dark:bg-blue-900/20"
                            : "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                        } border-b border-gray-100 dark:border-gray-600`}
                        onClick={() => {
                          if (suggestion.type !== "info" && setSearchQuery) {
                            setSearchQuery(suggestion.text);
                          }
                          setShowSuggestions(false);
                        }}
                      >
                        <div className="font-medium text-gray-900 dark:text-white">
                          {suggestion.text}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {suggestion.subtext}{" "}
                          {suggestion.type !== "info" && `• ${suggestion.type}`}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Removed helper text and counters for minimum characters */}

              {/* Location Typeahead with Compass Icon */}
              <div className="flex-1 relative" ref={locationRef}>
                <Compass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={locationInput}
                  onChange={handleLocationInput}
                  onFocus={fetchLocationSuggestions}
                  placeholder="Enter location (city, state, village)"
                  className="w-full pl-10 pr-10 py-2 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-gray-900 placeholder-gray-500 dark:placeholder-gray-400"
                  autoComplete="off"
                />
                {locationInput ? (
                  <button
                    type="button"
                    onClick={() => {
                      setShowLocationSuggestions(false);
                      setAllLocations([]);
                      setLocationSuggestions([]);
                      setSelectedLocation && setSelectedLocation("");
                      setFilters &&
                        setFilters((prev) => ({ ...prev, distance: "" }));
                      // Clear input value
                      const evt = { target: { value: "" } };
                      handleLocationInput(evt);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    aria-label="Clear location"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : null}
                {showLocationSuggestions && locationSuggestions.length > 0 && (
                  <ul className="absolute left-0 right-0 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50 mt-1 max-h-48 overflow-y-auto text-left">
                    {locationSuggestions.map((loc) => (
                      <li
                        key={loc}
                        className="px-4 py-2 cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900 text-left"
                        onClick={() => {
                          handleLocationSelect(loc);
                          setShowLocationSuggestions(false);
                        }}
                      >
                        {loc}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Search Button */}
              <button
                type="submit"
                disabled={!(searchQuery || "").trim()}
                className={`group relative font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  (searchQuery || "").trim()
                    ? (searchQuery || "").length >= 3
                      ? "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white hover:scale-105 hover:shadow-xl hover:shadow-primary-500/50"
                      : "bg-yellow-500 hover:bg-yellow-600 text-white hover:scale-105"
                    : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                }`}
              >
                {(searchQuery || "").trim() && (searchQuery || "").length < 3
                  ? "Quick Search"
                  : "Search"}
              </button>
            </div>
          </div>

          {/* Quick Suggestions (Practo-like) */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-300 mr-1">
                Popular:
              </span>
              {specialtyPills.map((spec) => (
                <button
                  key={spec}
                  type="button"
                  className="px-3 py-1.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-primary-100 dark:hover:bg-primary-900 text-gray-700 dark:text-gray-200 hover:text-primary-700 dark:hover:text-primary-300"
                  onClick={() => {
                    if (setSearchQuery) setSearchQuery(spec);
                    if (onSearch && spec.length >= 3)
                      onSearch({ selectedLocation });
                  }}
                >
                  {spec}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-300 mr-1">
                Top cities:
              </span>
              {topCities.map((city) => (
                <button
                  key={city}
                  type="button"
                  className="px-3 py-1.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-primary-100 dark:hover:bg-primary-900 text-gray-700 dark:text-gray-200 hover:text-primary-700 dark:hover:text-primary-300"
                  onClick={() => {
                    setLocationInput(city);
                    setSelectedLocation(city);
                    if (onSearch) onSearch({ selectedLocation: city });
                  }}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Right-aligned Filters */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                showFilters || hasActiveFilters
                  ? "bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400"
                  : "text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Advanced Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
              )}
            </button>
          </div>
        </div>

        {/* Enhanced Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Advanced Filters
                  </h3>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <X className="w-4 h-4" />
                      <span>Clear all</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Specialization Filter */}
                  {((searchType || "all") === "all" ||
                    (searchType || "all") === "doctors") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Specialization
                      </label>
                      <select
                        value={filters.specialization}
                        onChange={(e) =>
                          handleFilterChange("specialization", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">All Specializations</option>
                        {specializations.map((spec) => (
                          <option key={spec} value={spec.toLowerCase()}>
                            {spec}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Experience Filter */}
                  {(searchType === "all" || searchType === "doctors") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Experience
                      </label>
                      <select
                        value={filters.experience}
                        onChange={(e) =>
                          handleFilterChange("experience", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Any Experience</option>
                        {experienceRanges.map((range) => (
                          <option key={range.value} value={range.value}>
                            {range.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Fee Filter */}
                  {(searchType === "all" || searchType === "doctors") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Consultation Fee
                      </label>
                      <select
                        value={filters.fee}
                        onChange={(e) =>
                          handleFilterChange("fee", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Any Fee</option>
                        {feeRanges.map((range) => (
                          <option key={range.value} value={range.value}>
                            {range.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Rating Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Minimum Rating
                    </label>
                    <select
                      value={filters.rating}
                      onChange={(e) =>
                        handleFilterChange("rating", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Any Rating</option>
                      {ratings.map((rating) => (
                        <option key={rating.value} value={rating.value}>
                          {rating.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Distance Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Distance
                    </label>
                    <select
                      value={filters.distance}
                      onChange={(e) =>
                        handleFilterChange("distance", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      {distances.map((distance) => (
                        <option key={distance.value} value={distance.value}>
                          Within {distance.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Apply Filters Button */}
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => {
                        onSearch(filters);
                        setShowFilters(false);
                      }}
                      className="w-full btn-primary"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
}
