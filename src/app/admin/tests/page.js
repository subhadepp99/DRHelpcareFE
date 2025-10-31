"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  TestTube,
  Clock,
  DollarSign,
  Image as ImageIcon,
  MapPin,
  Phone,
  Truck,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";
import StatesDropdown from "@/components/common/StatesDropdown";
import { getEntityImageUrl } from "@/utils/imageUtils";

export default function TestsPage() {
  const { get, post, put, del } = useApi();
  const [tests, setTests] = useState([]);
  const [pathologies, setPathologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    testCode: "",
    category: "",
    sampleType: "",
    description: "",
    price: "",
    discountedPrice: "",
    turnaroundTime: "24 hours",
    reportTime: "24 hours",
    preparationInstructions: "",
    isActive: true,
    imageUrl: "",
    components: [],
    pathologyLab: "",
    address: "",
    place: "",
    state: "",
    zipCode: "",
    country: "India",
    email: "",
    phone: "",
    homeCollection: {
      available: false,
      fee: 0,
      areas: [],
      timing: { start: "", end: "" },
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchTests();
    fetchPathologies();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const response = await get("/tests/admin/all");
      console.log("Tests API response:", response);
      const tests = response.data?.data?.tests || response.data?.tests || [];
      setTests(tests);
    } catch (error) {
      toast.error("Failed to fetch tests");
      console.error("Error fetching tests:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPathologies = async () => {
    try {
      const response = await get("/pathologies");
      const pathologies =
        response.data?.data?.pathologies || response.data?.pathologies || [];
      setPathologies(pathologies);
    } catch (error) {
      console.error("Error fetching pathologies:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();

      // Add all form fields
      Object.keys(formData).forEach((key) => {
        if (key === "homeCollection") {
          // Flatten nested homeCollection fields
          const hc = formData.homeCollection || {};
          if (typeof hc.available !== "undefined") {
            formDataToSend.append(
              "homeCollection[available]",
              String(!!hc.available)
            );
          }
          if (typeof hc.fee !== "undefined") {
            formDataToSend.append(
              "homeCollection[fee]",
              String(Number(hc.fee) || 0)
            );
          }
          if (Array.isArray(hc.areas)) {
            hc.areas
              .filter((a) => a && a.trim())
              .forEach((area) =>
                formDataToSend.append("homeCollection[areas]", area.trim())
              );
          }
          if (hc.timing && (hc.timing.start || hc.timing.end)) {
            if (hc.timing.start !== undefined) {
              formDataToSend.append(
                "homeCollection[timing][start]",
                hc.timing.start || ""
              );
            }
            if (hc.timing.end !== undefined) {
              formDataToSend.append(
                "homeCollection[timing][end]",
                hc.timing.end || ""
              );
            }
          }
        } else if (key === "components") {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add image file if selected
      if (selectedImage) {
        formDataToSend.append("image", selectedImage);
      }

      if (selectedTest) {
        await put(`/tests/${selectedTest._id}`, formDataToSend);
        toast.success("Test updated successfully");
      } else {
        await post("/tests", formDataToSend);
        toast.success("Test added successfully");
      }
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedTest(null);
      resetForm();
      fetchTests();
    } catch (error) {
      console.error("Error saving test:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Unknown error occurred";
      toast.error(
        selectedTest
          ? `Failed to update test: ${errorMessage}`
          : `Failed to add test: ${errorMessage}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (test) => {
    setSelectedTest(test);
    setFormData({
      name: test.name || "",
      testCode: test.testCode || "",
      category: test.category || "",
      sampleType: test.sampleType || "",
      description: test.description || "",
      price: test.price || "",
      discountedPrice: test.discountedPrice || "",
      turnaroundTime: test.turnaroundTime || "24 hours",
      reportTime: test.reportTime || "24 hours",
      preparationInstructions: test.preparationInstructions || "",
      isActive: test.isActive || true,
      imageUrl: test.imageUrl || "",
      components: test.components || [],
      pathologyLab: test.pathologyLab?._id || "",
      address: test.address || "",
      place: test.place || "",
      state: test.state || "",
      zipCode: test.zipCode || "",
      country: test.country || "India",
      email: test.email || "",
      phone: test.phone || "",
      homeCollection: test.homeCollection || {
        available: false,
        fee: 0,
        areas: [],
        timing: { start: "", end: "" },
      },
    });
    setImagePreview(test.imageUrl || null);
    setSelectedImage(null);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this test?")) return;

    try {
      await del(`/tests/${id}`);
      toast.success("Test deleted successfully");
      fetchTests();
    } catch (error) {
      toast.error("Failed to delete test");
      console.error("Error deleting test:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      testCode: "",
      category: "",
      sampleType: "",
      description: "",
      price: "",
      discountedPrice: "",
      turnaroundTime: "24 hours",
      reportTime: "24 hours",
      preparationInstructions: "",
      isActive: true,
      imageUrl: "",
      components: [],
      pathologyLab: "",
      address: "",
      place: "",
      state: "",
      zipCode: "",
      country: "India",
      email: "",
      phone: "",
      homeCollection: {
        available: false,
        fee: 0,
        areas: [],
        timing: { start: "", end: "" },
      },
    });
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
  };

  const addComponent = () => {
    const newComponent = {
      name: "",
      unit: "",
      referenceRange: "",
    };
    setFormData({
      ...formData,
      components: [...formData.components, newComponent],
    });
  };

  const removeComponent = (index) => {
    const newComponents = formData.components.filter((_, i) => i !== index);
    setFormData({ ...formData, components: newComponents });
  };

  const updateComponent = (index, field, value) => {
    const newComponents = [...formData.components];
    newComponents[index] = { ...newComponents[index], [field]: value };
    setFormData({ ...formData, components: newComponents });
  };

  const filteredTests = (tests || []).filter(
    (test) =>
      test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.sampleType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-100px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Test Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage individual pathology tests
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Test
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search tests by name, category, or sample type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Mobile Horizontal Scroll View */}
      <div className="md:hidden mb-6">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-4 min-w-max pb-4">
            {filteredTests.map((test) => (
              <div
                key={test._id}
                className="w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex-shrink-0"
              >
                {/* Test Image */}
                <div className="relative h-40 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900 dark:to-indigo-900">
                  {test.imageUrl ? (
                    <img
                      src={getEntityImageUrl(test, "imageUrl")}
                      alt={test.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <TestTube className="w-12 h-12 text-blue-400 dark:text-blue-300" />
                    </div>
                  )}

                  {/* Action Buttons Overlay */}
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button
                      onClick={() => handleEdit(test)}
                      className="p-1.5 bg-white/90 dark:bg-gray-800/90 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg backdrop-blur-sm transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDelete(test._id)}
                      className="p-1.5 bg-white/90 dark:bg-gray-800/90 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg backdrop-blur-sm transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Test Info */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 truncate">
                    {test.name}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">
                      {test.place}, {test.state}
                    </span>
                  </div>

                  {/* Test Details */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {test.category}
                    </span>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      ₹{test.discountedPrice || test.price}
                    </span>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(test)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(test._id)}
                      className="px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Sample Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Pathology Lab
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTests.map((test) => {
                const imgSrc = getEntityImageUrl(test, "imageUrl");
                return (
                  <tr
                    key={test._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        {imgSrc ? (
                          <img
                            src={imgSrc}
                            alt={test.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <TestTube className="w-5 h-5 text-blue-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {test.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                        {test.description}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {test.category}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {test.sampleType}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">
                          ₹{test.discountedPrice || test.price}
                        </span>
                        {test.discountedPrice &&
                          test.discountedPrice < test.price && (
                            <span className="text-xs text-gray-500 line-through">
                              ₹{test.price}
                            </span>
                          )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {test.pathologyLab?.name || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {test.isActive ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(test)}
                          className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(test._id)}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedTest ? "Edit Test" : "Add New Test"}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="input-field w-full"
                    placeholder="Test Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Test Code
                  </label>
                  <input
                    type="text"
                    value={formData.testCode}
                    onChange={(e) =>
                      setFormData({ ...formData, testCode: e.target.value })
                    }
                    className="input-field w-full"
                    placeholder="Test Code"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="input-field w-full"
                    placeholder="e.g., Blood, Urine, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sample Type *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sampleType}
                    onChange={(e) =>
                      setFormData({ ...formData, sampleType: e.target.value })
                    }
                    className="input-field w-full"
                    placeholder="Blood, Urine, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="input-field w-full"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Discounted Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.discountedPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountedPrice: e.target.value,
                      })
                    }
                    className="input-field w-full"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="input-field w-full"
                  placeholder="Test description"
                  rows={3}
                />
              </div>

              {/* Pathology Lab Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pathology Lab *
                </label>
                <select
                  required
                  value={formData.pathologyLab}
                  onChange={(e) =>
                    setFormData({ ...formData, pathologyLab: e.target.value })
                  }
                  className="input-field w-full"
                >
                  <option value="">Select Pathology Lab</option>
                  {pathologies.map((pathology) => (
                    <option key={pathology._id} value={pathology._id}>
                      {pathology.name} - {pathology.place}, {pathology.state}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Test Image
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300"
                    />
                  </div>
                  {selectedImage && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="px-3 py-2 text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Image Preview */}
                {(imagePreview || formData.imageUrl) && (
                  <div className="mt-4">
                    <div className="relative w-32 h-32 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                      <img
                        src={imagePreview || formData.imageUrl}
                        alt="Test preview"
                        className="w-full h-full object-cover"
                      />
                      {imagePreview && (
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Address */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="input-field w-full"
                    placeholder="Street address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Place *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.place}
                    onChange={(e) =>
                      setFormData({ ...formData, place: e.target.value })
                    }
                    className="input-field w-full"
                    placeholder="City/Town"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    State *
                  </label>
                  <StatesDropdown
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    name="state"
                    placeholder="Select State"
                    required={true}
                    className="input-field w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.zipCode}
                    onChange={(e) =>
                      setFormData({ ...formData, zipCode: e.target.value })
                    }
                    className="input-field w-full"
                    placeholder="ZIP Code"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    className="input-field w-full"
                    placeholder="Country"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="input-field w-full"
                    placeholder="Email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="input-field w-full"
                    placeholder="Phone number"
                  />
                </div>
              </div>

              {/* Test Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Turnaround Time
                  </label>
                  <input
                    type="text"
                    value={formData.turnaroundTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        turnaroundTime: e.target.value,
                      })
                    }
                    className="input-field w-full"
                    placeholder="24 hours"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Report Time
                  </label>
                  <input
                    type="text"
                    value={formData.reportTime}
                    onChange={(e) =>
                      setFormData({ ...formData, reportTime: e.target.value })
                    }
                    className="input-field w-full"
                    placeholder="24 hours"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preparation Instructions
                </label>
                <textarea
                  value={formData.preparationInstructions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preparationInstructions: e.target.value,
                    })
                  }
                  className="input-field w-full"
                  placeholder="Patient preparation instructions"
                  rows={3}
                />
              </div>

              {/* Services & Features */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isActive: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Active
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.homeCollection.available}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          homeCollection: {
                            ...formData.homeCollection,
                            available: e.target.checked,
                          },
                        })
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Home Collection Available
                    </span>
                  </label>
                </div>

                {formData.homeCollection.available && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Home Collection Fee
                      </label>
                      <input
                        type="number"
                        value={formData.homeCollection.fee}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            homeCollection: {
                              ...formData.homeCollection,
                              fee: parseFloat(e.target.value) || 0,
                            },
                          })
                        }
                        className="input-field w-full"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Service Areas
                      </label>
                      <input
                        type="text"
                        value={formData.homeCollection.areas.join(", ")}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            homeCollection: {
                              ...formData.homeCollection,
                              areas: e.target.value
                                .split(",")
                                .map((area) => area.trim())
                                .filter((area) => area),
                            },
                          })
                        }
                        className="input-field w-full"
                        placeholder="Area1, Area2, Area3"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Components Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    Test Components
                  </h4>
                  <button
                    type="button"
                    onClick={addComponent}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Add Component
                  </button>
                </div>

                {formData.components.map((component, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-gray-900 dark:text-white">
                        Component #{index + 1}
                      </h5>
                      <button
                        type="button"
                        onClick={() => removeComponent(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Component Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={component.name}
                          onChange={(e) =>
                            updateComponent(index, "name", e.target.value)
                          }
                          className="input-field w-full"
                          placeholder="Component name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Unit
                        </label>
                        <input
                          type="text"
                          value={component.unit}
                          onChange={(e) =>
                            updateComponent(index, "unit", e.target.value)
                          }
                          className="input-field w-full"
                          placeholder="mg/dL, %, etc."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Reference Range
                        </label>
                        <input
                          type="text"
                          value={component.referenceRange}
                          onChange={(e) =>
                            updateComponent(
                              index,
                              "referenceRange",
                              e.target.value
                            )
                          }
                          className="input-field w-full"
                          placeholder="Normal: 0-100, Abnormal: >100"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Form Actions */}
              <div className="flex space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {selectedTest ? "Updating..." : "Adding..."}
                    </>
                  ) : selectedTest ? (
                    "Update Test"
                  ) : (
                    "Add Test"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedTest(null);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
