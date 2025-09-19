"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Phone, ArrowLeft, MapPin, Share2 } from "lucide-react";
import Image from "next/image";
import { getEntityImageUrl } from "@/utils/imageUtils";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useApi } from "@/hooks/useApi";
import FAQAccordion from "@/components/common/FAQAccordion";
import toast from "react-hot-toast";

export default function AmbulanceDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { get, loading: apiLoading } = useApi();
  const [ambulance, setAmbulance] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetchAmbulance();
  }, [id]);

  const fetchAmbulance = async () => {
    try {
      const { data } = await get(`/ambulances/public/${id}`);
      setAmbulance(data?.data?.ambulance || data?.ambulance || null);
      if (!data?.data?.ambulance && !data?.ambulance)
        setError("Ambulance not found");
    } catch (e) {
      setError("Failed to fetch ambulance");
    }
  };

  const handleShare = async () => {
    try {
      const url = typeof window !== "undefined" ? window.location.href : "";
      const title = ambulance?.name || "Ambulance";
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
    } catch {}
  };

  if (apiLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        {/* Breadcrumb */}
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
                  href="/search?type=ambulance"
                  className="hover:text-primary-600 transition-colors"
                >
                  Ambulance
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
        {/* Breadcrumb */}
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
                  href="/search?type=ambulance"
                  className="hover:text-primary-600 transition-colors"
                >
                  Ambulance
                </a>
              </li>
              <li>
                <span className="mx-2">/</span>
              </li>
              <li>
                <span className="text-primary-600 font-medium">
                  Ambulance Not Found
                </span>
              </li>
            </ol>
          </div>
        </nav>
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {error}
            </h2>
            <button onClick={() => router.back()} className="btn-primary">
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!ambulance) return null;

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
                <a
                  href="/search?type=ambulance"
                  className="hover:text-primary-600 transition-colors"
                >
                  Ambulance
                </a>
              </li>
              <li>
                <span className="mx-2">/</span>
              </li>
              <li>
                <span className="text-primary-600 font-medium truncate max-w-xs">
                  {ambulance?.name || "Ambulance Details"}
                </span>
              </li>
            </ol>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="w-full h-56 sm:h-72 md:h-80 relative bg-gray-100 dark:bg-gray-700">
              {getEntityImageUrl(ambulance, "imageUrl") ? (
                <Image
                  src={getEntityImageUrl(ambulance, "imageUrl")}
                  alt={ambulance.name || "Ambulance"}
                  fill
                  className="object-cover"
                />
              ) : null}
            </div>

            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {ambulance.name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Vehicle: {ambulance.vehicleNumber}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    ambulance.isAvailable
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {ambulance.isAvailable ? "Available" : "Unavailable"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <Phone className="w-5 h-5 mr-2 text-primary-600" />{" "}
                    {ambulance.phone}
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <MapPin className="w-5 h-5 mr-2 text-primary-600" />{" "}
                    {ambulance.location}, {ambulance.city}
                  </div>
                  <div className="text-gray-700 dark:text-gray-300">
                    Driver: {ambulance.driverName} ({ambulance.driverPhone})
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <a
                  href={`tel:${ambulance.phone}`}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg font-medium transition-colors text-sm text-center"
                >
                  Call Now
                </a>
                <button
                  onClick={handleShare}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm"
                >
                  <Share2 className="w-4 h-4 mr-2" /> Share
                </button>
              </div>
            </div>
          </motion.div>

          {/* FAQs */}
          <div className="mt-8">
            <FAQAccordion entityType="ambulance" entityId={ambulance._id} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
