"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  Rocket,
  Users,
  Lightbulb,
  TrendingUp,
  Code,
  HeadphonesIcon,
  Megaphone,
  MapPin,
  Mail,
  Send,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MetaTags from "@/components/common/MetaTags";

export default function CareersPage() {
  const whyWorkWithUs = [
    {
      icon: Rocket,
      title: "Meaningful Impact",
      description:
        "Every feature you build, every patient you support helps someone get better care—faster and easier.",
    },
    {
      icon: TrendingUp,
      title: "Fast-Growing Startup",
      description:
        "We are expanding across West Bengal with opportunities to grow your career from day one.",
    },
    {
      icon: Users,
      title: "Inclusive Work Culture",
      description:
        "We value honesty, teamwork, continuous learning, and a healthy work-life balance.",
    },
    {
      icon: Lightbulb,
      title: "Innovation First",
      description:
        "Work with modern tools, creative freedom, and a team that encourages new ideas.",
    },
    {
      icon: Briefcase,
      title: "Career Development",
      description:
        "We offer mentorship, training, and opportunities to experiment and lead.",
    },
  ];

  const openPositions = [
    {
      title: "Front-End Web Developer",
      location: "Remote/On-site",
      icon: Code,
      responsibilities: [
        "Build intuitive and responsive user interfaces",
        "Optimize website speed and SEO",
        "Collaborate with product and backend teams",
      ],
      requirements: [
        "Experience in HTML, CSS, JavaScript (React preferred)",
        "Understanding of UI/UX",
        "Strong problem-solving skills",
      ],
    },
    {
      title: "Customer Support Executive",
      location: "On-site",
      icon: HeadphonesIcon,
      responsibilities: [
        "Assist users with doctor bookings, pathology tests, and service issues",
        "Maintain friendly communication via chat, email, and phone",
        "Ensure timely issue resolution",
      ],
      requirements: [
        "Strong communication skills (English & Bengali)",
        "Patient and helpful attitude",
        "Basic computer skills",
      ],
    },
    {
      title: "Marketing & SEO Specialist",
      location: "Remote/On-site",
      icon: Megaphone,
      responsibilities: [
        "Create digital marketing strategies",
        "Run SEO & social media campaigns",
        "Monitor analytics and user engagement",
      ],
      requirements: [
        "Knowledge of SEO tools",
        "Creative writing and strategy skills",
        "Experience with Facebook, Instagram, and Google ads",
      ],
    },
    {
      title: "Field Operations Associate",
      location: "West Bengal",
      icon: MapPin,
      responsibilities: [
        "Coordinate with clinics, labs, and car service partners",
        "Manage daily operations and service tracking",
      ],
      requirements: [
        "Good communication skills",
        "Knowledge of local areas in West Bengal",
        "Ability to travel",
      ],
    },
  ];

  return (
    <>
      <MetaTags
        title="Careers at DrHelp.in"
        description="Join DrHelp.in in transforming digital healthcare in West Bengal. Find open positions and career opportunities."
        keywords="drhelp careers, healthcare jobs, web developer jobs, customer support jobs, drhelp hiring"
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
                  <Briefcase className="w-16 h-16 text-primary-600" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  Careers at <span className="text-primary-600">DrHelp.in</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-4">
                  Join Us in Transforming Digital Healthcare in West Bengal
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  At DrHelp.in, we are on a mission to simplify healthcare access for everyone.
                  From online doctor consultations and pathology bookings to fast medical car
                  services, we're building a seamless, secure, and user-friendly healthcare
                  platform for millions.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mt-4">
                  If you're passionate about innovation, technology, and making a real impact
                  in people's lives, we'd love to have you on our growing team.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Why Work With Us */}
          <section className="py-16 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                  Why Work With Us?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {whyWorkWithUs.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="card p-6 text-center hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <item.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {item.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* Open Positions */}
          <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                  Open Positions
                </h2>
                <div className="space-y-8">
                  {openPositions.map((position, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="card p-8 hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="flex items-start space-x-4 mb-6">
                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
                          <position.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                              {position.title}
                            </h3>
                            <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium">
                              {position.location}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Responsibilities:
                          </h4>
                          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-4">
                            {position.responsibilities.map((resp, idx) => (
                              <li key={idx}>{resp}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Requirements:
                          </h4>
                          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-4">
                            {position.requirements.map((req, idx) => (
                              <li key={idx}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* How to Apply */}
          <section className="py-16 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <div className="flex items-center justify-center mb-6">
                  <Send className="w-16 h-16 text-primary-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  How to Apply
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                  Send your resume, portfolio (if applicable), and a short cover letter to:
                </p>
                <div className="card p-8 max-w-md mx-auto">
                  <a
                    href="mailto:doctorhelpcare@gmail.com"
                    className="flex items-center justify-center space-x-3 text-primary-600 hover:text-primary-700 text-xl font-semibold"
                  >
                    <Mail className="w-6 h-6" />
                    <span>doctorhelpcare@gmail.com</span>
                  </a>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-8 max-w-2xl mx-auto">
                  We review every application carefully. If shortlisted, our HR team will
                  contact you for the next steps.
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

