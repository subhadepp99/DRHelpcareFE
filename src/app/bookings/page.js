"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useApi } from "@/hooks/useApi";
import { Calendar, Clock, MapPin, User, Phone, Mail } from "lucide-react";
import BookingDetailsModal from "@/components/modals/BookingDetailsModal";
import Header from "@/components/layout/Header";
import MetaTags from "@/components/common/MetaTags";
import { pageMetadata } from "@/utils/metadata";
import toast from "react-hot-toast";

export default function BookingsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { get } = useApi();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await get("/bookings/my-bookings");
      setBookings(response.data?.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Please Login to View Your Bookings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              You need to be logged in to access your appointment bookings.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaTags
        title={pageMetadata.bookings.title}
        description={pageMetadata.bookings.description}
        keywords={pageMetadata.bookings.keywords}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Bookings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage your appointment bookings
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading bookings...
            </p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No bookings found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              You haven't made any appointments yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:shadow"
                onClick={() => {
                  setSelectedBookingId(booking._id);
                  setDetailsOpen(true);
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Dr. {booking.doctor?.name || "Unknown Doctor"}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {booking.doctor?.department || "General"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status || "Pending"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(booking.appointmentDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {booking.appointmentTime || "Time not specified"}
                    </span>
                  </div>
                </div>

                {booking.notes && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Notes:</strong> {booking.notes}
                    </p>
                  </div>
                )}

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Consultation Fee:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ₹{booking.doctor?.consultationFee || "Not specified"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {detailsOpen && selectedBookingId && (
        <BookingDetailsModal
          bookingId={selectedBookingId}
          isOpen={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          onChanged={fetchBookings}
        />
      )}
      </div>
    </>
  );
}
