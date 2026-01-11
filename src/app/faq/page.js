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
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MetaTags from "@/components/common/MetaTags";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqSections = [
    {
      category: "General Questions",
      icon: "🌐",
      questions: [
        {
          q: "What is DrHelp.in?",
          a: "DrHelp.in is an online healthcare platform in West Bengal that provides doctor booking, pathology test booking, and medical travel/car services—all in one place.",
        },
        {
          q: "Is DrHelp.in free to use?",
          a: "Yes, browsing the website and checking doctor or lab information is completely free. Booking charges depend on the specific service or doctor.",
        },
        {
          q: "In which areas do you provide services?",
          a: "DrHelp.in currently supports all major regions of West Bengal, including Tamluk, Haldia, Contai, Midnapore, Kolkata, and nearby areas.",
        },
      ],
    },
    {
      category: "Doctor Booking FAQs",
      icon: "👨‍⚕️",
      questions: [
        {
          q: "How do I book a doctor on DrHelp.in?",
          a: "Go to Doctor Booking, select your location, choose a specialty, pick a doctor, and confirm your appointment.",
        },
        {
          q: "Are the doctors verified?",
          a: "Yes, DrHelp.in lists doctors only after verification of their basic details and credentials.",
        },
        {
          q: "Can I cancel or reschedule an appointment?",
          a: "Yes. Contact our support team with your booking ID for assistance.",
        },
        {
          q: "Will I receive a confirmation?",
          a: "Yes, you will receive an SMS or email confirmation with appointment details.",
        },
      ],
    },
    {
      category: "Pathology Test FAQs",
      icon: "🧪",
      questions: [
        {
          q: "How do I book a test?",
          a: "Select the Pathology section, choose your test, select a lab, and confirm your booking.",
        },
        {
          q: "Is home sample collection available?",
          a: "Some partner labs offer home sample collection depending on location availability.",
        },
        {
          q: "How do I receive my reports?",
          a: "Your test report will be shared via email, WhatsApp, or collected directly from the lab.",
        },
        {
          q: "Are pathology labs verified?",
          a: "Yes, we only partner with trusted and registered labs.",
        },
      ],
    },
    {
      category: "Car & Ambulance Booking FAQs",
      icon: "🚑",
      questions: [
        {
          q: "How do I book a medical car or ambulance?",
          a: "Choose Vehicle Booking, select the car/ambulance type, enter your pickup and drop location, and confirm.",
        },
        {
          q: "Are emergency ambulances available 24/7?",
          a: "We try our best to connect you with available ambulances at all times, but availability may vary.",
        },
        {
          q: "Are the drivers trained for medical emergencies?",
          a: "Ambulance drivers are trained for emergency situations depending on service provider standards.",
        },
      ],
    },
    {
      category: "Payments & Refunds FAQs",
      icon: "💳",
      questions: [
        {
          q: "What payment methods do you support?",
          a: "We support UPI, Wallets, Credit/Debit Cards, Net Banking, and Cash (for some offline services).",
        },
        {
          q: "How do refunds work?",
          a: "Refunds are processed for cancelled bookings or failed transactions. It usually takes 3–7 working days depending on the bank or payment method.",
        },
        {
          q: "Do you charge cancellation fees?",
          a: "Cancellation fees depend on the doctor, lab, or vehicle provider's policy. We do not charge any extra platform fee.",
        },
      ],
    },
    {
      category: "Account & Technical FAQs",
      icon: "🔧",
      questions: [
        {
          q: "I forgot my password. What should I do?",
          a: "Use the Forgot Password option to reset your password via email or mobile OTP.",
        },
        {
          q: "I am unable to log in.",
          a: "Please check your internet connection, login details, or contact customer support if the issue persists.",
        },
        {
          q: "The website is not loading properly.",
          a: "Try clearing browser cache, switching browsers, or checking your internet connection.",
        },
      ],
    },
    {
      category: "Support & Contact FAQs",
      icon: "📞",
      questions: [
        {
          q: "How can I contact customer support?",
          a: "You can reach us via email at doctorhelpcare@gmail.com, phone at +91 9647243119, or visit our website at https://drhelp.in",
        },
      ],
    },
  ];

  return (
    <>
      <MetaTags
        title="Frequently Asked Questions (FAQ) – DrHelp.in"
        description="Find answers to common questions about doctor booking, pathology tests, car/ambulance services, payments, and account support on DrHelp.in"
        keywords="drhelp faq, frequently asked questions, help, support, doctor booking faq"
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
                  Frequently Asked Questions <span className="text-primary-600">(FAQ)</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Welcome to the DrHelp.in FAQ page! Here you will find the most common
                  questions and answers related to doctor booking, pathology tests,
                  car/ambulance services, payments, and account support.
                </p>
              </motion.div>
            </div>
          </section>

          {/* FAQ Sections */}
          <section className="py-16 bg-white dark:bg-gray-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="space-y-8">
                {faqSections.map((section, sectionIndex) => (
                  <motion.div
                    key={sectionIndex}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
                    className="mb-12"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <span className="text-3xl mr-3">{section.icon}</span>
                      {section.category}
                    </h2>
                    <div className="space-y-4">
                      {section.questions.map((faq, faqIndex) => {
                        const index = `${sectionIndex}-${faqIndex}`;
                        const isOpen = openIndex === index;
                        return (
                          <div
                            key={faqIndex}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                          >
                            <button
                              onClick={() => toggleFAQ(index)}
                              className="w-full px-6 py-4 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center justify-between"
                            >
                              <span className="font-semibold text-gray-900 dark:text-white pr-4">
                                {faq.q}
                              </span>
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
                                className="px-6 py-4 bg-white dark:bg-gray-800"
                              >
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                  {faq.a}
                                </p>
                              </motion.div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Still Have Questions?
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Can't find the answer you're looking for? Contact our support team.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href="mailto:doctorhelpcare@gmail.com"
                    className="flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <Mail className="w-5 h-5" />
                    <span>doctorhelpcare@gmail.com</span>
                  </a>
                  <a
                    href="tel:+919647243119"
                    className="flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <Phone className="w-5 h-5" />
                    <span>+91 9647243119</span>
                  </a>
                  <a
                    href="https://drhelp.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <Globe className="w-5 h-5" />
                    <span>https://drhelp.in</span>
                  </a>
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

