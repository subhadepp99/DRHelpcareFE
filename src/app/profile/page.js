"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Camera,
  Save,
  Edit,
  Calendar,
  Heart,
  Settings,
  Upload,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/store/authStore";
import { useApi } from "@/hooks/useApi";
import Header from "@/components/layout/Header";

import Footer from "@/components/layout/Footer";
import BookingModal from "@/components/modals/BookingModal";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const { get, put } = useApi();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      username: user?.username || "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        username: user.username,
      });
    }
    fetchBookings();
  }, [user, reset]);

  const fetchBookings = async () => {
    try {
      const response = await get("/bookings/my-bookings");
      const realBookings = response.data?.bookings || [];

      // Transform API data to match the expected format
      const transformedBookings = realBookings.map((booking) => ({
        id: booking._id,
        doctorName: `Dr. ${booking.doctor?.name || "Unknown"}`,
        specialization: booking.doctor?.department || "General",
        date: new Date(booking.appointmentDate).toLocaleDateString(),
        time: booking.appointmentTime || "Time not specified",
        status: booking.status || "pending",
        fee: booking.doctor?.consultationFee || "Not specified",
        symptoms: booking.symptoms || "Not specified",
        diagnosis: booking.diagnosis || "Pending consultation",
        prescription:
          booking.prescription || "To be provided after consultation",
        // Add original booking data for modal
        originalData: booking,
      }));

      setBookings(transformedBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      // Fallback to empty array if API fails
      setBookings([]);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const response = await put(`/users/${user.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      updateUser(data);
      toast.success("Profile updated successfully!");
      setEditMode(false);
      setProfileImage(null);
      setImagePreview(null);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "bookings", label: "My Bookings", icon: Calendar },
    { id: "favorites", label: "Favorites", icon: Heart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "badge-primary";
      case "completed":
        return "badge-success";
      case "cancelled":
        return "badge-error";
      default:
        return "badge-secondary";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="card sticky top-24">
                <div className="p-6">
                  {/* Profile Picture with Upload */}
                  <div className="text-center mb-6">
                    <div className="relative inline-block">
                      <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center overflow-hidden">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Profile Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : user?.profileImage ? (
                          <img
                            src={user.profileImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : (
                          <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                            {user?.firstName?.charAt(0)}
                            {user?.lastName?.charAt(0)}
                          </span>
                        )}
                      </div>

                      <label className="absolute bottom-0 right-0 p-1 bg-primary-600 text-white rounded-full hover:bg-primary-700 cursor-pointer transition-colors">
                        <Camera className="w-4 h-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
                      {user?.firstName} {user?.lastName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      @{user?.username}
                    </p>
                  </div>

                  {/* Navigation */}
                  <nav className="space-y-1">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? "bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <tab.icon className="w-5 h-5" />
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Profile Tab with Better Padding */}
              {activeTab === "profile" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card"
                >
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Personal Information
                      </h2>
                      <button
                        onClick={() => setEditMode(!editMode)}
                        className="btn-secondary"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        {editMode ? "Cancel" : "Edit"}
                      </button>
                    </div>
                  </div>

                  <div className="p-8">
                    {editMode ? (
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="form-label">First Name</label>
                            <input
                              {...register("firstName", {
                                required: "First name is required",
                              })}
                              className="input-field"
                            />
                            {errors.firstName && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.firstName.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="form-label">Last Name</label>
                            <input
                              {...register("lastName", {
                                required: "Last name is required",
                              })}
                              className="input-field"
                            />
                            {errors.lastName && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.lastName.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="form-label">Email</label>
                            <input
                              {...register("email", {
                                required: "Email is required",
                                pattern: {
                                  value: /^\S+@\S+$/i,
                                  message: "Invalid email address",
                                },
                              })}
                              className="input-field"
                            />
                            {errors.email && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.email.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="form-label">Phone</label>
                            <input
                              {...register("phone", {
                                required: "Phone is required",
                              })}
                              className="input-field"
                            />
                            {errors.phone && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.phone.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="form-label">Username</label>
                          <input
                            {...register("username", {
                              required: "Username is required",
                            })}
                            className="input-field"
                          />
                          {errors.username && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.username.message}
                            </p>
                          )}
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                          >
                            {loading ? (
                              <div className="spinner mr-2"></div>
                            ) : (
                              <Save className="w-4 h-4 mr-2" />
                            )}
                            Save Changes
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex items-center space-x-3">
                            <User className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Full Name
                              </p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {user?.firstName} {user?.lastName}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Email
                              </p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {user?.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex items-center space-x-3">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Phone
                              </p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {user?.phone}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <User className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Username
                              </p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                @{user?.username}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Enhanced Bookings Tab with Modal */}
              {activeTab === "bookings" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card"
                >
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      My Appointments
                    </h2>
                  </div>

                  <div className="p-6">
                    {bookings.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          No appointments yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Book your first appointment to get started
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {bookings.map((booking) => (
                          <div
                            key={booking.id}
                            onClick={() => setSelectedBooking(booking)}
                            className="flex items-center justify-between p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {booking.doctorName}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {booking.specialization}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {booking.date} at {booking.time}
                                </p>
                              </div>
                            </div>

                            <div className="text-right">
                              <span
                                className={`badge ${getStatusColor(
                                  booking.status
                                )} mb-2`}
                              >
                                {booking.status}
                              </span>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                ₹{booking.fee}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setSelectedBooking(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all w-full max-w-lg"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Appointment Details
                  </h3>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {selectedBooking.doctorName}
                    </h4>
                    <p className="text-sm text-primary-600 dark:text-primary-400">
                      {selectedBooking.specialization}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Date</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedBooking.date}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Time</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedBooking.time}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Status
                    </p>
                    <span
                      className={`badge ${getStatusColor(
                        selectedBooking.status
                      )}`}
                    >
                      {selectedBooking.status}
                    </span>
                  </div>

                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Consultation Fee
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      ₹{selectedBooking.fee}
                    </p>
                  </div>

                  {selectedBooking.symptoms && (
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Symptoms
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        {selectedBooking.symptoms}
                      </p>
                    </div>
                  )}

                  {selectedBooking.diagnosis && (
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Diagnosis
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        {selectedBooking.diagnosis}
                      </p>
                    </div>
                  )}

                  {selectedBooking.prescription && (
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Prescription
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        {selectedBooking.prescription}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Add Footer */}
      <Footer />
    </div>
  );
}
