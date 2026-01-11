"use client";

import { motion } from "framer-motion";
import { Shield, Mail, Globe } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MetaTags from "@/components/common/MetaTags";

export default function PrivacyPolicyPage() {
  return (
    <>
      <MetaTags
        title="Privacy Policy for DrHelp.in"
        description="Learn how DrHelp.in collects, uses, stores, and safeguards your personal information."
        keywords="privacy policy, data protection, user privacy, drhelp privacy"
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
                  <Shield className="w-16 h-16 text-primary-600" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  Privacy Policy for <span className="text-primary-600">DrHelp.in</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Last Updated: 21/11/25
                </p>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mt-4">
                  At DrHelp.in, we value your privacy and are committed to protecting your
                  personal information. This Privacy Policy explains how we collect, use,
                  store, and safeguard the data you share with us. By using DrHelp.in, you
                  agree to the practices described in this Privacy Policy.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Main Content */}
          <section className="py-16 bg-white dark:bg-gray-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="space-y-12 prose prose-lg dark:prose-invert max-w-none">
                {/* Section 1 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    1. Introduction
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    DrHelp.in ("we", "our", "us") is an online healthcare directory that helps
                    users find doctors, pathology labs, ambulance services, car booking
                    providers, and healthcare-related information in West Bengal. We do not
                    provide medical treatment directly. This policy applies to everyone who
                    accesses or uses our website.
                  </p>
                </motion.div>

                {/* Section 2 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    2. Information We Collect
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    We may collect the following types of information:
                  </p>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        (A) Personal Information
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-2">
                        You may provide this when using contact forms, booking services, or
                        communicating with us:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-4">
                        <li>Full Name</li>
                        <li>Phone Number</li>
                        <li>Email Address</li>
                        <li>Location/City</li>
                        <li>Appointment details</li>
                        <li>Messages or inquiries</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        (B) Non-Personal Information
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-2">
                        Automatically collected information includes:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-4">
                        <li>Browser type</li>
                        <li>Device type</li>
                        <li>Operating system</li>
                        <li>IP address</li>
                        <li>Pages visited on DrHelp.in</li>
                        <li>Time spent on the website</li>
                        <li>Cookies and tracking data</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        (C) Third-Party Service Data
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-2">
                        If you use links to contact doctors, labs, ambulances, or car services,
                        we may track clicks, referring pages, and service categories accessed.
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        We do not collect health reports, medical records, payments, or
                        diagnostic data.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Section 3 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    3. How We Use Your Information
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    We use collected information to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-4">
                    <li>Improve website performance</li>
                    <li>Provide relevant listings and services</li>
                    <li>Respond to your inquiries</li>
                    <li>Connect you with service providers</li>
                    <li>Enhance user experience</li>
                    <li>Improve security and prevent fraud</li>
                    <li>Track analytics and user behavior</li>
                    <li>Notify you about updates or important information</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
                    We never sell your data to third parties.
                  </p>
                </motion.div>

                {/* Section 4 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    4. Cookies & Tracking Technologies
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    DrHelp.in uses cookies to understand how users interact with the site,
                    personalize website experience, improve page loading and functionality, and
                    track analytics through tools like Google Analytics. You can disable
                    cookies in your browser settings, but some features may not work properly.
                  </p>
                </motion.div>

                {/* Section 5 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    5. Sharing of Information
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    We may share limited information with:
                  </p>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        (A) Third-Party Providers
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        Doctors, labs, ambulance, or car booking providers only when you
                        choose to contact them.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        (B) Analytics Platforms
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        Google Analytics or similar tools collect anonymous data for traffic
                        analysis.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        (C) Legal Authorities
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        We may disclose information if required by law enforcement, court
                        orders, or government authorities.
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
                    We do not trade, rent, or sell personal data.
                  </p>
                </motion.div>

                {/* Section 6 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    6. Data Security
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    We use reasonable security measures to protect your information from
                    unauthorized access, misuse, loss, and alteration. However, no online
                    platform is 100% secure. Users share data at their own risk.
                  </p>
                </motion.div>

                {/* Section 7 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    7. Third-Party Links
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    DrHelp.in contains links to doctors, clinics, labs, ambulance/car booking
                    services, and external websites. We are not responsible for the privacy
                    practices, content, or policies of third-party sites. We encourage you to
                    read their privacy policies before sharing information.
                  </p>
                </motion.div>

                {/* Section 8 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    8. Children's Privacy
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    DrHelp.in is not intended for individuals under the age of 18. We do not
                    knowingly collect data from minors. If you believe a child has provided
                    information, contact us immediately to delete it.
                  </p>
                </motion.div>

                {/* Section 9 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    9. User Rights
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    You have the right to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-4">
                    <li>Request a copy of your stored data</li>
                    <li>Request correction of inaccurate data</li>
                    <li>Request deletion of your information</li>
                    <li>Opt-out of marketing or communication</li>
                    <li>Disable cookies anytime</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
                    To exercise these rights, contact us at the email below.
                  </p>
                </motion.div>

                {/* Section 10 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    10. Changes to the Privacy Policy
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    We may update this Privacy Policy from time to time. Changes take effect
                    immediately when posted on this page. We encourage you to review this page
                    periodically.
                  </p>
                </motion.div>

                {/* Section 11 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    11. Contact Us
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    For questions, complaints, or requests related to privacy, contact:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-primary-600" />
                      <a
                        href="mailto:doctorhelpcare@gmail.com"
                        className="text-primary-600 hover:underline"
                      >
                        doctorhelpcare@gmail.com
                      </a>
                    </div>
                    <div className="flex items-center space-x-3">
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
                </motion.div>
              </div>
            </div>
          </section>
        </div>

        <Footer />
      </div>
    </>
  );
}

