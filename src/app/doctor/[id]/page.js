"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApi } from "@/hooks/api";
import { ArrowLeft, Search, X, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";
import Head from "next/head";
import FAQAccordion from "@/components/common/FAQAccordion";

export default function DoctorProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { get } = useApi();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [allDoctors, setAllDoctors] = useState([]);
  const [allLocations, setAllLocations] = useState([]);

  useEffect(() => {
    if (!id) return;
    async function fetchDoctor() {
      setLoading(true);
      try {
        const res = await get(`/doctors/${id}`);
        const payload = res?.data;
        const normalized = payload?.data || payload?.doctor || payload || null;
        setDoctor(normalized);
      } catch (err) {
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    fetchAllDoctorsAndLocations();
  }, []);

  const fetchAllDoctorsAndLocations = async () => {
    try {
      const doctorsResponse = await get("/doctors?limit=1000");
      if (doctorsResponse.data?.data?.doctors) {
        const doctors = doctorsResponse.data.data.doctors;
        setAllDoctors(doctors);

        // Extract unique locations
        const locations = new Set();
        doctors.forEach((doctor) => {
          if (doctor.city) locations.add(doctor.city);
          if (doctor.state) locations.add(doctor.state);
          if (doctor.location) locations.add(doctor.location);
        });
        setAllLocations(Array.from(locations));
      }
    } catch (error) {
      console.error("Error fetching doctors and locations:", error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(true);
      return;
    }

    const results = allDoctors.filter(
      (doctor) =>
        doctor.name?.toLowerCase().includes(query.toLowerCase()) ||
        doctor.firstName?.toLowerCase().includes(query.toLowerCase()) ||
        doctor.lastName?.toLowerCase().includes(query.toLowerCase()) ||
        doctor.specialization?.toLowerCase().includes(query.toLowerCase()) ||
        doctor.city?.toLowerCase().includes(query.toLowerCase()) ||
        doctor.state?.toLowerCase().includes(query.toLowerCase()) ||
        doctor.location?.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(results);
    setShowSearchResults(true);
  };

  const handleDoctorSelect = (selectedDoctor) => {
    router.push(`/doctor/${selectedDoctor._id}`);
    setShowSearchResults(false);
  };

  const handleLocationSelect = (location) => {
    const results = allDoctors.filter(
      (doctor) =>
        doctor.city?.toLowerCase().includes(location.toLowerCase()) ||
        doctor.state?.toLowerCase().includes(location.toLowerCase()) ||
        doctor.location?.toLowerCase().includes(location.toLowerCase())
    );

    if (results.length === 1) {
      // Single result - navigate directly to doctor details
      router.push(`/doctor/${results[0]._id}`);
    } else {
      // Multiple results - navigate to search page with proper query
      router.push(
        `/search?q=${encodeURIComponent(
          location
        )}&type=doctors&location=${encodeURIComponent(location)}`
      );
    }
    setShowSearchResults(false);
  };

  const handleShare = async () => {
    try {
      const url = typeof window !== "undefined" ? window.location.href : "";
      const name =
        doctor?.name || `${doctor?.firstName || ""} ${doctor?.lastName || ""}`;
      if (navigator.share) {
        await navigator.share({
          title: `Dr. ${name}`,
          text: `Check out Dr. ${name} on Dr Help`,
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

  if (loading)
    return (
      <>
        <Header />
        {/* Breadcrumb Navigation */}
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 pt-16">
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
                <a
                  href="/search?type=doctors"
                  className="hover:text-primary-600 transition-colors"
                >
                  Doctors
                </a>
              </li>
              <li>
                <span className="mx-2">/</span>
              </li>
              <li>
                <span className="text-primary-600 font-medium">Loading...</span>
              </li>
            </ol>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <p>Loading...</p>
        </div>
        <Footer />
      </>
    );
  if (!doctor)
    return (
      <>
        <Header />
        {/* Breadcrumb Navigation */}
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 pt-16">
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
                <a
                  href="/search?type=doctors"
                  className="hover:text-primary-600 transition-colors"
                >
                  Doctors
                </a>
              </li>
              <li>
                <span className="mx-2">/</span>
              </li>
              <li>
                <span className="text-primary-600 font-medium">
                  Doctor Not Found
                </span>
              </li>
            </ol>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <p>Doctor not found.</p>
        </div>
        <Footer />
      </>
    );

  // Safely get initials
  const initials =
    [doctor.firstName?.charAt(0) ?? "", doctor.lastName?.charAt(0) ?? ""]
      .join("")
      .toUpperCase() || "D";

  // Helper to get image src safely
  const getImageSrc = () => {
    // First check imageUrl (preferred)
    if (doctor.imageUrl) {
      if (
        typeof doctor.imageUrl === "string" &&
        doctor.imageUrl.startsWith("http")
      )
        return doctor.imageUrl;
      if (
        typeof doctor.imageUrl === "string" &&
        doctor.imageUrl.startsWith("data:image/")
      )
        return doctor.imageUrl;
      if (
        typeof doctor.imageUrl === "string" &&
        doctor.imageUrl.startsWith("/uploads/")
      )
        return `${process.env.NEXT_PUBLIC_API_URL}${doctor.imageUrl}`;
    }

    // Fallback to image field
    if (doctor.image) {
      if (typeof doctor.image === "string" && doctor.image.startsWith("http"))
        return doctor.image;
      if (
        typeof doctor.image === "string" &&
        doctor.image.startsWith("data:image/")
      )
        return doctor.image;
      if (
        typeof doctor.image === "string" &&
        doctor.image.startsWith("/uploads/")
      )
        return `${process.env.NEXT_PUBLIC_API_URL}${doctor.image}`;
    }

    return undefined;
  };

  return (
    <>
      <Head>
        <title>{`Dr. ${
          doctor.name || `${doctor.firstName || ""} ${doctor.lastName || ""}`
        }`}</title>
        <meta
          name="description"
          content={`Book an appointment with Dr. ${
            doctor.name || doctor.firstName || ""
          }. Department: ${doctor.department || "Doctor"}.`}
        />
      </Head>
      <Header />
      {/* Breadcrumb Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 pt-16">
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
              <a
                href="/search?type=doctors"
                className="hover:text-primary-600 transition-colors"
              >
                Doctors
              </a>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li>
              <span className="text-primary-600 font-medium truncate max-w-xs">
                {doctor.name ||
                  `${doctor.firstName || ""} ${doctor.lastName || ""}` ||
                  "Unknown Doctor"}
              </span>
            </li>
          </ol>
        </div>
      </nav>
      {/* Custom Doctor Search */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setShowSearchResults(true)}
              placeholder="Search for doctors or locations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            />
            {showSearchResults &&
              (searchResults.length > 0 || allLocations.length > 0) && (
                <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50 mt-1 max-h-96 overflow-y-auto">
                  {searchQuery && searchResults.length > 0 && (
                    <>
                      <div className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
                        Doctors
                      </div>
                      {searchResults.map((doctor) => (
                        <div
                          key={doctor._id}
                          className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600"
                          onClick={() => handleDoctorSelect(doctor)}
                        >
                          <div className="font-medium text-gray-900 dark:text-white">
                            {doctor.name ||
                              `Dr. ${doctor.firstName || ""} ${
                                doctor.lastName || ""
                              }`}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {doctor.specialization || "General Medicine"} •{" "}
                            {doctor.city ||
                              doctor.location ||
                              doctor.state ||
                              "Location not specified"}
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
      {/* Modern Doctor Profile Layout */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Hero Section with Gradient Background */}
          <div className="relative bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 h-48 md:h-56">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="relative z-10 h-full flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  Dr.{" "}
                  {doctor.name ||
                    `${doctor.firstName || ""} ${doctor.lastName || ""}` ||
                    "Unknown Doctor"}
                </h1>
                <p className="text-xl opacity-90">
                  {doctor.specialization || "Medical Specialist"}
                </p>
                {/* Department Name */}
                <p className="text-lg opacity-80 mt-1">
                  Department:{" "}
                  {typeof doctor.department === "object"
                    ? doctor.department?.name || "General Medicine"
                    : doctor.department || "General Medicine"}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="relative -mt-16 z-20 px-6 md:px-8 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Photo and Quick Actions */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg p-6 text-center">
                  {/* Doctor Photo */}
                  <div className="relative mb-6">
                    {getImageSrc() ? (
                      <img
                        src={getImageSrc()}
                        alt={
                          doctor.name ||
                          `${doctor.firstName || ""} ${
                            doctor.lastName || ""
                          }` ||
                          "Doctor"
                        }
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-4xl mx-auto shadow-lg">
                        {initials}
                      </div>
                    )}
                    {/* Online Status Indicator */}
                    <div className="absolute bottom-2 right-1/2 transform translate-x-16 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-md"></div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="space-y-3">
                    {doctor.phone && (
                      <a
                        href={`tel:${doctor.phone}`}
                        className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                      >
                        📞 Call Now
                      </a>
                    )}
                    {doctor.phone && (
                      <a
                        href={`https://wa.me/${doctor.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                      >
                        💬 WhatsApp
                      </a>
                    )}
                    <button
                      onClick={handleShare}
                      className="w-full inline-flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                      <Share2 className="w-5 h-5 mr-2" /> Share Profile
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information Card */}
                <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    👨‍⚕️ About Doctor
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <span className="text-gray-600 dark:text-gray-300 font-medium w-24">
                          Qualification:
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {doctor.qualification || "Not specified"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-600 dark:text-gray-300 font-medium w-24">
                          Experience:
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {doctor.experience || 0} years
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-600 dark:text-gray-300 font-medium w-24">
                          Consultation:
                        </span>
                        <span className="text-primary-600 font-bold">
                          ₹{doctor.consultationFee || doctor.doctorFees || 0}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start">
                        <span className="text-gray-600 dark:text-gray-300 font-medium w-24 mt-1">
                          Location:
                        </span>
                        <div className="text-gray-900 dark:text-white">
                          {/* Display full address from database */}
                          {(() => {
                            const addressParts = [];
                            // Add street address if available
                            if (doctor.address?.street) {
                              addressParts.push(doctor.address.street);
                            }
                            // Add city
                            const city = doctor.city || doctor.address?.city;
                            if (city) {
                              addressParts.push(city);
                            }
                            // Add state
                            const state = doctor.state || doctor.address?.state;
                            if (state) {
                              addressParts.push(state);
                            }
                            // Add zip code if available
                            if (doctor.address?.zipCode) {
                              addressParts.push(doctor.address.zipCode);
                            }
                            // Add country if different from default
                            if (
                              doctor.address?.country &&
                              doctor.address.country !== "India"
                            ) {
                              addressParts.push(doctor.address.country);
                            }

                            return addressParts.length > 0
                              ? addressParts.join(", ")
                              : "Not specified";
                          })()}
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className="text-gray-600 dark:text-gray-300 font-medium w-24 mt-1">
                          Specialty:
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {doctor.specialization || "General Medicine"}
                        </span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-gray-600 dark:text-gray-300 font-medium w-24 mt-1">
                          Department:
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {typeof doctor.department === "object"
                            ? doctor.department?.name || "General Medicine"
                            : doctor.department || "General Medicine"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bio Section */}
                  {doctor.bio && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Biography
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {doctor.bio}
                      </p>
                    </div>
                  )}
                </div>

                {/* Clinic Information Card */}
                {doctor.clinicDetails && doctor.clinicDetails.length > 0 && (
                  <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      🏥 Associated Clinics
                    </h2>

                    <div className="space-y-4">
                      {doctor.clinicDetails.map((clinicDetail, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {clinicDetail.clinicName ||
                                  clinicDetail.clinic?.name ||
                                  "Clinic"}
                                {clinicDetail.isPrimary && (
                                  <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 rounded-full text-xs font-medium">
                                    Primary
                                  </span>
                                )}
                              </h3>
                              {clinicDetail.clinicAddress && (
                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                  {clinicDetail.clinicAddress}
                                </p>
                              )}
                              {clinicDetail.consultationFee && (
                                <p className="text-primary-600 font-medium text-sm mt-1">
                                  Consultation: ₹{clinicDetail.consultationFee}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Book Appointment CTA */}
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl shadow-lg p-6 text-center text-white">
                  <h3 className="text-2xl font-bold mb-4">
                    Ready to Book an Appointment?
                  </h3>
                  <p className="text-primary-100 mb-6">
                    Get expert medical care from Dr.{" "}
                    {doctor.name || doctor.firstName || "this specialist"}
                  </p>
                  <a
                    href={`/booking/${doctor._id}`}
                    className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
                    📅 Book Appointment Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* FAQs */}
      <div className="max-w-4xl mx-auto px-4">
        <FAQAccordion entityType="doctor" entityId={doctor?._id} />
      </div>
      <Footer />
    </>
  );
}
