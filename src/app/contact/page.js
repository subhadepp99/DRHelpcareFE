"use client";

import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Clock,
  AlertCircle,
  Briefcase,
  FileText,
  MessageSquare,
  Send,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MetaTags from "@/components/common/MetaTags";

export default function ContactPage() {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      value: "doctorhelpcare@gmail.com",
      href: "mailto:doctorhelpcare@gmail.com",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+91-9242141716",
      href: "tel:+919242141716",
    },
    {
      icon: Globe,
      title: "Website",
      value: "https://drhelp.in",
      href: "https://drhelp.in",
    },
  ];

  const supportHours = {
    days: "Monday – Sunday",
    time: "9:00 AM to 9:00 PM",
  };

  const sections = [
    {
      icon: Phone,
      title: "Customer Support",
      description: "For general inquiries, booking support, or technical help",
      contact: {
        email: "doctorhelpcare@gmail.com",
        phone: "+91-9242141716",
        website: "https://drhelp.in",
      },
      hours: supportHours,
    },
    {
      icon: MapPin,
      title: "Office Address",
      description: "Our headquarters location",
      address: {
        name: "DrHelp.in",
        city: "Tamluk",
        state: "West Bengal",
        country: "India",
      },
    },
    {
      icon: AlertCircle,
      title: "Emergency Support",
      description: "For urgent vehicle or ambulance assistance",
      phone: "+91 9233240488",
    },
    {
      icon: Briefcase,
      title: "Business & Partnership Inquiries",
      description: "For business partnerships, collaborations, or listing your clinic/lab",
      phone: "+91 9242141716",
    },
    {
      icon: FileText,
      title: "Press & Media Contact",
      description: "For media inquiries, interviews, or press materials",
      phone: "+91 9242141716",
    },
    {
      icon: MessageSquare,
      title: "Report an Issue",
      description: "If you find incorrect information, technical bugs, or listing errors",
      phone: "+91 9242141716",
    },
    {
      icon: Send,
      title: "Feedback & Suggestions",
      description: "We value your feedback. Help us improve by sharing your ideas",
      email: "doctorhelpcare@gmail.com",
    },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://www.facebook.com/share/14JqPMM1M2L/",
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/drhelp.in?igsh=b3pocTdmb2dyeXNi",
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/",
    },
    {
      name: "YouTube",
      href: "https://youtube.com/@doctorhelpcare?si=MScYwt_IaC-4GWLY",
    },
  ];

  return (
    <>
      <MetaTags
        title="Contact Us – DrHelp.in"
        description="Contact DrHelp.in for questions about doctor booking, pathology tests, car/ambulance services, account issues, or anything else. Our team is ready to assist you."
        keywords="contact drhelp, customer support, healthcare booking support, drhelp contact"
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
                  Contact Us – <span className="text-primary-600">DrHelp.in</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  We're here to help! If you have questions about doctor booking, pathology
                  tests, car/ambulance services, account issues, or anything else—our team is
                  ready to assist you.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Quick Contact */}
          <section className="py-12 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {contactMethods.map((method, index) => (
                  <motion.a
                    key={method.title}
                    href={method.href}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="card p-6 text-center hover:shadow-lg transition-shadow duration-300 group"
                  >
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-600 transition-colors">
                      <method.icon className="w-6 h-6 text-primary-600 dark:text-primary-400 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {method.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">{method.value}</p>
                  </motion.a>
                ))}
              </div>
            </div>
          </section>

          {/* Support Hours */}
          <section className="py-8 bg-gray-100 dark:bg-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Clock className="w-5 h-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Support Hours
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {supportHours.days}: {supportHours.time}
                </p>
              </motion.div>
            </div>
          </section>

          {/* Detailed Contact Sections */}
          <section className="py-16 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="space-y-12">
                {sections.map((section, index) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="border-l-4 border-primary-600 pl-6"
                  >
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
                        <section.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {section.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {section.description}
                        </p>
                        <div className="space-y-2">
                          {section.contact && (
                            <>
                              {section.contact.email && (
                                <div className="flex items-center space-x-2">
                                  <Mail className="w-4 h-4 text-gray-400" />
                                  <a
                                    href={`mailto:${section.contact.email}`}
                                    className="text-primary-600 hover:underline"
                                  >
                                    {section.contact.email}
                                  </a>
                                </div>
                              )}
                              {section.contact.phone && (
                                <div className="flex items-center space-x-2">
                                  <Phone className="w-4 h-4 text-gray-400" />
                                  <a
                                    href={`tel:${section.contact.phone.replace(/\s/g, "")}`}
                                    className="text-primary-600 hover:underline"
                                  >
                                    {section.contact.phone}
                                  </a>
                                </div>
                              )}
                              {section.contact.website && (
                                <div className="flex items-center space-x-2">
                                  <Globe className="w-4 h-4 text-gray-400" />
                                  <a
                                    href={section.contact.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary-600 hover:underline"
                                  >
                                    {section.contact.website}
                                  </a>
                                </div>
                              )}
                              {section.hours && (
                                <div className="flex items-center space-x-2">
                                  <Clock className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-600 dark:text-gray-300">
                                    {section.hours.days}: {section.hours.time}
                                  </span>
                                </div>
                              )}
                            </>
                          )}
                          {section.phone && (
                            <div className="flex items-center space-x-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <a
                                href={`tel:${section.phone.replace(/\s/g, "")}`}
                                className="text-primary-600 hover:underline font-semibold"
                              >
                                {section.phone}
                              </a>
                            </div>
                          )}
                          {section.email && (
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <a
                                href={`mailto:${section.email}`}
                                className="text-primary-600 hover:underline"
                              >
                                {section.email}
                              </a>
                            </div>
                          )}
                          {section.address && (
                            <div className="flex items-start space-x-2">
                              <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                              <div>
                                <p className="text-gray-900 dark:text-white font-semibold">
                                  {section.address.name}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300">
                                  {section.address.city}, {section.address.state}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300">
                                  {section.address.country}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Social Media */}
          <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Connect With Us
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Follow our social channels
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
                    >
                      {social.name}
                    </a>
                  ))}
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

