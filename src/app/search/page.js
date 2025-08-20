"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Grid3X3,
  List,
  Compass,
} from "lucide-react";
import { useApi } from "@/hooks/useApi";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DoctorCard from "@/components/cards/DoctorCard";
import ClinicCard from "@/components/cards/ClinicCard";
import PharmacyCard from "@/components/cards/PharmacyCard";
import SearchFilters from "@/components/search/SearchFilters";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { get, loading: apiLoading } = useApi();

  const [results, setResults] = useState({});
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [searchType, setSearchType] = useState(
    searchParams.get("type") || "all"
  );
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    specialization: "",
    experience: "",
    fee: "",
    rating: "",
    distance: "",
  });

  // Location typeahead
  const locations = [
    "Delhi",
    "Mumbai",
    "Bangalore",
    "Hyderabad",
    "Ahmedabad",
    "Chennai",
    "Kolkata",
    "Pune",
    "Jaipur",
    "Lucknow",
  ]; // trimmed list for brevity
  const [locationInput, setLocationInput] = useState(
    searchParams.get("city") || ""
  );
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");

  const handleLocationInput = (e) => {
    const value = e.target.value;
    setLocationInput(value);
    setSelectedLocation("");
    if (value.length >= 2) {
      setLocationSuggestions(
        locations.filter((loc) =>
          loc.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setLocationSuggestions([]);
    }
  };
  const handleLocationSelect = (loc) => {
    setLocationInput(loc);
    setSelectedLocation(loc);
    setLocationSuggestions([]);
  };

  const performSearch = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams({
        q: searchQuery,
        type: searchType,
        sort: sortBy,
        ...filters,
      });
      if (selectedLocation) queryParams.set("city", selectedLocation);
      const response = await get(`/search?${queryParams.toString()}`);
      setResults(response.data?.results || {});
    } catch (error) {
      console.error("Search error:", error);
      setResults({});
    }
  }, [searchQuery, searchType, sortBy, filters, selectedLocation, get]);

  useEffect(() => {
    if (searchQuery.trim() || searchType !== "all") {
      performSearch();
    } else {
      setResults({});
    }
  }, [performSearch]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (searchType !== "all") params.set("type", searchType);
    if (selectedLocation) params.set("city", selectedLocation);
    const newUrl = `/search${params.toString() ? `?${params.toString()}` : ""}`;
    router.replace(newUrl, { shallow: true });
  }, [searchQuery, searchType, selectedLocation, router]);

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch();
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const getTotalResults = () => {
    if (searchType === "all") {
      return (
        (results.doctors?.length || 0) +
        (results.clinics?.length || 0) +
        (results.pharmacies?.length || 0) +
        (results.ambulances?.length || 0)
      );
    }
    return results[searchType]?.length || 0;
  };

  const searchTypes = [
    { value: "all", label: "All", icon: "🔍" },
    { value: "doctors", label: "Doctors", icon: "👨‍⚕️" },
    { value: "clinics", label: "Clinics", icon: "🏥" },
    { value: "pharmacies", label: "Pharmacies", icon: "💊" },
    { value: "ambulance", label: "Ambulance", icon: "🚑" },
  ];

  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "rating", label: "Rating" },
    { value: "distance", label: "Distance" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      {/* Breadcrumb Navigation */}
      <nav
        className="text-sm text-gray-500 dark:text-gray-400 py-4 px-4 max-w-7xl mx-auto"
        aria-label="Breadcrumb"
      >
        <ol className="list-reset flex">
          <li>
            <a href="/" className="hover:text-primary-600">
              Home
            </a>
            <span className="mx-2">/</span>
          </li>
          <li>
            <a href="/search" className="hover:text-primary-600">
              Search
            </a>
            <span className="mx-2">/</span>
          </li>
          <li
            className="text-primary-600 font-semibold truncate max-w-xs"
            title={searchQuery}
          >
            {searchQuery || "All"}
          </li>
        </ol>
      </nav>
      <main className="flex-grow pt-20">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for doctors, clinics, pharmacies..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    aria-label="Search input"
                    minLength={3}
                  />
                </div>
                <div className="flex-1 relative">
                  <Compass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={locationInput}
                    onChange={handleLocationInput}
                    placeholder="Enter location (city, state, village)"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    autoComplete="off"
                  />
                  {locationSuggestions.length > 0 && (
                    <ul className="absolute left-0 right-0 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-10 mt-1 max-h-48 overflow-y-auto">
                      {locationSuggestions.map((loc) => (
                        <li
                          key={loc}
                          className="px-4 py-2 cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900"
                          onClick={() => handleLocationSelect(loc)}
                        >
                          {loc}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <button type="submit" className="btn-primary px-6 py-3">
                  Search
                </button>
              </div>
            </form>

            {/* Search Type */}
            <div className="flex flex-wrap gap-2 mb-4">
              {searchTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSearchType(type.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    searchType === type.value
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {type.icon} {type.label}
                  {results[type.value] && (
                    <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                      {results[type.value].length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filters</span>
                </button>

                {selectedLocation && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{selectedLocation}</span>
                  </div>
                )}

                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {getTotalResults()} results found
                </span>
              </div>

              <div className="flex items-center space-x-4">
                {/* Sort select */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* View Mode Toggles */}
                <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${
                      viewMode === "grid"
                        ? "bg-primary-600 text-white"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${
                      viewMode === "list"
                        ? "bg-primary-600 text-white"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-[60vh]">
          {apiLoading && <LoadingSpinner />}

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-80 flex-shrink-0 mb-6"
            >
              <SearchFilters
                searchType={searchType}
                filters={filters}
                onFiltersChange={setFilters}
              />
            </motion.div>
          )}

          {/* All Results Combined */}
          {searchType === "all" && (
            <div className="space-y-8">
              {/* Doctors */}
              {results.doctors?.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-4">
                    Doctors ({results.doctors.length})
                  </h2>
                  <div
                    className={`grid gap-6 ${
                      viewMode === "grid"
                        ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                        : "grid-cols-1"
                    }`}
                  >
                    {results.doctors.map((doctor) => (
                      <DoctorCard key={doctor._id} doctor={doctor} />
                    ))}
                  </div>
                </section>
              )}

              {/* Clinics */}
              {results.clinics?.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-4">
                    Clinics ({results.clinics.length})
                  </h2>
                  <div
                    className={`grid gap-6 ${
                      viewMode === "grid"
                        ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                        : "grid-cols-1"
                    }`}
                  >
                    {results.clinics.map((clinic) => (
                      <ClinicCard key={clinic._id} clinic={clinic} />
                    ))}
                  </div>
                </section>
              )}

              {/* Pharmacies */}
              {results.pharmacies?.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-4">
                    Pharmacies ({results.pharmacies.length})
                  </h2>
                  <div
                    className={`grid gap-6 ${
                      viewMode === "grid"
                        ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                        : "grid-cols-1"
                    }`}
                  >
                    {results.pharmacies.map((pharmacy) => (
                      <PharmacyCard key={pharmacy._id} pharmacy={pharmacy} />
                    ))}
                  </div>
                </section>
              )}

              {/* Ambulances */}
              {results.ambulances?.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-4">
                    Ambulances ({results.ambulances.length})
                  </h2>
                  <div
                    className={`grid gap-6 ${
                      viewMode === "grid"
                        ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                        : "grid-cols-1"
                    }`}
                  >
                    {results.ambulances.map((ambulance) => (
                      <div
                        key={ambulance._id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                              <span className="text-2xl">🚑</span>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {ambulance.name}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Vehicle: {ambulance.vehicleNumber}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              ambulance.isAvailable
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}
                          >
                            {ambulance.isAvailable
                              ? "Available"
                              : "Unavailable"}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Driver: {ambulance.driverName}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Phone: {ambulance.phone}
                            </span>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              Location: {ambulance.location || "N/A"},{" "}
                              {ambulance.city || "N/A"}
                            </span>
                            <button
                              onClick={() =>
                                window.open(`tel:${ambulance.phone}`, "_blank")
                              }
                              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              Call Now
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* Individual Type Results */}
          {searchType !== "all" && (
            <>
              {/* Doctors */}
              {searchType === "doctors" && results.doctors?.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-4">
                    Doctors ({results.doctors.length})
                  </h2>
                  <div
                    className={`grid gap-6 ${
                      viewMode === "grid"
                        ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                        : "grid-cols-1"
                    }`}
                  >
                    {results.doctors.map((doctor) => (
                      <DoctorCard key={doctor._id} doctor={doctor} />
                    ))}
                  </div>
                </section>
              )}

              {/* Clinics */}
              {searchType === "clinics" && results.clinics?.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-4">
                    Clinics ({results.clinics.length})
                  </h2>
                  <div
                    className={`grid gap-6 ${
                      viewMode === "grid"
                        ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                        : "grid-cols-1"
                    }`}
                  >
                    {results.clinics.map((clinic) => (
                      <ClinicCard key={clinic._id} clinic={clinic} />
                    ))}
                  </div>
                </section>
              )}

              {/* Pharmacies */}
              {searchType === "pharmacies" &&
                results.pharmacies?.length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-4">
                      Pharmacies ({results.pharmacies.length})
                    </h2>
                    <div
                      className={`grid gap-6 ${
                        viewMode === "grid"
                          ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                          : "grid-cols-1"
                      }`}
                    >
                      {results.pharmacies.map((pharmacy) => (
                        <PharmacyCard key={pharmacy._id} pharmacy={pharmacy} />
                      ))}
                    </div>
                  </section>
                )}

              {/* Ambulances */}
              {searchType === "ambulance" && results.ambulances?.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-4">
                    Ambulances ({results.ambulances.length})
                  </h2>
                  <div
                    className={`grid gap-6 ${
                      viewMode === "grid"
                        ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                        : "grid-cols-1"
                    }`}
                  >
                    {results.ambulances.map((ambulance) => (
                      <div
                        key={ambulance._id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                              <span className="text-2xl">🚑</span>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {ambulance.name}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Vehicle: {ambulance.vehicleNumber}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              ambulance.isAvailable
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}
                          >
                            {ambulance.isAvailable
                              ? "Available"
                              : "Unavailable"}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Driver: {ambulance.driverName}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Phone: {ambulance.phone}
                            </span>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              Location: {ambulance.location || "N/A"},{" "}
                              {ambulance.city || "N/A"}
                            </span>
                            <button
                              onClick={() =>
                                window.open(`tel:${ambulance.phone}`, "_blank")
                              }
                              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              Call Now
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {/* No Results Message */}
          {getTotalResults() === 0 && !apiLoading && (
            <div className="text-center py-12 text-gray-600 dark:text-gray-400">
              <Search className="mx-auto w-16 h-16 mb-6" />
              <h3 className="text-lg font-medium">No results found</h3>
              <p className="mt-2">
                Try adjusting your search terms or filters.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
