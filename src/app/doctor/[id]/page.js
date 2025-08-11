"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useApi } from "@/hooks/api";

export default function DoctorProfilePage() {
  const { id } = useParams();
  const { get } = useApi();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function fetchDoctor() {
      setLoading(true);
      try {
        const res = await get(`/doctors/${id}`);
        setDoctor(res.data || null);
      } catch {
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctor();
  }, [id, get]);

  if (loading) return <p>Loading...</p>;
  if (!doctor) return <p>Doctor not found.</p>;

  // Safely get initials
  const initials =
    [doctor.firstName?.charAt(0) ?? "", doctor.lastName?.charAt(0) ?? ""]
      .join("")
      .toUpperCase() || "D";

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center space-x-6">
        <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-4xl">
          {initials}
        </div>
        <div>
          <h1 className="text-3xl font-bold">
            {doctor.name || "Unknown Doctor"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {doctor.specialization}
          </p>
          <p>{doctor.qualification}</p>
          <p>Experience: {doctor.experience} years</p>
          <p>Consultation Fee: ${doctor.consultationFee}</p>
          <p>Email: {doctor.email}</p>
          <p>Phone: {doctor.phone}</p>
        </div>
      </div>
      {/* Add more detailed profile info as needed */}
    </div>
  );
}
