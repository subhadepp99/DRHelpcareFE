"use client";

import { motion } from "framer-motion";
import { FileText, Mail, Phone, Globe } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MetaTags from "@/components/common/MetaTags";

export default function TermsPage() {
  return (
    <>
      <MetaTags
        title="Terms & Conditions for DrHelp.in"
        description="Read the Terms & Conditions for using DrHelp.in. Understand your rights and responsibilities when using our platform."
        keywords="terms and conditions, terms of service, legal, drhelp terms"
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
                  <FileText className="w-16 h-16 text-primary-600" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  Terms & Conditions for <span className="text-primary-600">DrHelp.in</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Last Updated: 21/11/25
                </p>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mt-4">
                  Welcome to DrHelp.in. By accessing or using our website, you agree to comply
                  with the following Terms & Conditions. Please read them carefully before using
                  our services. If you do not agree with any part of these terms, you must
                  discontinue using DrHelp.in.
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
                    DrHelp.in ("we", "us", "our", or "the platform") is an online healthcare
                    directory and service assistance platform that helps users find doctors,
                    clinics, pathology labs, ambulance services, and car booking providers in
                    West Bengal. We are not a medical service provider, hospital, clinic, or
                    diagnostic center.
                  </p>
                </motion.div>

                {/* Section 2 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    2. Acceptance of Terms
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    By accessing or using DrHelp.in, you confirm that:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-4">
                    <li>You are at least 18 years old.</li>
                    <li>You have read, understood, and agreed to these Terms & Conditions.</li>
                    <li>You will use the platform legally and responsibly.</li>
                  </ul>
                </motion.div>

                {/* Section 3 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    3. Nature of Services
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    DrHelp.in provides:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-4">
                    <li>Doctor listings</li>
                    <li>Pathology & diagnostic service listings</li>
                    <li>Ambulance and car booking information</li>
                    <li>Contact details for medical and related service providers</li>
                    <li>General healthcare-related information</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
                    We do not provide medical treatment, medical advice, or diagnostic services
                    directly. All listings on DrHelp.in belong to independent service providers.
                  </p>
                </motion.div>

                {/* Section 4 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    4. No Medical Advice
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Information provided on DrHelp.in is for general informational purposes only
                    and must not be considered medical advice. Always consult a qualified doctor
                    or healthcare professional for diagnosis or treatment. DrHelp.in is not
                    responsible for any medical decisions or outcomes.
                  </p>
                </motion.div>

                {/* Section 5 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    5. Third-Party Service Providers
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    The doctors, clinics, labs, ambulances, and car services listed on
                    DrHelp.in are independent third parties. We do not guarantee their
                    availability, control their pricing, verify every claim made by them, or
                    involve ourselves in disputes between users and service providers.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Any service you book or use is solely between you and the third-party
                    provider.
                  </p>
                </motion.div>

                {/* Section 6 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    6. Accuracy of Information
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    We aim to keep information accurate and updated; however, some information
                    may be incomplete, outdated, or inaccurate. Service providers may change
                    timings, pricing, or availability without notice. DrHelp.in is not liable
                    for inaccuracies or outdated information.
                  </p>
                </motion.div>

                {/* Section 7 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    7. User Responsibilities
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    By using DrHelp.in, you agree to provide accurate personal and contact
                    information, use the platform only for lawful purposes, and not attempt to
                    hack, damage, or misuse the website. You are responsible for verifying
                    service details before booking.
                  </p>
                </motion.div>

                {/* Section 8 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    8. Booking & Payments
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Some services on DrHelp.in may require booking or payment through external
                    service providers. DrHelp.in does not process payments directly. All
                    payments are handled by third-party providers. We are not responsible for
                    payment failures, refunds, cancellations, or disputes. Please check each
                    provider's own policies.
                  </p>
                </motion.div>

                {/* Section 9 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    9. Limitation of Liability
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    DrHelp.in will not be responsible for:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-4">
                    <li>Incorrect or outdated information</li>
                    <li>Service delays, cancellations, or improper service by providers</li>
                    <li>Medical negligence or malpractice by doctors or labs</li>
                    <li>Transportation delays or accidents</li>
                    <li>Loss of data or system errors</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
                    Using the platform is at your own risk.
                  </p>
                </motion.div>

                {/* Section 10 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    10. Privacy Policy
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Your personal data is handled according to our Privacy Policy. By using
                    DrHelp.in, you consent to data collection and use as described in the
                    Privacy Policy.
                  </p>
                </motion.div>

                {/* Section 11 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    11. Intellectual Property
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    All content on DrHelp.in—including text, design, images, and logos—is the
                    property of DrHelp.in unless otherwise credited. You may not copy,
                    reproduce, or distribute any content without written permission.
                  </p>
                </motion.div>

                {/* Section 12 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    12. Prohibited Activities
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    Users must not:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-4">
                    <li>Misuse the platform to spread spam or harmful content</li>
                    <li>Attempt to impersonate other users</li>
                    <li>Use bots or automated tools to access the platform</li>
                    <li>Use the website for illegal, fraudulent, or abusive purposes</li>
                  </ul>
                </motion.div>

                {/* Section 13 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    13. Modification of Terms
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    DrHelp.in reserves the right to update or modify these Terms & Conditions
                    anytime without prior notice. Continued use of the site indicates acceptance
                    of the updated terms.
                  </p>
                </motion.div>

                {/* Section 14 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    14. Termination of Access
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    We may restrict or terminate user access if we suspect misuse of the
                    platform, violation of these terms, or fraudulent or harmful activity.
                  </p>
                </motion.div>

                {/* Section 15 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    15. Governing Law
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    These Terms & Conditions are governed by the laws of India. Any disputes
                    shall be resolved in courts located in West Bengal.
                  </p>
                </motion.div>

                {/* Section 16 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    16. Contact Information
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    For any queries or support, please contact:
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
                      <Phone className="w-5 h-5 text-primary-600" />
                      <a
                        href="tel:+919242141716"
                        className="text-primary-600 hover:underline"
                      >
                        +91 9242141716
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

