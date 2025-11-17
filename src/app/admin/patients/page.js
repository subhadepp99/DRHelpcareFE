"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import {
  Search,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Activity,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

export default function PatientsPage() {
  const { get } = useApi();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("lastActivity");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await get("/patients?sort=lastActivity&order=desc");
      setPatients(response.data.patients || []);
    } catch (error) {
      toast.error("Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  };

  const getLastActivity = (patient) => {
    if (patient.lastActivity) {
      return new Date(patient.lastActivity).toLocaleDateString();
    }
    if (patient.lastAppointment) {
      return new Date(patient.lastAppointment).toLocaleDateString();
    }
    if (patient.createdAt) {
      return new Date(patient.createdAt).toLocaleDateString();
    }
    return "Never";
  };

  const getLastActivityTime = (patient) => {
    if (patient.lastActivity) {
      return new Date(patient.lastActivity).getTime();
    }
    if (patient.lastAppointment) {
      return new Date(patient.lastAppointment).getTime();
    }
    if (patient.createdAt) {
      return new Date(patient.createdAt).getTime();
    }
    return 0;
  };

  const sortedPatients = [...patients].sort((a, b) => {
    if (sortBy === "lastActivity") {
      return getLastActivityTime(b) - getLastActivityTime(a);
    }
    if (sortBy === "name") {
      return (a.firstName + " " + a.lastName).localeCompare(
        b.firstName + " " + b.lastName
      );
    }
    if (sortBy === "createdAt") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  const filteredPatients = sortedPatients.filter(
    (patient) =>
      patient.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone?.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-100px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Patient Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View and manage patient information
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field min-w-[150px]"
          >
            <option value="lastActivity">Last Activity</option>
            <option value="name">Name</option>
            <option value="createdAt">Registration Date</option>
          </select>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search patients by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
        />
        {searchTerm ? (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-body p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Patients
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {patients.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active This Month
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {
                    patients.filter((p) => {
                      const lastActivity = getLastActivityTime(p);
                      const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
                      return lastActivity > monthAgo;
                    }).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
                <Calendar className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  New This Month
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {
                    patients.filter((p) => {
                      const createdAt = new Date(p.createdAt);
                      const monthAgo = new Date();
                      monthAgo.setMonth(monthAgo.getMonth() - 1);
                      return createdAt > monthAgo;
                    }).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Inactive Patients
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {
                    patients.filter((p) => {
                      const lastActivity = getLastActivityTime(p);
                      const threeMonthsAgo =
                        Date.now() - 90 * 24 * 60 * 60 * 1000;
                      return lastActivity < threeMonthsAgo;
                    }).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Patients Table */}
      <div className="card">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Last Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPatients.map((patient) => (
                  <tr
                    key={patient._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <User className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {patient.firstName} {patient.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {patient._id.slice(-8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900 dark:text-white">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {patient.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {patient.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900 dark:text-white">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        {patient.address?.city || patient.city || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {patient.address?.state || patient.state || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {getLastActivity(patient)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          getLastActivityTime(patient) >
                          Date.now() - 30 * 24 * 60 * 60 * 1000
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : getLastActivityTime(patient) >
                              Date.now() - 90 * 24 * 60 * 60 * 1000
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {getLastActivityTime(patient) >
                        Date.now() - 30 * 24 * 60 * 60 * 1000
                          ? "Active"
                          : getLastActivityTime(patient) >
                            Date.now() - 90 * 24 * 60 * 60 * 1000
                          ? "Moderate"
                          : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            No patients found
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm
              ? "Try adjusting your search terms."
              : "Get started by adding a new patient."}
          </p>
        </div>
      )}
    </div>
  );
}
