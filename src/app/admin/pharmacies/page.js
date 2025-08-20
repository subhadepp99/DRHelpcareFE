"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Upload, X } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import Modal from "@/components/common/Modal";
import StatesDropdown from "@/components/common/StatesDropdown";
import toast from "react-hot-toast";

const initialForm = {
  name: "",
  licenseNumber: "",
  email: "",
  phone: "",
  address: "",
  place: "",
  state: "",
  zipCode: "",
  country: "India",
  services: "",
  is24Hours: false,
  imageUrl: "",
};

export default function PharmaciesPage() {
  const { get, post, put, del } = useApi();
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const fetchPharmacies = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await get("/pharmacies?limit=1000");
      setPharmacies(res.data.pharmacies || []);
    } catch (err) {
      console.error("Failed to fetch pharmacies:", err);
      toast.error("Failed to fetch pharmacies.");
      setError("Failed to load pharmacies data.");
      setPharmacies([]);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setForm(initialForm);
    setEditing(null);
    setImageFile(null);
    setImagePreview("");
    setModalOpen(true);
  };

  const openEdit = (pharmacy) => {
    setForm({
      name: pharmacy.name || "",
      licenseNumber: pharmacy.licenseNumber || "",
      email: pharmacy.email || "",
      phone: pharmacy.phone || "",
      address: pharmacy.address || "",
      place: pharmacy.place || "",
      state: pharmacy.state || "",
      zipCode: pharmacy.zipCode || "",
      country: pharmacy.country || "India",
      services: (pharmacy.services || []).join(", "),
      is24Hours: !!pharmacy.is24Hours,
      imageUrl: pharmacy.imageUrl || "",
    });
    setEditing(pharmacy);
    setImageFile(null);
    setImagePreview(pharmacy.imageUrl || "");
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Confirm delete?")) return;
    setIsDeleting(true);
    try {
      await del(`/pharmacies/${id}`);
      toast.success("Pharmacy deleted successfully!");
      fetchPharmacies();
    } catch (err) {
      console.error("Failed to delete pharmacy:", err);
      toast.error(
        "Failed to delete pharmacy: " +
          (err?.response?.data?.message || err.message || "Unknown error")
      );
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name: form.name,
      licenseNumber: form.licenseNumber || undefined,
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
      is24Hours: form.is24Hours,
      imageUrl: form.imageUrl,
    };

    try {
      if (editing) {
        await put(`/pharmacies/${editing._id}`, payload);
        toast.success("Pharmacy updated successfully!");
      } else {
        await post("/pharmacies", payload);
        toast.success("Pharmacy added successfully!");
      }
      setModalOpen(false);
      fetchPharmacies();
    } catch (err) {
      console.error("Failed to save pharmacy:", err);
      toast.error(
        "Failed to save pharmacy: " +
          (err?.response?.data?.message || err.message || "Unknown error")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Pharmacies Management</h1>
        <button
          className="btn-primary flex items-center space-x-2"
          onClick={openAdd}
        >
          <Plus className="w-4 h-4" /> <span>Add Pharmacy</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading pharmacies...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">{error}</div>
      ) : pharmacies.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No pharmacies found.
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
                  License Number
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
                  24 Hours
                </th>
                <th className="border border-gray-300 p-3 text-left font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pharmacies.map((pharmacy) => (
                <tr key={pharmacy._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-3">
                    {pharmacy.name}
                  </td>
                  <td className="border border-gray-300 p-3">
                    {pharmacy.licenseNumber || "-"}
                  </td>
                  <td className="border border-gray-300 p-3">
                    {pharmacy.email}
                  </td>
                  <td className="border border-gray-300 p-3">
                    {pharmacy.phone}
                  </td>
                  <td className="border border-gray-300 p-3">
                    {pharmacy.place || "-"}
                  </td>
                  <td className="border border-gray-300 p-3">
                    {pharmacy.state || "-"}
                  </td>
                  <td className="border border-gray-300 p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        pharmacy.is24Hours
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {pharmacy.is24Hours ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="border border-gray-300 p-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEdit(pharmacy)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(pharmacy._id)}
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
          title={editing ? "Edit Pharmacy" : "Add Pharmacy"}
          onClose={() => setModalOpen(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Pharmacy Name"
                className="input-field"
              />
              <input
                name="licenseNumber"
                value={form.licenseNumber}
                onChange={handleChange}
                placeholder="License Number (Optional)"
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                required
                placeholder="Email"
                className="input-field"
              />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="Phone"
                className="input-field"
              />
            </div>

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              placeholder="Full Address"
              className="input-field"
              rows={3}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                name="place"
                value={form.place}
                onChange={handleChange}
                required
                placeholder="City/Place"
                className="input-field"
              />
              <StatesDropdown
                name="state"
                value={form.state}
                onChange={handleChange}
                required
                placeholder="Select State"
              />
              <input
                name="zipCode"
                value={form.zipCode}
                onChange={handleChange}
                required
                placeholder="ZIP Code"
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="services"
                value={form.services}
                onChange={handleChange}
                placeholder="Services (comma separated)"
                className="input-field"
              />
              <div className="flex items-center space-x-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is24Hours"
                    checked={form.is24Hours}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Open 24 Hours
                  </span>
                </label>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Pharmacy Image
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
                  onChange={handleChange}
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
                ? "Update Pharmacy"
                : "Add Pharmacy"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
