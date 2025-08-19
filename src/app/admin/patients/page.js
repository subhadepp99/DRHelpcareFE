"use client";

import { useState, useEffect } from "react";
import { useApi } from "@/hooks/api";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast"; // Import toast

export default function AdminPatientsPage() {
  const { user } = useAuthStore();
  const { get } = useApi();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user.role === "admin" || user.role === "superuser") {
      fetchPatients();
    }
  }, [user]);

  async function fetchPatients() {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const res = await get("/patients");
      setPatients(res.data?.patients || []);
    } catch (err) {
      console.error("Failed to fetch patients:", err);
      toast.error("Failed to fetch patients.");
      setError("Failed to load patient data.");
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }

  if (user.role !== "admin" && user.role !== "superuser") {
    return (
      <div className="p-8 text-xl font-bold text-center text-gray-600 dark:text-gray-400">
        Access Denied
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
    <div>
      <h1 className="text-xl font-bold mb-3">
        Patient Registrations (Basic AppUsers)
      </h1>
      {loading ? (
        <p>Loading...</p>
      ) : patients.length === 0 ? (
        <p className="text-center text-gray-500">No patients found.</p>
      ) : (
        <table className="w-full border-collapse border mb-8">
          <thead>
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Date Registered</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p._id}>
                <td className="border p-2">
                  {p.firstName} {p.lastName}
                </td>
                <td className="border p-2">{p.email}</td>
                <td className="border p-2">{p.phone}</td>
                <td className="border p-2">
                  {new Date(p.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
