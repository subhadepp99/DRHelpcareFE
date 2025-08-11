"use client";

import { useState } from "react";
import { Search, MapPin, Filter, Loader, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchSection({
  searchQuery,
  setSearchQuery,
  searchType,
  setSearchType,
  onSearch,
  location,
  locationLoading,
  onLocationRequest,
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    specialization: "",
    experience: "",
    fee: "",
    rating: "",
    distance: "25",
  });

  const searchTypes = [
    { value: "all", label: "All", icon: "🔍" },
    { value: "doctors", label: "Doctors", icon: "👨‍⚕️" },
    { value: "clinics", label: "Clinics", icon: "🏥" },
    { value: "pharmacies", label: "Pharmacies", icon: "💊" },
    { value: "pathology", label: "Pathology", icon: "🔬" },
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      searchQuery.trim() ||
      Object.values(filters).some((filter) => filter !== "" && filter !== "25")
    ) {
      onSearch(filters);
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
  const isSearchDisabled = !searchQuery.trim() && !hasActiveFilters;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      {/* Search Type Tabs - Made Sticky */}
      <div className="sticky top-20 z-40 bg-white/10 dark:bg-gray-800/95 backdrop-blur-md rounded-lg p-2 shadow-lg mb-6">
        <div className="flex flex-wrap justify-center gap-2">
          {searchTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setSearchType(type.value)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                searchType === type.value
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
          {/* Main Search Bar */}
          <div className="flex flex-col sm:flex-row gap-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search for ${
                  searchType === "all" ? "healthcare services" : searchType
                }...`}
                className="w-full pl-10 pr-4 py-3 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-gray-900 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            {/* Location Display with Proper Alignment */}
            <div className="flex items-center justify-between px-4 py-3 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-md min-w-[180px]">
              <div className="flex items-center">
                {locationLoading ? (
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                )}
                <span className="text-sm truncate">
                  {locationLoading
                    ? "Getting location..."
                    : location
                    ? `${location.city}`
                    : "Location"}
                </span>
              </div>

              {!location && !locationLoading && (
                <button
                  type="button"
                  onClick={onLocationRequest}
                  className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 ml-2 whitespace-nowrap"
                >
                  Near me
                </button>
              )}
            </div>

            {/* Enhanced Search Button with Disabled State */}
            <button
              type="submit"
              disabled={isSearchDisabled}
              className={`group relative font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                isSearchDisabled
                  ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white hover:scale-105 hover:shadow-xl hover:shadow-primary-500/50"
              }`}
            >
              <span className="relative z-10">Search</span>
              {!isSearchDisabled && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
              )}
            </button>
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
                  {(searchType === "all" || searchType === "doctors") && (
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
