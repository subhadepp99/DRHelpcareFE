"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useApi } from "@/hooks/api";
import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";
import Head from "next/head";

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
        const payload = res?.data;
        const normalized = payload?.data || payload?.doctor || payload || null;
        setDoctor(normalized);
      } catch (err) {
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading)
    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-6">
          <p>Loading...</p>
        </div>
        <Footer />
      </>
    );
  if (!doctor)
    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-6">
          <p>Doctor not found.</p>
        </div>
        <Footer />
      </>
    );

  // Safely get initials
  const initials =
    [doctor.firstName?.charAt(0) ?? "", doctor.lastName?.charAt(0) ?? ""]
      .join("")
      .toUpperCase() || "D";

  // Helper to get image src safely
  const getImageSrc = () => {
    // First check imageUrl (preferred)
    if (doctor.imageUrl) {
      if (
        typeof doctor.imageUrl === "string" &&
        doctor.imageUrl.startsWith("http")
      )
        return doctor.imageUrl;
      if (
        typeof doctor.imageUrl === "string" &&
        doctor.imageUrl.startsWith("data:image/")
      )
        return doctor.imageUrl;
      if (
        typeof doctor.imageUrl === "string" &&
        doctor.imageUrl.startsWith("/uploads/")
      )
        return `${process.env.NEXT_PUBLIC_API_URL}${doctor.imageUrl}`;
    }

    // Fallback to image field
    if (doctor.image) {
      if (typeof doctor.image === "string" && doctor.image.startsWith("http"))
        return doctor.image;
      if (
        typeof doctor.image === "string" &&
        doctor.image.startsWith("data:image/")
      )
        return doctor.image;
      if (
        typeof doctor.image === "string" &&
        doctor.image.startsWith("/uploads/")
      )
        return `${process.env.NEXT_PUBLIC_API_URL}${doctor.image}`;
    }

    return undefined;
  };

  return (
    <>
      <Head>
        <title>{`Dr. ${
          doctor.name || `${doctor.firstName || ""} ${doctor.lastName || ""}`
        }`}</title>
        <meta
          name="description"
          content={`Book an appointment with Dr. ${
            doctor.name || doctor.firstName || ""
          }. Department: ${doctor.department || "Doctor"}.`}
        />
      </Head>
      <Header />
      {/* Breadcrumb Navigation */}
      <nav
        className="text-sm text-gray-500 dark:text-gray-400 py-4 px-4 max-w-4xl mx-auto"
        aria-label="Breadcrumb"
      >
        <ol className="list-reset flex">
          <li>
            <a href="/" className="hover:text-primary-600">
              Home
            </a>
            <span className="mx-2">/</span>
          </li>
          <li>
            <a href="/search?type=doctors" className="hover:text-primary-600">
              Doctors
            </a>
            <span className="mx-2">/</span>
          </li>
          <li>
            <span
              className="text-primary-600 font-semibold truncate max-w-xs"
              title={
                doctor.name ||
                `${doctor.firstName || ""} ${doctor.lastName || ""}` ||
                "Unknown Doctor"
              }
            >
              {doctor.name ||
                `${doctor.firstName || ""} ${doctor.lastName || ""}` ||
                "Unknown Doctor"}
            </span>
          </li>
        </ol>
        <div className="mt-2">
          <a
            href="/search?type=doctors"
            className="text-primary-600 hover:underline"
          >
            ← Back to Search
          </a>
        </div>
      </nav>
      <div className="min-h-[70vh] flex flex-col justify-between max-w-4xl mx-auto px-4 py-6">
        <div>
          <div className="flex items-center space-x-6 flex-wrap">
            <div className="relative flex flex-col items-center">
              {getImageSrc() ? (
                <img
                  src={getImageSrc()}
                  alt={
                    doctor.name ||
                    `${doctor.firstName || ""} ${doctor.lastName || ""}` ||
                    "Doctor"
                  }
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary-600"
                />
              ) : (
                <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-4xl">
                  {initials}
                </div>
              )}
              {/* Small Call/WhatsApp Buttons */}
              <div className="flex flex-col items-center gap-2 mt-2">
                {doctor.phone && (
                  <a
                    href={`tel:${doctor.phone}`}
                    className="inline-flex items-center px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition"
                  >
                    Call
                  </a>
                )}
                {doctor.phone && (
                  <a
                    href={`https://wa.me/${doctor.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {doctor.name ||
                  `${doctor.firstName || ""} ${doctor.lastName || ""}` ||
                  "Unknown Doctor"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {doctor.specialization || "Specialist"}
              </p>
              <p className="mb-2">{doctor.qualification || ""}</p>
              <p>Experience: {doctor.experience || 0} years</p>
              <p>Consultation Fee: ₹{doctor.consultationFee || 0}</p>
              <p>Email: {doctor.email || "N/A"}</p>
              <p>Phone: {doctor.phone || "N/A"}</p>
              {doctor.address && (
                <p>
                  Address:{" "}
                  {typeof doctor.address === "string"
                    ? doctor.address
                    : doctor.address.fullAddress ||
                      `${doctor.address.city || ""} ${
                        doctor.address.state || ""
                      }`}
                </p>
              )}
              {doctor.bio && <p className="mt-2 text-gray-700">{doctor.bio}</p>}
            </div>
          </div>

          {/* Booking Section */}
          <div className="mt-10 flex flex-col md:flex-row md:items-center md:space-x-8 space-y-4 md:space-y-0">
            <a
              href={`/booking/${doctor._id}`}
              className="flex-1 btn-primary text-sm px-5 py-2.5 rounded-lg font-semibold shadow hover:shadow-lg transition w-full md:w-auto text-center inline-flex items-center justify-center"
            >
              <span className="flex items-center justify-center">Book Now</span>
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
