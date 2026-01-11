"use client";

import { motion } from "framer-motion";
import {
  Users,
  User,
  Crown,
  Code,
  Settings,
  Megaphone,
  HeadphonesIcon,
  TestTube,
  Truck,
  Laptop,
  Heart,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MetaTags from "@/components/common/MetaTags";

export default function TeamPage() {
  const leadershipTeam = [
    {
      name: "S Mallik",
      role: "Founder & CEO",
      icon: Crown,
      description:
        "The visionary behind DrHelp.in, responsible for building a platform that connects people with quality healthcare services across West Bengal. Leads product development, innovation, and long-term strategy.",
    },
    {
      name: "C K Mallik",
      role: "Co-Founder & CTO",
      icon: Code,
      description:
        "Manages all technical operations, including website development, system security, and platform optimization to ensure a smooth and fast user experience.",
    },
  ];

  const managementTeam = [
    {
      name: "Subhadeep",
      role: "Operations Manager",
      icon: Settings,
      description:
        "Oversees daily operations, coordinates with doctors, labs, and car/ambulance partners, ensuring seamless service delivery.",
    },
    {
      name: "Sudarshan Das",
      role: "Marketing & Communications Head",
      icon: Megaphone,
      description:
        "Leads digital marketing, social outreach, brand promotions, and awareness campaigns to bring DrHelp.in closer to every household.",
    },
  ];

  const supportTeam = [
    {
      name: "Arpita Das",
      role: "Customer Support Executive",
      icon: HeadphonesIcon,
    },
    {
      name: "Bapon das",
      role: "Customer Support Executive",
      icon: HeadphonesIcon,
    },
  ];

  const transportTeam = [
    {
      name: "Sudarshan Das",
      role: "Transport Supervisor",
      icon: Truck,
    },
  ];

  return (
    <>
      <MetaTags
        title="Our Team – DrHelp.in"
        description="Meet the dedicated team behind DrHelp.in working to make healthcare accessible across West Bengal"
        keywords="drhelp team, healthcare team, medical platform team, drhelp employees"
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
                <div className="flex items-center justify-center mb-6">
                  <Users className="w-16 h-16 text-primary-600" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  Our Team – <span className="text-primary-600">DrHelp.in</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  At DrHelp.in, our mission is to make healthcare simple, accessible, and
                  reliable for everyone in West Bengal. Behind every service—doctor booking,
                  pathology testing, and medical travel—stands a dedicated team of
                  professionals who work tirelessly to deliver trust, accuracy, and
                  convenience.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Leadership Team */}
          <section className="py-16 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
                  <Crown className="w-8 h-8 mr-3 text-primary-600" />
                  Leadership Team
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {leadershipTeam.map((member, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="card p-6 hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center flex-shrink-0">
                          <member.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                            {member.name}
                          </h3>
                          <p className="text-primary-600 dark:text-primary-400 font-semibold mb-3">
                            {member.role}
                          </p>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {member.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* Management Team */}
          <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
                  <Settings className="w-8 h-8 mr-3 text-primary-600" />
                  Management & Operations
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {managementTeam.map((member, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="card p-6 hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center flex-shrink-0">
                          <member.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                            {member.name}
                          </h3>
                          <p className="text-primary-600 dark:text-primary-400 font-semibold mb-3">
                            {member.role}
                          </p>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {member.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* Support Team */}
          <section className="py-16 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <HeadphonesIcon className="w-8 h-8 mr-3 text-primary-600" />
                  Customer Care & Support Team
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Our friendly support team works from 9 AM to 9 PM every day to help with:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-8 ml-4">
                  <li>Doctor appointments</li>
                  <li>Pathology bookings</li>
                  <li>Vehicle/ambulance assistance</li>
                  <li>Payment or refund queries</li>
                  <li>Technical issues</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-300 font-semibold mb-4">
                  Customer Support Executives:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {supportTeam.map((member, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="card p-6 hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center flex-shrink-0">
                          <member.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {member.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {member.role}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-6">
                  They ensure quick responses and helpful guidance during every step.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Medical & Pathology Team */}
          <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <TestTube className="w-8 h-8 mr-3 text-primary-600" />
                  Medical & Pathology Coordination Team
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  This team collaborates with registered doctors, pathology labs, diagnostic
                  centers, and medical travel service providers. They verify listings, update
                  service information, and maintain quality control across the platform.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Transport Team */}
          <section className="py-16 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Truck className="w-8 h-8 mr-3 text-primary-600" />
                  Transport & Ambulance Partner Network
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Dedicated members ensure reliable transportation for emergency ambulance
                  services, non-emergency medical travel, hospital visits, and long-distance
                  medical needs.
                </p>
                <p className="text-gray-600 dark:text-gray-300 font-semibold mb-4">
                  Transport Supervisors:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {transportTeam.map((member, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="card p-6 hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center flex-shrink-0">
                          <member.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {member.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {member.role}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* Technical Team */}
          <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Laptop className="w-8 h-8 mr-3 text-primary-600" />
                  Technical & Development Team
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  A skilled team of developers and designers who work behind the scenes to
                  ensure:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-4">
                  <li>Fast website performance</li>
                  <li>Secure user data</li>
                  <li>Easy navigation</li>
                  <li>Mobile-friendly interface</li>
                  <li>New features and updates</li>
                </ul>
              </motion.div>
            </div>
          </section>

          {/* Commitment Section */}
          <section className="py-16 bg-primary-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <div className="flex items-center justify-center mb-6">
                  <Heart className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-6">Our Commitment</h2>
                <p className="text-xl text-primary-100 mb-8">
                  At DrHelp.in, we believe:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                  {[
                    "Healthcare should be accessible",
                    "Booking should be simple",
                    "Services should be transparent",
                    "Help should be available when you need it most",
                  ].map((belief, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
                    >
                      <p className="text-white text-lg">{belief}</p>
                    </motion.div>
                  ))}
                </div>
                <p className="text-primary-100 mt-8 text-lg">
                  Our team works together every day to make this vision a reality for people
                  across West Bengal.
                </p>
              </motion.div>
            </div>
          </section>
        </div>

        <Footer />
      </div>
    </>
  );
}

