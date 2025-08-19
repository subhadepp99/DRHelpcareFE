"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Star, MapPin, Clock, Calendar, Heart, Phone } from "lucide-react";
import Image from "next/image";

export default function DoctorCard({
  doctor,
  showBookButton = true,
  showRating = true,
  highlight = "",
}) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleBooking = () => {
    router.push(`/booking/${doctor._id}`);
  };

  const handleViewProfile = () => {
    router.push(`/doctor/${doctor._id}`);
  };

  const formatFee = (fee) => {
    return fee ? `₹${fee}` : "Fee not specified";
  };

  // Generate realistic rating
  const ratingRaw = doctor.rating || 0; // Directly use doctor.rating or 0 if not provided
  const rating =
    typeof ratingRaw === "number" ? ratingRaw : Number(ratingRaw) || 0;
  const reviewCount =
    doctor.reviewCount != null
      ? doctor.reviewCount
      : doctor.reviews
      ? doctor.reviews.length
      : 0;

  // Helper to highlight matches
  function highlightText(text) {
    if (!highlight || !text) return text;
    const regex = new RegExp(`(${highlight})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <span
          key={i}
          className="bg-yellow-200 dark:bg-yellow-700 text-black dark:text-white rounded px-1"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  }

  // Helper to get image src safely
  const getImageSrc = () => {
    if (!doctor.image) return undefined;
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
    return undefined;
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="card overflow-hidden hover:shadow-xl hover:shadow-primary-200/50 transition-all duration-300"
    >
      <div className="relative">
        {/* Doctor Image */}
        <div className="aspect-w-16 aspect-h-12 bg-gray-100 dark:bg-gray-700">
          {getImageSrc() && !imageError ? (
            <Image
              src={getImageSrc()}
              alt={doctor.name || "Doctor"}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex items-center justify-center h-48 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-900">
              <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">
                  {doctor.name?.charAt(0) || "D"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Like Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-colors"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isLiked
                ? "fill-primary-500 text-primary-500"
                : "text-gray-600 dark:text-gray-300"
            }`}
          />
        </button>

        {/* Online Status */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
            <span className="w-2 h-2 bg-primary-400 rounded-full mr-1.5 animate-pulse"></span>
            Available
          </span>
        </div>
      </div>

      <div className="p-6">
        {/* Doctor Info */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Dr. {highlightText(doctor.name || doctor.firstName || "Doctor")}
          </h3>
          <p className="text-primary-600 dark:text-primary-400 font-medium text-sm">
            {highlightText(doctor.specialization || "Specialist")}
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {highlightText(doctor.qualification || "")}
          </p>
        </div>

        {/* Enhanced Rating Display */}
        {showRating && (
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.floor(rating)
                      ? "text-yellow-400 fill-current"
                      : star === Math.ceil(rating) && rating % 1 !== 0
                      ? "text-yellow-400 fill-current opacity-50"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              {rating.toFixed(1)} ({reviewCount || 0} reviews)
            </span>
          </div>
        )}

        {/* Experience & Fee */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4 mr-1" />
            <span>{doctor.experience}+ years exp</span>
          </div>
          <div className="font-semibold text-primary-600 dark:text-primary-400">
            {formatFee(doctor.consultationFee)}
          </div>
        </div>

        {/* Location */}
        {doctor.address && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">
              {highlightText(
                typeof doctor.address === "string"
                  ? doctor.address
                  : doctor.address.fullAddress ||
                      `${doctor.address.city || ""}, ${
                        doctor.address.state || ""
                      }`
              )}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={handleViewProfile}
            className="flex-1 btn-secondary text-sm py-2"
          >
            View Profile
          </button>
          {showBookButton && (
            <button
              onClick={handleBooking}
              className="flex-1 btn-primary text-sm px-6 py-3 rounded-lg font-semibold shadow hover:shadow-lg transition inline-flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Now</span>
            </button>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-center space-x-4 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => window.open(`tel:${doctor.phone}`, "_self")}
            className="flex items-center text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            <Phone className="w-3 h-3 mr-1" />
            Call
          </button>
          <button
            onClick={() => window.open(`/booking/${doctor._id}`, "_blank")}
            className="flex items-center text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            <Calendar className="w-3 h-3 mr-1" />
            Schedule
          </button>
        </div>
      </div>
    </motion.div>
  );
}
