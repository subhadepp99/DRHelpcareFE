"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, MapPin, SlidersHorizontal, Grid3X3, List } from "lucide-react";
import { useLocation } from "@/hooks/useLocation";
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
  const { location, requestLocation, loading: locationLoading } = useLocation();
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

  const performSearch = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams({
        q: searchQuery,
        type: searchType,
        sort: sortBy,
        ...filters,
      });
      if (location) {
        queryParams.append("lat", location.lat);
        queryParams.append("lng", location.lng);
      }
      const response = await get(`/search?${queryParams.toString()}`);
      setResults(response.data?.results || {});
    } catch (error) {
      console.error("Search error:", error);
      setResults({});
    }
  }, [searchQuery, searchType, sortBy, filters, location, get]);

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
    if (location) {
      params.set("lat", location.lat);
      params.set("lng", location.lng);
    }
    const newUrl = `/search${params.toString() ? `?${params.toString()}` : ""}`;
    router.replace(newUrl, { shallow: true });
  }, [searchQuery, searchType, location, router]);

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch();
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const getTotalResults = () =>
    Object.values(results).reduce(
      (total, items) => total + (items?.length || 0),
      0
    );

  const searchTypes = [
    { value: "all", label: "All" },
    { value: "doctors", label: "Doctors" },
    { value: "clinics", label: "Clinics" },
    { value: "pharmacies", label: "Pharmacies" },
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
                  />
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
                  {type.label}
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

                {location && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{location.city}</span>
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

          {/* Doctors */}
          {(searchType === "all" || searchType === "doctors") &&
            results.doctors?.length > 0 && (
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
          {(searchType === "all" || searchType === "clinics") &&
            results.clinics?.length > 0 && (
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
          {(searchType === "all" || searchType === "pharmacies") &&
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

          {/* No Results Message */}
          {getTotalResults() === 0 && !apiLoading && (
            <div className="text-center py-12 text-gray-600 dark:text-gray-400">
              <Search className="mx-auto w-16 h-16 mb-6" />
              <h3 className="text-lg font-medium">No results found</h3>
              <p className="mt-2">
                Try adjusting your search terms or filters.
              </p>
              <button
                onClick={() => requestLocation()}
                disabled={locationLoading}
                className="inline-flex items-center bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-4 py-2 rounded shadow mt-4"
                title="Search near me"
              >
                <MapPin className="w-5 h-5 mr-2" />
                {locationLoading ? "Locating..." : "Search near me"}
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
