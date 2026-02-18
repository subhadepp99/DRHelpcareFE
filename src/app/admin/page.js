"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Stethoscope,
  Building2,
  Pill,
  UserPlus,
  TrendingUp,
  Calendar,
  BarChart3,
  Clock,
  Activity,
  TestTube,
  Building,
  Truck,
  RefreshCw,
  AlertCircle,
  Bell,
} from "lucide-react";
import { useApi } from "@/hooks/useApi";
import StatsCard from "@/components/admin/StatsCard";
import DashboardChart from "@/components/charts/DashboardChart";
import RecentActivity from "@/components/admin/RecentActivity";
import MetaTags from "@/components/common/MetaTags";
import { pageMetadata } from "@/utils/metadata";
import toast from "react-hot-toast";
import SlotNotificationsModal from "@/components/modals/SlotNotificationsModal";

export default function AdminDashboard() {
  const router = useRouter();
  const { get } = useApi();
  const [stats, setStats] = useState({});
  const [doctorStats, setDoctorStats] = useState([]);
  const [registrationStats, setRegistrationStats] = useState([]);
  const [bookingStats, setBookingStats] = useState([]);
  const [departmentStats, setDepartmentStats] = useState([]);
  const [period, setPeriod] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const normalizeBookingStats = (payload) => {
    const raw =
      payload?.data?.data?.bookingStats ||
      payload?.data?.bookingStats ||
      payload?.bookingStats ||
      [];

    if (!Array.isArray(raw)) return [];

    return raw.map((item) => {
      const statusMap = Array.isArray(item.bookings)
        ? item.bookings.reduce((acc, entry) => {
            if (entry?.status) acc[entry.status] = entry.count || 0;
            return acc;
          }, {})
        : {};

      const label = item.date || item._id || item.label;

      return {
        ...item,
        _id: label,
        date: label,
        total: item.total || 0,
        pending: item.pending ?? statusMap.pending ?? 0,
        confirmed: item.confirmed ?? statusMap.confirmed ?? 0,
        cancelled: item.cancelled ?? statusMap.cancelled ?? 0,
        completed: item.completed ?? statusMap.completed ?? 0,
        no_show: item.no_show ?? statusMap.no_show ?? 0,
      };
    });
  };

  const fetchNotificationCount = useCallback(async () => {
    try {
      const response = await get("/dashboard/slot-notifications", {
        silent: true,
      });
      const data = response.data?.data || response.data || {};
      const notifications = data.notifications || [];
      setNotificationCount(notifications.length);
    } catch (error) {
      // Silently fail for notification count
      setNotificationCount(0);
    }
  }, [get]);

  useEffect(() => {
    fetchData();
    fetchNotificationCount();
  }, [period, fetchNotificationCount]);

  // Fetch notification count periodically
  useEffect(() => {
    fetchNotificationCount(); // Initial fetch
    const interval = setInterval(() => {
      fetchNotificationCount();
    }, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, [fetchNotificationCount]);

  const fetchData = async () => {
    setLoading(true);
    setErrors({});

    try {
      // Fetch all data with individual error handling
      const results = await Promise.allSettled([
        get(`/dashboard/stats?period=${period}`)
          .then((res) => ({ type: "stats", data: res }))
          .catch((err) => ({ type: "stats", error: err })),
        get(`/dashboard/doctors?period=${period}`)
          .then((res) => ({ type: "doctors", data: res }))
          .catch((err) => ({ type: "doctors", error: err })),
        get(`/dashboard/registrations?period=${period}`)
          .then((res) => ({ type: "registrations", data: res }))
          .catch((err) => ({ type: "registrations", error: err })),
        get(`/dashboard/bookings?period=${period}`)
          .then((res) => ({ type: "bookings", data: res }))
          .catch((err) => ({ type: "bookings", error: err })),
        get("/dashboard/departments")
          .then((res) => ({ type: "departments", data: res }))
          .catch((err) => ({ type: "departments", error: err })),
      ]);

      // Process results and handle errors individually
      const newErrors = {};
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          const { type, data, error } = result.value;

          if (error) {
            // Handle API error response
            newErrors[type] = `API Error: ${error.message || "Unknown error"}`;
            return;
          }

          // Process successful data
          switch (type) {
            case "stats":
              const statsData = data.data?.data || data.data || {};
              setStats(statsData);
              break;
            case "doctors":
              const doctorData =
                data.data?.data?.doctorStats || data.data?.doctorStats || [];
              setDoctorStats(doctorData);
              break;
            case "registrations":
              const registrationData =
                data.data?.data?.registrationStats ||
                data.data?.registrationStats ||
                [];
              setRegistrationStats(registrationData);
              break;
            case "bookings":
              setBookingStats(normalizeBookingStats(data));
              break;
            case "departments":
              const departmentData =
                data.data?.data?.departments || data.data?.departments || [];
              setDepartmentStats(departmentData);
              break;
          }
        } else {
          // Handle promise rejection
          const { type, error } = result.reason;
          newErrors[type] = `Network Error: ${
            error.message || "Failed to connect"
          }`;
        }
      });

      // Set errors after processing all results
      setErrors(newErrors);

      // Set last updated time
      setLastUpdated(new Date());

      // Show success message based on errors
      const hasErrors = Object.keys(newErrors).length > 0;
      if (!hasErrors) {
        toast.success(
          `Dashboard data updated successfully for ${period} period`,
        );
      } else {
        const errorCount = Object.keys(newErrors).length;
        const successCount = 5 - errorCount;
        toast.success(
          `${successCount} out of 5 data sources loaded successfully`,
        );
        if (errorCount > 0) {
          toast.error(`${errorCount} data sources failed to load`);
        }
      }
    } catch (err) {
      toast.error("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const retryData = async (type) => {
    try {
      let endpoint;
      switch (type) {
        case "stats":
          endpoint = `/dashboard/stats?period=${period}`;
          break;
        case "doctors":
          endpoint = `/dashboard/doctors?period=${period}`;
          break;
        case "registrations":
          endpoint = `/dashboard/registrations?period=${period}`;
          break;
        case "bookings":
          endpoint = `/dashboard/bookings?period=${period}`;
          break;
        case "departments":
          endpoint = "/dashboard/departments";
          break;
        default:
          return;
      }

      const response = await get(endpoint);

      // Process successful data
      switch (type) {
        case "stats":
          const statsData = response.data?.data || response.data || {};
          setStats(statsData);
          break;
        case "doctors":
          const doctorData =
            response.data?.data?.doctorStats ||
            response.data?.doctorStats ||
            [];
          setDoctorStats(doctorData);
          break;
        case "registrations":
          const registrationData =
            response.data?.data?.registrationStats ||
            response.data?.registrationStats ||
            [];
          setRegistrationStats(registrationData);
          break;
        case "bookings":
          setBookingStats(normalizeBookingStats(response));
          break;
        case "departments":
          const departmentData =
            response.data?.data?.departments ||
            response.data?.departments ||
            [];
          setDepartmentStats(departmentData);
          break;
      }

      // Clear error for this type
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[type];
        return newErrors;
      });

      toast.success(
        `${
          type.charAt(0).toUpperCase() + type.slice(1)
        } data refreshed successfully`,
      );
    } catch (err) {
      toast.error(`Failed to refresh ${type} data`);
    }
  };

  const statsCards = [
    {
      title: "Total Doctors",
      value: errors.doctors ? "Unavailable" : stats.totalDoctors || 0,
      icon: Stethoscope,
      color: "bg-blue-500",
      href: "/admin/doctors",
      growth: errors.doctors ? null : stats.growth?.doctors || 0,
      periodStats: errors.doctors ? null : stats.periodStats?.doctors || 0,
      hasError: !!errors.doctors,
      errorType: "doctors",
    },
    {
      title: "Total Clinics",
      value: errors.stats ? "Unavailable" : stats.totalClinics || 0,
      icon: Building2,
      color: "bg-green-500",
      href: "/admin/clinics",
      growth: errors.stats ? null : stats.growth?.clinics || 0,
      periodStats: errors.stats ? null : stats.periodStats?.clinics || 0,
      hasError: !!errors.stats,
      errorType: "stats",
    },
    // {
    //   title: "Total Pharmacies",
    //   value: errors.stats ? "Unavailable" : stats.totalPharmacies || 0,
    //   icon: Pill,
    //   color: "bg-purple-500",
    //   href: "/admin/pharmacies",
    //   growth: errors.stats ? null : stats.growth?.pharmacies || 0,
    //   periodStats: errors.stats ? null : stats.periodStats?.pharmacies || 0,
    //   hasError: !!errors.stats,
    //   errorType: "stats",
    // },
    {
      title: "Total Patients",
      value: errors.stats ? "Unavailable" : stats.totalPatients || 0,
      icon: Users,
      color: "bg-orange-500",
      href: "/admin/patients",
      growth: errors.stats ? null : stats.growth?.patients || 0,
      periodStats: errors.stats ? null : stats.periodStats?.patients || 0,
      hasError: !!errors.stats,
      errorType: "stats",
    },
    {
      title: "Total Pathologies",
      value: errors.stats ? "Unavailable" : stats.totalPathologies || 0,
      icon: TestTube,
      color: "bg-red-500",
      href: "/admin/pathology",
      growth: 0,
      periodStats: 0,
      hasError: !!errors.stats,
      errorType: "stats",
    },
    {
      title: "Total Departments",
      value: errors.departments ? "Unavailable" : stats.totalDepartments || 0,
      icon: Building,
      color: "bg-indigo-500",
      href: "/admin/departments",
      growth: 0,
      periodStats: 0,
      hasError: !!errors.departments,
      errorType: "departments",
    },
    {
      title: "Total Ambulances",
      value: errors.stats ? "Unavailable" : stats.totalAmbulances || 0,
      icon: Truck,
      color: "bg-orange-500",
      href: "/admin/ambulances",
      growth: errors.stats ? null : stats.growth?.ambulances || 0,
      periodStats: errors.stats ? null : stats.periodStats?.ambulances || 0,
      hasError: !!errors.stats,
      errorType: "stats",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Loading dashboard data...
            </p>
          </div>
        </div>

        {/* Loading Skeleton for Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="card-body p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading Skeleton for Additional Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="card bg-gray-200 dark:bg-gray-700 animate-pulse"
            >
              <div className="card-body p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </div>
                  <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show error summary at the top if there are any errors, but still display partial data
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <>
      <MetaTags
        title={pageMetadata.admin.title}
        description={pageMetadata.admin.description}
        keywords={pageMetadata.admin.keywords}
      />
      <div className="space-y-8">
        {/* Error Summary Banner */}
        {hasErrors && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Some data sources failed to load
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    {Object.keys(errors).length} out of 5 data sources are
                    unavailable. You can retry individual sources or refresh all
                    data.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.keys(errors).map((type) => (
                  <button
                    key={type}
                    onClick={() => retryData(type)}
                    className="px-3 py-1 text-xs bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700 text-red-700 dark:text-red-300 rounded-full transition-colors flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Retry {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Here's a summary of your healthcare platform with real-time data.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <button
              onClick={() => setShowNotifications(true)}
              className="relative px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors flex items-center gap-2"
            >
              <Bell className="w-4 h-4" />
              Notifications
              {notificationCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {notificationCount > 99 ? "99+" : notificationCount}
                </span>
              )}
            </button>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="input-field min-w-[150px]"
            >
              <option value="weekly">Last 7 days</option>
              <option value="monthly">This month</option>
              <option value="yearly">This year</option>
            </select>
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Loading...
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  Refresh
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsCards.map((card) => (
            <StatsCard key={card.title} {...card} onRetry={retryData} />
          ))}
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-100 mb-1">
                    Total Bookings
                  </p>
                  <p className="text-3xl font-bold">
                    {stats.totalBookings || 0}
                  </p>
                  <p className="text-sm text-blue-200 mt-1">
                    {stats.periodStats?.bookings || 0} this {period}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-blue-400 bg-opacity-30 shadow-lg">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-green-100 mb-1">
                    Completed Bookings
                  </p>
                  <p className="text-3xl font-bold">
                    {stats.completedBookings || 0}
                  </p>
                  <p className="text-sm text-green-200 mt-1">
                    {stats.totalBookings > 0
                      ? Math.round(
                          (stats.completedBookings / stats.totalBookings) * 100,
                        )
                      : 0}
                    % completion rate
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-green-400 bg-opacity-30 shadow-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-yellow-100 mb-1">
                    Pending Bookings
                  </p>
                  <p className="text-3xl font-bold">
                    {stats.pendingBookings || 0}
                  </p>
                  <p className="text-sm text-yellow-200 mt-1">
                    {stats.totalBookings > 0
                      ? Math.round(
                          (stats.pendingBookings / stats.totalBookings) * 100,
                        )
                      : 0}
                    % pending rate
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-yellow-400 bg-opacity-30 shadow-lg">
                  <Clock className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-purple-100 mb-1">
                    Total Users
                  </p>
                  <p className="text-3xl font-bold">{stats.totalUsers || 0}</p>
                  <p className="text-sm text-purple-200 mt-1">
                    {stats.periodStats?.patients || 0} new this {period}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-purple-400 bg-opacity-30 shadow-lg">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Summary */}
        <div className="card bg-gray-50 dark:bg-gray-800">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Data Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">
                  Period:
                </span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white capitalize">
                  {period}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">
                  Last Updated:
                </span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                  {lastUpdated ? lastUpdated.toLocaleTimeString() : "Never"}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">
                  Total Records:
                </span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                  {(stats.totalDoctors || 0) +
                    (stats.totalClinics || 0) +
                    (stats.totalPharmacies || 0) +
                    (stats.totalPatients || 0)}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">
                  Active Status:
                </span>
                <span className="ml-2 font-medium text-green-600 dark:text-green-400">
                  ✓ All Systems Operational
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Doctor Registrations
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                New doctor registrations over time
              </p>
            </div>
            <div className="p-6">
              {doctorStats && doctorStats.length > 0 ? (
                <DashboardChart
                  data={doctorStats}
                  dataKey="count"
                  name="Doctors"
                  color="#3B82F6"
                  type="area"
                />
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No doctor registration data available</p>
                </div>
              )}
            </div>
          </div>
          <div className="card">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                All Registrations
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Platform registrations breakdown
              </p>
            </div>
            <div className="p-6">
              {registrationStats && registrationStats.length > 0 ? (
                <DashboardChart
                  data={registrationStats}
                  dataKey="total"
                  name="Total Registrations"
                  color="#10B981"
                  multiline
                />
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No registration data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Department Stats */}
        {departmentStats?.length > 0 && (
          <div className="card">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Department Overview
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Doctor distribution across departments
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {departmentStats.slice(0, 6).map((dept) => (
                  <div
                    key={dept._id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-blue-200 dark:border-gray-600 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                        {dept.heading || dept.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {dept.doctorCount || 0} doctors
                      </p>
                    </div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 ml-4">
                      {dept.doctorCount || 0}
                    </div>
                  </div>
                ))}
              </div>
              {departmentStats.length > 6 && (
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing 6 of {departmentStats.length} departments
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bookings Chart */}
        <div className="card">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Appointment Bookings
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Booking trends and status distribution
            </p>
          </div>
          <div className="p-6">
            {bookingStats && bookingStats.length > 0 ? (
              <DashboardChart
                data={bookingStats}
                dataKey="total"
                name="Bookings"
                color="#6366F1"
              />
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No booking data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Latest platform activities and updates
            </p>
          </div>
          <div className="p-6">
            <RecentActivity />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-6">
          <button
            onClick={() => router.push("/admin/doctors")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Stethoscope className="w-5 h-5" />
            Manage Doctors
          </button>
          <button
            onClick={() => router.push("/admin/departments")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            <Building className="w-5 h-5" />
            Manage Departments
          </button>
          <button
            onClick={() => router.push("/admin/clinics")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Building2 className="w-5 h-5" />
            Manage Clinics
          </button>
        </div>
      </div>

      {/* Slot Notifications Modal */}
      <SlotNotificationsModal
        isOpen={showNotifications}
        onClose={() => {
          setShowNotifications(false);
          fetchNotificationCount(); // Refresh count when modal closes
        }}
      />
    </>
  );
}
