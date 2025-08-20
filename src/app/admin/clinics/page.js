"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Upload, X } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import Modal from "@/components/common/Modal";
import StatesDropdown from "@/components/common/StatesDropdown";
import toast from "react-hot-toast";

const initialForm = {
  name: "",
  registrationNumber: "",
  email: "",
  phone: "",
  address: "",
  place: "",
  state: "",
  zipCode: "",
  country: "India",
  services: "",
  facilities: "",
  imageUrl: "",
};

export default function AdminClinics() {
  const { get, post, put, del } = useApi();
  const [clinics, setClinics] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    fetchClinics();
  }, []);

  async function fetchClinics() {
    setFetching(true);
    try {
      const res = await get("/clinics?limit=1000");
      setClinics(res.data.clinics || res.data.data?.clinics || []);
    } catch (err) {
      console.error("Failed to fetch clinics:", err);
      toast.error("Failed to fetch clinics.");
      setClinics([]);
    } finally {
      setFetching(false);
    }
  }

  const openAdd = () => {
    setForm(initialForm);
    setEditing(null);
    setImageFile(null);
    setImagePreview("");
    setModalOpen(true);
  };

  const openEdit = (clinic) => {
    setForm({
      name: clinic.name || "",
      registrationNumber: clinic.registrationNumber || "",
      email: clinic.email || "",
      phone: clinic.phone || "",
      address: clinic.address || "",
      place: clinic.place || "",
      state: clinic.state || "",
      zipCode: clinic.zipCode || "",
      country: clinic.country || "India",
      services: (clinic.services || []).join(", "),
      facilities: (clinic.facilities || []).join(", "),
      imageUrl: clinic.imageUrl || "",
    });
    setEditing(clinic);
    setImageFile(null);
    setImagePreview(clinic.imageUrl || "");
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Confirm delete?")) return;
    setIsDeleting(true);
    try {
      await del(`/clinics/${id}`);
      toast.success("Clinic deleted successfully!");
      fetchClinics();
    } catch (err) {
      console.error("Failed to delete clinic:", err);
      toast.error("Failed to delete clinic.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setForm((prev) => ({ ...prev, imageUrl: "" }));
  };

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name: form.name,
      registrationNumber: form.registrationNumber || undefined,
      email: form.email,
      phone: form.phone,
      address: form.address,
      place: form.place,
      state: form.state,
      zipCode: form.zipCode,
      country: form.country,
      services: form.services
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      facilities: form.facilities
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      imageUrl: form.imageUrl,
    };

    try {
      if (editing) {
        await put(`/clinics/${editing._id}`, payload);
        toast.success("Clinic updated successfully!");
      } else {
        await post("/clinics", payload);
        toast.success("Clinic added successfully!");
      }
      setModalOpen(false);
      fetchClinics();
    } catch (err) {
      console.error("Failed to save clinic:", err);
      toast.error("Failed to save clinic.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Clinics Management</h1>
        <button
          onClick={openAdd}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Clinic</span>
        </button>
      </div>

      {fetching ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading clinics...</p>
        </div>
      ) : clinics.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No clinics found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 p-3 text-left font-semibold">
                  Name
                </th>
                <th className="border border-gray-300 p-3 text-left font-semibold">
                  Reg. No.
                </th>
                <th className="border border-gray-300 p-3 text-left font-semibold">
                  Email
                </th>
                <th className="border border-gray-300 p-3 text-left font-semibold">
                  Phone
                </th>
                <th className="border border-gray-300 p-3 text-left font-semibold">
                  Place
                </th>
                <th className="border border-gray-300 p-3 text-left font-semibold">
                  State
                </th>
                <th className="border border-gray-300 p-3 text-left font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {clinics.map((clinic) => (
                <tr key={clinic._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-3">{clinic.name}</td>
                  <td className="border border-gray-300 p-3">
                    {clinic.registrationNumber || "-"}
                  </td>
                  <td className="border border-gray-300 p-3">{clinic.email}</td>
                  <td className="border border-gray-300 p-3">{clinic.phone}</td>
                  <td className="border border-gray-300 p-3">
                    {clinic.place || "-"}
                  </td>
                  <td className="border border-gray-300 p-3">
                    {clinic.state || "-"}
                  </td>
                  <td className="border border-gray-300 p-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEdit(clinic)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(clinic._id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                        disabled={isDeleting}
                        title="Delete"
                      >
                        {isDeleting ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <Modal
          title={editing ? "Edit Clinic" : "Add Clinic"}
          onClose={() => setModalOpen(false)}
        >
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                required
                placeholder="Clinic Name"
                className="input-field"
              />
              <input
                name="registrationNumber"
                value={form.registrationNumber}
                onChange={onChange}
                placeholder="Registration Number (Optional)"
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="email"
                value={form.email}
                onChange={onChange}
                type="email"
                required
                placeholder="Email"
                className="input-field"
              />
              <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                required
                placeholder="Phone"
                className="input-field"
              />
            </div>

            <textarea
              name="address"
              value={form.address}
              onChange={onChange}
              required
              placeholder="Full Address"
              className="input-field"
              rows={3}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                name="place"
                value={form.place}
                onChange={onChange}
                required
                placeholder="City/Place"
                className="input-field"
              />
              <StatesDropdown
                name="state"
                value={form.state}
                onChange={onChange}
                required
                placeholder="Select State"
              />
              <input
                name="zipCode"
                value={form.zipCode}
                onChange={onChange}
                required
                placeholder="ZIP Code"
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="services"
                value={form.services}
                onChange={onChange}
                placeholder="Services (comma separated)"
                className="input-field"
              />
              <input
                name="facilities"
                value={form.facilities}
                onChange={onChange}
                placeholder="Facilities (comma separated)"
                className="input-field"
              />
            </div>

            {/* Image Upload Section */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Clinic Image
              </label>

              {imagePreview && (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg border border-gray-300 flex items-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <input
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={onChange}
                  placeholder="Or enter image URL"
                  className="input-field flex-1"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? editing
                  ? "Updating..."
                  : "Adding..."
                : editing
                ? "Update Clinic"
                : "Add Clinic"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
