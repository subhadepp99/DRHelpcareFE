"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApi } from "@/hooks/api";
import { ArrowLeft, Search, X, Share } from "lucide-react";
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
      <div className="min-h-[70vh] flex flex-col justify-between max-w-4xl mx-auto px-4 py-6">
        <div>
          <div className="flex items-center space-x-6 flex-wrap">
            <div className="relative flex flex-col items-center">
              {getImageSrc() ? (
                <img
                  src={getImageSrc()}
                  alt={
                    doctor.name ||
                    `${doctor.firstName || ""} ${doctor.lastName || ""}` ||
                    "Doctor"
                  }
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary-600"
                />
              ) : (
                <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-4xl">
                  {initials}
                </div>
              )}
              {/* Small Call/WhatsApp Buttons */}
              <div className="flex flex-col items-center gap-2 mt-2">
                {doctor.phone && (
                  <a
                    href={`tel:${doctor.phone}`}
                    className="inline-flex items-center px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition"
                  >
                    Call
                  </a>
                )}
                {doctor.phone && (
                  <a
                    href={`https://wa.me/${doctor.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {doctor.name ||
                  `${doctor.firstName || ""} ${doctor.lastName || ""}` ||
                  "Unknown Doctor"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {doctor.specialization || "Specialist"}
              </p>
              <p className="mb-2">{doctor.qualification || ""}</p>
              <p>Experience: {doctor.experience || 0} years</p>
              <p>Consultation Fee: ₹{doctor.consultationFee || 0}</p>
              <p>Email: {doctor.email || "N/A"}</p>
              <p>Phone: {doctor.phone || "N/A"}</p>
              {doctor.address && (
                <p>
                  Address:{" "}
                  {typeof doctor.address === "string"
                    ? doctor.address
                    : doctor.address.fullAddress ||
                      `${doctor.address.city || ""} ${
                        doctor.address.state || ""
                      }`}
                </p>
              )}
              {doctor.bio && <p className="mt-2 text-gray-700">{doctor.bio}</p>}
            </div>
          </div>

          {/* Booking Section */}
          <div className="mt-10 flex flex-col md:flex-row md:items-center md:space-x-8 space-y-4 md:space-y-0">
            <a
              href={`/booking/${doctor._id}`}
              className="flex-1 btn-primary text-sm px-5 py-2 rounded-lg font-semibold shadow hover:shadow-lg transition w-full md:w-auto text-center inline-flex items-center justify-center"
            >
              <span className="flex items-center justify-center">Book Now</span>
            </a>
            <button
              onClick={handleShare}
              className="flex-1 md:flex-none inline-flex items-center justify-center px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <Share className="w-4 h-4 mr-2" /> Share
            </button>
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
