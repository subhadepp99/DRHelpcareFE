"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import { useApi } from "@/hooks/useApi";
import StatsCard from "@/components/admin/StatsCard";
import DashboardChart from "@/components/charts/DashboardChart";
import RecentActivity from "@/components/admin/RecentActivity";
import toast from "react-hot-toast";

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
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, doctorRes, regRes, bookRes, deptRes] = await Promise.all(
        [
          get(`/dashboard/stats?period=${period}`),
          get(`/dashboard/doctors?period=${period}`),
          get(`/dashboard/registrations?period=${period}`),
          get(`/dashboard/bookings?period=${period}`),
          get("/dashboard/departments"),
        ]
      );

      // Handle the nested API response structure
      const statsData = statsRes.data?.data || statsRes.data || {};
      const doctorData =
        doctorRes.data?.data?.doctorStats || doctorRes.data?.doctorStats || [];
      const registrationData =
        regRes.data?.data?.registrationStats ||
        regRes.data?.registrationStats ||
        [];
      const bookingData =
        bookRes.data?.data?.bookingStats || bookRes.data?.bookingStats || [];
      const departmentData =
        deptRes.data?.data?.departments || deptRes.data?.departments || [];

      setStats(statsData);
      setDoctorStats(doctorData);
      setRegistrationStats(registrationData);
      setBookingStats(bookingData);
      setDepartmentStats(departmentData);

      // Set last updated time
      setLastUpdated(new Date());

      // Show success message
      toast.success(`Dashboard data updated successfully for ${period} period`);
    } catch (err) {
      setError("Failed to load dashboard data.");
      toast.error("Failed to load dashboard data. Please try again.");
      console.error("Dashboard data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Total Doctors",
      value: stats.totalDoctors || 0,
      icon: Stethoscope,
      color: "bg-blue-500",
      href: "/admin/doctors",
      growth: stats.growth?.doctors || 0,
      periodStats: stats.periodStats?.doctors || 0,
    },
    {
      title: "Total Clinics",
      value: stats.totalClinics || 0,
      icon: Building2,
      color: "bg-green-500",
      href: "/admin/clinics",
      growth: stats.growth?.clinics || 0,
      periodStats: stats.periodStats?.clinics || 0,
    },
    {
      title: "Total Pharmacies",
      value: stats.totalPharmacies || 0,
      icon: Pill,
      color: "bg-purple-500",
      href: "/admin/pharmacies",
      growth: stats.growth?.pharmacies || 0,
      periodStats: stats.periodStats?.pharmacies || 0,
    },
    {
      title: "Total Patients",
      value: stats.totalPatients || 0,
      icon: Users,
      color: "bg-orange-500",
      href: "/admin/patients",
      growth: stats.growth?.patients || 0,
      periodStats: stats.periodStats?.patients || 0,
    },
    {
      title: "Total Pathologies",
      value: stats.totalPathologies || 0,
      icon: TestTube,
      color: "bg-red-500",
      href: "/admin/pathology",
      growth: 0, // Add growth calculation when available
      periodStats: 0, // Add period stats when available
    },
    {
      title: "Total Departments",
      value: stats.totalDepartments || 0,
      icon: Building,
      color: "bg-indigo-500",
      href: "/admin/departments",
      growth: 0, // Add growth calculation when available
      periodStats: 0, // Add period stats when available
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

  if (error) {
    return (
      <div className="text-center mt-12 text-red-600 dark:text-red-400">
        <p>{error}</p>
        <button
          onClick={fetchData}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
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
          <div
            key={card.title}
            onClick={() => router.push(card.href)}
            className="cursor-pointer transform transition-transform hover:scale-105 h-full"
          >
            <StatsCard {...card} />
          </div>
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
                <p className="text-3xl font-bold">{stats.totalBookings || 0}</p>
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
                        (stats.completedBookings / stats.totalBookings) * 100
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
                        (stats.pendingBookings / stats.totalBookings) * 100
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
              <span className="text-gray-600 dark:text-gray-400">Period:</span>
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
              multiline
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
  );
}
