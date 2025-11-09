"use client";

import { useState, useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import { motion } from "framer-motion";
import {
  Search,
  Phone,
  TestTube,
  Package,
  Clock,
  MapPin,
  Star,
  Home,
  X,
} from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/utils/imageUtils";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroCarousel from "@/components/common/HeroCarousel";
import MetaTags from "@/components/common/MetaTags";
import { pageMetadata } from "@/utils/metadata";

export default function Pathology() {
  const { get } = useApi();
  const [searchQuery, setSearchQuery] = useState("");
  const [testPackages, setTestPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [allTests, setAllTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [homePickup, setHomePickup] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchPathologyData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTests(allTests);
      setFilteredPackages(testPackages);
    } else {
      const filteredTests = allTests.filter(
        (test) =>
          test.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          test.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          test.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const filteredPackages = testPackages.filter(
        (pkg) =>
          pkg.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pkg.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pkg.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setFilteredTests(filteredTests);
      setFilteredPackages(filteredPackages);
    }
  }, [searchQuery, allTests, testPackages]);

  const fetchPathologyData = async () => {
    try {
      setLoading(true);

      // Fetch test packages (pathology packages)
      const packagesResponse = await get("/pathology/test-packages");
      const packages =
        packagesResponse.data?.data?.testPackages ||
        packagesResponse.data?.testPackages ||
        [];
      setTestPackages(packages);
      setFilteredPackages(packages);

      // Fetch individual tests from the new tests endpoint
      const testsResponse = await get("/tests");
      const tests =
        testsResponse.data?.data?.tests || testsResponse.data?.tests || [];
      setAllTests(tests);
      setFilteredTests(tests);
    } catch (error) {
      console.error("Error fetching pathology data:", error);
      setTestPackages([]);
      setFilteredPackages([]);
      setAllTests([]);
      setFilteredTests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (phoneNumber = "+919242141716") => {
    window.open(`tel:${phoneNumber}`, "_blank");
  };

  const getDiscountPercentage = (originalPrice, discountedPrice) => {
    if (!originalPrice || !discountedPrice) return 0;
    return Math.round(
      ((originalPrice - discountedPrice) / originalPrice) * 100
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <MetaTags
        title={pageMetadata.pathology.title}
        description={pageMetadata.pathology.description}
        keywords={pageMetadata.pathology.keywords}
      />
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
        <Header />

        <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-16"
          >
            <div className="max-w-xl mx-auto">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search for tests, packages, or categories..."
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : null}
                </div>
                <div className="flex items-center justify-center">
                  <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <input
                      type="checkbox"
                      checked={homePickup}
                      onChange={(e) => setHomePickup(e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <Home className="w-4 h-4" />
                    <span>Home Collection Available</span>
                  </label>
                </div>
                {searchQuery && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Found {filteredTests.length} test
                    {filteredTests.length !== 1 ? "s" : ""} and{" "}
                    {filteredPackages.length} package
                    {filteredPackages.length !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
          </motion.section>

          {/* Pathology Banners - Hide when searching */}
          {!searchQuery && (
            <div className="mb-10">
              <HeroCarousel placement="pathology" />
            </div>
          )}

          {/* Featured Packages Slider */}
          {filteredPackages.length > 0 ? (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
                Featured Health Packages
              </h2>

              {filteredPackages.length <= 4 ? (
                // Show all packages in a grid for 4 or fewer
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredPackages.map((pkg, index) => (
                    <motion.div
                      key={pkg._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative h-32 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-900">
                        {getImageUrl(pkg.imageUrl) ? (
                          <img
                            src={getImageUrl(pkg.imageUrl)}
                            alt={pkg.name}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Package className="w-12 h-12 text-primary-600 dark:text-primary-400" />
                          </div>
                        )}
                        {pkg.discountedPrice &&
                          pkg.discountedPrice < pkg.price && (
                            <div className="absolute top-2 right-2">
                              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                {getDiscountPercentage(
                                  pkg.price,
                                  pkg.discountedPrice
                                )}
                                % OFF
                              </span>
                            </div>
                          )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                          {pkg.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm line-clamp-2">
                          {pkg.description}
                        </p>
                        {pkg.rating && pkg.rating.average > 0 && (
                          <div className="flex items-center mb-2">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="ml-1 text-sm font-medium text-gray-900 dark:text-white">
                              {pkg.rating.average.toFixed(1)}
                            </span>
                            <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                              ({pkg.rating.count} reviews)
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                              ₹{pkg.discountedPrice || pkg.price}
                            </span>
                            {pkg.discountedPrice &&
                              pkg.discountedPrice < pkg.price && (
                                <span className="text-sm text-gray-500 line-through">
                                  ₹{pkg.price}
                                </span>
                              )}
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {pkg.category}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCall()}
                          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-1.5 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-sm"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Book Package</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                // Show slider for more than 4 packages
                <div className="relative">
                  <div className="overflow-hidden">
                    <div
                      className="flex space-x-6 transition-transform duration-300 ease-in-out"
                      style={{
                        transform: `translateX(-${currentSlide * 100}%)`,
                      }}
                    >
                      {filteredPackages.map((pkg, index) => (
                        <motion.div
                          key={pkg._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.1 * index }}
                          className="flex-none w-64 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300"
                        >
                          <div className="relative h-32 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-900">
                            {getImageUrl(pkg.imageUrl) ? (
                              <img
                                src={getImageUrl(pkg.imageUrl)}
                                alt={pkg.name}
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Package className="w-12 h-12 text-primary-600 dark:text-primary-400" />
                              </div>
                            )}
                            {pkg.discountedPrice &&
                              pkg.discountedPrice < pkg.price && (
                                <div className="absolute top-2 right-2">
                                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                    {getDiscountPercentage(
                                      pkg.price,
                                      pkg.discountedPrice
                                    )}
                                    % OFF
                                  </span>
                                </div>
                              )}
                          </div>
                          <div className="p-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                              {pkg.name}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm line-clamp-2">
                              {pkg.description}
                            </p>
                            {pkg.rating && pkg.rating.average > 0 && (
                              <div className="flex items-center mb-2">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="ml-1 text-sm font-medium text-gray-900 dark:text-white">
                                  {pkg.rating.average.toFixed(1)}
                                </span>
                                <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                                  ({pkg.rating.count} reviews)
                                </span>
                              </div>
                            )}
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                                  ₹{pkg.discountedPrice || pkg.price}
                                </span>
                                {pkg.discountedPrice &&
                                  pkg.discountedPrice < pkg.price && (
                                    <span className="text-sm text-gray-500 line-through">
                                      ₹{pkg.price}
                                    </span>
                                  )}
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {pkg.category}
                              </span>
                            </div>
                            <button
                              onClick={() => handleCall()}
                              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-1.5 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-sm"
                            >
                              <Phone className="w-3 h-3" />
                              <span>Book Package</span>
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Navigation Dots */}
                  <div className="flex justify-center mt-6 space-x-2">
                    {Array.from({
                      length: Math.ceil(filteredPackages.length / 4),
                    }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                          currentSlide === index
                            ? "bg-primary-600"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Navigation Arrows */}
                  {filteredPackages.length > 4 && (
                    <>
                      <button
                        onClick={() =>
                          setCurrentSlide(Math.max(0, currentSlide - 1))
                        }
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                        disabled={currentSlide === 0}
                      >
                        <svg
                          className="w-5 h-5 text-gray-600 dark:text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() =>
                          setCurrentSlide(
                            Math.min(
                              Math.ceil(filteredPackages.length / 4) - 1,
                              currentSlide + 1
                            )
                          )
                        }
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                        disabled={
                          currentSlide ===
                          Math.ceil(filteredPackages.length / 4) - 1
                        }
                      >
                        <svg
                          className="w-5 h-5 text-gray-600 dark:text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              )}
            </motion.section>
          ) : (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-16"
            >
              <div className="text-center py-8">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Health Packages Available
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Currently no health packages are available. Please check back
                  later or contact us for custom packages.
                </p>
              </div>
            </motion.section>
          )}

          {/* All Tests List View */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
              All Available Tests
            </h2>

            {filteredTests.length === 0 && filteredPackages.length === 0 ? (
              <div className="text-center py-12">
                <TestTube className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No tests or packages found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search terms or check back later for new
                  tests and packages.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTests.map((test, index) => (
                  <motion.div
                    key={test._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.05 * index }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    {/* Test Image */}
                    <div className="relative h-40 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-900">
                      {getImageUrl(test.imageUrl) ? (
                        <img
                          src={getImageUrl(test.imageUrl)}
                          alt={test.name}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <TestTube className="w-12 h-12 text-primary-600 dark:text-primary-400" />
                        </div>
                      )}
                      {test.discountedPrice &&
                        test.discountedPrice < test.price && (
                          <div className="absolute top-2 right-2">
                            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                              {getDiscountPercentage(
                                test.price,
                                test.discountedPrice
                              )}
                              % OFF
                            </span>
                          </div>
                        )}
                    </div>

                    {/* Test Content */}
                    <div className="p-4">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[48px]">
                        {test.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm line-clamp-2 min-h-[40px]">
                        {test.description}
                      </p>

                      {/* Rating */}
                      {test.rating && test.rating.average > 0 && (
                        <div className="flex items-center mb-3">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1 text-sm font-medium text-gray-900 dark:text-white">
                            {test.rating.average.toFixed(1)}
                          </span>
                          <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                            ({test.rating.count} reviews)
                          </span>
                        </div>
                      )}

                      {/* Test Details */}
                      <div className="flex flex-wrap gap-2 mb-3 text-xs text-gray-500 dark:text-gray-400">
                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {test.category || "General"}
                        </span>
                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {test.reportTime || "24 hours"}
                        </span>
                      </div>

                      {/* Price and Actions */}
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                                ₹{test.discountedPrice || test.price}
                              </span>
                              {test.discountedPrice &&
                                test.discountedPrice < test.price && (
                                  <span className="text-sm text-gray-500 line-through">
                                    ₹{test.price}
                                  </span>
                                )}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const testName = encodeURIComponent(
                                test.name.replace(/\s+/g, "-").toLowerCase()
                              );
                              const location = encodeURIComponent(
                                test.place || test.state || "unknown"
                              );
                              window.location.href = `/test/${testName}/${location}`;
                            }}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-sm"
                          >
                            <TestTube className="w-4 h-4" />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => handleCall()}
                            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-sm"
                          >
                            <Phone className="w-4 h-4" />
                            <span>Book</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-16"
          >
            <div className="bg-primary-600 dark:bg-primary-700 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                Need Help Choosing Tests?
              </h3>
              <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
                Our pathology experts are here to help you select the right
                tests for your health needs. Call us for personalized
                consultation and package recommendations.
              </p>
              <button
                onClick={() => handleCall()}
                className="bg-white text-primary-600 hover:bg-primary-50 font-semibold py-4 px-8 rounded-xl transition-colors duration-200 flex items-center space-x-2 mx-auto"
              >
                <Phone className="w-5 h-5" />
                <span>Call for Consultation</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
      </div>
    </>
  );
}
