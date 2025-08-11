"use client";

import { motion } from "framer-motion";
import { Heart, Users, Award, Shield, Target, Zap } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  const features = [
    {
      icon: Heart,
      title: "Patient-Centered Care",
      description:
        "Your health and comfort are our top priorities in every interaction.",
    },
    {
      icon: Users,
      title: "Expert Network",
      description:
        "Connect with qualified healthcare professionals across specialties.",
    },
    {
      icon: Award,
      title: "Quality Assured",
      description:
        "All our partners meet stringent quality and certification standards.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Your medical information is protected with enterprise-grade security.",
    },
    {
      icon: Target,
      title: "Precision Matching",
      description:
        "Find the right healthcare provider based on your specific needs.",
    },
    {
      icon: Zap,
      title: "Instant Booking",
      description:
        "Book appointments instantly with real-time availability updates.",
    },
  ];

  return (
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
                About <span className="text-primary-600">HealthCare Pro</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                We're revolutionizing healthcare access by connecting patients
                with the right healthcare providers at the right time, making
                quality healthcare accessible to everyone.
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
                  Our Mission
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  To democratize healthcare access by providing a comprehensive
                  platform that connects patients with qualified healthcare
                  providers, enabling seamless appointment booking, and
                  fostering better health outcomes for communities worldwide.
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  We believe that everyone deserves access to quality
                  healthcare, regardless of their location or circumstances. Our
                  technology bridges the gap between patients and healthcare
                  providers, making it easier than ever to find, connect, and
                  receive care.
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
                Why Choose HealthCare Pro?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                We're committed to providing the best healthcare discovery and
                booking experience
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

        {/* Stats Section */}
        <section className="py-16 bg-primary-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "10,000+", label: "Healthcare Providers" },
                { number: "500,000+", label: "Appointments Booked" },
                { number: "50+", label: "Cities Covered" },
                { number: "4.8/5", label: "User Rating" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-white"
                >
                  <div className="text-3xl md:text-4xl font-bold mb-2">
                    {stat.number}
                  </div>
                  <div className="text-primary-100">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
      {/* Add Footer */}
      <Footer />
    </div>
  );
}
