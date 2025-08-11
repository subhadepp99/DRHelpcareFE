"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, MapPin, Star, DollarSign, Clock, Filter } from "lucide-react";

export default function SearchFilters({
  searchType,
  filters,
  onFiltersChange,
}) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      specialization: "",
      experience: "",
      fee: "",
      rating: "",
      distance: "",
    };
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const specializations = [
    "Cardiology",
    "Dermatology",
    "Neurology",
    "Pediatrics",
    "Orthopedics",
    "Gynecology",
    "Psychiatry",
    "Radiology",
    "Anesthesiology",
    "Pathology",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-32"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filters
        </h3>
        <button
          onClick={clearFilters}
          className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-6">
        {/* Distance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            <MapPin className="w-4 h-4 inline mr-1" />
            Distance
          </label>
          <div className="space-y-2">
            {["5", "10", "25", "50"].map((distance) => (
              <label key={distance} className="flex items-center">
                <input
                  type="radio"
                  name="distance"
                  value={distance}
                  checked={localFilters.distance === distance}
                  onChange={(e) =>
                    handleFilterChange("distance", e.target.value)
                  }
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  Within {distance} km
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            <Star className="w-4 h-4 inline mr-1" />
            Rating
          </label>
          <div className="space-y-2">
            {["4", "4.5", "5"].map((rating) => (
              <label key={rating} className="flex items-center">
                <input
                  type="radio"
                  name="rating"
                  value={rating}
                  checked={localFilters.rating === rating}
                  onChange={(e) => handleFilterChange("rating", e.target.value)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  {rating}+{" "}
                  <Star className="w-3 h-3 ml-1 fill-current text-yellow-400" />
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Doctor-specific filters */}
        {(searchType === "all" || searchType === "doctors") && (
          <>
            {/* Specialization */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Specialization
              </label>
              <select
                value={localFilters.specialization}
                onChange={(e) =>
                  handleFilterChange("specialization", e.target.value)
                }
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="">All Specializations</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec.toLowerCase()}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <Clock className="w-4 h-4 inline mr-1" />
                Experience
              </label>
              <div className="space-y-2">
                {[
                  { value: "1-5", label: "1-5 years" },
                  { value: "5-10", label: "5-10 years" },
                  { value: "10-15", label: "10-15 years" },
                  { value: "15+", label: "15+ years" },
                ].map((exp) => (
                  <label key={exp.value} className="flex items-center">
                    <input
                      type="radio"
                      name="experience"
                      value={exp.value}
                      checked={localFilters.experience === exp.value}
                      onChange={(e) =>
                        handleFilterChange("experience", e.target.value)
                      }
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      {exp.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Consultation Fee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Consultation Fee
              </label>
              <div className="space-y-2">
                {[
                  { value: "0-500", label: "₹0 - ₹500" },
                  { value: "500-1000", label: "₹500 - ₹1000" },
                  { value: "1000-2000", label: "₹1000 - ₹2000" },
                  { value: "2000+", label: "₹2000+" },
                ].map((fee) => (
                  <label key={fee.value} className="flex items-center">
                    <input
                      type="radio"
                      name="fee"
                      value={fee.value}
                      checked={localFilters.fee === fee.value}
                      onChange={(e) =>
                        handleFilterChange("fee", e.target.value)
                      }
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      {fee.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Availability */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Availability
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                Available today
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                Available tomorrow
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                Weekend available
              </span>
            </label>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
