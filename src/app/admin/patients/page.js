"use client";

import { useState, useEffect } from "react";
import { useApi } from "@/hooks/api";
import { useAuthStore } from "@/store/authStore";

export default function AdminPatientsPage() {
  const { user } = useAuthStore();
  const { get } = useApi();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user.role === "admin" || user.role === "superuser") {
      fetchPatients();
    }
  }, [user]);

  async function fetchPatients() {
    setLoading(true);
    try {
      const res = await get("/patients");
      setPatients(res.data?.patients || []);
    } catch {
      setPatients([]);
    }
    setLoading(false);
  }

  if (user.role !== "admin" && user.role !== "superuser") {
    return (
      <div className="p-8 text-xl font-bold text-center text-gray-600">
        Access Denied
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
