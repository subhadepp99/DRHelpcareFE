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
  TestTube,
  Truck,
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
import Image from "next/image";

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
  const [testPackages, setTestPackages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all"); // Default to 'all'
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchFeaturedDoctors();
    fetchDepartments();
    fetchTestPackages();
  }, []);

  // Auto-slide for cards
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(
        (prev) => (prev + 1) % Math.ceil(featuredDoctors.length / 4)
      );
    }, 10000);
    return () => clearInterval(interval);
  }, [featuredDoctors.length]);

  const fetchFeaturedDoctors = async () => {
    try {
      const response = await get("/doctors?limit=8");
      const doctors =
        response?.data?.data?.doctors || response?.data?.doctors || [];
      setFeaturedDoctors(doctors);
    } catch (error) {
      console.error("Error fetching featured doctors:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await get("/departments/public"); // departments contain pic, details, heading, and linked doctors
      setDepartments(response.data.departments || []);
    } catch (error) {
      setDepartments([]);
    }
  };

  const fetchTestPackages = async () => {
    try {
      const response = await get("/pathology/test-packages");
      setTestPackages(response.data?.testPackages || []);
    } catch (error) {
      console.error("Error fetching test packages:", error);
      setTestPackages([]);
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
      icon: TestTube,
      title: "Pathology Tests",
      description: "Book diagnostic tests and health packages",
      color: "bg-red-500",
      href: "/pathology",
    },
  ];

  const getDiscountPercentage = (originalPrice, discountedPrice) => {
    if (!originalPrice || !discountedPrice) return 0;
    return Math.round(
      ((originalPrice - discountedPrice) / originalPrice) * 100
    );
  };

  const handleCall = (phoneNumber = "+919674243119") => {
    window.open(`tel:${phoneNumber}`, "_blank");
  };

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
              Our Departments
            </h2>

            <div className="overflow-x-auto scrollbar-hide pb-2">
              <div className="flex gap-4 min-w-fit">
                {departments.map((dept) => (
                  <DepartmentCard key={dept._id} department={dept} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Health Packages Section */}
      {testPackages.length > 0 && (
        <section className="py-12 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Featured Health Packages
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Comprehensive health screening packages at affordable prices
              </p>
            </motion.div>

            <div className="overflow-x-auto scrollbar-hide pb-4">
              <div className="flex space-x-6 min-w-fit">
                {testPackages.map((pkg, index) => (
                  <motion.div
                    key={pkg._id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex-none w-72 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                  >
                    <div className="relative h-40 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-900">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <TestTube className="w-16 h-16 text-primary-600 dark:text-primary-400" />
                      </div>
                      {pkg.discountedPrice &&
                        pkg.discountedPrice < pkg.price && (
                          <div className="absolute top-4 right-4">
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                              {getDiscountPercentage(
                                pkg.price,
                                pkg.discountedPrice
                              )}
                              % OFF
                            </span>
                          </div>
                        )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {pkg.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm line-clamp-2">
                        {pkg.description}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                            ₹{pkg.discountedPrice || pkg.price}
                          </span>
                          {pkg.discountedPrice &&
                            pkg.discountedPrice < pkg.price && (
                              <span className="text-lg text-gray-500 line-through">
                                ₹{pkg.price}
                              </span>
                            )}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {pkg.category}
                        </span>
                      </div>
                      <button
                        onClick={() => router.push("/pathology")}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <span>View Details</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services Section with Better Padding */}
      <section className="py-12 bg-white dark:bg-gray-800">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Featured Doctors with Auto-slider */}
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

            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-1000 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                <div className="flex gap-4 min-w-full">
                  {featuredDoctors.slice(0, 4).map((doctor, index) => (
                    <motion.div
                      key={doctor._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="flex-none w-80"
                    >
                      <DoctorCard
                        doctor={doctor}
                        showRating={true}
                        onBook={() => bookAppointment(doctor)}
                      />
                    </motion.div>
                  ))}
                </div>
                {featuredDoctors.length > 4 && (
                  <div className="flex gap-4 min-w-full">
                    {featuredDoctors.slice(4, 8).map((doctor, index) => (
                      <motion.div
                        key={doctor._id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="flex-none w-80"
                      >
                        <DoctorCard
                          doctor={doctor}
                          showRating={true}
                          onBook={() => bookAppointment(doctor)}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Slider Indicators */}
              {featuredDoctors.length > 4 && (
                <div className="flex justify-center mt-6 space-x-2">
                  {Array.from({
                    length: Math.ceil(featuredDoctors.length / 4),
                  }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                        index === currentSlide
                          ? "bg-primary-600"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
              )}
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
          className="inline-flex items-center px-4 py-3 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/watsapp.png"
            alt="WhatsApp"
            width={20}
            height={20}
            className="mr-2"
          />
          WhatsApp
        </a>
        <a
          href="tel:+919674243119"
          className="inline-flex items-center px-4 py-3 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-all duration-300 hover:scale-110"
        >
          <Image
            src="/Call.png"
            alt="Call"
            width={20}
            height={20}
            className="mr-2"
          />
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

      <Footer />
    </div>
  );
}
