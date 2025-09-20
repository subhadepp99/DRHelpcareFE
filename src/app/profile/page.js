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
  Settings,
  Upload,
  X,
  Calendar,
  Clock,
  MapPin,
  Stethoscope,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/store/authStore";
import { useApi } from "@/hooks/useApi";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BookingDetailsModal from "@/components/modals/BookingDetailsModal";
import toast from "react-hot-toast";
import { getEntityImageUrl } from "@/utils/imageUtils";

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const { put, get, post } = useApi();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [pwdOtp, setPwdOtp] = useState("");
  const [pwdOtpCountdown, setPwdOtpCountdown] = useState(0);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdForm, setPwdForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

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
      console.log("User loaded in profile page:", user);
      console.log("User ID (id):", user.id);
      console.log("User ID (_id):", user._id);
      console.log("User object keys:", Object.keys(user));
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        username: user.username,
      });
    }
  }, [user, reset]);

  // Fetch user bookings when bookings tab is selected
  useEffect(() => {
    if (activeTab === "bookings" && user) {
      fetchUserBookings();
    }
  }, [activeTab, user]);

  const fetchUserBookings = async () => {
    try {
      setBookingsLoading(true);
      const userId = user._id || user.id;
      const response = await get(`/bookings/user/${userId}`);

      if (response.data?.success) {
        setBookings(response.data.bookings || []);
      } else {
        console.error("Failed to fetch bookings:", response.data?.message);
        toast.error("Failed to fetch bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to fetch bookings");
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Automatically update profile picture when image is selected
      try {
        setLoading(true);

        // Check if user is loaded
        if (!user) {
          toast.error("User not loaded. Please refresh the page.");
          return;
        }

        // Get the user ID (try _id first, then id)
        const userId = user._id || user.id;
        if (!userId) {
          console.error("User ID not found:", user);
          toast.error("User ID not found. Please log in again.");
          return;
        }

        console.log("🔄 Auto-updating profile picture for user ID:", userId);
        console.log("📁 File details:", {
          name: file.name,
          size: file.size,
          type: file.type,
        });

        const formData = new FormData();
        formData.append("profileImage", file);

        const response = await put(`/users/${userId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("✅ Profile picture update response:", response);
        console.log("📊 Response data:", response.data);
        console.log(
          "🖼️ New profile image URL:",
          response.data?.data?.profileImageUrl
        );

        // Merge full server user payload to ensure profileImage/profileImageUrl are in store/localStorage
        const serverUser = response.data?.data;
        const mergedUser = serverUser ? { ...user, ...serverUser } : user;
        console.log("👤 Updated user data:", mergedUser);
        updateUser(mergedUser);

        // Clear preview states
        setImagePreview(null);
        setProfileImage(null);

        toast.success("Profile picture updated successfully!");
      } catch (error) {
        console.error("❌ Profile picture update error:", error);
        toast.error("Failed to update profile picture");
        // Reset the image selection on error
        setProfileImage(null);
        setImagePreview(null);
      } finally {
        setLoading(false);
      }
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

      // Check if user is loaded
      if (!user) {
        toast.error("User not loaded. Please refresh the page.");
        return;
      }

      // Get the user ID (try _id first, then id)
      const userId = user._id || user.id;
      if (!userId) {
        console.error("User ID not found:", user);
        toast.error("User ID not found. Please log in again.");
        return;
      }

      console.log("Updating profile for user ID:", userId);

      const apiUrl = `/users/${userId}`;
      console.log("API URL:", apiUrl);

      const response = await put(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Profile update response:", response);
      console.log("Response data:", response.data);

      // Update user with both form data and new profile image URL if available
      const updatedUserData = {
        ...data,
        profileImageUrl:
          response.data?.data?.profileImageUrl ||
          getEntityImageUrl(user, "profileImageUrl"),
      };

      console.log("Updated user data:", updatedUserData);
      updateUser(updatedUserData);
      toast.success("Profile updated successfully!");
      setEditMode(false);
      setProfileImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "bookings", label: "My Bookings", icon: Calendar },
    { id: "settings", label: "Settings", icon: Settings },
  ];

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
                        ) : getEntityImageUrl(user, "profileImageUrl") ? (
                          <img
                            src={getEntityImageUrl(user, "profileImageUrl")}
                            alt="Profile"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.log(
                                "Profile image failed to load:",
                                e.target.src
                              );
                              e.target.style.display = "none";
                              const fallback =
                                e.target.parentElement.querySelector(
                                  ".fallback-initials"
                                );
                              if (fallback) fallback.style.display = "flex";
                            }}
                            onLoad={(e) => {
                              console.log(
                                "Profile image loaded:",
                                e.target.src
                              );
                            }}
                          />
                        ) : (
                          <span className="fallback-initials text-2xl font-bold text-primary-600 dark:text-primary-400 flex items-center justify-center w-full h-full">
                            {user?.firstName?.charAt(0)}
                            {user?.lastName?.charAt(0)}
                          </span>
                        )}
                      </div>

                      <label
                        className={`absolute bottom-0 right-0 p-1 rounded-full transition-colors ${
                          loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-primary-600 hover:bg-primary-700 cursor-pointer"
                        }`}
                      >
                        {loading ? (
                          <div className="spinner w-4 h-4 border-white"></div>
                        ) : (
                          <Camera className="w-4 h-4 text-white" />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          disabled={loading}
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
              {/* Profile Tab */}
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
                        className="btn-secondary flex items-center justify-center"
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
                            className="btn-primary flex items-center justify-center"
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

              {/* My Bookings Tab */}
              {activeTab === "bookings" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card"
                >
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      My Bookings
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      View all your appointment bookings
                    </p>
                  </div>

                  <div className="p-6">
                    {bookingsLoading ? (
                      <div className="flex justify-center items-center py-8">
                        <div className="spinner w-8 h-8"></div>
                      </div>
                    ) : bookings.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          No Bookings Found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          You haven't made any appointments yet.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {bookings.map((booking) => (
                          <div
                            key={booking._id}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                            onClick={() => {
                              setSelectedBookingId(booking._id);
                              setDetailsOpen(true);
                            }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <Stethoscope className="w-5 h-5 text-blue-600" />
                                  <h4 className="font-medium text-gray-900 dark:text-white">
                                    {booking.doctorName || "Dr. Unknown"}
                                  </h4>
                                  <span
                                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                                      booking.status === "confirmed"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                        : booking.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                        : booking.status === "completed"
                                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                        : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                                    }`}
                                  >
                                    {booking.status?.charAt(0).toUpperCase() +
                                      booking.status?.slice(1) || "Unknown"}
                                  </span>
                                  {(() => {
                                    try {
                                      const dt = new Date(
                                        `${booking.date || ""}T${
                                          booking.time || "00:00"
                                        }`
                                      );
                                      if (dt < new Date()) {
                                        return (
                                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                                            Expired
                                          </span>
                                        );
                                      }
                                    } catch (e) {}
                                    return null;
                                  })()}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                      {booking.date || "Date not specified"}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4" />
                                    <span>
                                      {booking.time || "Time not specified"}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>
                                      {booking.specialization ||
                                        "Specialization not specified"}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium">Fee:</span>
                                    <span>
                                      ₹{booking.fee || "Not specified"}
                                    </span>
                                  </div>
                                </div>

                                {booking.symptoms && (
                                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-sm">
                                      <span className="font-medium text-gray-700 dark:text-gray-300">
                                        Symptoms:
                                      </span>{" "}
                                      {booking.symptoms}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card"
                >
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Account Settings
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Manage your account preferences and settings
                    </p>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Change Password with OTP */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Change Password
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="form-label">Current Password</label>
                          <input
                            type="password"
                            value={pwdForm.currentPassword}
                            onChange={(e) =>
                              setPwdForm({
                                ...pwdForm,
                                currentPassword: e.target.value,
                              })
                            }
                            className="input-field"
                          />
                        </div>
                        <div className="md:col-span-2 flex items-end justify-between gap-2">
                          <div className="flex-1">
                            <label className="form-label">
                              OTP sent to {user?.phone || "your phone"}
                            </label>
                            <input
                              type="text"
                              value={pwdOtp}
                              onChange={(e) =>
                                setPwdOtp(
                                  e.target.value.replace(/\D/g, "").slice(0, 4)
                                )
                              }
                              maxLength={4}
                              className="input-field"
                              placeholder="0000"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Required to confirm password change
                            </p>
                          </div>
                          <button
                            type="button"
                            disabled={pwdOtpCountdown > 0 || pwdLoading}
                            onClick={async () => {
                              try {
                                setPwdLoading(true);
                                const res = await post(
                                  "/auth/send-change-password-otp",
                                  {}
                                );
                                if (res.data?.success) {
                                  setPwdOtpCountdown(60);
                                  const timer = setInterval(() => {
                                    setPwdOtpCountdown((v) => {
                                      if (v <= 1) {
                                        clearInterval(timer);
                                        return 0;
                                      }
                                      return v - 1;
                                    });
                                  }, 1000);
                                  toast.success("OTP sent");
                                } else {
                                  toast.error(
                                    res.data?.message || "Failed to send OTP"
                                  );
                                }
                              } catch (_) {
                                toast.error("Failed to send OTP");
                              } finally {
                                setPwdLoading(false);
                              }
                            }}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                          >
                            {pwdOtpCountdown > 0
                              ? `Resend in ${pwdOtpCountdown}s`
                              : "Send OTP"}
                          </button>
                        </div>
                        <div>
                          <label className="form-label">New Password</label>
                          <input
                            type="password"
                            value={pwdForm.newPassword}
                            onChange={(e) =>
                              setPwdForm({
                                ...pwdForm,
                                newPassword: e.target.value,
                              })
                            }
                            className="input-field"
                          />
                        </div>
                        <div>
                          <label className="form-label">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={pwdForm.confirmPassword}
                            onChange={(e) =>
                              setPwdForm({
                                ...pwdForm,
                                confirmPassword: e.target.value,
                              })
                            }
                            className="input-field"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          disabled={pwdLoading}
                          onClick={async () => {
                            try {
                              if (!pwdOtp || pwdOtp.length !== 4) {
                                toast.error("Enter the 4-digit OTP");
                                return;
                              }
                              if (
                                pwdForm.newPassword !== pwdForm.confirmPassword
                              ) {
                                toast.error("Passwords do not match");
                                return;
                              }
                              setPwdLoading(true);
                              const res = await post("/auth/change-password", {
                                currentPassword: pwdForm.currentPassword,
                                newPassword: pwdForm.newPassword,
                                otp: pwdOtp,
                              });
                              if (res.data?.success) {
                                toast.success("Password changed successfully");
                                setPwdForm({
                                  currentPassword: "",
                                  newPassword: "",
                                  confirmPassword: "",
                                });
                                setPwdOtp("");
                              } else {
                                toast.error(
                                  res.data?.message ||
                                    "Failed to change password"
                                );
                              }
                            } catch (_) {
                              toast.error("Failed to change password");
                            } finally {
                              setPwdLoading(false);
                            }
                          }}
                          className="btn-primary"
                        >
                          {pwdLoading ? (
                            <div className="spinner mr-2"></div>
                          ) : null}
                          Save New Password
                        </button>
                      </div>
                    </div>
                    {/* Account Actions */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Account Actions
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Deactivate Account */}
                        <div className="p-4 border border-yellow-200 dark:border-yellow-700 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                          <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                            Deactivate Account
                          </h4>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                            Temporarily disable your account. You can reactivate
                            it later by logging in and confirming via OTP.
                          </p>
                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  "Are you sure you want to deactivate your account? You can reactivate it later by logging in."
                                )
                              ) {
                                // Call deactivate API
                                console.log("Deactivating account...");
                              }
                            }}
                            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                          >
                            Deactivate Account
                          </button>
                        </div>

                        {/* Delete Account */}
                        <div className="p-4 border border-red-200 dark:border-red-700 rounded-lg bg-red-50 dark:bg-red-900/20">
                          <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                            Delete Account
                          </h4>
                          <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                            Permanently delete your account. This action cannot
                            be undone. Your data will be archived.
                          </p>
                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  "Are you absolutely sure you want to delete your account? This action cannot be undone."
                                )
                              ) {
                                if (
                                  confirm(
                                    "Final confirmation: This will permanently delete your account and archive your data. Continue?"
                                  )
                                ) {
                                  // Call delete API
                                  console.log("Deleting account...");
                                }
                              }
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Privacy Settings */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Privacy Settings
                      </h3>

                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            defaultChecked={true}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            Allow notifications via email
                          </span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            defaultChecked={true}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            Allow notifications via SMS
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Theme Settings */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Theme Settings
                      </h3>

                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="theme"
                            value="light"
                            defaultChecked={true}
                            className="text-primary-600 focus:ring-primary-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            Light
                          </span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="theme"
                            value="dark"
                            className="text-primary-600 focus:ring-primary-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            Dark
                          </span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="theme"
                            value="auto"
                            className="text-primary-600 focus:ring-primary-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            Auto
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
        {detailsOpen && selectedBookingId && (
          <BookingDetailsModal
            bookingId={selectedBookingId}
            isOpen={detailsOpen}
            onClose={() => setDetailsOpen(false)}
            onChanged={fetchUserBookings}
          />
        )}
      </div>

      {/* Add Footer */}
      <Footer />
    </div>
  );
}
