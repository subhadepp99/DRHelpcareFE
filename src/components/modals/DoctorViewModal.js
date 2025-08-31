"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Clock,
  Building,
  DollarSign,
  FileText,
} from "lucide-react";

export default function DoctorViewModal({ doctor, isOpen, onClose }) {
  if (!isOpen || !doctor) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  const getClinicNames = () => {
    if (doctor.clinicDetails?.length > 0) {
      return doctor.clinicDetails.map((clinic, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Building className="w-4 h-4 text-gray-500" />
          <span className="text-sm">
            {clinic.clinicName || clinic.clinic?.name || "Unknown Clinic"}
            {clinic.isPrimary && (
              <span className="text-blue-600 ml-1">(Primary)</span>
            )}
          </span>
        </div>
      ));
    } else if (doctor.clinics?.length > 0) {
      return doctor.clinics.map((clinic, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Building className="w-4 h-4 text-gray-500" />
          <span className="text-sm">
            {typeof clinic === "object" ? clinic.name : `Clinic ID: ${clinic}`}
          </span>
        </div>
      ));
    }
    return <span className="text-gray-500">No clinics assigned</span>;
  };

  const getAvailabilityText = () => {
    if (doctor.availableDateTime?.length > 0) {
      const availableDays = doctor.availableDateTime
        .filter((day) => day.isAvailable)
        .map((day) => day.day.charAt(0).toUpperCase() + day.day.slice(1));
      return availableDays.join(", ");
    } else if (doctor.availability?.length > 0) {
      const availableDays = doctor.availability
        .filter((day) => day.isAvailable)
        .map((day) => day.day.charAt(0).toUpperCase() + day.day.slice(1));
      return availableDays.join(", ");
    }
    return "Not specified";
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                {doctor.imageUrl ? (
                  <img
                    src={doctor.imageUrl}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-500" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Dr. {doctor.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {doctor.department?.name || "Department not specified"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    Basic Information
                  </h4>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Name
                        </span>
                        <p className="text-gray-900 dark:text-white">
                          {doctor.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Email
                        </span>
                        <p className="text-gray-900 dark:text-white">
                          {doctor.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Phone
                        </span>
                        <p className="text-gray-900 dark:text-white">
                          {doctor.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <GraduationCap className="w-5 h-5 text-gray-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Qualification
                        </span>
                        <p className="text-gray-900 dark:text-white">
                          {doctor.qualification}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Experience
                        </span>
                        <p className="text-gray-900 dark:text-white">
                          {doctor.experience} years
                        </p>
                      </div>
                    </div>

                    {doctor.licenseNumber && (
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-gray-500" />
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            License Number
                          </span>
                          <p className="text-gray-900 dark:text-white">
                            {doctor.licenseNumber}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    Location & Fees
                  </h4>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Location
                        </span>
                        <p className="text-gray-900 dark:text-white">
                          {doctor.city}, {doctor.state}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-5 h-5 text-gray-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Consultation Fee
                        </span>
                        <p className="text-gray-900 dark:text-white">
                          ₹{doctor.consultationFee || "Not specified"}
                        </p>
                      </div>
                    </div>

                    {doctor.doctorFees && (
                      <div className="flex items-center space-x-3">
                        <DollarSign className="w-5 h-5 text-gray-500" />
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Doctor Fees
                          </span>
                          <p className="text-gray-900 dark:text-white">
                            ₹{doctor.doctorFees}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Available Days
                        </span>
                        <p className="text-gray-900 dark:text-white">
                          {getAvailabilityText()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {doctor.bio && (
                <div className="space-y-3">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    Biography
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {doctor.bio}
                  </p>
                </div>
              )}

              {/* Clinics */}
              <div className="space-y-3">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                  Associated Clinics
                </h4>
                <div className="space-y-2">{getClinicNames()}</div>
              </div>

              {/* Address Details */}
              {doctor.address && (
                <div className="space-y-3">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    Address Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {doctor.address.street && (
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Street
                        </span>
                        <p className="text-gray-900 dark:text-white">
                          {doctor.address.street}
                        </p>
                      </div>
                    )}
                    {doctor.address.zipCode && (
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          ZIP Code
                        </span>
                        <p className="text-gray-900 dark:text-white">
                          {doctor.address.zipCode}
                        </p>
                      </div>
                    )}
                    {doctor.address.country && (
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Country
                        </span>
                        <p className="text-gray-900 dark:text-white">
                          {doctor.address.country}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              {(doctor.languages?.length > 0 ||
                doctor.services?.length > 0) && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    Additional Information
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {doctor.languages?.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Languages
                        </span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {doctor.languages.map((lang, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {doctor.services?.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Services
                        </span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {doctor.services.map((service, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* System Information */}
              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  System Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      Status:
                    </span>
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        doctor.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                      }`}
                    >
                      {doctor.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      Created:
                    </span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {formatDate(doctor.createdAt)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      Last Updated:
                    </span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {formatDate(doctor.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end p-6 border-t border-gray-200 dark:border-gray-700">
              <button onClick={onClose} className="btn-secondary">
                Close
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
