"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Grid3X3,
  List,
  Compass,
  TestTube,
  Home,
  Building2,
  Clock,
  X,
} from "lucide-react";
import { useApi } from "@/hooks/useApi";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DoctorCard from "@/components/cards/DoctorCard";
import ClinicCard from "@/components/cards/ClinicCard";
import AmbulanceCard from "@/components/cards/AmbulanceCard";
import PharmacyCard from "@/components/cards/PharmacyCard";
import SearchFilters from "@/components/search/SearchFilters";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import FAQAccordion from "@/components/common/FAQAccordion";

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
    department: searchParams.get("department") || "",
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Debug department parameter
  useEffect(() => {
    const departmentParam = searchParams.get("department");
    console.log(
      "Search page loaded with department parameter:",
      departmentParam
    );
    console.log(
      "Decoded department:",
      departmentParam ? decodeURIComponent(departmentParam) : "none"
    );
  }, [searchParams]);

  // Location typeahead (dynamic from backend)
  const [allLocations, setAllLocations] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [locationInput, setLocationInput] = useState(
    searchParams.get("city") || ""
  );
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const locationBoxRef = useRef(null);

  const handleLocationInput = (e) => {
    const value = e.target.value;
    setLocationInput(value);
    setSelectedLocation("");
    setShowLocationSuggestions(true);
    if (allLocations.length === 0) return; // wait for fetch on focus or mount
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
    setLocationSuggestions([]);
    setShowLocationSuggestions(false);
  };

  // Fetch search suggestions (now supports empty string for defaults)
  const fetchSuggestions = async (query) => {
    try {
      const res = await fetch(
        `/api/search/suggestions?q=${encodeURIComponent(query)}&type=${
          searchType || "all"
        }`
      );
      debugger;
      const data = await res.json();
      setSuggestions(data.suggestions || []);
      setShowSuggestions((data.suggestions || []).length > 0);
    } catch (e) {
      console.error("Suggestion fetch failed", e);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (value.length >= 1) {
      fetchSuggestions(value);
    } else {
      // Empty input: show default suggestions (departments etc.)
      fetchSuggestions("");
    }
  };

  const performSearch = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams({
        q: searchQuery,
        type: searchType,
        sort: sortBy,
        ...filters,
      });
      const cityParam = (selectedLocation || locationInput || "").trim();
      if (cityParam) queryParams.set("city", cityParam);
      console.log("Search query params:", queryParams.toString());
      console.log("Search type:", searchType);
      console.log("Search query:", searchQuery);
      console.log("Department filter:", filters.department);
      const response = await get(`/search?${queryParams.toString()}`);
      debugger;
      console.log("Search response:", response.data);
      console.log("Search results:", response.data?.results);
      console.log("Ambulance results:", response.data?.results?.ambulances);
      setResults(response.data?.results || {});
    } catch (error) {
      console.error("Search error:", error);
      setResults({});
    }
  }, [searchQuery, searchType, sortBy, filters, selectedLocation, get]);

  useEffect(() => {
    // Auto-search only when query has 3+ characters or when a specific type is selected
    if (
      searchQuery.trim().length >= 3 ||
      searchType !== "all" ||
      locationInput ||
      selectedLocation
    ) {
      performSearch();
    }
  }, [performSearch]);

  // Close suggestion lists on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        locationBoxRef.current &&
        !locationBoxRef.current.contains(event.target)
      ) {
        setShowLocationSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Trigger search when searchType changes
  useEffect(() => {
    if (searchType !== "all") {
      performSearch();
    }
  }, [searchType]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (searchType !== "all") params.set("type", searchType);
    const cityParam = (selectedLocation || locationInput || "").trim();
    if (cityParam) params.set("city", cityParam);
    if (filters.department) params.set("department", filters.department);
    const newUrl = `/search${params.toString() ? `?${params.toString()}` : ""}`;
    router.replace(newUrl, { shallow: true });
  }, [
    searchQuery,
    searchType,
    selectedLocation,
    locationInput,
    filters.department,
    router,
  ]);

  // Initialize selectedLocation from URL on first load
  useEffect(() => {
    const initialCity = searchParams.get("city");
    if (initialCity) {
      setSelectedLocation(initialCity);
      setLocationInput(initialCity);
    }
    // Preload locations list
    (async () => {
      try {
        const res = await fetch("/api/search/locations");
        const data = await res.json();
        const list = Array.isArray(data.locations) ? data.locations : [];
        setAllLocations(list);
        // Initialize suggestions based on initial input
        const base = (initialCity || locationInput || "").trim();
        if (base) {
          const filtered = list.filter((loc) =>
            String(loc).toLowerCase().includes(base.toLowerCase())
          );
          setLocationSuggestions(filtered);
        } else {
          setLocationSuggestions(list);
        }
      } catch (e) {
        setAllLocations([]);
        setLocationSuggestions([]);
      }
    })();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch();
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Normalize singular type names to results keys
  const mapTypeToKey = (type) => {
    if (type === "ambulance") return "ambulances";
    if (type === "pathology") return "pathologies";
    return type;
  };

  const getTotalResults = () => {
    if (searchType === "all") {
      return (
        (results.doctors?.length || 0) +
        (results.clinics?.length || 0) +
        // (results.pharmacies?.length || 0) +
        (results.ambulances?.length || 0) +
        (results.pathologies?.length || 0)
      );
    }
    const key = mapTypeToKey(searchType);
    return results[key]?.length || 0;
  };

  const searchTypes = [
    { value: "all", label: "All", icon: "🔍" },
    { value: "doctors", label: "Doctors", icon: "👨‍⚕️" },
    { value: "clinics", label: "Clinics", icon: "🏥" },
    // { value: "pharmacies", label: "Pharmacies", icon: "💊" },
    { value: "ambulance", label: "Ambulance", icon: "🚑" },
    { value: "pathology", label: "Pathology", icon: "⚕️" },
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
        className="text-sm text-gray-500 dark:text-gray-400 py-4 px-4 max-w-7xl"
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
      <main className="flex-grow pt-4">
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
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => {
                      fetchSuggestions(searchQuery || "");
                    }}
                    placeholder="Search for doctors, clinics, departments, pathologies, ambulance..."
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    aria-label="Search input"
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setSuggestions([]);
                        setShowSuggestions(false);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : null}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-10 mt-1 max-h-60 overflow-y-auto text-left">
                      {suggestions.map((s, idx) => (
                        <div
                          key={idx}
                          className={`px-4 py-2 text-left ${
                            s.type === "info"
                              ? "cursor-default bg-blue-50 dark:bg-blue-900/20"
                              : "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                          } border-b border-gray-100 dark:border-gray-600`}
                          onClick={() => {
                            if (s.type !== "info") {
                              if (s.type === "department" && s.value) {
                                setFilters((prev) => ({
                                  ...prev,
                                  department: encodeURIComponent(s.value),
                                }));
                              }
                              setSearchQuery(s.text || "");
                              setShowSuggestions(false);
                              performSearch();
                            }
                          }}
                        >
                          <div className="font-medium text-gray-900 dark:text-white">
                            {s.text}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {s.subtext}{" "}
                            {s.type && s.type !== "info" ? `• ${s.type}` : ""}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex-1 relative" ref={locationBoxRef}>
                  <Compass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={locationInput}
                    onChange={handleLocationInput}
                    onFocus={() => setShowLocationSuggestions(true)}
                    onBlur={() =>
                      setTimeout(() => setShowLocationSuggestions(false), 150)
                    }
                    placeholder="Enter location (city, state, village)"
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    autoComplete="off"
                  />
                  {locationInput ? (
                    <button
                      type="button"
                      onClick={() => {
                        setLocationInput("");
                        setSelectedLocation("");
                        setLocationSuggestions([]);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      aria-label="Clear location"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : null}
                  {showLocationSuggestions &&
                    locationSuggestions.length > 0 && (
                      <ul className="absolute left-0 right-0 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-10 mt-1 max-h-48 overflow-y-auto text-left">
                        {locationSuggestions.map((loc) => (
                          <li
                            key={loc}
                            className="px-4 py-2 cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900 text-left"
                            onClick={() => handleLocationSelect(loc)}
                          >
                            {loc}
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
                <button type="submit" className="btn-primary px-6 py-2">
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
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    searchType === type.value
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {type.icon} {type.label}
                  {results[mapTypeToKey(type.value)] && (
                    <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                      {results[mapTypeToKey(type.value)].length}
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

                {filters.department && (
                  <div className="flex items-center text-sm text-primary-600 dark:text-primary-400">
                    <span className="bg-primary-100 dark:bg-primary-900 px-2 py-1 rounded-full text-xs font-medium">
                      Department: {decodeURIComponent(filters.department)}
                    </span>
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
                      <div
                        key={clinic._id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                              <Building2 className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {clinic.name}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {clinic.type || "General Clinic"}
                              </p>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm font-medium">
                            {clinic.place || clinic.state || "N/A"}
                          </span>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-2">
                          {clinic.description || "No description available"}
                        </p>

                        <div className="flex items-center justify-between text-sm mb-4">
                          <span className="text-gray-500 dark:text-gray-400">
                            {clinic.place || "N/A"}, {clinic.state || "N/A"}
                          </span>
                          {clinic.is24Hours && (
                            <span className="text-blue-600 dark:text-blue-400 flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              24/7
                            </span>
                          )}
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                          <button
                            onClick={() => {
                              const clinicName = encodeURIComponent(
                                clinic.name.replace(/\s+/g, "-").toLowerCase()
                              );
                              const location = encodeURIComponent(
                                clinic.place || clinic.state || "unknown"
                              );
                              // Pass ID as query parameter for better data retrieval
                              router.push(
                                `/clinic/${clinicName}/${location}?id=${clinic._id}`
                              );
                            }}
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Pharmacies */}
              {/* {results.pharmacies?.length > 0 && (
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
              )} */}

              {/* Ambulances - Only show for "all" search type */}
              {searchType === "all" && results.ambulances?.length > 0 && (
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
                      <AmbulanceCard
                        key={ambulance._id}
                        ambulance={ambulance}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Pathologies */}
              {results.pathologies?.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-4">
                    Pathology Tests ({results.pathologies.length})
                  </h2>
                  <div
                    className={`grid gap-6 ${
                      viewMode === "grid"
                        ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                        : "grid-cols-1"
                    }`}
                  >
                    {results.pathologies.map((pathology) => (
                      <div
                        key={pathology._id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow min-h-[300px] flex flex-col"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                              <TestTube className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {pathology.name}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {pathology.category}
                              </p>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full text-sm font-medium">
                            ₹{pathology.discountedPrice || pathology.price}
                          </span>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-2">
                          {pathology.description}
                        </p>

                        <div className="flex items-center justify-between text-sm mb-4">
                          <span className="text-gray-500 dark:text-gray-400">
                            {pathology.place || "N/A"},{" "}
                            {pathology.state || "N/A"}
                          </span>
                          {pathology.homeCollection && (
                            <span className="text-blue-600 dark:text-blue-400 flex items-center">
                              <Home className="w-4 h-4 mr-1" />
                              Home Collection
                            </span>
                          )}
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-auto">
                          <button
                            onClick={() => {
                              const pathologyName = encodeURIComponent(
                                pathology.name
                                  .replace(/\s+/g, "-")
                                  .toLowerCase()
                              );
                              const location = encodeURIComponent(
                                pathology.place || pathology.state || "unknown"
                              );
                              // Pass ID as query parameter for better data retrieval
                              router.push(
                                `/pathology/${pathologyName}/${location}?id=${pathology._id}`
                              );
                            }}
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors block"
                          >
                            View Details
                          </button>
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
              {/* {searchType === "pharmacies" &&
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
                )} */}

              {/* Ambulances - Specific search type */}
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
                      <AmbulanceCard
                        key={ambulance._id}
                        ambulance={ambulance}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Pathologies */}
              {searchType === "pathology" &&
                results.pathologies?.length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-4">
                      Pathologies ({results.pathologies.length})
                    </h2>
                    <div
                      className={`grid gap-6 ${
                        viewMode === "grid"
                          ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                          : "grid-cols-1"
                      }`}
                    >
                      {results.pathologies.map((pathology) => (
                        <div
                          key={pathology._id}
                          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow min-h-[300px] flex flex-col"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                                <TestTube className="w-6 h-6 text-red-600" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {pathology.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {pathology.category}
                                </p>
                              </div>
                            </div>
                            <span className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full text-sm font-medium">
                              ₹{pathology.discountedPrice || pathology.price}
                            </span>
                          </div>

                          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-2">
                            {pathology.description}
                          </p>

                          <div className="flex items-center justify-between text-sm mb-4">
                            <span className="text-gray-500 dark:text-gray-400">
                              {pathology.address?.city || "N/A"},{" "}
                              {pathology.address?.state || "N/A"}
                            </span>
                            {pathology.homeCollection && (
                              <span className="text-blue-600 dark:text-blue-400 flex items-center">
                                <Home className="w-4 h-4 mr-1" />
                                Home Collection
                              </span>
                            )}
                          </div>

                          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-auto">
                            <button
                              onClick={() => {
                                const pathologyName = encodeURIComponent(
                                  pathology.name
                                    .replace(/\s+/g, "-")
                                    .toLowerCase()
                                );
                                const location = encodeURIComponent(
                                  pathology.address?.city ||
                                    pathology.address?.state ||
                                    "unknown"
                                );
                                router.push(
                                  `/pathology/${pathologyName}/${location}?id=${pathology._id}`
                                );
                              }}
                              className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors block"
                            >
                              View Details
                            </button>
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
        {/* FAQs for Doctor Search */}
        {searchType === "doctors" && (
          <div className="mt-10">
            <FAQAccordion entityType="doctor_search" />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
