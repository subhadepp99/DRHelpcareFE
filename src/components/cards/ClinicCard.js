"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Phone, Star, Users, Building2 } from "lucide-react";
import ReactStars from "react-rating-stars-component";
import { getEntityImageUrl } from "@/utils/imageUtils";

export default function ClinicCard({ clinic }) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);

  const handleViewDetails = () => {
    // Create URL-friendly clinic name and location
    const clinicName = encodeURIComponent(
      clinic.name.replace(/\s+/g, "-").toLowerCase()
    );
    const location = encodeURIComponent(
      clinic.place || clinic.state || "unknown"
    );
    // Pass ID as query parameter for better data retrieval
    router.push(`/clinic/${clinicName}/${location}?id=${clinic._id}`);
  };

  const formatAddress = (address) => {
    if (!address) return "Address not available";

    if (typeof address === "string") {
      return address;
    }

    const parts = [];
    if (address.address) parts.push(address.address);
    if (address.place) parts.push(address.place);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.zipCode) parts.push(address.zipCode);

    return parts.length > 0 ? parts.join(", ") : "Address not available";
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="card overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={handleViewDetails}
    >
      <div className="relative h-48 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-900">
        {clinic.imageUrl ? (
          <img
            src={getEntityImageUrl(clinic, "imageUrl")}
            alt={clinic.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ display: clinic.imageUrl ? "none" : "flex" }}
        >
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

        {/* Services & Doctor Count */}
        <div className="mb-4 space-y-3">
          {/* Services */}
          {(() => {
            // Normalize services to clean string tags (strip quotes/brackets/backslashes)
            const normalizeList = (value) => {
              let items = value;
              if (typeof items === "string") {
                const trimmed = items.trim();
                try {
                  items = JSON.parse(trimmed);
                } catch {
                  items = trimmed.split(",");
                }
              }
              if (!Array.isArray(items)) items = [items].filter(Boolean);
              items = items.flat ? items.flat() : items;
              return items
                .map((it) =>
                  String(it)
                    .replace(/[\\\[\]\"']/g, "")
                    .trim()
                )
                .filter((s) => s.length > 0);
            };

            const services = normalizeList(clinic.services || []);

            return services.length > 0 ? (
              <div>
                <div className="flex flex-wrap gap-1">
                  {services.slice(0, 3).map((service, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                    >
                      {service}
                    </span>
                  ))}
                  {services.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                      +{services.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            ) : null;
          })()}

          {/* Doctor Count */}
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="text-sm">
              {clinic.doctorCount || clinic.doctors?.length || 0} Doctor
              {clinic.doctorCount !== 1 ||
              (clinic.doctors && clinic.doctors.length !== 1)
                ? "s"
                : ""}
              {/* Available */}
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="mb-4 text-sm">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">
              {formatAddress(clinic.address)}
              {clinic.distance != null && clinic.distance > 0 && (
                <span className="ml-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                  ({clinic.distance} km)
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
            className="flex-1 btn-secondary text-sm py-1.5"
          >
            View Details
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle contact
            }}
            className="flex-1 btn-primary text-sm py-1.5 flex items-center justify-center"
          >
            <Phone className="w-4 h-4 mr-1" />
            Contact
          </button>
        </div>
      </div>
    </motion.div>
  );
}
