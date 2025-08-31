"use client";

import { useState, useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import { Plus, Edit, Trash2, Calendar, Eye } from "lucide-react";
import Modal from "@/components/common/Modal";
import DoctorScheduleModal from "@/components/modals/DoctorScheduleModal";
import DoctorViewModal from "@/components/modals/DoctorViewModal";
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
  doctorFees: "",
  bio: "",
  state: "",
  city: "",
  imageUrl: "",
  selectedClinics: [],
};

export default function AdminDoctorsPage() {
  const { get, post, put, del } = useApi();
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for form submission
  const [isDeleting, setIsDeleting] = useState(false); // New state for deletion
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

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
    doctorFees: "",
    bio: "",
    state: "",
    city: "",
    imageUrl: "", // Ensure imageUrl is always present
    selectedClinics: [],
  });

  // Fetch doctors from the API using the Node backend endpoint
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await get(
        "/doctors?populate=department,clinicDetails.clinic"
      ); // Add populate to get department names and clinic details
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
      const res = await get("/departments");
      const depts = res.data?.data?.departments || res.data?.departments || [];
      console.log("Fetched departments:", depts); // Debug departments
      setDepartments(depts);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
      toast.error("Failed to fetch departments.");
      setDepartments([]);
    }
  };

  // Fetch clinics from the API
  const fetchClinics = async () => {
    try {
      const res = await get("/clinics");
      const clinicList = res.data?.data?.clinics || res.data?.clinics || [];
      console.log("Fetched clinics:", clinicList); // Debug clinics
      setClinics(clinicList);
    } catch (err) {
      console.error("Failed to fetch clinics:", err);
      toast.error("Failed to fetch clinics.");
      setClinics([]);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchDepartments();
    fetchClinics();
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
      doctorFees: "",
      bio: "",
      state: "",
      city: "",
      imageUrl: "", // Ensure imageUrl is reset
      selectedClinics: [],
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
      doctorFees: doc.doctorFees || doc.consultationFee || "",
      bio: doc.bio || "",
      imageUrl: doc.imageUrl || "",
      selectedClinics:
        doc.clinicDetails?.map((cd) => cd.clinic?._id || cd.clinic) ||
        doc.clinics ||
        [],
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

  const handleClinicChange = (clinicId) => {
    setForm((prev) => ({
      ...prev,
      selectedClinics: prev.selectedClinics.includes(clinicId)
        ? prev.selectedClinics.filter((id) => id !== clinicId)
        : [...prev.selectedClinics, clinicId],
    }));
  };

  const openScheduleModal = (doctor) => {
    setSelectedDoctor(doctor);
    setScheduleModalOpen(true);
  };

  const openViewModal = (doctor) => {
    setSelectedDoctor(doctor);
    setViewModalOpen(true);
  };

  const handleScheduleUpdate = (updatedSchedule) => {
    setDoctors((prev) =>
      prev.map((doc) =>
        doc._id === selectedDoctor._id
          ? { ...doc, bookingSchedule: updatedSchedule }
          : doc
      )
    );
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
      doctorFees: Number(form.doctorFees) || Number(form.consultationFee),
      imageUrl: form.imageUrl || "", // Always include imageUrl
    };

    // Convert selected clinics to clinicDetails structure
    if (form.selectedClinics && form.selectedClinics.length > 0) {
      payload.clinicDetails = form.selectedClinics.map((clinicId, index) => {
        const clinic = clinics.find((c) => c._id === clinicId);
        return {
          clinic: clinicId,
          clinicName: clinic?.name || "",
          clinicAddress: clinic?.address || "",
          isPrimary: index === 0, // First clinic is primary
          consultationFee: Number(form.consultationFee),
          availableDays: [],
          availableSlots: [],
        };
      });
    }

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
              <th className="border p-2">Clinics</th>
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
                <td className="border p-2">
                  <button
                    onClick={() => openViewModal(doc)}
                    className="text-left hover:text-primary-600 hover:underline cursor-pointer font-medium"
                  >
                    {doc.name}
                  </button>
                </td>
                <td className="border p-2">{doc.email}</td>
                <td className="border p-2">
                  {doc.department?.name || doc.department || "Unknown"}
                </td>
                <td className="border p-2">{doc.phone}</td>
                <td className="border p-2">
                  {doc.clinicDetails?.length > 0 ? (
                    <div className="text-xs">
                      {doc.clinicDetails.slice(0, 2).map((clinic, index) => (
                        <div key={index} className="mb-1">
                          {clinic.clinicName ||
                            clinic.clinic?.name ||
                            "Unknown Clinic"}
                          {clinic.isPrimary && (
                            <span className="text-blue-600 ml-1">
                              (Primary)
                            </span>
                          )}
                        </div>
                      ))}
                      {doc.clinicDetails.length > 2 && (
                        <span className="text-gray-500">
                          +{doc.clinicDetails.length - 2} more
                        </span>
                      )}
                    </div>
                  ) : doc.clinics?.length > 0 ? (
                    <div className="text-xs">
                      {doc.clinics.slice(0, 2).map((clinic, index) => (
                        <div key={index} className="mb-1">
                          {typeof clinic === "object"
                            ? clinic.name
                            : "Clinic ID: " + clinic}
                        </div>
                      ))}
                      {doc.clinics.length > 2 && (
                        <span className="text-gray-500">
                          +{doc.clinics.length - 2} more
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400">No clinics</span>
                  )}
                </td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => openViewModal(doc)}
                    className="p-1 hover:text-blue-600"
                    title="View Details"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => openScheduleModal(doc)}
                    className="p-1 hover:text-green-600"
                    title="Manage Schedule"
                  >
                    <Calendar className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => openEditModal(doc)}
                    className="p-1 hover:text-blue-600"
                    title="Edit Doctor"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="p-1 hover:text-red-600"
                    disabled={isDeleting} // Disable delete button while deleting
                    title="Delete Doctor"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Doctor Fees (Primary)
              </label>
              <input
                name="doctorFees"
                type="number"
                placeholder="Doctor Fees"
                className="input-field"
                value={form.doctorFees}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                placeholder="Doctor's biography and experience"
                className="input-field"
                rows="3"
                value={form.bio}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Clinics
              </label>
              <select
                multiple
                name="selectedClinics"
                className="input-field min-h-32"
                value={form.selectedClinics}
                onChange={(e) => {
                  const selectedOptions = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  );
                  setForm((prev) => ({
                    ...prev,
                    selectedClinics: selectedOptions,
                  }));
                }}
              >
                {clinics.map((clinic) => (
                  <option key={clinic._id} value={clinic._id}>
                    {clinic.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Hold Ctrl (or Cmd on Mac) to select multiple clinics
              </p>
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

      {/* Doctor Schedule Modal */}
      {scheduleModalOpen && selectedDoctor && (
        <DoctorScheduleModal
          doctor={selectedDoctor}
          isOpen={scheduleModalOpen}
          onClose={() => setScheduleModalOpen(false)}
          onScheduleUpdate={handleScheduleUpdate}
        />
      )}

      {/* Doctor View Modal */}
      {viewModalOpen && selectedDoctor && (
        <DoctorViewModal
          doctor={selectedDoctor}
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
        />
      )}
    </div>
  );
}
