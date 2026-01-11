"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  Globe,
  MapPin,
  Clock,
  Stethoscope,
  TestTube,
  Truck,
  User,
  CreditCard,
  Settings,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MetaTags from "@/components/common/MetaTags";

export default function HelpCenterPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const helpSections = [
    {
      icon: Stethoscope,
      title: "About DrHelp.in",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            DrHelp.in is a digital platform that helps users across West Bengal to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-4">
            <li>Book doctors online</li>
            <li>Book pathology tests</li>
            <li>Book cars/ambulances for medical travel</li>
            <li>Access healthcare directories</li>
            <li>Get local medical information</li>
          </ul>
          <p className="text-gray-600 dark:text-gray-300">
            Our goal is to make healthcare simple, fast, and accessible.
          </p>
        </div>
      ),
    },
    {
      icon: Stethoscope,
      title: "Doctor Booking Support",
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              How do I book a doctor?
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-4">
              <li>Visit DrHelp.in</li>
              <li>Select your location</li>
              <li>Choose your specialty (e.g., cardiologist, dermatologist, surgeon)</li>
              <li>Select an available doctor</li>
              <li>Book an appointment</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Can I cancel or reschedule a booking?
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Yes. Contact our support team with your booking ID and we will assist you.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Is doctor information verified?
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              We try our best to list only verified and trusted doctors on our platform.
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: TestTube,
      title: "Pathology Test Support",
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              How do I book a pathology test?
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-4">
              <li>Go to Pathology section</li>
              <li>Select the test (e.g., CBC, Thyroid, Lipid Profile)</li>
              <li>Choose a lab near you</li>
              <li>Confirm your booking</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Do labs offer home sample collection?
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Some partnered labs support home sample collection. Availability depends on
              location.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              When will I receive my reports?
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Reports are usually delivered within the timeframe mentioned by the respective
              lab.
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: Truck,
      title: "Car / Ambulance Booking Support",
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              How do I book a car or ambulance?
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-4">
              <li>Visit the Vehicle Booking section</li>
              <li>Choose car/ambulance type</li>
              <li>Enter pickup and drop location</li>
              <li>Confirm your booking</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Are emergency services available?
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Yes, we try to connect you with the nearest available ambulance service.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Can I check vehicle availability?
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Availability depends on area and distance. You will be notified instantly on the
              website.
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: User,
      title: "Account & Login Support",
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              How do I create an account?
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Click on Sign Up, enter your details, and verify your mobile/email.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              What if I forgot my password?
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Use the Forgot Password option to reset it.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Can I update my profile?
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Yes. Go to My Account → Edit Profile.
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: CreditCard,
      title: "Payments & Refunds",
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              What payment methods are accepted?
            </h4>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-4">
              <li>UPI</li>
              <li>Wallets</li>
              <li>Credit/Debit Cards</li>
              <li>Net Banking</li>
              <li>Cash at clinic (for select doctors)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              What is the refund policy?
            </h4>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Refunds are issued for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-4">
              <li>Canceled bookings</li>
              <li>Duplicate payments</li>
              <li>Service unavailability</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              Refunds may take 3–7 business days depending on the payment method.
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: Settings,
      title: "Technical Issues",
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              The website is not loading. What should I do?
            </h4>
            <p className="text-gray-600 dark:text-gray-300 mb-2">Try the following:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-4">
              <li>Check internet connection</li>
              <li>Clear browser cache</li>
              <li>Try a different browser</li>
              <li>Restart your device</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              I cannot complete a booking.
            </h4>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Please contact support with:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-4">
              <li>Screenshot</li>
              <li>Booking URL</li>
              <li>Error message</li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <MetaTags
        title="Help Center – DrHelp.in"
        description="Get help with doctor booking, pathology tests, vehicle services, account issues, and more on DrHelp.in"
        keywords="drhelp help, support, customer service, help center, assistance"
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
                  <HelpCircle className="w-16 h-16 text-primary-600" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  Help Center – <span className="text-primary-600">DrHelp.in</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Welcome to the DrHelp.in Help Center! We are here to assist you with doctor
                  booking, pathology tests, vehicle services, account issues, and more. Find
                  answers to the most common questions below.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Help Sections */}
          <section className="py-16 bg-white dark:bg-gray-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="space-y-6">
                {helpSections.map((section, index) => {
                  const isOpen = openIndex === index;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleSection(index)}
                        className="w-full px-6 py-5 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-4">
                          <section.icon className="w-6 h-6 text-primary-600 flex-shrink-0" />
                          <span className="font-semibold text-gray-900 dark:text-white text-lg">
                            {section.title}
                          </span>
                        </div>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-primary-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-primary-600 flex-shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-6 py-6 bg-white dark:bg-gray-800"
                        >
                          {section.content}
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Contact Support */}
          <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Contact Support
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Need more help? We're here for you.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <div className="card p-6 text-center">
                    <Mail className="w-8 h-8 text-primary-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Email
                    </h3>
                    <a
                      href="mailto:doctorhelpcare@gmail.com"
                      className="text-primary-600 hover:underline"
                    >
                      doctorhelpcare@gmail.com
                    </a>
                  </div>
                  <div className="card p-6 text-center">
                    <Phone className="w-8 h-8 text-primary-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Phone
                    </h3>
                    <a
                      href="tel:+919242141716"
                      className="text-primary-600 hover:underline"
                    >
                      +91 9242141716
                    </a>
                  </div>
                  <div className="card p-6 text-center">
                    <Globe className="w-8 h-8 text-primary-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Website
                    </h3>
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
                <div className="mt-8 flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-300">
                  <MapPin className="w-5 h-5" />
                  <span>West Bengal, India</span>
                </div>
                <div className="mt-4 flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-300">
                  <Clock className="w-5 h-5" />
                  <span>Support Hours: Monday–Sunday: 9:00 AM – 9:00 PM</span>
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

