"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import BookingModal from "@/components/modals/BookingModal";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import toast from "react-hot-toast";

export default function BookingDirectPage() {
  const { doctorId } = useParams();
  const router = useRouter();
  const { get } = useApi();
  const [doctor, setDoctor] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDoctor();
  }, []);

  const fetchDoctor = async () => {
    try {
      const res = await get(`/doctors/${doctorId}`);
      const doctorData = res.data?.data || res.data;
      setDoctor(doctorData);
    } catch (e) {
      setError("Doctor not found");
      toast.error("Unable to fetch doctor");
    }
  };

  if (error) return <p className="text-center mt-24">{error}</p>;
  if (!doctor) return <LoadingSpinner text="Loading Doctor..." />;

  return (
    <BookingModal
      doctor={doctor}
      isOpen={true}
      onClose={() => router.push(`/`)} // Change navigation to home on close
    />
  );
}
