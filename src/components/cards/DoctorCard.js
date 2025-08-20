"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Stethoscope, Shield } from "lucide-react";
import Image from "next/image";
import ReactStars from "react-rating-stars-component";

export default function DoctorCard({
  doctor,
  showRating = true,
  onBook,
  searchQuery = "",
}) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const handleViewDetails = () => {
    router.push(`/doctor/${doctor._id}`);
  };

  const handleBooking = () => {
    if (onBook) {
      onBook();
    } else {
      router.push(`/doctor/${doctor._id}?tab=booking`);
    }
  };

  const imageSrc = doctor.imageUrl || doctor.profileImage;

  // Generate realistic rating
  const ratingRaw = doctor.rating || 0;
  const rating =
    typeof ratingRaw === "object" && ratingRaw.average !== undefined
      ? ratingRaw.average
      : typeof ratingRaw === "number"
      ? ratingRaw
      : Number(ratingRaw) || 0;
  const reviewCount =
    doctor.reviewCount != null
      ? doctor.reviewCount
      : typeof doctor.rating === "object" && doctor.rating.count !== undefined
      ? doctor.rating.count
      : doctor.reviews
      ? doctor.reviews.length
      : 0;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="card overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={handleViewDetails}
    >
      <div className="relative h-36 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 overflow-hidden">
        {imageSrc && !imageError ? (
          <Image
            src={imageSrc}
            alt={doctor.name || "Doctor"}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Stethoscope className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></span>
            Available
          </span>
        </div>

        {/* Verified Badge */}
        <div className="absolute top-3 right-3">
          <Shield className="w-4 h-4 text-green-500" title="Verified Doctor" />
        </div>
      </div>

      <div className="p-4">
        {/* Doctor Info */}
        <div className="mb-3">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
            Dr. {doctor.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {typeof doctor.department === "object" && doctor.department?.name
              ? doctor.department.name
              : doctor.department || "General Physician"}
          </p>
        </div>

        {/* Rating */}
        {showRating && (
          <div className="flex items-center mb-3">
            <ReactStars
              count={5}
              value={rating}
              size={14}
              edit={false}
              activeColor="#f59e0b"
              color="#d1d5db"
            />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              {rating.toFixed(1)} ({reviewCount} reviews)
            </span>
          </div>
        )}

        {/* Location & Fee */}
        <div className="space-y-1 mb-3 text-sm">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">
              {doctor.address?.city || doctor.city || "City"},{" "}
              {doctor.address?.state || doctor.state || "State"}
            </span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <span className="font-medium text-primary-600 dark:text-primary-400">
              ₹{doctor.consultationFee || "Not specified"}
            </span>
            <span className="ml-1">consultation fee</span>
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
              handleBooking();
            }}
            className="flex-1 btn-primary text-sm py-2"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </motion.div>
  );
}
