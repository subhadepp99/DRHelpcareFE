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
  TestTube,
  Calendar,
  ArrowLeft,
  ExternalLink,
  Package,
  Home,
  FileText,
} from "lucide-react";
import ReactStars from "react-rating-stars-component";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useApi } from "@/hooks/useApi";
import { getImageUrl } from "@/utils/imageUtils";
import Image from "next/image";
import FAQAccordion from "@/components/common/FAQAccordion";

export default function PathologyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { get, loading: apiLoading } = useApi();
  const [pathology, setPathology] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params.pathologyName && params.location) {
      fetchPathologyDetails();
    }
  }, [params.pathologyName, params.location]);

  const fetchPathologyDetails = async () => {
    try {
      const pathologyId = searchParams.get("id");

      if (pathologyId) {
        // If ID is provided, fetch directly by ID
        console.log("Fetching pathology details by ID:", pathologyId);
        const detailsResponse = await get(`/pathology/by-id/${pathologyId}`);
        if (detailsResponse.data?.data[0].pathology) {
          setPathology(detailsResponse.data.data[0].pathology);
        } else {
          setError("Failed to load pathology details");
        }
      } else {
        // Fallback to search by name and location
        const pathologyName = decodeURIComponent(params.pathologyName);
        const location = decodeURIComponent(params.location);

        console.log("Fetching pathology details by search:", {
          pathologyName,
          location,
        });

        const searchResponse = await get(
          `/pathology/search?name=${encodeURIComponent(
            pathologyName
          )}&location=${encodeURIComponent(location)}`
        );

        console.log("Search response:", searchResponse);
        if (searchResponse.data?.data?.pathologies?.length > 0) {
          const foundPathologyId = searchResponse.data.data.pathologies[0]._id;
          console.log("Found pathology ID:", foundPathologyId);

          // Now get full pathology details by ID
          const detailsResponse = await get(
            `/pathology/by-id/${foundPathologyId}`
          );

          if (detailsResponse.data?.data.pathology) {
            setPathology(detailsResponse.data.data.pathology);
          } else {
            setError("Failed to load pathology details");
          }
        } else {
          setError("Pathology not found");
        }
      }
    } catch (error) {
      console.error("Error fetching pathology details:", error);
      setError("Failed to load pathology details");
    }
  };

  const formatAddress = (pathology) => {
    if (!pathology?.address) return "Address not available";

    const parts = [];
    if (pathology.address.street) parts.push(pathology.address.street);
    if (pathology.address.city) parts.push(pathology.address.city);
    if (pathology.address.state) parts.push(pathology.address.state);
    if (pathology.address.pincode) parts.push(pathology.address.pincode);

    return parts.length > 0 ? parts.join(", ") : "Address not available";
  };

  const getOperatingHours = (day) => {
    if (!pathology?.operatingHours?.[day]) return "Closed";

    const hours = pathology.operatingHours[day];
    if (!hours.open || !hours.close) return "Closed";

    return `${hours.open} - ${hours.close}`;
  };

  const getCurrentStatus = () => {
    if (!pathology?.operatingHours) return { status: "Unknown", color: "gray" };

    const today = new Date()
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    const todaysHours = pathology.operatingHours[today];

    if (!todaysHours || !todaysHours.open || !todaysHours.close) {
      return { status: "Closed", color: "red" };
    }

    // Simple time check
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();

    // Parse opening and closing times (assuming format like "09:00", "17:00")
    const openTime = parseInt(todaysHours.open.replace(":", ""));
    const closeTime = parseInt(todaysHours.close.replace(":", ""));

    if (currentTime >= openTime && currentTime <= closeTime) {
      return { status: "Open", color: "green" };
    } else {
      return { status: "Closed", color: "red" };
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
            <TestTube className="mx-auto w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {error}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The pathology you're looking for could not be found.
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

  if (!pathology) {
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
                  {pathology.name}
                </span>
              </li>
            </ol>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            {/* Hero Section */}
            <div className="relative h-64 md:h-80 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-800 dark:to-red-900">
              {getImageUrl(pathology.imageUrl) ? (
                <Image
                  src={getImageUrl(pathology.imageUrl)}
                  alt={pathology.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : null}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  display: getImageUrl(pathology.imageUrl) ? "none" : "flex",
                }}
              >
                <TestTube className="w-24 h-24 text-red-600 dark:text-red-400" />
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

              {/* Package Badge */}
              {pathology.isPackage && (
                <div className="absolute top-6 right-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    <Package className="w-4 h-4 mr-1" />
                    Package
                  </span>
                </div>
              )}

              {/* Home Collection Badge */}
              {pathology.homeCollection && (
                <div className="absolute top-16 right-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    <Home className="w-4 h-4 mr-1" />
                    Home Collection
                  </span>
                </div>
              )}
            </div>

            <div className="p-6 md:p-8">
              {/* Header Info */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {pathology.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <ReactStars
                    count={5}
                    value={pathology.rating?.average || 0}
                    size={20}
                    edit={false}
                    activeColor="#f59e0b"
                    color="#d1d5db"
                  />
                  <span className="ml-3 text-lg text-gray-600 dark:text-gray-400">
                    {pathology.rating?.average || 0} (
                    {pathology.rating?.count || 0} reviews)
                  </span>
                </div>

                {/* Category Badge */}
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 mb-4">
                  <TestTube className="w-4 h-4 mr-2" />
                  {pathology.category}
                </div>
              </div>

              {/* Description */}
              {pathology.description && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Description
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {pathology.description}
                  </p>
                </div>
              )}

              {/* Pricing */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Pricing
                </h3>

                <div className="flex items-center space-x-4">
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    ₹{pathology.discountedPrice || pathology.price}
                  </div>

                  {pathology.discountedPrice &&
                    pathology.discountedPrice < pathology.price && (
                      <>
                        <div className="text-xl text-gray-500 line-through">
                          ₹{pathology.price}
                        </div>
                        <div className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full text-sm font-medium">
                          {Math.round(
                            ((pathology.price - pathology.discountedPrice) /
                              pathology.price) *
                              100
                          )}
                          % OFF
                        </div>
                      </>
                    )}
                </div>
              </div>

              {/* Contact & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Contact Information
                  </h3>

                  <div className="space-y-3">
                    {pathology.contact?.phone && (
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Phone className="w-5 h-5 mr-3 text-primary-600" />
                        <a
                          href={`tel:${pathology.contact.phone}`}
                          className="hover:text-primary-600 transition-colors"
                        >
                          {pathology.contact.phone}
                        </a>
                      </div>
                    )}

                    {pathology.contact?.email && (
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Mail className="w-5 h-5 mr-3 text-primary-600" />
                        <a
                          href={`mailto:${pathology.contact.email}`}
                          className="hover:text-primary-600 transition-colors"
                        >
                          {pathology.contact.email}
                        </a>
                      </div>
                    )}

                    {pathology.contact?.website && (
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <ExternalLink className="w-5 h-5 mr-3 text-primary-600" />
                        <a
                          href={pathology.contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary-600 transition-colors"
                        >
                          Visit Website
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
                      <p className="font-medium">{formatAddress(pathology)}</p>
                      {pathology.address?.location?.coordinates && (
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
              {(pathology.services?.length > 0 ||
                pathology.facilities?.length > 0) && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Services & Facilities
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pathology.services?.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Services
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {pathology.services.map((service, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm rounded-full"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {pathology.facilities?.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Facilities
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {pathology.facilities.map((facility, index) => (
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
              )}

              {/* Additional Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Additional Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pathology.preparationInstructions && (
                    <div>
                      <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Preparation Instructions
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {pathology.preparationInstructions}
                      </p>
                    </div>
                  )}

                  {pathology.reportTime && (
                    <div>
                      <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Report Time
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {pathology.reportTime}
                      </p>
                    </div>
                  )}

                  {pathology.licenseNumber && (
                    <div>
                      <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                        License Number
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {pathology.licenseNumber}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() =>
                    window.open(
                      `tel:${pathology.contact?.phone || "+919674243119"}`,
                      "_blank"
                    )
                  }
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg font-medium transition-colors text-sm"
                >
                  <Calendar className="w-4 h-4 mr-2 inline" />
                  Book Test
                </button>
                {pathology.contact?.phone && (
                  <button
                    onClick={() =>
                      window.open(`tel:${pathology.contact.phone}`, "_blank")
                    }
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg font-medium transition-colors text-sm"
                  >
                    <Phone className="w-4 h-4 mr-2 inline" />
                    Call Now
                  </button>
                )}
                {pathology.homeCollection && (
                  <button
                    onClick={() =>
                      window.open(
                        `tel:${pathology.contact?.phone || "+919674243119"}`,
                        "_blank"
                      )
                    }
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-colors text-sm"
                  >
                    <Home className="w-4 h-4 mr-2 inline" />
                    Request Home Collection
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
        {/* FAQs */}
        <FAQAccordion
          entityType="pathology"
          entityId={pathology?._id}
          className="mt-6"
        />
      </main>

      <Footer />
    </div>
  );
}
