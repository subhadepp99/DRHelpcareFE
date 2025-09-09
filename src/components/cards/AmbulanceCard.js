"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Phone, Truck, Clock, User } from "lucide-react";
import Image from "next/image";
import { getEntityImageUrl } from "@/utils/imageUtils";

export default function AmbulanceCard({ ambulance }) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const handleViewDetails = () => {
    router.push(`/ambulance/${ambulance._id}`);
  };

  const handleCall = (e) => {
    e.stopPropagation();
    window.open(`tel:${ambulance.phone}`, "_blank");
  };

  const imageSrc = getEntityImageUrl(ambulance, "imageUrl");

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="card overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={handleViewDetails}
    >
      <div className="relative h-36 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-800 dark:to-orange-900 overflow-hidden">
        {imageSrc && !imageError ? (
          <Image
            src={imageSrc}
            alt={ambulance.name || "Ambulance"}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Truck className="w-12 h-12 text-orange-600 dark:text-orange-400" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              ambulance.isAvailable
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full mr-1 ${
                ambulance.isAvailable
                  ? "bg-green-400 animate-pulse"
                  : "bg-red-400"
              }`}
            ></span>
            {ambulance.isAvailable ? "Available" : "Unavailable"}
          </span>
        </div>

        {/* 24/7 Badge */}
        <div className="absolute top-3 right-3">
          <Clock className="w-4 h-4 text-orange-500" title="24/7 Service" />
        </div>
      </div>

      <div className="p-4">
        {/* Ambulance Info */}
        <div className="mb-3">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
            {ambulance.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Vehicle: {ambulance.vehicleNumber}
          </p>
        </div>

        {/* Location & Driver */}
        <div className="space-y-1 mb-3 text-sm">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">
              {ambulance.location}, {ambulance.city}
            </span>
          </div>

          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <User className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">Driver: {ambulance.driverName}</span>
          </div>

          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Phone className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">{ambulance.phone}</span>
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
            onClick={handleCall}
            className="flex-1 btn-primary text-sm py-1.5"
            disabled={!ambulance.isAvailable}
          >
            Call Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}
