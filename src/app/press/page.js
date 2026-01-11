"use client";

import { motion } from "framer-motion";
import {
  Newspaper,
  Mail,
  Phone,
  Globe,
  Image as ImageIcon,
  FileText,
  Users,
  Award,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MetaTags from "@/components/common/MetaTags";

export default function PressPage() {
  const pressReleases = [
    {
      title: "DrHelp.in Launches Fast Doctor Booking Across West Bengal",
      description:
        "DrHelp.in has launched an easy-to-use digital platform that connects patients with verified doctors across multiple specialties. Users can now book appointments from any district in just a few clicks.",
    },
    {
      title: "New Pathology Booking Feature Added",
      description:
        "The platform now supports online booking for pathology tests, partnering with trusted labs offering accurate reports and optional home sample collection.",
    },
    {
      title: "Car & Ambulance Service Integration Introduced",
      description:
        "To improve patient mobility, DrHelp.in introduces on-demand medical car and ambulance booking for emergency and non-emergency travel.",
    },
  ];

  const mediaKitItems = [
    { name: "Official DrHelp.in logo", icon: ImageIcon },
    { name: "Brand colors and typography", icon: FileText },
    { name: "High-resolution images", icon: ImageIcon },
    { name: "Product screenshots", icon: ImageIcon },
    { name: "Company introduction PDF", icon: FileText },
  ];

  const interviewTopics = [
    "Digital healthcare growth in India",
    "Healthcare accessibility challenges",
    "Technology-driven medical solutions",
    "Future expansion plans",
  ];

  return (
    <>
      <MetaTags
        title="Press & Media – DrHelp.in"
        description="Official Press & Media Center of DrHelp.in. Find press releases, media resources, and contact information for journalists and media organizations."
        keywords="drhelp press, drhelp media, healthcare news, press releases, media kit"
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
                  Press & Media – <span className="text-primary-600">DrHelp.in</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Welcome to the official Press & Media Center of DrHelp.in, West Bengal's
                  growing digital healthcare platform. This page provides journalists, bloggers,
                  healthcare writers, and media organizations with official information, company
                  updates, press releases, and media resources.
                </p>
              </motion.div>
            </div>
          </section>

          {/* About Section */}
          <section className="py-16 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Award className="w-8 h-8 mr-3 text-primary-600" />
                  About DrHelp.in
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  DrHelp.in is a digital health directory and booking platform designed to make
                  healthcare easier for everyone in West Bengal.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-6 font-semibold">
                  We provide:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6 ml-4">
                  <li>Online doctor appointment booking</li>
                  <li>Pathology test booking</li>
                  <li>Medical car & ambulance services</li>
                  <li>Verified healthcare listings</li>
                  <li>Local medical assistance</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Our mission is to make reliable and affordable healthcare accessible in every
                  district of West Bengal.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Press Releases */}
          <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Newspaper className="w-8 h-8 mr-3 text-primary-600" />
                  Latest Press Releases
                </h2>
              </motion.div>
              <div className="space-y-6">
                {pressReleases.map((release, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="card p-6 hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                        <span className="text-primary-600 dark:text-primary-400 font-bold">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {release.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {release.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Media Kit */}
          <section className="py-16 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <ImageIcon className="w-8 h-8 mr-3 text-primary-600" />
                  Media Kit
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Journalists and partners may request access to:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {mediaKitItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <item.icon className="w-5 h-5 text-primary-600 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Request media kit:</strong>
                  </p>
                  <a
                    href="mailto:doctorhelpcare@gmail.com"
                    className="text-primary-600 hover:underline flex items-center space-x-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>doctorhelpcare@gmail.com</span>
                  </a>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Leadership & Interviews */}
          <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Users className="w-8 h-8 mr-3 text-primary-600" />
                  Leadership & Founders
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Interviews with the founder and management team are available upon request.
                  Topics include:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6 ml-4">
                  {interviewTopics.map((topic, index) => (
                    <li key={index}>{topic}</li>
                  ))}
                </ul>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    <strong>For interview requests:</strong>
                  </p>
                  <a
                    href="tel:+919242141716"
                    className="text-primary-600 hover:underline flex items-center space-x-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>+91 9242141716</span>
                  </a>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Press Contact */}
          <section className="py-16 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Press Contact
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  For all media inquiries, please contact:
                </p>
                <div className="card p-8 max-w-2xl mx-auto">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    DrHelp.in – Press & Media Department
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-3">
                      <Mail className="w-5 h-5 text-primary-600" />
                      <a
                        href="mailto:doctorhelpcare@gmail.com"
                        className="text-primary-600 hover:underline"
                      >
                        doctorhelpcare@gmail.com
                      </a>
                    </div>
                    <div className="flex items-center justify-center space-x-3">
                      <Phone className="w-5 h-5 text-primary-600" />
                      <a
                        href="tel:+919242141716"
                        className="text-primary-600 hover:underline"
                      >
                        +91 9242141716
                      </a>
                    </div>
                    <div className="flex items-center justify-center space-x-3">
                      <Globe className="w-5 h-5 text-primary-600" />
                      <a
                        href="https://drhelp.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline"
                      >
                        https://drhelp.in
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </div>

        <Footer />
      </div>
    </>
  );
}

