"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { useAuthStore } from "@/store/authStore";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Building,
  Stethoscope,
  Image as ImageIcon,
  Upload,
} from "lucide-react";
import toast from "react-hot-toast";

export default function DepartmentsPage() {
  const { get, post, put, del } = useApi();
  const { user } = useAuthStore();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    heading: "",
    description: "",
    specialization: "",
    image: null,
    imageUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user can modify departments
  const canModifyDepartments =
    user?.role === "admin" ||
    user?.role === "superuser" ||
    user?.role === "masteruser";

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await get("/departments");
      console.log("Department API response:", response); // Debug log
      const departments =
        response.data?.data?.departments || response.data?.departments || [];
      setDepartments(departments);
    } catch (error) {
      toast.error("Failed to fetch departments");
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (selectedDepartment) {
        await put(`/departments/${selectedDepartment._id}`, formData);
        toast.success("Department updated successfully");
      } else {
        await post("/departments", formData);
        toast.success("Department added successfully");
      }
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedDepartment(null);
      resetForm();
      fetchDepartments();
    } catch (error) {
      toast.error(
        selectedDepartment
          ? "Failed to update department"
          : "Failed to add department"
      );
      console.error("Error saving department:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setFormData({
      name: department.name || "",
      heading: department.heading || "",
      description: department.description || "",
      specialization: department.specialization || "",
      image: null,
      imageUrl: department.imageUrl || "",
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this department?")) return;

    try {
      await del(`/departments/${id}`);
      toast.success("Department deleted successfully");
      fetchDepartments();
    } catch (error) {
      toast.error("Failed to delete department");
      console.error("Error deleting department:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      heading: "",
      description: "",
      specialization: "",
      image: null,
      imageUrl: "",
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  const filteredDepartments = departments.filter(
    (department) =>
      department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.specialization.toLowerCase().includes(searchTerm.toLowerCase())
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
            Department Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {canModifyDepartments
              ? "Manage departments and their specializations"
              : "View departments and their specializations (Admin users can only view)"}
          </p>
        </div>
        <div className="flex gap-3 mt-4 sm:mt-0">
          {canModifyDepartments && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Department
            </button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search departments by name, heading, or specialization..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepartments.map((department) => (
          <div
            key={department._id}
            className="card hover:shadow-lg transition-shadow"
          >
            <div className="card-body p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                    <Building className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {department.heading || department.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {department.specialization}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {canModifyDepartments && (
                    <>
                      <button
                        onClick={() => handleEdit(department)}
                        className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(department._id)}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {department.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {department.description}
                </p>
              )}

              {department.imageUrl && (
                <div className="mb-4">
                  <img
                    src={department.imageUrl}
                    alt={department.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Doctors:
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {department.doctorCount || 0}
                  </span>
                </div>

                {/* Show Doctors List */}
                {department.doctors && department.doctors.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400 block">
                      Doctors in this department:
                    </span>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {department.doctors.map((doctor, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded"
                        >
                          <Stethoscope className="w-3 h-3 text-blue-500" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {doctor.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-600 dark:text-gray-400">
                    Status:
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      department.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}
                  >
                    {department.isActive ? "Active" : "Inactive"}
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
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedDepartment ? "Edit Department" : "Add New Department"}
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
                    onChange={(e) => {
                      const value = e.target.value;
                      const capitalizedValue =
                        value.charAt(0).toUpperCase() + value.slice(1);
                      setFormData({ ...formData, name: capitalizedValue });
                    }}
                    className="input-field w-full"
                    placeholder="e.g., Cardiology"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Heading *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.heading}
                    onChange={(e) =>
                      setFormData({ ...formData, heading: e.target.value })
                    }
                    className="input-field w-full"
                    placeholder="e.g., Cardiology"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Specialization *
                </label>
                <select
                  required
                  value={formData.specialization}
                  onChange={(e) =>
                    setFormData({ ...formData, specialization: e.target.value })
                  }
                  className="input-field w-full"
                >
                  <option value="">Select Specialization</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Gynecology">Gynecology</option>
                  <option value="Psychiatry">Psychiatry</option>
                  <option value="Radiology">Radiology</option>
                  <option value="Anesthesiology">Anesthesiology</option>
                  <option value="Pathology">Pathology</option>
                  <option value="Emergency">Emergency</option>
                  <option value="General">General</option>
                  <option value="Others">Others</option>
                </select>
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
                  rows={3}
                  placeholder="Department description..."
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Department Image
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="input-field w-full"
                    />
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload
                  </button>
                </div>
                {formData.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded"
                    />
                  </div>
                )}
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
                      {selectedDepartment ? "Updating..." : "Adding..."}
                    </>
                  ) : selectedDepartment ? (
                    "Update Department"
                  ) : (
                    "Add Department"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedDepartment(null);
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
