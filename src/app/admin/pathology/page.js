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
} from "lucide-react";
import toast from "react-hot-toast";

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

  useEffect(() => {
    fetchPathologies();
  }, []);

  const fetchPathologies = async () => {
    try {
      setLoading(true);
      const response = await get("/pathologies");
      setPathologies(response.data.pathologies);
    } catch (error) {
      toast.error("Failed to fetch pathologies");
      console.error("Error fetching pathologies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedPathology) {
        await put(`/pathologies/${selectedPathology._id}`, formData);
        toast.success("Pathology updated successfully");
      } else {
        await post("/pathologies", formData);
        toast.success("Pathology added successfully");
      }
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedPathology(null);
      resetForm();
      fetchPathologies();
    } catch (error) {
      toast.error(
        selectedPathology
          ? "Failed to update pathology"
          : "Failed to add pathology"
      );
      console.error("Error saving pathology:", error);
    }
  };

  const handleEdit = (pathology) => {
    setSelectedPathology(pathology);
    setFormData({
      name: pathology.name || "",
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
      homeCollection: pathology.homeCollection || {
        available: false,
        fee: 0,
        areas: [],
        timing: { start: "", end: "" },
      },
    });
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
      homeCollection: {
        available: false,
        fee: 0,
        areas: [],
        timing: { start: "", end: "" },
      },
    });
  };

  const addTest = () => {
    setFormData({
      ...formData,
      testsOffered: [
        ...formData.testsOffered,
        {
          name: "",
          category: "",
          price: 0,
          discountedPrice: 0,
          discountType: "flat",
          discountValue: 0,
          requiresPrescription: false,
          description: "",
          preparationInstructions: "",
          reportTime: "",
          isHomeCollection: false,
          homeCollectionFee: 0,
        },
      ],
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

  const filteredPathologies = pathologies.filter(
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

      {/* Pathologies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPathologies.map((pathology) => (
          <div
            key={pathology._id}
            className="card hover:shadow-lg transition-shadow"
          >
            <div className="card-body p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                    <TestTube className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {pathology.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {pathology.place}, {pathology.state}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(pathology)}
                    className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(pathology._id)}
                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4 mr-2" />
                  {pathology.is24Hours ? "24/7 Service" : "Limited Hours"}
                </div>
                {pathology.homeCollection?.available && (
                  <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                    <Home className="w-4 h-4 mr-2" />
                    Home Collection Available
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <TestTube className="w-4 h-4 mr-2" />
                  {pathology.testsOffered?.length || 0} Tests Available
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Contact:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {pathology.phone}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-600 dark:text-gray-400">
                    Email:
                  </span>
                  <span className="text-gray-900 dark:text-white truncate">
                    {pathology.email}
                  </span>
                </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    className="input-field w-full"
                    placeholder="State"
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
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {selectedPathology ? "Update Pathology" : "Add Pathology"}
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
