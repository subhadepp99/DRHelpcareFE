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
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { getEntityImageUrl } from "@/utils/imageUtils";

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
  const [imagePreview, setImagePreview] = useState("");
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
      const response = await get("/departments?limit=1000");
      const departments =
        response.data?.data?.departments || response.data?.departments || [];
      setDepartments(departments);
    } catch (error) {
      toast.error("Failed to fetch departments");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("heading", formData.heading);
      submitData.append("description", formData.description);
      submitData.append("specialization", formData.specialization);

      // Add image file if selected
      if (formData.image) {
        submitData.append("image", formData.image);
      } else if (formData.imageUrl) {
        submitData.append("imageUrl", formData.imageUrl);
      }

      if (selectedDepartment) {
        await put(`/departments/${selectedDepartment._id}`, submitData);
        toast.success("Department updated successfully");
      } else {
        await post("/departments", submitData);
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
    setImagePreview(department.imageUrl || "");
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
    setImagePreview("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Row image change handler (upload immediately)
  const handleRowImageInputChange = async (department, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = new FormData();
      // Include all required department fields
      data.append("name", department.name);
      data.append("heading", department.heading || department.name);
      data.append("description", department.description || "");
      data.append("specialization", department.specialization || "General");

      // Include existing department data to preserve other fields
      if (department.state) data.append("state", department.state);
      if (department.city) data.append("city", department.city);

      // Add the new image file
      data.append("image", file);

      await put(`/departments/${department._id}`, data);
      toast.success("Image updated successfully");
      fetchDepartments();
    } catch (err) {
      toast.error("Failed to update image");
    }
  };

  // Doctors modal state
  const [doctorsModalOpen, setDoctorsModalOpen] = useState(false);
  const [doctorsModalDepartment, setDoctorsModalDepartment] = useState(null);
  const [doctorsModalDoctors, setDoctorsModalDoctors] = useState([]);
  const [doctorsModalLoading, setDoctorsModalLoading] = useState(false);
  const openDoctorsModal = async (department) => {
    setDoctorsModalDepartment(department);
    setDoctorsModalOpen(true);
    setDoctorsModalLoading(true);
    setDoctorsModalDoctors([]);
    try {
      const res = await get(`/doctors?department=${department._id}&limit=100`);
      const list = res.data?.data?.doctors || res.data?.doctors || [];
      setDoctorsModalDoctors(list);
    } catch (e) {
      toast.error("Failed to load doctors");
    } finally {
      setDoctorsModalLoading(false);
    }
  };
  const closeDoctorsModal = () => {
    setDoctorsModalOpen(false);
    setDoctorsModalDepartment(null);
    setDoctorsModalDoctors([]);
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
            <>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Department
              </button>
            </>
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
        {searchTerm ? (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}
      </div>

      {/* Departments Table */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
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
                  Specialization
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Doctors
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
              {filteredDepartments.map((department) => {
                const imgSrc = getEntityImageUrl(department);

                return (
                  <tr
                    key={department._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center relative">
                          {imgSrc ? (
                            <>
                              <img
                                src={imgSrc}
                                alt={department.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target;
                                  const fallback = target.nextSibling;
                                  if (target && fallback) {
                                    target.style.display = "none";
                                    fallback.style.display = "flex";
                                  }
                                }}
                                onLoad={() => {}}
                              />
                              <div
                                className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800"
                                style={{ display: "none" }}
                              >
                                <ImageIcon className="w-5 h-5 text-gray-400" />
                              </div>
                            </>
                          ) : (
                            <ImageIcon className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        {canModifyDepartments && (
                          <div>
                            <label className="px-2 py-1.5 border text-xs rounded cursor-pointer hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                              Change
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  handleRowImageInputChange(department, e)
                                }
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {department.name}
                      </div>
                      {(department.heading || department.description) && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                          {department.heading || department.description}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {department.specialization}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-900 dark:text-white">
                      {department.doctorCount ??
                        (Array.isArray(department.doctors)
                          ? department.doctors.length
                          : 0)}
                      <button
                        className="ml-2 text-xs text-blue-600 hover:underline"
                        onClick={() => openDoctorsModal(department)}
                      >
                        View Doctors
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          department.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {department.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
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
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg border border-gray-300 flex items-center gap-2 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600">
                    <Upload className="w-4 h-4" />
                    <span>Select Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                {(imagePreview || formData.imageUrl) && (
                  <div className="mt-2">
                    <img
                      src={imagePreview || formData.imageUrl}
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

      {/* Doctors List Modal */}
      {doctorsModalOpen && doctorsModalDepartment && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeDoctorsModal}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Doctors in{" "}
                  {doctorsModalDepartment.heading ||
                    doctorsModalDepartment.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total: {doctorsModalDepartment.doctors?.length || 0}
                </p>
              </div>
              <button
                className="px-3 py-1 text-sm rounded border dark:border-gray-600"
                onClick={closeDoctorsModal}
              >
                Close
              </button>
            </div>
            <div className="p-6">
              {doctorsModalLoading ? (
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Loading...
                </div>
              ) : doctorsModalDoctors.length ? (
                <div className="space-y-2">
                  {doctorsModalDoctors.map((doctor, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-blue-500" />
                        <div className="text-sm text-gray-900 dark:text-white">
                          {doctor.name}
                        </div>
                      </div>
                      {doctor.specialization && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {doctor.specialization}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  No doctors assigned to this department.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
