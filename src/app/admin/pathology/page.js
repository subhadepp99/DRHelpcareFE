"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  TestTube,
  Home,
  Clock,
  DollarSign,
  Image as ImageIcon,
  MapPin,
  Phone,
  Truck,
} from "lucide-react";
import toast from "react-hot-toast";
import StatesDropdown from "@/components/common/StatesDropdown";
import { getEntityImageUrl } from "@/utils/imageUtils";

export default function PathologyPage() {
  const { get, post, put, del } = useApi();
  const [pathologies, setPathologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPathology, setSelectedPathology] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    licenseNumber: "",
    email: "",
    phone: "",
    address: "",
    place: "",
    state: "",
    zipCode: "",
    country: "India",
    servicesOffered: [],
    testsOffered: [],
    is24Hours: false,
    imageUrl: "",
    homeCollection: {
      available: false,
      fee: 0,
      areas: [],
      timing: {
        start: "",
        end: "",
      },
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchPathologies();
  }, []);

  const fetchPathologies = async () => {
    try {
      setLoading(true);
      const response = await get("/pathologies");
      console.log("Pathology API response:", response); // Debug log
      const pathologies =
        response.data?.data?.pathologies || response.data?.pathologies || [];
      setPathologies(pathologies);
    } catch (error) {
      toast.error("Failed to fetch pathologies");
      console.error("Error fetching pathologies:", error);
    } finally {
      setLoading(false);
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
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === "testsOffered") {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === "servicesOffered") {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === "imageUrl") {
          // Skip imageUrl as it will be handled by the backend
        } else if (
          key === "licenseNumber" &&
          (!formData[key] || formData[key].trim() === "")
        ) {
          // Skip empty license numbers to avoid duplicate key errors
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Debug: Log what's being sent
      console.log("Form data being sent:", formData);
      console.log("FormData entries:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}: ${value}`);
      }

      // Additional debugging for required fields
      console.log("Required fields check:");
      console.log("- name:", formData.name);
      console.log("- description:", formData.description);
      console.log("- category:", formData.category);
      console.log("- price:", formData.price);
      console.log("- email:", formData.email);
      console.log("- phone:", formData.phone);
      console.log("- address:", formData.address);
      console.log("- place:", formData.place);
      console.log("- state:", formData.state);
      console.log("- zipCode:", formData.zipCode);

      // Add image file if selected
      if (selectedImage) {
        formDataToSend.append("image", selectedImage);
      }

      // Add image file if selected
      if (selectedImage) {
        formDataToSend.append("image", selectedImage);
      }

      if (selectedPathology) {
        await put(`/pathologies/${selectedPathology._id}`, formDataToSend);
        toast.success("Pathology updated successfully");
      } else {
        await post("/pathologies", formDataToSend);
        toast.success("Pathology added successfully");
      }
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedPathology(null);
      resetForm();
      fetchPathologies();
    } catch (error) {
      console.error("Error saving pathology:", error);
      console.error("Error response:", error.response);
      console.error("Error data:", error.response?.data);

      // Show more specific error message
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Unknown error occurred";
      toast.error(
        selectedPathology
          ? `Failed to update pathology: ${errorMessage}`
          : `Failed to add pathology: ${errorMessage}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (pathology) => {
    setSelectedPathology(pathology);
    setFormData({
      name: pathology.name || "",
      description: pathology.description || "",
      category: pathology.category || "",
      price: pathology.price || "",
      licenseNumber: pathology.licenseNumber || "",
      email: pathology.email || "",
      phone: pathology.phone || "",
      address: pathology.address || "",
      place: pathology.place || "",
      state: pathology.state || "",
      zipCode: pathology.zipCode || "",
      country: pathology.country || "India",
      servicesOffered: pathology.servicesOffered || [],
      testsOffered: pathology.testsOffered || [],
      is24Hours: pathology.is24Hours || false,
      imageUrl: pathology.imageUrl || "",
      homeCollection: pathology.homeCollection || {
        available: false,
        fee: 0,
        areas: [],
        timing: {
          start: "",
          end: "",
        },
      },
    });
    setImagePreview(pathology.imageUrl || null);
    setSelectedImage(null);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this pathology?")) return;

    try {
      await del(`/pathologies/${id}`);
      toast.success("Pathology deleted successfully");
      fetchPathologies();
    } catch (error) {
      toast.error("Failed to delete pathology");
      console.error("Error deleting pathology:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      price: "",
      licenseNumber: "",
      email: "",
      phone: "",
      address: "",
      place: "",
      state: "",
      zipCode: "",
      country: "India",
      servicesOffered: [],
      testsOffered: [],
      is24Hours: false,
      imageUrl: "",
      homeCollection: {
        available: false,
        fee: 0,
        areas: [],
        timing: {
          start: "",
          end: "",
        },
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

  const addTest = () => {
    const newTest = {
      name: "",
      category: "",
      price: 0,
      discountedPrice: 0,
      discountType: "flat",
      discountValue: 0,
      requiresPrescription: false,
      imageUrl: "",
      description: "",
      preparationInstructions: "",
      reportTime: "",
      isHomeCollection: false,
      homeCollectionFee: 0,
    };
    setFormData({
      ...formData,
      testsOffered: [...formData.testsOffered, newTest],
    });
  };

  const removeTest = (index) => {
    const newTests = formData.testsOffered.filter((_, i) => i !== index);
    setFormData({ ...formData, testsOffered: newTests });
  };

  const updateTest = (index, field, value) => {
    const newTests = [...formData.testsOffered];
    newTests[index] = { ...newTests[index], [field]: value };
    setFormData({ ...formData, testsOffered: newTests });
  };

  const handleTestImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newTests = [...formData.testsOffered];
      newTests[index].imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, testsOffered: newTests });
    }
  };

  const removeTestImage = (index) => {
    const newTests = [...formData.testsOffered];
    newTests[index].imageUrl = "";
    setFormData({ ...formData, testsOffered: newTests });
  };

  const filteredPathologies = (pathologies || []).filter(
    (pathology) =>
      pathology.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pathology.place.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pathology.state.toLowerCase().includes(searchTerm.toLowerCase())
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
            Pathology Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage pathology labs, tests, and services
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Pathology
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search pathologies by name, place, or state..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Mobile Horizontal Scroll View */}
      <div className="md:hidden mb-6">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-4 min-w-max pb-4">
            {filteredPathologies.map((pathology) => (
              <div
                key={pathology._id}
                className="w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex-shrink-0"
              >
                {/* Pathology Image */}
                <div className="relative h-40 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900 dark:to-indigo-900">
                  {pathology.imageUrl ? (
                    <img
                      src={getEntityImageUrl(pathology, "imageUrl")}
                      alt={pathology.name}
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
                      onClick={() => handleEdit(pathology)}
                      className="p-1.5 bg-white/90 dark:bg-gray-800/90 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg backdrop-blur-sm transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDelete(pathology._id)}
                      className="p-1.5 bg-white/90 dark:bg-gray-800/90 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg backdrop-blur-sm transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Pathology Info */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 truncate">
                    {pathology.name}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">
                      {pathology.place}, {pathology.state}
                    </span>
                  </div>

                  {/* Tests Count */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {pathology.testsOffered?.length || 0} Tests
                    </span>
                    {pathology.homeCollection?.available && (
                      <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full">
                        Home Collection
                      </span>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(pathology)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pathology._id)}
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

      {/* Desktop Grid View */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPathologies.map((pathology) => (
          <div
            key={pathology._id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden transform hover:-translate-y-1"
          >
            {/* Pathology Image */}
            <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900 dark:to-indigo-900">
              {pathology.imageUrl ? (
                <img
                  src={getEntityImageUrl(pathology, "imageUrl")}
                  alt={pathology.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <TestTube className="w-16 h-16 text-blue-400 dark:text-blue-300" />
                </div>
              )}

              {/* Action Buttons Overlay */}
              <div className="absolute top-3 right-3 flex space-x-2">
                <button
                  onClick={() => handleEdit(pathology)}
                  className="p-2 bg-white/90 dark:bg-gray-800/90 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg backdrop-blur-sm transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(pathology._id)}
                  className="p-2 bg-white/90 dark:bg-gray-800/90 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg backdrop-blur-sm transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Pathology Info */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {pathology.name}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {pathology.place}, {pathology.state}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4" />
                  <span>{pathology.phone}</span>
                </div>
              </div>

              {/* Home Collection Badge */}
              {pathology.homeCollection?.available && (
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <Truck className="w-3 h-3 mr-1" />
                    Home Collection Available
                    {pathology.homeCollection.fee && (
                      <span className="ml-1">
                        (₹{pathology.homeCollection.fee})
                      </span>
                    )}
                  </span>
                </div>
              )}

              {/* Tests Packages */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                  Test Packages ({pathology.testsOffered?.length || 0})
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {pathology.testsOffered?.slice(0, 3).map((test, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {test.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {test.reportTime || "24h"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                            ₹{test.discountedPrice || test.price}
                          </span>
                          {test.discountedPrice &&
                            test.discountedPrice < test.price && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹{test.price}
                              </span>
                            )}
                        </div>
                        {test.discountValue && (
                          <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded-full">
                            {test.discountType === "percentage"
                              ? `${test.discountValue}% OFF`
                              : `₹${test.discountValue} OFF`}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {pathology.testsOffered?.length > 3 && (
                    <div className="text-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        +{pathology.testsOffered.length - 3} more tests
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(pathology)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(pathology._id)}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedPathology ? "Edit Pathology" : "Add New Pathology"}
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
                    placeholder="Pathology Lab Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="input-field w-full"
                    placeholder="Pathology description"
                    rows={3}
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
                    placeholder="e.g., General, Specialized, etc."
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
                    License Number
                  </label>
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        licenseNumber: e.target.value,
                      })
                    }
                    className="input-field w-full"
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="input-field w-full"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="input-field w-full"
                    placeholder="Phone number"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pathology Image
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
                        alt="Pathology preview"
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

              {/* Services & Features */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is24Hours}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is24Hours: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      24/7 Service Available
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

              {/* Tests Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    Available Tests
                  </h4>
                  <button
                    type="button"
                    onClick={addTest}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Add Test
                  </button>
                </div>

                {formData.testsOffered.map((test, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-gray-900 dark:text-white">
                        Test #{index + 1}
                      </h5>
                      <button
                        type="button"
                        onClick={() => removeTest(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Test Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={test.name}
                          onChange={(e) =>
                            updateTest(index, "name", e.target.value)
                          }
                          className="input-field w-full"
                          placeholder="Test name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Category
                        </label>
                        <input
                          type="text"
                          value={test.category}
                          onChange={(e) =>
                            updateTest(index, "category", e.target.value)
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
                          value={test.price}
                          onChange={(e) =>
                            updateTest(
                              index,
                              "price",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="input-field w-full"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Discount Type
                        </label>
                        <select
                          value={test.discountType}
                          onChange={(e) =>
                            updateTest(index, "discountType", e.target.value)
                          }
                          className="input-field w-full"
                        >
                          <option value="flat">Flat Amount</option>
                          <option value="percentage">Percentage</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Discount Value
                        </label>
                        <input
                          type="number"
                          value={test.discountValue}
                          onChange={(e) =>
                            updateTest(
                              index,
                              "discountValue",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="input-field w-full"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Report Time
                        </label>
                        <input
                          type="text"
                          value={test.reportTime}
                          onChange={(e) =>
                            updateTest(index, "reportTime", e.target.value)
                          }
                          className="input-field w-full"
                          placeholder="24 hours, Same day"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Description
                        </label>
                        <textarea
                          value={test.description}
                          onChange={(e) =>
                            updateTest(index, "description", e.target.value)
                          }
                          className="input-field w-full"
                          rows={2}
                          placeholder="Test description"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Preparation Instructions
                        </label>
                        <textarea
                          value={test.preparationInstructions}
                          onChange={(e) =>
                            updateTest(
                              index,
                              "preparationInstructions",
                              e.target.value
                            )
                          }
                          className="input-field w-full"
                          rows={2}
                          placeholder="Patient preparation instructions"
                        />
                      </div>
                    </div>

                    {/* Test Image Upload */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Test Image
                      </label>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleTestImageChange(index, e)}
                            className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300"
                          />
                        </div>
                        {test.imageUrl && (
                          <button
                            type="button"
                            onClick={() => removeTestImage(index)}
                            className="px-3 py-2 text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      {/* Test Image Preview */}
                      {test.imageUrl && (
                        <div className="mt-3">
                          <div className="relative w-24 h-24 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                            <img
                              src={test.imageUrl}
                              alt={`${test.name} preview`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeTestImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={test.requiresPrescription}
                          onChange={(e) =>
                            updateTest(
                              index,
                              "requiresPrescription",
                              e.target.checked
                            )
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Requires Prescription
                        </span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={test.isHomeCollection}
                          onChange={(e) =>
                            updateTest(
                              index,
                              "isHomeCollection",
                              e.target.checked
                            )
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Home Collection Available
                        </span>
                      </label>
                    </div>

                    {test.isHomeCollection && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Home Collection Fee
                        </label>
                        <input
                          type="number"
                          value={test.homeCollectionFee}
                          onChange={(e) =>
                            updateTest(
                              index,
                              "homeCollectionFee",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="input-field w-full"
                          placeholder="0"
                        />
                      </div>
                    )}
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
                      {selectedPathology ? "Updating..." : "Adding..."}
                    </>
                  ) : selectedPathology ? (
                    "Update Pathology"
                  ) : (
                    "Add Pathology"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedPathology(null);
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
