"use client";

import { useState, useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import { Plus, Edit, Trash2 } from "lucide-react";
import Modal from "@/components/common/Modal";
import toast from "react-hot-toast"; // Import toast

const initialForm = {
  name: "",
  email: "",
  phone: "",
  department: "",
  qualification: "",
  experience: "",
  licenseNumber: "",
  consultationFee: "",
  state: "",
  city: "",
  imageUrl: "",
};

export default function AdminDoctorsPage() {
  const { get, post, put, del } = useApi();
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for form submission
  const [isDeleting, setIsDeleting] = useState(false); // New state for deletion
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  // You can expand the form as required for your model
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    qualification: "",
    experience: "",
    licenseNumber: "",
    consultationFee: "",
    state: "",
    city: "",
    imageUrl: "", // Ensure imageUrl is always present
  });

  // Fetch doctors from the API using the Node backend endpoint
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await get("/doctors?populate=department"); // Add populate to get department names
      setDoctors(res.data.doctors || res.data.data?.doctors || []);
    } catch (err) {
      console.error("Failed to fetch doctors:", err);
      toast.error("Failed to fetch doctors.");
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch departments from the API
  const fetchDepartments = async () => {
    try {
      const res = await get("/department");
      const depts = res.data?.data?.departments || res.data?.departments || [];
      console.log("Fetched departments:", depts); // Debug departments
      setDepartments(depts);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
      toast.error("Failed to fetch departments.");
      setDepartments([]);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchDepartments();
  }, []);

  const openAddModal = () => {
    setEditingDoctor(null);
    setForm({
      name: "",
      email: "",
      phone: "",
      department: "",
      qualification: "",
      experience: "",
      licenseNumber: "",
      consultationFee: "",
      state: "",
      city: "",
      imageUrl: "", // Ensure imageUrl is reset
    });
    setModalOpen(true);
  };

  const openEditModal = (doc) => {
    setEditingDoctor(doc);
    setForm({
      name: doc.name || "",
      email: doc.email || "",
      phone: doc.phone || "",
      department: doc.department?.name || doc.department || "", // Handle both ObjectId and name
      state: doc.state || "",
      city: doc.city || "",
      qualification: doc.qualification || "",
      experience: doc.experience || "",
      licenseNumber: doc.licenseNumber || "",
      consultationFee: doc.consultationFee || "",
      imageUrl: doc.imageUrl || "",
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this doctor?")) {
      setIsDeleting(true); // Set deleting state
      try {
        await del(`/doctors/${id}`);
        setDoctors((prev) => prev.filter((doc) => doc._id !== id));
        toast.success("Doctor deleted successfully!");
      } catch (err) {
        console.error("Failed to delete doctor:", err);
        toast.error(
          "Failed to delete doctor: " +
            (err?.response?.data?.message || err.message || "Unknown error")
        );
      } finally {
        setIsDeleting(false); // Reset deleting state
      }
    }
  };

  // Handles regular input and file input for photo

  function handleInputChange(e) {
    const { name, value, files } = e.target;
    if (name === "photo" && files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = () =>
        setForm((prev) => ({ ...prev, imageUrl: reader.result }));
      reader.readAsDataURL(files[0]);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true); // Set submitting state

    console.log("Submitting doctor form:", form); // Debug log
    console.log("Department value:", form.department); // Debug department specifically

    const payload = {
      ...form,
      experience: Number(form.experience),
      consultationFee: Number(form.consultationFee),
      imageUrl: form.imageUrl || "", // Always include imageUrl
    };

    // Remove empty licenseNumber to avoid validation issues
    if (!payload.licenseNumber || payload.licenseNumber.trim() === "") {
      delete payload.licenseNumber;
    }

    // Ensure department is properly set
    if (!form.department || form.department.trim() === "") {
      toast.error("Please select a department");
      setIsSubmitting(false);
      return;
    }

    // Validate required fields
    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.qualification ||
      !form.experience ||
      !form.consultationFee
    ) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    console.log("Doctor payload:", payload); // Debug log
    console.log("Department in payload:", payload.department); // Debug department in payload

    try {
      if (editingDoctor) {
        console.log("Updating doctor:", editingDoctor._id); // Debug log
        const response = await put(`/doctors/${editingDoctor._id}`, payload);
        console.log("Update response:", response); // Debug log

        setDoctors((prev) =>
          prev.map((doc) =>
            doc._id === editingDoctor._id ? { ...doc, ...payload } : doc
          )
        );
        toast.success("Doctor updated successfully!");
      } else {
        console.log("Creating new doctor"); // Debug log
        const res = await post("/doctors", payload);
        console.log("Create response:", res); // Debug log

        setDoctors((prev) => [...prev, res.data]);
        toast.success("Doctor added successfully!");
      }
      setModalOpen(false);
    } catch (err) {
      console.error("Failed to save doctor:", err);
      console.error("Error response:", err?.response); // Debug log
      toast.error(
        "Could not save doctor: " +
          (err?.response?.data?.message || err.message || "Unknown error")
      );
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  }

  return (
    <div>
      {/* *** NEW BUTTON STYLING *** */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Doctors Management</h1>
        <button
          className="flex items-center px-6 py-2 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-bold shadow-lg space-x-2 transition-all 
                     active:scale-95 active:shadow-none"
          onClick={openAddModal}
        >
          <Plus className="w-5 h-5" />
          <span>Add Doctor</span>
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : doctors.length === 0 ? (
        <p className="text-center text-gray-500">No doctors found.</p>
      ) : (
        <table className="w-full text-left border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Photo</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Department</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr
                key={doc._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="border p-2">
                  {doc.imageUrl ? (
                    <img
                      src={doc.imageUrl}
                      alt={doc.name}
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-500 text-xs">
                      No Img
                    </div>
                  )}
                </td>
                <td className="border p-2">{doc.name}</td>
                <td className="border p-2">{doc.email}</td>
                <td className="border p-2">
                  {doc.department?.name || doc.department || "Unknown"}
                </td>
                <td className="border p-2">{doc.phone}</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => openEditModal(doc)}
                    className="p-1 hover:text-blue-600"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="p-1 hover:text-red-600"
                    disabled={isDeleting} // Disable delete button while deleting
                  >
                    {isDeleting ? (
                      "Deleting..."
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalOpen && (
        <Modal
          title={editingDoctor ? "Edit Doctor" : "Add Doctor"}
          onClose={() => setModalOpen(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                required
                placeholder="Name"
                className="input-field"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                required
                type="email"
                placeholder="Email"
                className="input-field"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                name="phone"
                required
                placeholder="Phone"
                className="input-field"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                name="department"
                required
                className="input-field"
                value={form.department}
                onChange={handleChange}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <select
                name="state"
                required
                className="input-field"
                value={form.state}
                onChange={handleChange}
              >
                <option value="">Select State</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                <option value="Assam">Assam</option>
                <option value="Bihar">Bihar</option>
                <option value="Chhattisgarh">Chhattisgarh</option>
                <option value="Goa">Goa</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Haryana">Haryana</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Jharkhand">Jharkhand</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Manipur">Manipur</option>
                <option value="Meghalaya">Meghalaya</option>
                <option value="Mizoram">Mizoram</option>
                <option value="Nagaland">Nagaland</option>
                <option value="Odisha">Odisha</option>
                <option value="Punjab">Punjab</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Sikkim">Sikkim</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Tripura">Tripura</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Delhi">Delhi</option>
                <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                <option value="Ladakh">Ladakh</option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Dadra and Nagar Haveli and Daman and Diu">
                  Dadra and Nagar Haveli and Daman and Diu
                </option>
                <option value="Lakshadweep">Lakshadweep</option>
                <option value="Puducherry">Puducherry</option>
                <option value="Andaman and Nicobar Islands">
                  Andaman and Nicobar Islands
                </option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                name="city"
                required
                placeholder="City"
                className="input-field"
                value={form.city}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Qualification <span className="text-red-500">*</span>
              </label>
              <input
                name="qualification"
                required
                placeholder="Qualification"
                className="input-field"
                value={form.qualification}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience (years) <span className="text-red-500">*</span>
              </label>
              <input
                name="experience"
                type="number"
                placeholder="Experience (years)"
                className="input-field"
                value={form.experience}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                License Number (Optional)
              </label>
              <input
                name="licenseNumber"
                placeholder="License Number (Optional)"
                className="input-field"
                value={form.licenseNumber}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Consultation Fee <span className="text-red-500">*</span>
              </label>
              <input
                name="consultationFee"
                type="number"
                placeholder="Consultation Fee"
                className="input-field"
                value={form.consultationFee}
                onChange={handleChange}
              />
            </div>
            {/* Doctor Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Doctor Photo (Optional)
              </label>
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md"
              />
            </div>
            {/* Photo Preview */}
            {form.imageUrl && (
              <img
                src={form.imageUrl}
                alt="Doctor Preview"
                className="w-20 h-20 rounded-full object-cover mx-auto mt-2"
              />
            )}
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? editingDoctor
                  ? "Updating..."
                  : "Adding..."
                : editingDoctor
                ? "Update Doctor"
                : "Add Doctor"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
