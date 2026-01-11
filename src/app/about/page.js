"use client";

import { motion } from "framer-motion";
import { Heart, Users, Award, Shield, Target, Zap } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MetaTags from "@/components/common/MetaTags";
import { pageMetadata } from "@/utils/metadata";

export default function AboutPage() {
  const features = [
    {
      icon: Zap,
      title: "Easy and fast online booking",
      description: "Book appointments with just a few clicks",
    },
    {
      icon: Users,
      title: "Verified doctors and labs",
      description: "All healthcare providers are verified and trusted",
    },
    {
      icon: Shield,
      title: "Reliable medical transportation",
      description: "Fast and safe ambulance and car services",
    },
    {
      icon: Award,
      title: "Simple and clean user interface",
      description: "Easy to navigate and user-friendly design",
    },
    {
      icon: Target,
      title: "24/7 emergency support availability",
      description: "Round-the-clock assistance when you need it",
    },
    {
      icon: Heart,
      title: "Focus on trust, safety, and convenience",
      description: "Your health and safety are our priorities",
    },
  ];

  return (
    <>
      <MetaTags
        title={pageMetadata.about.title}
        description={pageMetadata.about.description}
        keywords={pageMetadata.about.keywords}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />

        <div className="pt-20">
          {/* Hero Section */}
          <section className="py-16 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  About Us – <span className="text-primary-600">DrHelp.in</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Welcome to DrHelp.in, your trusted digital healthcare companion in West
                  Bengal. We are dedicated to making healthcare simple, fast, and accessible for
                  everyone—whether you need to book a doctor, schedule a pathology test, or
                  arrange a medical car or ambulance.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Mission Section */}
          <section className="py-16 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Who We Are
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    DrHelp.in is a modern healthcare platform designed to bridge the gap between
                    patients and essential medical services. Our goal is to help people find
                    trusted doctors, labs, clinics, and medical transportation—all in one place
                    with just a few clicks.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed font-semibold">
                    We bring together:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6 ml-4">
                    <li>Online Doctor Booking</li>
                    <li>Pathology Test Booking</li>
                    <li>Car & Ambulance Services</li>
                    <li>Healthcare Directory Listings</li>
                    <li>Verified Medical Professionals</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    With a mission to improve healthcare accessibility in every town and district
                    of West Bengal.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="relative"
                >
                  <div className="bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-900 rounded-2xl p-8 h-80 flex items-center justify-center">
                    <Heart className="w-32 h-32 text-primary-600 dark:text-primary-400" />
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Why Choose DrHelp.in?
                </h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  We believe every patient deserves transparent, reliable, and quick access to
                  medical help.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="card p-6 text-center hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Mission & Vision */}
          <section className="py-16 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Our Mission
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    To make healthcare accessible, transparent, and convenient for every
                    person—regardless of location, time, or circumstances.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Our Vision
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    To become West Bengal's most trusted and widely used healthcare platform by
                    connecting millions of people to reliable medical services effortlessly.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* What We Offer */}
          <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                  What We Offer
                </h2>
              </motion.div>
              <div className="space-y-8">
                {[
                  {
                    title: "Online Doctor Booking",
                    description:
                      "Find and book appointments with verified doctors across multiple specialties, including general physicians, surgeons, gynecologists, pediatricians, orthopedic experts, and more.",
                  },
                  {
                    title: "Pathology Test Booking",
                    description:
                      "Schedule diagnostic tests with trusted labs. Many partner labs offer accurate reports, home sample collection, and affordable packages.",
                  },
                  {
                    title: "Car & Ambulance Booking",
                    description:
                      "Book emergency or non-emergency vehicles within minutes. We provide ambulances, medical cars, and local and outstation medical transport.",
                  },
                  {
                    title: "Verified Healthcare Information",
                    description:
                      "We verify doctors, clinics, and labs to ensure users receive trustworthy and updated information.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="card p-6"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Areas We Serve */}
          <section className="py-16 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Areas We Serve
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  DrHelp.in proudly serves patients across West Bengal, including:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[
                    "Tamluk",
                    "Haldia",
                    "Contai",
                    "Midnapore",
                    "Kolkata",
                    "Kharagpur",
                    "All nearby districts",
                  ].map((area, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-center"
                    >
                      <p className="text-gray-900 dark:text-white font-medium">{area}</p>
                    </div>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-6">
                  Our service area continues to expand every month.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Partner & Contact */}
          <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Partner With Us
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    We welcome:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6 ml-4">
                    <li>Doctors</li>
                    <li>Clinics</li>
                    <li>Hospitals</li>
                    <li>Pathology Labs</li>
                    <li>Ambulance Providers</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Partner with DrHelp.in to reach more patients and grow your medical services.
                  </p>
                  <a
                    href="mailto:doctorhelpcare@gmail.com"
                    className="text-primary-600 hover:underline font-semibold"
                  >
                    doctorhelpcare@gmail.com
                  </a>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Get in Touch
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Have questions or need assistance?
                  </p>
                  <div className="space-y-3">
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>Email:</strong>{" "}
                      <a
                        href="mailto:doctorhelpcare@gmail.com"
                        className="text-primary-600 hover:underline"
                      >
                        doctorhelpcare@gmail.com
                      </a>
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>Phone:</strong>{" "}
                      <a
                        href="tel:+919242141716"
                        className="text-primary-600 hover:underline"
                      >
                        +91-9242141716
                      </a>
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>Website:</strong>{" "}
                      <a
                        href="https://drhelp.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline"
                      >
                        https://drhelp.in
                      </a>
                    </p>
                  </div>
                  <p className="text-primary-600 font-semibold mt-6">
                    We're here to help!
                  </p>
                </motion.div>
              </div>
            </div>
          </section>
        </div>
        {/* Add Footer */}
        <Footer />
      </div>
    </>
  );
}
