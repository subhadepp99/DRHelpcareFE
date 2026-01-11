"use client";

import { motion } from "framer-motion";
import { Cookie, Mail, Globe } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MetaTags from "@/components/common/MetaTags";

export default function CookiePolicyPage() {
  const cookieTypes = [
    {
      type: "Session Cookies",
      purpose: "Website functionality & login sessions",
    },
    {
      type: "Google Analytics Cookies",
      purpose: "Traffic and performance tracking",
    },
    {
      type: "Preference Cookies",
      purpose: "Saving user preferences",
    },
    {
      type: "Security Cookies",
      purpose: "Fraud prevention & account protection",
    },
    {
      type: "Marketing Cookies",
      purpose: "Personalized ads & remarketing",
    },
  ];

  return (
    <>
      <MetaTags
        title="Cookie Policy for DrHelp.in"
        description="Learn how DrHelp.in uses cookies and similar tracking technologies when you visit our website."
        keywords="cookie policy, privacy, data tracking, cookies, drhelp cookies"
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
                  <Cookie className="w-16 h-16 text-primary-600" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  Cookie Policy for <span className="text-primary-600">DrHelp.in</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Last Updated: 21/11/25
                </p>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mt-4">
                  This Cookie Policy explains how DrHelp.in ("we", "our", "us") uses cookies
                  and similar tracking technologies when you visit or interact with our website
                  https://drhelp.in ("Website"). By using our Website, you agree to the use of
                  cookies as described in this policy.
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
                    1. What Are Cookies?
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    Cookies are small text files placed on your device (computer, mobile, or
                    tablet) when you visit a website. They help us improve user experience,
                    understand website traffic, and offer relevant content or services.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    Cookies may be:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-4">
                    <li>
                      <strong>Session Cookies:</strong> Deleted when you close your browser.
                    </li>
                    <li>
                      <strong>Persistent Cookies:</strong> Remain on your device for a set
                      period.
                    </li>
                    <li>
                      <strong>First-party Cookies:</strong> Set by DrHelp.in.
                    </li>
                    <li>
                      <strong>Third-party Cookies:</strong> Set by external service providers
                      (e.g., Google Analytics).
                    </li>
                  </ul>
                </motion.div>

                {/* Section 2 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    2. How We Use Cookies
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    DrHelp.in uses cookies for the following purposes:
                  </p>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        a. Essential Cookies
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        These cookies are necessary for the website to function properly. They
                        help with accessing secure areas, page navigation, booking doctors or
                        services, and preventing fraudulent activity. Without these cookies,
                        some features may not work.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        b. Functional Cookies
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        These cookies help enhance your user experience by remembering your
                        preferences, saving login details, and maintaining session settings.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        c. Analytics Cookies
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        We use third-party analytics tools such as Google Analytics to
                        understand visitor behavior, device types, time spent on pages, and
                        traffic sources. This helps us improve our platform and services.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        d. Advertising & Marketing Cookies
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        These cookies may be used to show relevant ads, measure ad performance,
                        and track user interactions with our promotional content. We may use
                        services such as Google Ads, Facebook Pixel, and third-party marketing
                        tools.
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
                    3. Third-Party Cookies
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Some cookies are placed by third-party partners assisting us with
                    analytics, advertisements, social media features, and embedded content
                    (videos, maps, etc.). These third parties may collect and process your
                    data based on their own privacy policies.
                  </p>
                </motion.div>

                {/* Section 4 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    4. Managing Your Cookie Preferences
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    You can control or delete cookies anytime. You can change browser settings,
                    block cookies, set alerts when cookies are used, and delete previously
                    stored cookies.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    However, disabling cookies may affect website performance, login access,
                    booking features, and personalized content.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    Browser Controls: You may adjust cookie settings on Chrome, Firefox,
                    Safari, Edge, Opera, and other browsers. Visit each browser's help section
                    for instructions.
                  </p>
                </motion.div>

                {/* Section 5 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    5. Cookies Used on DrHelp.in
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    Below are some types of cookies we may use:
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                      <thead>
                        <tr className="bg-gray-100 dark:bg-gray-700">
                          <th className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-left text-gray-900 dark:text-white font-semibold">
                            Cookie Type
                          </th>
                          <th className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-left text-gray-900 dark:text-white font-semibold">
                            Purpose
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {cookieTypes.map((cookie, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-white">
                              {cookie.type}
                            </td>
                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-gray-600 dark:text-gray-300">
                              {cookie.purpose}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>

                {/* Section 6 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    6. Updates to This Cookie Policy
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    We may update this Cookie Policy from time to time to reflect changes in
                    technology, legal requirements, and our business operations. The latest
                    version will always be available on this page.
                  </p>
                </motion.div>

                {/* Section 7 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    7. Contact Us
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    If you have any questions about our Cookie Policy or data usage, contact
                    us:
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

