"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Phone,
  Calendar,
  Clock,
  MapPin,
  User,
  FileText,
} from "lucide-react";
import { useApi } from "@/hooks/useApi";
import toast from "react-hot-toast";

export default function BookingDetailsModal({
  bookingId,
  isOpen,
  onClose,
  onChanged,
}) {
  const { get, put, del } = useApi();
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (!isOpen || !bookingId) return;
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, bookingId]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await get(`/bookings/${bookingId}`, { silent: true });
      setBooking(res?.data?.booking || res?.data?.data || res?.data || null);
    } catch (e) {
      toast.error("Failed to load booking");
      onClose?.();
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Cancel this booking?")) return;
    try {
      setWorking(true);
      await del(`/bookings/${bookingId}`, {
        data: { reason: "Cancelled by user" },
      });
      toast.success("Booking cancelled");
      onChanged?.();
      onClose?.();
    } catch (e) {
      toast.error("Failed to cancel booking");
    } finally {
      setWorking(false);
    }
  };

  const handleReschedule = async () => {
    toast("Reschedule flow coming soon. Choose a new date/time then confirm.");
  };

  if (!isOpen) return null;

  const clinic = booking?.clinic;
  const doctor = booking?.doctor;
  const patient = booking?.patient;
  const isPast = (() => {
    try {
      if (!booking) return false;
      const dt = new Date(booking.appointmentDate);
      if (booking.appointmentTime) {
        const [h, m] = String(booking.appointmentTime)
          .split(":")
          .map((v) => parseInt(v, 10) || 0);
        dt.setHours(h, m, 0, 0);
      }
      return new Date() > dt;
    } catch (e) {
      return false;
    }
  })();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Booking Details
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Loading...
                  </p>
                </div>
              ) : !booking ? (
                <div className="text-center py-10 text-gray-500">Not found</div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <User className="w-4 h-4" />
                        <span>Dr. {doctor?.name}</span>
                      </div>
                      {doctor?.department && (
                        <div className="text-xs text-gray-500">
                          {doctor.department?.name || doctor.department}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      {clinic && (
                        <div className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <MapPin className="w-4 h-4 mt-0.5" />
                          <div>
                            <div className="font-medium">{clinic.name}</div>
                            <div className="text-xs text-gray-500">
                              {clinic.address}
                            </div>
                          </div>
                        </div>
                      )}
                      {clinic?.phone && (
                        <a
                          href={`tel:${clinic.phone}`}
                          className="inline-flex items-center gap-2 text-primary-600 text-sm"
                        >
                          <Phone className="w-4 h-4" /> Call Clinic
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(booking.appointmentDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Clock className="w-4 h-4" />
                      <span>{booking.appointmentTime}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Status: </span>
                      <span className="font-medium">{booking.status}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 rounded p-3 space-y-1 text-sm">
                    <div className="font-medium text-gray-900 dark:text-white">
                      Patient
                    </div>
                    <div className="text-gray-700 dark:text-gray-300">
                      {booking.patientDetails?.name ||
                        `${patient?.firstName || ""} ${
                          patient?.lastName || ""
                        }`}
                    </div>
                    {booking.patientDetails?.phone && (
                      <div className="text-gray-500">
                        {booking.patientDetails.phone}
                      </div>
                    )}
                    {booking.patientDetails?.email && (
                      <div className="text-gray-500">
                        {booking.patientDetails.email}
                      </div>
                    )}
                  </div>

                  {(booking.diagnosis ||
                    booking.prescription ||
                    booking.notes) && (
                    <div className="rounded p-3 space-y-2 border border-gray-200 dark:border-gray-700">
                      <div className="font-medium flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Clinical Notes
                      </div>
                      {booking.diagnosis && (
                        <div className="text-sm">
                          <span className="text-gray-500">Diagnosis: </span>
                          {booking.diagnosis}
                        </div>
                      )}
                      {booking.prescription && (
                        <div className="text-sm">
                          <span className="text-gray-500">Prescription: </span>
                          {booking.prescription}
                        </div>
                      )}
                      {booking.notes && (
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          {booking.notes}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between p-5 border-t border-gray-200 dark:border-gray-700">
              <button onClick={onClose} className="btn-secondary">
                Close
              </button>
              {!isPast && (
                <div className="flex gap-2">
                  <button
                    onClick={handleReschedule}
                    disabled={working || loading}
                    className="btn-secondary"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={working || loading}
                    className="btn-primary"
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
