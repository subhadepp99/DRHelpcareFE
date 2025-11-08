"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Star,
  Users,
  Building2,
  Calendar,
  ArrowLeft,
  ExternalLink,
  Search,
  X,
  Share2,
} from "lucide-react";
import toast from "react-hot-toast";
import ReactStars from "react-rating-stars-component";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import BookingModal from "@/components/modals/BookingModal";
import { useApi } from "@/hooks/useApi";
import FAQAccordion from "@/components/common/FAQAccordion";
import ReviewSection from "@/components/common/ReviewSection";

import Image from "next/image";
import { getImageUrl } from "@/utils/imageUtils";

export default function ClinicDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { get, loading: apiLoading } = useApi();
  const [clinic, setClinic] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [allClinics, setAllClinics] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    if (params.clinicName && params.location) {
      fetchClinicDetails();
    }
  }, [params.clinicName, params.location]);

  useEffect(() => {
    fetchAllClinicsAndLocations();
  }, []);

  const fetchClinicDetails = async () => {
    try {
      const clinicId = searchParams.get("id");

      if (clinicId) {
        // If ID is provided, fetch directly by ID
        console.log("Fetching clinic details by ID:", clinicId);
        const detailsResponse = await get(`/clinics/by-id/${clinicId}`);
        if (detailsResponse.data?.data.clinic) {
          setClinic(detailsResponse.data.data.clinic);
        } else {
          setError("Failed to load clinic details");
        }
      } else {
        // Fallback to search by name and location
        const clinicName = decodeURIComponent(params.clinicName);
        const location = decodeURIComponent(params.location);

        console.log("Fetching clinic details by search:", {
          clinicName,
          location,
        });

        const searchResponse = await get(
          `/clinics/search?name=${encodeURIComponent(
            clinicName
          )}&location=${encodeURIComponent(location)}`
        );

        console.log("Search response:", searchResponse);

        if (searchResponse.data?.clinics?.length > 0) {
          const foundClinicId = searchResponse.data.clinics[0]._id;
          console.log("Found clinic ID:", foundClinicId);

          // Now get full clinic details by ID
          const detailsResponse = await get(`/clinics/by-id/${foundClinicId}`);

          if (detailsResponse.data?.clinic) {
            setClinic(detailsResponse.data.clinic);
          } else {
            setError("Failed to load clinic details");
          }
        } else {
          setError("Clinic not found");
        }
      }
    } catch (error) {
      console.error("Error fetching clinic details:", error);
      setError("Failed to load clinic details");
    }
  };

  const fetchAllClinicsAndLocations = async () => {
    try {
      const clinicsResponse = await get("/clinics?limit=1000");
      if (clinicsResponse.data?.data?.clinics) {
        const clinics = clinicsResponse.data.data.clinics;
        setAllClinics(clinics);

        // Extract unique locations
        const locations = new Set();
        clinics.forEach((clinic) => {
          if (clinic.address?.city) locations.add(clinic.address.city);
          if (clinic.address?.state) locations.add(clinic.address.state);
          if (clinic.place) locations.add(clinic.place);
        });
        setAllLocations(Array.from(locations));
      }
    } catch (error) {
      console.error("Error fetching clinics and locations:", error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(true);
      return;
    }

    const results = allClinics.filter(
      (clinic) =>
        clinic.name.toLowerCase().includes(query.toLowerCase()) ||
        clinic.address?.city?.toLowerCase().includes(query.toLowerCase()) ||
        clinic.address?.state?.toLowerCase().includes(query.toLowerCase()) ||
        clinic.place?.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(results);
    setShowSearchResults(true);
  };

  const handleClinicSelect = (selectedClinic) => {
    const clinicName = encodeURIComponent(
      selectedClinic.name.replace(/\s+/g, "-").toLowerCase()
    );
    const location = encodeURIComponent(
      selectedClinic.place ||
        selectedClinic.address?.city ||
        selectedClinic.address?.state ||
        "unknown"
    );

    // Always navigate to the selected clinic
    router.push(`/clinic/${clinicName}/${location}?id=${selectedClinic._id}`);
    setShowSearchResults(false);
  };

  const handleLocationSelect = (location) => {
    const results = allClinics.filter(
      (clinic) =>
        clinic.address?.city?.toLowerCase().includes(location.toLowerCase()) ||
        clinic.address?.state?.toLowerCase().includes(location.toLowerCase()) ||
        clinic.place?.toLowerCase().includes(location.toLowerCase())
    );

    if (results.length === 1) {
      // Single result - navigate directly to clinic details
      const clinic = results[0];
      const clinicName = encodeURIComponent(
        clinic.name.replace(/\s+/g, "-").toLowerCase()
      );
      const locationName = encodeURIComponent(
        clinic.place ||
          clinic.address?.city ||
          clinic.address?.state ||
          "unknown"
      );
      router.push(`/clinic/${clinicName}/${locationName}?id=${clinic._id}`);
    } else {
      // Multiple results - navigate to search page
      router.push(`/search?q=${encodeURIComponent(location)}&type=clinics`);
    }
    setShowSearchResults(false);
  };

  const formatAddress = (clinic) => {
    if (!clinic) return "Address not available";

    const parts = [];
    if (clinic.address) parts.push(clinic.address);
    if (clinic.place) parts.push(clinic.place);
    if (clinic.state) parts.push(clinic.state);
    if (clinic.zipCode) parts.push(clinic.zipCode);

    return parts.length > 0 ? parts.join(", ") : "Address not available";
  };

  const getOperatingHours = (day) => {
    if (!clinic?.operatingHours?.[day]) return "Closed";

    const hours = clinic.operatingHours[day];
    if (hours.isClosed) return "Closed";

    return `${hours.open} - ${hours.close}`;
  };

  const getCurrentStatus = () => {
    if (!clinic?.operatingHours)
      return { status: "Not Available", color: "gray" };

    const today = new Date()
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    const todaysHours = clinic.operatingHours[today];

    if (!todaysHours || todaysHours.isClosed) {
      return { status: "Closed", color: "red" };
    }

    // Check if open and close times exist and are valid
    if (!todaysHours.open || !todaysHours.close) {
      return { status: "Not Available", color: "gray" };
    }

    // Simple time check (you can make this more sophisticated)
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();

    try {
      // Parse opening and closing times (assuming format like "09:00", "17:00")
      const openTime = parseInt(todaysHours.open.replace(":", ""));
      const closeTime = parseInt(todaysHours.close.replace(":", ""));

      if (isNaN(openTime) || isNaN(closeTime)) {
        return { status: "Not Available", color: "gray" };
      }

      if (currentTime >= openTime && currentTime <= closeTime) {
        return { status: "Open", color: "green" };
      } else {
        return { status: "Closed", color: "red" };
      }
    } catch (error) {
      console.error("Error parsing operating hours:", error);
      return { status: "Not Available", color: "gray" };
    }
  };

  const handleShare = async () => {
    try {
      const url = typeof window !== "undefined" ? window.location.href : "";
      const title = clinic?.name || "Clinic";
      if (navigator.share) {
        await navigator.share({
          title,
          text: `Check out ${title} on Dr Help`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
      }
    } catch (e) {
      // ignore
    }
  };

  const status = getCurrentStatus();

  if (apiLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Building2 className="mx-auto w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {error}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The clinic you're looking for could not be found.
            </p>
            <button onClick={() => router.back()} className="btn-primary">
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!clinic) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="pt-20">
        {/* Breadcrumb */}
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <button
                  onClick={() => router.back()}
                  className="flex items-center hover:text-primary-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </button>
              </li>
              <li>
                <span className="mx-2">/</span>
              </li>
              <li>
                <span className="text-primary-600 font-medium">
                  {clinic.name}
                </span>
              </li>
            </ol>
          </div>
        </nav>

        {/* Custom Clinic Search */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setShowSearchResults(true)}
                placeholder="Search for clinics or locations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
              {showSearchResults &&
                (searchResults.length > 0 || allLocations.length > 0) && (
                  <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50 mt-1 max-h-96 overflow-y-auto">
                    {searchQuery && searchResults.length > 0 && (
                      <>
                        <div className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
                          Clinics
                        </div>
                        {searchResults.map((clinic) => (
                          <div
                            key={clinic._id}
                            className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600"
                            onClick={() => handleClinicSelect(clinic)}
                          >
                            <div className="font-medium text-gray-900 dark:text-white">
                              {clinic.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {clinic.address?.city || clinic.place},{" "}
                              {clinic.address?.state}
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                    {!searchQuery && (
                      <>
                        <div className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
                          Popular Locations
                        </div>
                        {allLocations.slice(0, 10).map((location) => (
                          <div
                            key={location}
                            className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600"
                            onClick={() => handleLocationSelect(location)}
                          >
                            <div className="font-medium text-gray-900 dark:text-white">
                              {location}
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
              {showSearchResults && (
                <button
                  onClick={() => setShowSearchResults(false)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            {/* Hero Section */}
            <div className="relative h-64 md:h-80 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-900">
              {getImageUrl(clinic.imageUrl) ? (
                <Image
                  src={getImageUrl(clinic.imageUrl)}
                  alt={clinic.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : null}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  display: getImageUrl(clinic.imageUrl) ? "none" : "flex",
                }}
              >
                <Building2 className="w-24 h-24 text-green-600 dark:text-green-400" />
              </div>

              {/* Status Badge */}
              <div className="absolute top-6 left-6">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    status.color === "green"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : status.color === "red"
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full mr-2 ${
                      status.color === "green" ? "bg-green-400" : "bg-red-400"
                    } ${status.color === "green" ? "animate-pulse" : ""}`}
                  ></span>
                  {status.status}
                </span>
              </div>

              {/* Registration Number */}
              {clinic.registrationNumber && (
                <div className="absolute top-6 right-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Reg: {clinic.registrationNumber}
                  </span>
                </div>
              )}
            </div>

            <div className="p-6 md:p-8">
              {/* Header Info */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {clinic.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <ReactStars
                    count={5}
                    value={clinic.rating?.average || 0}
                    size={20}
                    edit={false}
                    activeColor="#f59e0b"
                    color="#d1d5db"
                  />
                  <span className="ml-3 text-lg text-gray-600 dark:text-gray-400">
                    {clinic.rating?.average || 0} ({clinic.rating?.count || 0}{" "}
                    reviews)
                  </span>
                </div>
                
                {/* Description */}
                {clinic.description && (
                  <div className="mb-4">
                    <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                      {clinic.description}
                    </p>
                  </div>
                )}

                {/* Type Badge */}
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 mb-4">
                  <Building2 className="w-4 h-4 mr-2" />
                  {clinic.type?.replace("_", " ").toUpperCase() || "CLINIC"}
                </div>
              </div>

              {/* Contact & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Contact Information
                  </h3>

                  <div className="space-y-3">
                    {clinic.phone && (
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Phone className="w-5 h-5 mr-3 text-primary-600" />
                        <a
                          href={`tel:${clinic.phone}`}
                          className="hover:text-primary-600 transition-colors"
                        >
                          {clinic.phone}
                        </a>
                      </div>
                    )}

                    {clinic.email && (
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Mail className="w-5 h-5 mr-3 text-primary-600" />
                        <a
                          href={`mailto:${clinic.email}`}
                          className="hover:text-primary-600 transition-colors"
                        >
                          {clinic.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Location
                  </h3>

                  <div className="flex items-start text-gray-600 dark:text-gray-400">
                    <MapPin className="w-5 h-5 mr-3 text-primary-600 mt-0.5" />
                    <div>
                      <p className="font-medium">{formatAddress(clinic)}</p>
                      {clinic.coordinates && (
                        <button className="text-sm text-primary-600 hover:text-primary-700 mt-1 flex items-center">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View on Map
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Services & Facilities */}
              {(() => {
                // Helper to normalize list values into clean string tags
                const normalizeList = (value) => {
                  let items = value;
                  // Try to parse JSON if it's a string
                  if (typeof items === "string") {
                    const trimmed = items.trim();
                    try {
                      items = JSON.parse(trimmed);
                    } catch {
                      // Fallback: split by comma
                      items = trimmed.split(",");
                    }
                  }
                  // Ensure array
                  if (!Array.isArray(items)) items = [items].filter(Boolean);
                  // Flatten nested arrays
                  items = items.flat ? items.flat() : items;
                  // Map to strings and strip quotes/brackets/extra chars
                  return items
                    .map((it) =>
                      String(it)
                        .replace(/[\\\[\]\"']/g, "")
                        .trim()
                    )
                    .filter((s) => s.length > 0);
                };

                const services = normalizeList(clinic.services || []);
                const facilities = normalizeList(clinic.facilities || []);

                return services.length > 0 || facilities.length > 0 ? (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Services & Facilities
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {services.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Services
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {services.map((service, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full"
                              >
                                {service}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {facilities.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Facilities
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {facilities.map((facility, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                              >
                                {facility}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Operating Hours */}
              {/* Operating Hours - Commented Out */}
              {/* <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Operating Hours
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    "monday",
                    "tuesday",
                    "wednesday",
                    "thursday",
                    "friday",
                    "saturday",
                    "sunday",
                  ].map((day) => (
                    <div
                      key={day}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">
                        {day}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {getOperatingHours(day)}
                      </span>
                    </div>
                  ))}
                </div>
              </div> */}

              {/* Doctors */}
              {clinic.doctors?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Available Doctors (
                    {clinic.doctors.filter((d) => d.isActive).length})
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {clinic.doctors
                      .filter((d) => d.isActive)
                      .map((doctorInfo, index) => {
                        // Debug logging to see the actual data structure
                        console.log("Doctor Info:", doctorInfo);

                        // Handle different possible data structures
                        const doctor = doctorInfo.doctor || doctorInfo;
                        const imageUrl =
                          doctor.imageUrl ||
                          doctor.profileImage ||
                          doctor.image;
                        const firstName = doctor.firstName || doctor.first_name;
                        const lastName = doctor.lastName || doctor.last_name;
                        const name = doctor.name;
                        const department =
                          doctor.department?.name || doctor.department;
                        const specialization = doctor.specialization;
                        const qualification = doctor.qualification;

                        return (
                          <div
                            key={index}
                            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <div className="flex items-center space-x-3 mb-3">
                              {getImageUrl(imageUrl) ? (
                                <img
                                  src={getImageUrl(imageUrl)}
                                  alt={
                                    firstName && lastName
                                      ? `Dr. ${firstName} ${lastName}`
                                      : name
                                      ? `Dr. ${name}`
                                      : "Doctor"
                                  }
                                  className="w-12 h-12 rounded-full object-cover border-2 border-primary-200"
                                />
                              ) : null}
                              <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                  getImageUrl(imageUrl) ? "hidden" : "flex"
                                }`}
                                style={{
                                  display: getImageUrl(imageUrl)
                                    ? "none"
                                    : "flex",
                                }}
                              >
                                <Users className="w-6 h-6 text-primary-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {firstName && lastName
                                    ? `Dr. ${firstName} ${lastName}`
                                    : name
                                    ? `Dr. ${name}`
                                    : "Dr. Name Not Available"}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {department ||
                                    specialization ||
                                    qualification ||
                                    "General Medicine"}
                                </p>
                              </div>
                            </div>

                            {doctorInfo.consultationFee && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Consultation Fee: ₹{doctorInfo.consultationFee}
                              </p>
                            )}

                            {doctorInfo.availableDays?.length > 0 && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Available: {doctorInfo.availableDays.join(", ")}
                              </p>
                            )}

                            <div className="mt-3">
                              <button
                                onClick={() => {
                                  setSelectedDoctor(doctor);
                                  setBookingOpen(true);
                                }}
                                className="btn-primary w-full"
                              >
                                Book with this Doctor
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setBookingOpen(true)}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Calendar className="w-5 h-5 mr-2 inline" />
                  Book Appointment
                </button>
                {clinic.phone && (
                  <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    <Phone className="w-5 h-5 mr-2 inline" />
                    Call Now
                  </button>
                )}
                <button
                  onClick={handleShare}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <Share2 className="w-5 h-5 mr-2" /> Share
                </button>
              </div>
            </div>
          </motion.div>
        </div>
        {/* Reviews */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <ReviewSection
            entityType="Clinic"
            entityId={clinic?._id}
            entityName={clinic?.name || "this clinic"}
          />
        </div>
        {/* FAQs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <FAQAccordion entityType="clinic" entityId={clinic?._id} />
        </div>
      </main>

      <Footer />
      {bookingOpen && (
        <BookingModal
          doctor={selectedDoctor || clinic.doctors?.[0]?.doctor || null}
          clinic={clinic}
          allowDoctorSelect={true}
          isOpen={bookingOpen}
          onClose={() => {
            setBookingOpen(false);
            setSelectedDoctor(null);
          }}
        />
      )}
    </div>
  );
}
