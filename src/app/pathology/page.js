import { useState, useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Image from "next/image";

export default function Pathology() {
  const { get } = useApi();
  const [banners, setBanners] = useState([]);
  const [testPackages, setTestPackages] = useState([]);
  const [allTests, setAllTests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPathologyData();
  }, []);

  const fetchPathologyData = async () => {
    try {
      const bannerResponse = await get("/pathology/banners");
      setBanners(bannerResponse.data.banners || []);

      const packagesResponse = await get("/pathology/test-packages");
      setTestPackages(packagesResponse.data.testPackages || []);

      const testsResponse = await get("/pathology/tests");
      setAllTests(testsResponse.data.tests || []);
    } catch (error) {
      console.error("Error fetching pathology data:", error);
    }
  };

  const filteredTests = allTests.filter((test) =>
    test.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Pathology Services
        </h1>

        {/* Scrollable Banner */}
        {banners.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Featured Banners
            </h2>
            <div className="overflow-x-auto scrollbar-hide pb-4">
              <div className="flex space-x-4">
                {banners.map((banner) => (
                  <motion.div
                    key={banner._id}
                    className="flex-none w-80 h-48 rounded-lg overflow-hidden shadow-md relative"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Image
                      src={banner.imageUrl}
                      alt={banner.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                    <div classNameName="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                      <h3 className="font-bold text-lg">{banner.title}</h3>
                      <p className="text-sm">{banner.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Search Option */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Search Pathology Tests
          </h2>
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for tests..."
              className="input-field pl-10 pr-4 py-2 w-full rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>

        {/* Scroll Section for Test Packages */}
        {testPackages.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Popular Health Packages
            </h2>
            <div className="overflow-x-auto scrollbar-hide pb-4">
              <div className="flex space-x-4">
                {testPackages.map((pkg) => (
                  <motion.div
                    key={pkg._id}
                    className="flex-none w-64 rounded-lg overflow-hidden shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="relative h-40 w-full">
                      <Image
                        src={pkg.imageUrl}
                        alt={pkg.name}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                        {pkg.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {pkg.description}
                      </p>
                      <div className="font-semibold text-primary-600 dark:text-primary-400">
                        ₹{pkg.price}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* List of All Tests */}
        {allTests.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              All Available Tests
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTests.map((test) => (
                <motion.div
                  key={test._id}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {test.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {test.description}
                  </p>
                  <div className="font-bold text-primary-600 dark:text-primary-400">
                    ₹{test.price}
                  </div>
                </motion.div>
              ))}
            </div>
            {filteredTests.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
                No tests found matching your search.
              </p>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
