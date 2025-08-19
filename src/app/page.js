"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Stethoscope,
  Building2,
  Pill,
  Users,
  User,
  Heart,
  Phone,
  Mail,
  Smartphone,
  Download,
  Apple,
  PlayCircle,
  WhatsappIcon,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchSection from "@/components/common/SearchSection";
import ServiceCard from "@/components/cards/ServiceCard";
import DoctorCard from "@/components/cards/DoctorCard";
import DepartmentCard from "@/components/cards/DepartmentCard";
import AppointmentModal from "@/components/common/AppointmentModal";
import { useLocation } from "@/hooks/useLocation";
import { useApi } from "@/hooks/useApi";
import { useAuthStore } from "@/store/authStore";

export default function HomePage() {
  const router = useRouter();
  const {
    location,
    requestLocation,
    isLoading: locationLoading,
  } = useLocation();
  const { get } = useApi();
  const { isAuthenticated } = useAuthStore();
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all"); // Default to 'all'
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    fetchFeaturedDoctors();
    fetchDepartments();
  }, []);

  const fetchFeaturedDoctors = async () => {
    try {
      const response = await get("/doctors?limit=6");
      const doctors =
        response?.data?.data?.doctors || response?.data?.doctors || [];
      setFeaturedDoctors(doctors);
    } catch (error) {
      console.error("Error fetching featured doctors:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await get("/department"); // departments contain pic, details, heading, and linked doctors
      setDepartments(response.data.departments || []);
    } catch (error) {
      setDepartments([]);
    }
  };

  const handleSearch = ({ selectedLocation } = {}) => {
    const hasQuery = !!searchQuery.trim();
    const hasLocation = !!selectedLocation?.trim();
    if (!hasQuery && !hasLocation) return;
    const queryParams = new URLSearchParams({ type: searchType });
    if (hasQuery) queryParams.set("q", searchQuery);
    if (hasLocation) queryParams.set("city", selectedLocation);
    router.push(`/search?${queryParams.toString()}`);
  };

  // Handle opening appointment booking modal

  function bookAppointment(doctor) {
    setSelectedDoctor(doctor);
    setAppointmentModalOpen(true);
  }

  const services = [
    {
      icon: Stethoscope,
      title: "Find Doctors",
      description: "Book appointments with qualified doctors",
      color: "bg-primary-500",
      href: "/search?type=doctors",
    },
    {
      icon: Building2,
      title: "Find Clinics",
      description: "Locate nearby clinics and hospitals",
      color: "bg-green-500",
      href: "/search?type=clinics",
    },
    {
      icon: Pill,
      title: "Find Pharmacies",
      description: "Locate pharmacies for medicines",
      color: "bg-purple-500",
      href: "/search?type=pharmacies",
    },
    {
      icon: Users,
      title: "Health Records",
      description: "Manage your health records",
      color: "bg-orange-500",
      href: isAuthenticated ? "/profile" : "/login",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 relative">
      <Header />

      {/* Hero Section */}
      <section className="relative z-40 overflow-hidden pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center relative z-50"
          >
            {/* <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Your Health, Our{" "}
              <span className="text-primary-600">Priority</span>
            </h1> */}
            {/* Subtitle removed as requested */}

            {/* Enhanced Search Section */}
            <SearchSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchType={searchType}
              setSearchType={setSearchType}
              onSearch={handleSearch}
            />
          </motion.div>
        </div>
      </section>

      {/* Department Section - Scrollable Cards */}
      {departments.length > 0 && (
        <section className="py-8 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Departments
            </h2>

            <div className="overflow-x-auto scrollbar-hide pb-2">
              <div className="flex gap-6 min-w-fit">
                {departments.map((dept) => (
                  <DepartmentCard key={dept._id} department={dept} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services Section with Better Padding */}
      <section className="py-12 bg-white dark:bg-gray-800">
        {/* <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Our Services
          </h2>

          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Comprehensive healthcare services at your fingertips
          </p>
        </div> */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Services
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive healthcare services at your fingertips
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ServiceCard {...service} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Doctors with Ratings */}
      {featuredDoctors.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Featured Doctors
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Top-rated doctors in your area
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredDoctors.map((doctor, index) => (
                <motion.div
                  key={doctor._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <DoctorCard
                    doctor={doctor}
                    showRating={true}
                    onBook={() => bookAppointment(doctor)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Appointment Modal (popup from right side) */}
      {appointmentModalOpen && (
        <AppointmentModal
          doctor={selectedDoctor}
          onClose={() => setAppointmentModalOpen(false)}
        />
      )}

      {/* Floating Call & WhatsApp Buttons (global) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 items-end">
        <a
          href="https://wa.me/919674243119"
          className="inline-flex items-center px-4 py-3 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition"
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>
        <a
          href="tel:+919674243119"
          className="inline-flex items-center px-4 py-3 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition"
        >
          Call Us
        </a>
      </div>

      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* App Coming Soon Banner */}
          <div className="py-8 border-b border-gray-800">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Smartphone className="w-8 h-8 text-primary-400" />
                <h3 className="text-2xl font-bold text-white">
                  Mobile Apps Coming Soon!
                </h3>
              </div>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Take your healthcare experience on the go. Our mobile apps will
                be available soon on iOS and Android platforms.
              </p>

              {/* App Store Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                {/* iOS App Store Button */}
                <div className="flex items-center space-x-3 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 px-6 py-3 rounded-lg border border-gray-600 transition-all duration-300 cursor-not-allowed opacity-75">
                  <Apple className="w-8 h-8 text-white" />
                  <div className="text-left">
                    <div className="text-xs text-gray-300">Coming Soon on</div>
                    <div className="text-lg font-semibold text-white">
                      App Store
                    </div>
                  </div>
                </div>

                {/* Google Play Store Button */}
                <div className="flex items-center space-x-3 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 px-6 py-3 rounded-lg border border-gray-600 transition-all duration-300 cursor-not-allowed opacity-75">
                  <PlayCircle className="w-8 h-8 text-white" />
                  <div className="text-left">
                    <div className="text-xs text-gray-300">Coming Soon on</div>
                    <div className="text-lg font-semibold text-white">
                      Google Play
                    </div>
                  </div>
                </div>
              </div>

              {/* Notify Me Button */}
              <div className="mt-6">
                <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 mx-auto">
                  <Download className="w-5 h-5" />
                  <span>Notify Me When Available</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <div className="pb-32" />

      <Footer />
    </div>
  );
}
