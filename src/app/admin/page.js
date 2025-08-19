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
  const [period, setPeriod] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const statsRes = await get("/dashboard/stats");
      const doctorRes = await get(`/dashboard/doctors?period=${period}`);
      const regRes = await get(`/dashboard/registrations?period=${period}`);
      const bookRes = await get(`/dashboard/bookings?period=${period}`);
      setStats(statsRes.data);
      setDoctorStats(doctorRes.data.doctorStats);
      setRegistrationStats(regRes.data.registrationStats);
      setBookingStats(bookRes.data.bookingStats);
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
      value: stats.totalDoctors,
      icon: Stethoscope,
      color: "bg-blue-500",
      href: "/admin/doctors",
    },
    {
      title: "Total Clinics",
      value: stats.totalClinics,
      icon: Building2,
      color: "bg-green-500",
      href: "/admin/clinics",
    },
    {
      title: "Total Pharmacies",
      value: stats.totalPharmacies,
      icon: Pill,
      color: "bg-purple-500",
      href: "/admin/pharmacies",
    },
    {
      title: "Total Patients",
      value: stats.totalPatients,
      icon: Users,
      color: "bg-orange-500",
      href: "/admin/patients",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-100px)]">
        <p className="text-gray-500 dark:text-gray-400">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-12 text-red-600 dark:text-red-400">
        <p>{error}</p>
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
            Here’s a summary of your healthcare platform.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="input-field min-w-[150px]"
          >
            <option value="weekly">Last 7 days</option>
            <option value="monthly">This month</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card) => (
          <div
            key={card.title}
            onClick={() => router.push(card.href)}
            className="cursor-pointer"
          >
            <StatsCard {...card} />
          </div>
        ))}
      </div>
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
            <DashboardChart
              data={doctorStats}
              dataKey="count"
              name="Doctors"
              color="#3B82F6"
              type="area"
            />
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
            <DashboardChart
              data={registrationStats}
              dataKey="total"
              name="Total Registrations"
              color="#10B981"
              multiline
            />
          </div>
        </div>
      </div>
      <div className="card">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Appointment Bookings
          </h3>
        </div>
        <div className="p-6">
          <DashboardChart
            data={bookingStats}
            dataKey="total"
            name="Bookings"
            color="#6366F1"
            multiline
          />
        </div>
      </div>
      <div className="card">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h3>
        </div>
        <div className="p-6">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
