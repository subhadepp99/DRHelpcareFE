"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, Search } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MetaTags from "@/components/common/MetaTags";
import { pageMetadata } from "@/utils/metadata";
import Image from "next/image";

export default function BlogPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Sample blog posts data - In production, this would come from an API
  const blogPosts = [
    {
      id: 1,
      slug: "healthcare-services-midnapore",
      title: "Comprehensive Healthcare Services Now Available in Midnapore",
      excerpt:
        "DrHelp.in launches a revolutionary platform connecting patients with trusted doctors, clinics, and pathology labs across Midnapore, Tamluk, Haldia, and Contai.",
      author: "Dr. Rajesh Kumar",
      date: "October 25, 2025",
      category: "Healthcare",
      image: "/images/blog-1.jpg",
      readTime: "5 min read",
    },
    {
      id: 2,
      slug: "book-appointments-online",
      title: "How to Book Medical Appointments Online: A Complete Guide",
      excerpt:
        "Learn how to easily book appointments with doctors, schedule pathology tests, and access emergency ambulance services through DrHelp.in platform.",
      author: "Priya Sharma",
      date: "October 20, 2025",
      category: "Digital Health",
      image: "/images/blog-2.jpg",
      readTime: "4 min read",
    },
    {
      id: 3,
      slug: "importance-regular-health-checkups",
      title: "The Importance of Regular Health Check-ups",
      excerpt:
        "Discover why regular health screenings are crucial for early disease detection and maintaining overall wellness. Book your health package today.",
      author: "Dr. Anita Das",
      date: "October 15, 2025",
      category: "Health Tips",
      image: "/images/blog-3.jpg",
      readTime: "6 min read",
    },
    {
      id: 4,
      slug: "emergency-ambulance-services",
      title: "24/7 Emergency Ambulance Services: What You Need to Know",
      excerpt:
        "Understanding emergency medical services and how to quickly access ambulance support in critical situations across Midnapore region.",
      author: "Dr. Suresh Patel",
      date: "October 10, 2025",
      category: "Emergency Care",
      image: "/images/blog-4.jpg",
      readTime: "5 min read",
    },
    {
      id: 5,
      slug: "choosing-right-pathology-lab",
      title: "How to Choose the Right Pathology Lab for Your Tests",
      excerpt:
        "Key factors to consider when selecting a pathology laboratory, including accreditation, technology, and accuracy of results.",
      author: "Dr. Meera Singh",
      date: "October 5, 2025",
      category: "Diagnostics",
      image: "/images/blog-5.jpg",
      readTime: "4 min read",
    },
    {
      id: 6,
      slug: "telemedicine-future-healthcare",
      title: "Telemedicine: The Future of Healthcare is Here",
      excerpt:
        "Explore how telemedicine is transforming healthcare delivery and making quality medical consultation accessible to everyone.",
      author: "Dr. Amit Chatterjee",
      date: "September 30, 2025",
      category: "Technology",
      image: "/images/blog-6.jpg",
      readTime: "7 min read",
    },
  ];

  const filteredPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [
    "All",
    "Healthcare",
    "Digital Health",
    "Health Tips",
    "Emergency Care",
    "Diagnostics",
    "Technology",
  ];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const displayedPosts =
    selectedCategory === "All"
      ? filteredPosts
      : filteredPosts.filter((post) => post.category === selectedCategory);

  return (
    <>
      <MetaTags
        title={pageMetadata.blog.title}
        description={pageMetadata.blog.description}
        keywords={pageMetadata.blog.keywords}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />

        {/* Blog Header */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-900 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              DrHelp Blog
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Your trusted source for healthcare insights, medical tips, and
              wellness advice
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-full border-0 focus:ring-2 focus:ring-primary-300 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {displayedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                  onClick={() => router.push(`/blog/${post.slug}`)}
                >
                  {/* Blog Image */}
                  <div className="relative h-48 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-900">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl">📰</span>
                    </div>
                  </div>

                  {/* Blog Content */}
                  <div className="p-6">
                    {/* Category Badge */}
                    <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 text-xs font-semibold rounded-full mb-3">
                      {post.category}
                    </span>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Meta Information */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{post.date}</span>
                        </div>
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    {/* Author */}
                    <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {post.author}
                        </span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No articles found matching your search.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
      </div>
    </>
  );
}

