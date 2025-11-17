"use client";

import { useState, useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import { motion } from "framer-motion";
import {
  Phone,
  TestTube,
  Clock,
  MapPin,
  Star,
  Home,
  ArrowLeft,
  Calendar,
  DollarSign,
  User,
  Mail,
  Truck,
} from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/utils/imageUtils";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useRouter } from "next/navigation";
import ReviewSection from "@/components/common/ReviewSection";

export default function TestDetailPage({ params }) {
  const router = useRouter();
  const { get } = useApi();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTestDetails();
  }, [params.testName, params.location]);

  const fetchTestDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Decode the test name and location
      const testName = decodeURIComponent(params.testName).replace(/-/g, " ");
      const location = decodeURIComponent(params.location);

      // Search for the test by name and location
      const response = await get(
        `/tests/search?name=${encodeURIComponent(
          testName
        )}&location=${encodeURIComponent(location)}`
      );

      const tests = response.data?.data?.tests || response.data?.tests || [];

      if (tests.length === 0) {
        setError("Test not found");
        return;
      }

      // Find the best match
      const matchedTest =
        tests.find(
          (t) =>
            t.name.toLowerCase().includes(testName.toLowerCase()) &&
            (t.place?.toLowerCase().includes(location.toLowerCase()) ||
              t.state?.toLowerCase().includes(location.toLowerCase()))
        ) || tests[0];

      setTest(matchedTest);
    } catch (error) {
      setError("Failed to load test details");
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (phoneNumber = "+919242141716") => {
    window.open(`tel:${phoneNumber}`, "_blank");
  };

  const handleBookTest = () => {
    handleCall();
  };

  const goBack = () => {
    router.back();
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

  if (error || !test) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <div className="pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <TestTube className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {error || "Test Not Found"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                The test you're looking for doesn't exist or has been removed.
              </p>
              <button
                onClick={goBack}
                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2 mx-auto"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Go Back</span>
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <button
              onClick={goBack}
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Tests</span>
            </button>
          </motion.div>

          {/* Test Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Test Image and Basic Info */}
              <div className="space-y-6">
                {/* Test Image */}
                <div className="relative h-64 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-900 rounded-xl overflow-hidden">
                  {getImageUrl(test.imageUrl) ? (
                    <img
                      src={getImageUrl(test.imageUrl)}
                      alt={test.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <TestTube className="w-16 h-16 text-primary-600 dark:text-primary-400" />
                    </div>
                  )}
                </div>

                {/* Test Name and Category */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {test.name}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-3 py-1 rounded-full font-medium">
                      {test.category}
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full">
                      {test.sampleType}
                    </span>
                  </div>
                </div>

                {/* Description */}
                {test.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      About This Test
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {test.description}
                    </p>
                  </div>
                )}

                {/* Test Components */}
                {test.components && test.components.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Test Components
                    </h3>
                    <div className="space-y-2">
                      {test.components.map((component, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {component.name}
                            </span>
                            {component.unit && (
                              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                                ({component.unit})
                              </span>
                            )}
                          </div>
                          {component.referenceRange && (
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {component.referenceRange}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Test Details and Booking */}
              <div className="space-y-6">
                {/* Price and Booking */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">Test Price</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-3xl font-bold">
                          ₹{test.discountedPrice || test.price}
                        </span>
                        {test.discountedPrice &&
                          test.discountedPrice < test.price && (
                            <span className="text-lg line-through opacity-75">
                              ₹{test.price}
                            </span>
                          )}
                      </div>
                    </div>
                    {test.discountedPrice &&
                      test.discountedPrice < test.price && (
                        <div className="text-right">
                          <span className="bg-white text-primary-600 px-3 py-1 rounded-full text-sm font-bold">
                            {Math.round(
                              ((test.price - test.discountedPrice) /
                                test.price) *
                                100
                            )}
                            % OFF
                          </span>
                        </div>
                      )}
                  </div>
                  <button
                    onClick={handleBookTest}
                    className="w-full bg-white text-primary-600 hover:bg-primary-50 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Book This Test</span>
                  </button>
                </div>

                {/* Test Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Test Information
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          Turnaround Time
                        </span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {test.turnaroundTime || "24 hours"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          Report Time
                        </span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {test.reportTime || "24 hours"}
                        </p>
                      </div>
                    </div>

                    {test.preparationInstructions && (
                      <div className="flex items-start space-x-3">
                        <User className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-1" />
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            Preparation Instructions
                          </span>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {test.preparationInstructions}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pathology Lab Information */}
                {test.pathologyLab && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Pathology Lab
                    </h3>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                      <div className="flex items-center space-x-3">
                        <TestTube className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {test.pathologyLab.name}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        <div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {test.address}, {test.place}, {test.state} -{" "}
                            {test.zipCode}
                          </span>
                        </div>
                      </div>

                      {test.pathologyLab.phone && (
                        <div className="flex items-center space-x-3">
                          <Phone className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                          <div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {test.pathologyLab.phone}
                            </span>
                          </div>
                        </div>
                      )}

                      {test.pathologyLab.email && (
                        <div className="flex items-center space-x-3">
                          <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                          <div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {test.pathologyLab.email}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Home Collection */}
                {test.homeCollection?.available && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Home Collection
                    </h3>

                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 space-y-3">
                      <div className="flex items-center space-x-3">
                        <Truck className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <div>
                          <span className="font-medium text-green-800 dark:text-green-200">
                            Home Collection Available
                          </span>
                          {test.homeCollection.fee > 0 && (
                            <p className="text-sm text-green-600 dark:text-green-400">
                              Collection Fee: ₹{test.homeCollection.fee}
                            </p>
                          )}
                        </div>
                      </div>

                      {test.homeCollection.areas &&
                        test.homeCollection.areas.length > 0 && (
                          <div>
                            <span className="text-sm font-medium text-green-800 dark:text-green-200">
                              Service Areas:
                            </span>
                            <p className="text-sm text-green-600 dark:text-green-400">
                              {test.homeCollection.areas.join(", ")}
                            </p>
                          </div>
                        )}

                      {test.homeCollection.timing &&
                        (test.homeCollection.timing.start ||
                          test.homeCollection.timing.end) && (
                          <div>
                            <span className="text-sm font-medium text-green-800 dark:text-green-200">
                              Collection Hours:
                            </span>
                            <p className="text-sm text-green-600 dark:text-green-400">
                              {test.homeCollection.timing.start} -{" "}
                              {test.homeCollection.timing.end}
                            </p>
                          </div>
                        )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-8"
          >
            <div className="bg-primary-600 dark:bg-primary-700 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                Need More Information?
              </h3>
              <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
                Our pathology experts are here to help you understand this test
                better. Call us for detailed information, preparation guidance,
                and booking assistance.
              </p>
              <button
                onClick={handleCall}
                className="bg-white text-primary-600 hover:bg-primary-50 font-semibold py-4 px-8 rounded-xl transition-colors duration-200 flex items-center space-x-2 mx-auto"
              >
                <Phone className="w-5 h-5" />
                <span>Call for Assistance</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Reviews */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <ReviewSection
          entityType="Pathology"
          entityId={test?._id}
          entityName={test?.name || "this test"}
        />
      </div>

      <Footer />
    </div>
  );
}
