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
// import SearchFilters from "@/components/search/SearchFilters"; // COMMENTED OUT - Advanced filters disabled
import LoadingSpinner from "@/components/common/LoadingSpinner";
import FAQAccordion from "@/components/common/FAQAccordion";
import LocationModal from "@/components/modals/LocationModal";
import MetaTags from "@/components/common/MetaTags";
import { pageMetadata } from "@/utils/metadata";
import { useLocation } from "@/contexts/LocationContext";
import { isPincode, pincodeToLocation } from "@/utils/locationUtils";
import toast from "react-hot-toast";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { get, loading: apiLoading } = useApi();
  const { location: userLocation, setLocation: updateUserLocation } = useLocation();

  const [results, setResults] = useState({});
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [searchType, setSearchType] = useState(
    searchParams.get("type") || "all"
  );
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState("grid");
  // COMMENTED OUT - Advanced filters disabled
  // const [showFilters, setShowFilters] = useState(false);
  // const [filters, setFilters] = useState({
  //   specialization: "",
  //   experience: "",
  //   fee: "",
  //   rating: "",
  //   distance: "",
  //   department: searchParams.get("department") || "",
  // });
  
  // Temporary empty filters object for compatibility
  const filters = {
    specialization: "",
    experience: "",
    fee: "",
    rating: "",
    distance: "",
    department: searchParams.get("department") || "",
  };
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  
  // Pagination states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [suggestedResults, setSuggestedResults] = useState({});
  const [convertedLocation, setConvertedLocation] = useState(null);
  const [isConvertingPincode, setIsConvertingPincode] = useState(false);
  const RESULTS_PER_PAGE = 20;
  const loadMoreRef = useRef(null);

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
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const locationBoxRef = useRef(null);

  // Sync with context location
  useEffect(() => {
    if (userLocation?.city) {
      const locationText = userLocation.state
        ? `${userLocation.city}, ${userLocation.state}`
        : userLocation.city;
      setLocationInput(locationText);
      setSelectedLocation(locationText);
    }
  }, [userLocation]);

  const handleLocationInput = async (e) => {
    const value = e.target.value;
    setLocationInput(value);
    setSelectedLocation("");
    setConvertedLocation(null);
    setShowLocationSuggestions(true);
    
    // Check if input is a pincode
    if (isPincode(value)) {
      setIsConvertingPincode(true);
      const location = await pincodeToLocation(value);
      setIsConvertingPincode(false);
      
      if (location) {
        setConvertedLocation(location);
        const locationText = location.state 
          ? `${location.city}, ${location.state}`
          : location.city;
        setSelectedLocation(locationText);
        toast.success(`Pincode ${value} → ${locationText}`);
        setShowLocationSuggestions(false);
      } else {
        toast.error('Unable to find location for this pincode');
      }
      return;
    }
    
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
    setConvertedLocation(null);
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

  const performSearch = useCallback(async (pageNum = 1, append = false) => {
    try {
      const queryParams = new URLSearchParams({
        type: searchType,
        sort: sortBy,
        ...filters,
        page: pageNum,
        limit: RESULTS_PER_PAGE,
      });
      
      // Only add search query if it's not empty
      if (searchQuery && searchQuery.trim()) {
        queryParams.set("q", searchQuery.trim());
      }

      // Use converted location from pincode first, then context location, then manual input
      if (convertedLocation) {
        if (convertedLocation.city) queryParams.set("city", convertedLocation.city);
        if (convertedLocation.state) queryParams.set("state", convertedLocation.state);
        if (convertedLocation.lat) queryParams.set("lat", convertedLocation.lat);
        if (convertedLocation.lng) queryParams.set("lng", convertedLocation.lng);
      } else if (userLocation) {
        if (userLocation.city) queryParams.set("city", userLocation.city);
        if (userLocation.state) queryParams.set("state", userLocation.state);
        if (userLocation.pincode)
          queryParams.set("pincode", userLocation.pincode);
        // Add coordinates for distance calculation
        if (userLocation.lat) queryParams.set("lat", userLocation.lat);
        if (userLocation.lng) queryParams.set("lng", userLocation.lng);
      } else {
        // Fallback to manual location input
        const cityParam = (selectedLocation || locationInput || "").trim();
        if (cityParam) queryParams.set("city", cityParam);
      }

      console.log("Search query params:", queryParams.toString());
      console.log("Search type:", searchType);
      console.log("Search query:", searchQuery);
      console.log("Department filter:", filters.department);
      console.log("User location:", userLocation);

      const response = await get(`/search?${queryParams.toString()}`);
      console.log("Search response:", response.data);
      console.log("Search results:", response.data?.results);
      console.log("Ambulance results:", response.data?.results?.ambulances);
      
      const newResults = response.data?.results || {};
      
      if (append) {
        // Append new results to existing ones
        setResults(prevResults => ({
          doctors: [...(prevResults.doctors || []), ...(newResults.doctors || [])],
          clinics: [...(prevResults.clinics || []), ...(newResults.clinics || [])],
          ambulances: [...(prevResults.ambulances || []), ...(newResults.ambulances || [])],
          pathologies: [...(prevResults.pathologies || []), ...(newResults.pathologies || [])],
        }));
      } else {
        setResults(newResults);
        
        // If no results found, fetch suggestions
        const totalResults = Object.values(newResults).reduce((sum, arr) => 
          sum + (Array.isArray(arr) ? arr.length : 0), 0
        );
        
        if (totalResults === 0 && !append) {
          await fetchSuggestedResults();
        } else {
          setSuggestedResults({});
        }
      }
      
      // Check if there are more results
      // If any result type returned exactly RESULTS_PER_PAGE items, there might be more
      const hasMoreResults = Object.values(newResults).some(arr => 
        Array.isArray(arr) && arr.length === RESULTS_PER_PAGE
      );
      
      console.log("Has more results?", hasMoreResults);
      console.log("Results lengths:", {
        doctors: newResults.doctors?.length || 0,
        clinics: newResults.clinics?.length || 0,
        ambulances: newResults.ambulances?.length || 0,
        pathologies: newResults.pathologies?.length || 0
      });
      
      setHasMore(hasMoreResults);
      setIsLoadingMore(false);
    } catch (error) {
      console.error("Search error:", error);
      if (!append) {
        setResults({});
      }
      setIsLoadingMore(false);
      setHasMore(false);
    }
  }, [
    searchQuery,
    searchType,
    sortBy,
    filters,
    selectedLocation,
    locationInput,
    userLocation,
    convertedLocation,
    get,
    RESULTS_PER_PAGE,
  ]);

  // Use a ref to prevent infinite loops
  const searchTriggerRef = useRef(false);
  const lastSearchParams = useRef({});
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Auto-search when:
    // 1. Query has 3+ characters, OR
    // 2. A specific type is selected, OR  
    // 3. Location is provided (even without query)
    const hasLocation = locationInput || selectedLocation || userLocation?.city || convertedLocation?.city;
    
    // Create a signature of current search params
    const currentParams = {
      searchQuery: searchQuery.trim(),
      searchType,
      locationInput,
      selectedLocation,
      userLocationCity: userLocation?.city,
      convertedLocationCity: convertedLocation?.city,
      department: filters.department,
      sortBy
    };
    
    // Check if params actually changed
    const paramsChanged = JSON.stringify(currentParams) !== JSON.stringify(lastSearchParams.current);
    
    if (!paramsChanged) {
      console.log("⏭️ Skipping search - params unchanged");
      return; // Don't search if nothing changed
    }
    
    if (
      searchQuery.trim().length >= 3 ||
      searchType !== "all" ||
      hasLocation
    ) {
      // Debounce search by 500ms for query changes, immediate for other changes
      const delay = paramsChanged && currentParams.searchQuery !== lastSearchParams.current.searchQuery ? 500 : 0;
      
      console.log(`🔍 Auto-search scheduled (${delay}ms delay)`);
      
      searchTimeoutRef.current = setTimeout(() => {
        console.log("🔍 Auto-search triggered");
        lastSearchParams.current = currentParams;
        setPage(1); // Reset to page 1 for new searches
        performSearch(1, false);
      }, delay);
    }
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, searchType, locationInput, selectedLocation, userLocation?.city, convertedLocation?.city, filters.department, sortBy, performSearch]);

  // Infinite Scroll - Load more when user scrolls to bottom
  useEffect(() => {
    console.log("Infinite scroll setup - hasMore:", hasMore, "isLoadingMore:", isLoadingMore, "apiLoading:", apiLoading);
    
    if (!hasMore || isLoadingMore || apiLoading) {
      console.log("Skipping observer setup - conditions not met");
      return;
    }

    console.log("Setting up intersection observer for infinite scroll");
    
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        console.log("Observer triggered - isIntersecting:", target.isIntersecting);
        
        if (target.isIntersecting && hasMore && !isLoadingMore && !apiLoading) {
          console.log("🔄 Loading more results... Current page:", page);
          const nextPage = page + 1;
          setPage(nextPage);
          setIsLoadingMore(true);
          performSearch(nextPage, true);
        }
      },
      {
        root: null,
        rootMargin: "200px", // Load more when 200px from bottom
        threshold: 0.1
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      console.log("Observer attached to element");
      observer.observe(currentRef);
    } else {
      console.log("⚠️ Load more ref not found");
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
        console.log("Observer cleaned up");
      }
    };
  }, [hasMore, isLoadingMore, apiLoading, page, performSearch]);

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

  // COMMENTED OUT - This is now handled by the auto-search effect above
  // // Trigger search when searchType changes
  // useEffect(() => {
  //   if (searchType !== "all") {
  //     setPage(1);
  //     setHasMore(false);
  //     performSearch(1, false);
  //   }
  // }, [searchType]);

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
    console.log("🔍 New search triggered - resetting to page 1");
    setPage(1);
    setHasMore(false);
    setResults({}); // Clear previous results
    performSearch(1, false);
  };
  
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    setIsLoadingMore(true);
    performSearch(nextPage, true);
  };
  
  const fetchSuggestedResults = async () => {
    try {
      // Fetch nearby results from different locations when no results in searched location
      const queryParams = new URLSearchParams({
        type: searchType,
        limit: 15, // Get more suggested results from nearby areas
        nearby: 'true', // Flag to get nearby results
      });
      
      // Include search query to get similar results from other locations
      if (searchQuery && searchQuery.trim()) {
        queryParams.set("q", searchQuery.trim());
      }
      
      // Add current location to find nearby alternatives
      const currentLocation = convertedLocation || userLocation;
      if (currentLocation) {
        if (currentLocation.lat) queryParams.set("lat", currentLocation.lat);
        if (currentLocation.lng) queryParams.set("lng", currentLocation.lng);
        // Expand search radius for suggestions (e.g., 100km instead of default)
        queryParams.set("radius", "100");
      } else {
        // If no coordinates, try to get results from major cities in the state
        const cityParam = (selectedLocation || locationInput || "").trim();
        if (cityParam) {
          // Extract state if present
          const parts = cityParam.split(',');
          if (parts.length > 1) {
            queryParams.set("state", parts[1].trim());
          }
        }
      }
      
      const response = await get(`/search?${queryParams.toString()}`);
      const suggested = response.data?.results || {};
      
      // Add distance info if coordinates available
      if (currentLocation?.lat && currentLocation?.lng) {
        Object.keys(suggested).forEach(key => {
          if (Array.isArray(suggested[key])) {
            suggested[key] = suggested[key].map(item => ({
              ...item,
              isAlternative: true,
              alternativeLocation: item.city || item.location || 'Nearby'
            }));
          }
        });
      }
      
      setSuggestedResults(suggested);
    } catch (error) {
      console.error("Error fetching suggested results:", error);
      setSuggestedResults({});
    }
  };

  // COMMENTED OUT - Filters disabled
  // const handleFilterChange = (newFilters) => {
  //   setFilters(newFilters);
  //   setPage(1); // Reset page when filters change
  //   setHasMore(false);
  // };

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
    <>
      <MetaTags
        title={pageMetadata.search.title}
        description={pageMetadata.search.description}
        keywords={pageMetadata.search.keywords}
      />
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
                  <button
                    type="button"
                    onClick={() => setIsLocationModalOpen(true)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    title="Select location"
                  >
                    <MapPin className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={locationInput}
                    onClick={() => setIsLocationModalOpen(true)}
                    placeholder="Select location"
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white cursor-pointer"
                    autoComplete="off"
                    readOnly
                  />
                  {locationInput && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLocationInput("");
                        setSelectedLocation("");
                        setLocationSuggestions([]);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 z-10"
                      aria-label="Clear location"
                      title="Clear location"
                    >
                      <X className="w-4 h-4" />
                    </button>
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
                {/* COMMENTED OUT - Advanced filters button disabled */}
                {/* <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filters</span>
                </button> */}

                {selectedLocation && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{selectedLocation}</span>
                  </div>
                )}

                {/* COMMENTED OUT - Filter department badge disabled */}
                {/* {filters.department && (
                  <div className="flex items-center text-sm text-primary-600 dark:text-primary-400">
                    <span className="bg-primary-100 dark:bg-primary-900 px-2 py-1 rounded-full text-xs font-medium">
                      Department: {decodeURIComponent(filters.department)}
                    </span>
                  </div>
                )} */}

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

          {/* COMMENTED OUT - Advanced filters panel disabled */}
          {/* {showFilters && (
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
          )} */}

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

          {/* Infinite Scroll Observer & Loading Indicator */}
          {getTotalResults() > 0 && (
            <div className="text-center py-8">
              {/* Loading indicator */}
              {isLoadingMore && hasMore && (
                <div className="flex flex-col items-center justify-center mb-4">
                  <div className="spinner w-8 h-8 mb-2"></div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Loading more results...
                  </p>
                </div>
              )}
              
              {/* Manual Load More Button (backup/fallback) */}
              {hasMore && !isLoadingMore && !apiLoading && (
                <button
                  onClick={handleLoadMore}
                  className="btn-primary px-6 py-2 text-sm"
                >
                  Load More Results
                </button>
              )}
              
              {/* Observer element for infinite scroll - Always present when hasMore is true */}
              {hasMore && (
                <div 
                  ref={loadMoreRef} 
                  className="h-4 w-full"
                  style={{ visibility: 'hidden' }}
                />
              )}
              
              {/* End of Results Message */}
              {!hasMore && getTotalResults() > RESULTS_PER_PAGE && (
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">
                  All results loaded ({getTotalResults()} total)
                </p>
              )}
            </div>
          )}

          {/* No Results Message with Suggestions */}
          {getTotalResults() === 0 && !apiLoading && (
            <div className="py-12">
              <div className="text-center text-gray-600 dark:text-gray-400 mb-8">
                <Search className="mx-auto w-16 h-16 mb-6" />
                <h3 className="text-lg font-medium">No exact matches found</h3>
                <p className="mt-2">
                  {Object.values(suggestedResults).some(arr => arr && arr.length > 0) 
                    ? "Here are some nearby options that might help:" 
                    : "Try adjusting your search terms or filters."}
                </p>
              </div>
              
              {/* Display Suggested Results */}
              {Object.values(suggestedResults).some(arr => arr && arr.length > 0) && (
                <div className="space-y-8">
                  <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 text-primary-800 dark:text-primary-200">
                      <MapPin className="w-5 h-5" />
                      <h4 className="text-xl font-semibold">
                        Suggested Results from Nearby Locations
                      </h4>
                    </div>
                    <p className="text-sm text-primary-700 dark:text-primary-300 mt-2">
                      No results found in your selected location. Here are similar options from nearby areas that might help.
                    </p>
                  </div>
                  
                  {/* Suggested Doctors */}
                  {suggestedResults.doctors && suggestedResults.doctors.length > 0 && (
                    <section>
                      <h5 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
                        Doctors ({suggestedResults.doctors.length})
                      </h5>
                      <div className={viewMode === "grid" 
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                        : "space-y-4"}>
                        {suggestedResults.doctors.map((doctor) => (
                          <DoctorCard key={doctor._id} doctor={doctor} />
                        ))}
                      </div>
                    </section>
                  )}
                  
                  {/* Suggested Clinics */}
                  {suggestedResults.clinics && suggestedResults.clinics.length > 0 && (
                    <section>
                      <h5 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
                        Clinics ({suggestedResults.clinics.length})
                      </h5>
                      <div className={viewMode === "grid" 
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                        : "space-y-4"}>
                        {suggestedResults.clinics.map((clinic) => (
                          <ClinicCard key={clinic._id} clinic={clinic} />
                        ))}
                      </div>
                    </section>
                  )}
                  
                  {/* Suggested Ambulances */}
                  {suggestedResults.ambulances && suggestedResults.ambulances.length > 0 && (
                    <section>
                      <h5 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
                        Ambulances ({suggestedResults.ambulances.length})
                      </h5>
                      <div className={viewMode === "grid" 
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                        : "space-y-4"}>
                        {suggestedResults.ambulances.map((ambulance) => (
                          <AmbulanceCard key={ambulance._id} ambulance={ambulance} />
                        ))}
                      </div>
                    </section>
                  )}
                  
                  {/* Suggested Pathologies */}
                  {suggestedResults.pathologies && suggestedResults.pathologies.length > 0 && (
                    <section>
                      <h5 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
                        Pathology Labs ({suggestedResults.pathologies.length})
                      </h5>
                      <div className={viewMode === "grid" 
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                        : "space-y-4"}>
                        {suggestedResults.pathologies.map((pathology) => (
                          <div key={pathology._id} className="card p-6 hover:shadow-lg transition-shadow">
                            <h6 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                              {pathology.name}
                            </h6>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                              {pathology.place}, {pathology.state}
                            </p>
                            <button
                              onClick={() => {
                                const pathologyName = encodeURIComponent(
                                  pathology.name.replace(/\s+/g, "-").toLowerCase()
                                );
                                const location = encodeURIComponent(
                                  pathology.place || pathology.state || "unknown"
                                );
                                router.push(
                                  `/pathology/${pathologyName}/${location}?id=${pathology._id}`
                                );
                              }}
                              className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              View Details
                            </button>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}
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

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onLocationSelect={(location) => {
          console.log("Location selected from modal:", location);
          const locationText = location.state
            ? `${location.city}, ${location.state}`
            : location.city;
          setLocationInput(locationText);
          setSelectedLocation(locationText);
          
          // Create normalized location object
          const normalizedLocation = {
            city: location.city,
            state: location.state,
            lat: location.lat || location.latitude,
            lng: location.lng || location.longitude,
            pincode: location.pincode,
            country: location.country,
            formatted_address: location.formattedAddress
          };
          
          // Store the full location data with coordinates
          setConvertedLocation(normalizedLocation);
          
          // Update global location context
          updateUserLocation(normalizedLocation);
          
          setIsLocationModalOpen(false);
          
          // Trigger search with new location
          setPage(1);
          setHasMore(false);
        }}
      />

      <Footer />
      </div>
    </>
  );
}
