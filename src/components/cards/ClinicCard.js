"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Clock, Phone, Star, Users, Building2 } from "lucide-react";
import ReactStars from "react-rating-stars-component";

export default function ClinicCard({ clinic }) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);

  const handleViewDetails = () => {
    router.push(`/clinic/${clinic._id}`);
  };

  const formatAddress = (address) => {
    if (!address) return "Address not available";

    if (typeof address === "string") {
      return address;
    }

    const city = address.city || "N/A";
    const state = address.state || "N/A";
    return `${city}, ${state}`;
  };

  const getOperatingHours = () => {
    if (!clinic.operatingHours) return "Hours not specified";
    const today = new Date()
      .toLocaleDateString("en-US", {
        weekday: "long",
      })
      .toLowerCase();
    const todaysHours = clinic.operatingHours[today];
    return todaysHours
      ? `${todaysHours.open} - ${todaysHours.close}`
      : "Closed today";
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="card overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={handleViewDetails}
    >
      <div className="relative h-48 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <Building2 className="w-16 h-16 text-green-600 dark:text-green-400" />
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
            Open
          </span>
        </div>
      </div>

      <div className="card-body">
        {/* Clinic Info */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {clinic.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Registration: {clinic.registrationNumber || "Not specified"}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <ReactStars
            count={5}
            value={
              typeof clinic.rating === "object" &&
              clinic.rating.average !== undefined
                ? clinic.rating.average
                : clinic.rating || 4.2
            }
            size={16}
            edit={false}
            activeColor="#f59e0b"
            color="#d1d5db"
          />
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
            {typeof clinic.rating === "object" &&
            clinic.rating.average !== undefined
              ? clinic.rating.average
              : clinic.rating || 4.2}{" "}
            (
            {typeof clinic.rating === "object" &&
            clinic.rating.count !== undefined
              ? clinic.rating.count
              : clinic.reviewCount || 89}{" "}
            reviews)
          </span>
        </div>

        {/* Services */}
        {clinic.services && clinic.services.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {clinic.services.slice(0, 3).map((service, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                >
                  {service}
                </span>
              ))}
              {clinic.services.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                  +{clinic.services.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Location & Hours */}
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{formatAddress(clinic.address)}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{getOperatingHours()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
            className="flex-1 btn-secondary text-sm py-2"
          >
            View Details
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle contact
            }}
            className="flex-1 btn-primary text-sm py-2"
          >
            <Phone className="w-4 h-4 mr-1" />
            Contact
          </button>
        </div>
      </div>
    </motion.div>
  );
}
