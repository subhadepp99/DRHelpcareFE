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
import HeroCarousel from "@/components/common/HeroCarousel";
import ServiceCard from "@/components/cards/ServiceCard";
import DoctorCard from "@/components/cards/DoctorCard";
import DepartmentCard from "@/components/cards/DepartmentCard";
import AppointmentModal from "@/components/common/AppointmentModal";
import MetaTags from "@/components/common/MetaTags";
import { useLocation } from "@/hooks/useLocation";
import { useApi } from "@/hooks/useApi";
import { useAuthStore } from "@/store/authStore";
import { useLocation as useLocationContext } from "@/contexts/LocationContext";
import { pageMetadata } from "@/utils/metadata";
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
  const [departmentScrollPosition, setDepartmentScrollPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isDoctorDragging, setIsDoctorDragging] = useState(false);
  const [doctorStartX, setDoctorStartX] = useState(0);
  const [doctorScrollLeft, setDoctorScrollLeft] = useState(0);

  useEffect(() => {
    fetchFeaturedDoctors();
    fetchDepartments();
    fetchTestPackages();
  }, []);

  // Auto-slide for cards - removed since we're using manual dragging

  const fetchFeaturedDoctors = async () => {
    try {
      const response = await get("/doctors/featured");
      const doctors =
        response?.data?.data?.doctors || response?.data?.doctors || [];
      setFeaturedDoctors(doctors);
    } catch (error) {}
  };

  const fetchDepartments = async () => {
    try {
      const response = await get("/departments/public"); // departments contain pic, details, heading, and linked doctors
      const departmentsData = response.data.data.departments || [];
      setDepartments(departmentsData);
    } catch (error) {
      setDepartments([]);
    }
  };

  const fetchTestPackages = async () => {
    try {
      const response = await get("/pathology/test-packages");
      setTestPackages(response.data?.testPackages || []);
    } catch (error) {
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
    // {
    //   icon: Pill,
    //   title: "Find Pharmacies",
    //   description: "Locate pharmacies for medicines",
    //   color: "bg-purple-500",
    //   href: "/search?type=pharmacies",
    // },
    {
      icon: TestTube,
      title: "Pathology Tests",
      description: "Book diagnostic tests and health packages",
      color: "bg-red-500",
      href: "/pathology",
    },
    {
      icon: Truck,
      title: "Ambulance Service",
      description: "24/7 emergency ambulance services",
      color: "bg-orange-500",
      href: "/search?type=ambulance",
    },
  ];

  const getDiscountPercentage = (originalPrice, discountedPrice) => {
    if (!originalPrice || !discountedPrice) return 0;
    return Math.round(
      ((originalPrice - discountedPrice) / originalPrice) * 100
    );
  };

  const handleCall = (phoneNumber = "+919242141716") => {
    window.open(`tel:${phoneNumber}`, "_blank");
  };

  // Department drag handlers
  const handleDepartmentMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - e.currentTarget.offsetLeft);
    setScrollLeft(e.currentTarget.scrollLeft);
  };

  const handleDepartmentMouseLeave = () => {
    setIsDragging(false);
  };

  const handleDepartmentMouseUp = () => {
    setIsDragging(false);
  };

  const handleDepartmentMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - e.currentTarget.offsetLeft;
    const walk = (x - startX) * 2;
    e.currentTarget.scrollLeft = scrollLeft - walk;
  };

  const scrollDepartmentLeft = () => {
    const container = document.getElementById("department-container");
    if (container) {
      container.scrollLeft -= 300;
    }
  };

  const scrollDepartmentRight = () => {
    const container = document.getElementById("department-container");
    if (container) {
      container.scrollLeft += 300;
    }
  };

  // Doctor drag handlers
  const handleDoctorMouseDown = (e) => {
    setIsDoctorDragging(true);
    setDoctorStartX(e.pageX - e.currentTarget.offsetLeft);
    setDoctorScrollLeft(e.currentTarget.scrollLeft);
  };

  const handleDoctorMouseLeave = () => {
    setIsDoctorDragging(false);
  };

  const handleDoctorMouseUp = () => {
    setIsDoctorDragging(false);
  };

  const handleDoctorMouseMove = (e) => {
    if (!isDoctorDragging) return;
    e.preventDefault();
    const x = e.pageX - e.currentTarget.offsetLeft;
    const walk = (x - doctorStartX) * 2;
    e.currentTarget.scrollLeft = doctorScrollLeft - walk;
  };

  const scrollDoctorLeft = () => {
    const container = document.getElementById("doctor-container");
    if (container) {
      container.scrollLeft -= 320; // Width of one doctor card + gap
    }
  };

  const scrollDoctorRight = () => {
    const container = document.getElementById("doctor-container");
    if (container) {
      container.scrollLeft += 320; // Width of one doctor card + gap
    }
  };

  return (
    <>
      <MetaTags
        title={pageMetadata.home.title}
        description={pageMetadata.home.description}
        keywords={pageMetadata.home.keywords}
      />
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 relative">
        <Header />

        {/* Hero Section (Search then Carousel) */}
        <section className="relative z-40 overflow-hidden pt-20 pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center relative z-50"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Find Doctors, Clinics & Pathology Labs in Midnapore
              </h1>
              {/* Enhanced Search Section with Integrated Location Detection */}
              <SearchSection
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchType={searchType}
                setSearchType={setSearchType}
                onSearch={handleSearch}
              />
            </motion.div>
            <div className="mt-4 sm:mt-6">
              <HeroCarousel />
            </div>
          </div>
        </section>

        {/* Department Section - Scrollable Cards */}
        {departments.length > 0 && (
          <section className="py-8 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Our Departments
              </h2>
              <div className="relative">
                <div
                  id="department-container"
                  className="overflow-x-auto scrollbar-hide pb-2 cursor-grab active:cursor-grabbing"
                  onMouseDown={handleDepartmentMouseDown}
                  onMouseLeave={handleDepartmentMouseLeave}
                  onMouseUp={handleDepartmentMouseUp}
                  onMouseMove={handleDepartmentMouseMove}
                  style={{ userSelect: "none" }}
                >
                  <div className="flex gap-4 min-w-fit">
                    {departments.map((dept) => (
                      <DepartmentCard key={dept._id} department={dept} />
                    ))}
                  </div>
                </div>
                {/* Scroll indicators */}
                <button
                  onClick={scrollDepartmentLeft}
                  className="absolute top-1/2 -translate-y-1/2 left-0 w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-10"
                >
                  <svg
                    className="w-4 h-4 text-gray-600 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={scrollDepartmentRight}
                  className="absolute top-1/2 -translate-y-1/2 right-0 w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-10"
                >
                  <svg
                    className="w-4 h-4 text-gray-600 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
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

              <div className="relative">
                <div
                  id="doctor-container"
                  className="overflow-x-auto scrollbar-hide pb-2 cursor-grab active:cursor-grabbing"
                  onMouseDown={handleDoctorMouseDown}
                  onMouseLeave={handleDoctorMouseLeave}
                  onMouseUp={handleDoctorMouseUp}
                  onMouseMove={handleDoctorMouseMove}
                  style={{ userSelect: "none" }}
                >
                  <div className="flex gap-4 min-w-fit">
                    {featuredDoctors.map((doctor, index) => (
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
                </div>
                {/* Scroll indicators */}
                <button
                  onClick={scrollDoctorLeft}
                  className="absolute top-1/2 -translate-y-1/2 left-0 w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-10"
                >
                  <svg
                    className="w-4 h-4 text-gray-600 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={scrollDoctorRight}
                  className="absolute top-1/2 -translate-y-1/2 right-0 w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-10"
                >
                  <svg
                    className="w-4 h-4 text-gray-600 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
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

        {/* Floating Call & WhatsApp Buttons removed as requested */}

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
                  Take your healthcare experience on the go. Our mobile apps
                  will be available soon on iOS and Android platforms.
                </p>

                {/* App Store Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  {/* iOS App Store Button */}
                  <div className="flex items-center space-x-3 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 px-6 py-3 rounded-lg border border-gray-600 transition-all duration-300 cursor-not-allowed opacity-75">
                    <Apple className="w-8 h-8 text-white" />
                    <div className="text-left">
                      <div className="text-xs text-gray-300">
                        Coming Soon on
                      </div>
                      <div className="text-lg font-semibold text-white">
                        App Store
                      </div>
                    </div>
                  </div>

                  {/* Google Play Store Button */}
                  <div className="flex items-center space-x-3 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 px-6 py-3 rounded-lg border border-gray-600 transition-all duration-300 cursor-not-allowed opacity-75">
                    <PlayCircle className="w-8 h-8 text-white" />
                    <div className="text-left">
                      <div className="text-xs text-gray-300">
                        Coming Soon on
                      </div>
                      <div className="text-lg font-semibold text-white">
                        Google Play
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notify Me Button */}
                <div className="mt-6">
                  <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-8 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2 mx-auto">
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
    </>
  );
}
