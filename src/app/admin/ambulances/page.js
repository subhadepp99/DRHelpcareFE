"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  X,
  Search,
  HelpCircle,
} from "lucide-react";
import { useApi } from "@/hooks/useApi";
import Modal from "@/components/common/Modal";
import FAQModal from "@/components/modals/FAQModal";
import toast from "react-hot-toast";
import { getEntityImageUrl } from "@/utils/imageUtils";

const initialForm = {
  name: "",
  vehicleNumber: "",
  driverName: "",
  driverPhone: "",
  phone: "",
  location: "",
  city: "",
  isAvailable: true,
  imageUrl: "",
};

export default function AmbulancesPage() {
  const { get, post, put, del } = useApi();
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAmbulances();
  }, []);

  const fetchAmbulances = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await get("/ambulances?limit=1000");
      const ambulances =
        res.data?.data?.ambulances || res.data?.ambulances || [];
      setAmbulances(ambulances);
    } catch (err) {
      console.error("Failed to fetch ambulances:", err);
      toast.error("Failed to fetch ambulances.");
      setError("Failed to load ambulances data.");
      setAmbulances([]);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setForm(initialForm);
    setEditing(null);
    setSelectedImage(null);
    setImagePreview("");
    setModalOpen(true);
  };

  const openFaqModal = (ambulance) => {
    setSelectedAmbulance(ambulance);
    setFaqModalOpen(true);
  };

  const openEdit = (ambulance) => {
    setForm({
      name: ambulance.name || "",
      vehicleNumber: ambulance.vehicleNumber || "",
      driverName: ambulance.driverName || "",
      driverPhone: ambulance.driverPhone || "",
      phone: ambulance.phone || "",
      location: ambulance.location || "",
      city: ambulance.city || "",
      isAvailable: !!ambulance.isAvailable,
      imageUrl: ambulance.imageUrl || "",
    });
    setEditing(ambulance);
    setSelectedImage(null);
    setImagePreview(ambulance.imageUrl || "");
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Confirm delete?")) return;
    setIsDeleting(true);
    try {
      await del(`/ambulances/${id}`);
      toast.success("Ambulance deleted successfully!");
      fetchAmbulances();
    } catch (err) {
      console.error("Failed to delete ambulance:", err);
      toast.error(
        "Failed to delete ambulance: " +
          (err?.response?.data?.message || err.message || "Unknown error")
      );
    } finally {
      setIsDeleting(false);
    }
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

    // If a file is selected, send multipart/form-data; else send JSON
    let useFormData = !!selectedImage;
    let payload;
    if (useFormData) {
      payload = new FormData();
      payload.append("name", form.name);
      payload.append("vehicleNumber", form.vehicleNumber);
      payload.append("driverName", form.driverName);
      payload.append("driverPhone", form.driverPhone);
      payload.append("phone", form.phone);
      payload.append("location", form.location);
      payload.append("city", form.city);
      payload.append("isAvailable", String(form.isAvailable));
      if (selectedImage) payload.append("image", selectedImage);
      if (form.imageUrl && !selectedImage)
        payload.append("imageUrl", form.imageUrl);
    } else {
      payload = {
        name: form.name,
        vehicleNumber: form.vehicleNumber,
        driverName: form.driverName,
        driverPhone: form.driverPhone,
        phone: form.phone,
        location: form.location,
        city: form.city,
        isAvailable: form.isAvailable,
        imageUrl: form.imageUrl,
      };
    }

    try {
      if (editing) {
        await put(`/ambulances/${editing._id}`, payload, {
          headers: useFormData
            ? { "Content-Type": "multipart/form-data" }
            : undefined,
        });
        toast.success("Ambulance updated successfully!");
      } else {
        await post("/ambulances", payload, {
          headers: useFormData
            ? { "Content-Type": "multipart/form-data" }
            : undefined,
        });
        toast.success("Ambulance added successfully!");
      }
      setModalOpen(false);
      fetchAmbulances();
    } catch (err) {
      console.error("Failed to save ambulance:", err);
      toast.error(
        "Failed to save ambulance: " +
          (err?.response?.data?.message || err.message || "Unknown error")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAmbulances = ambulances.filter(
    (ambulance) =>
      ambulance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ambulance.vehicleNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      ambulance.driverName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Ambulance Management</h1>
        <button
          className="btn-primary flex items-center space-x-2"
          onClick={openAdd}
        >
          <Plus className="w-4 h-4" /> <span>Add Ambulance</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search ambulances by name, vehicle number, or driver name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading ambulances...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">{error}</div>
      ) : filteredAmbulances.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm
            ? "No ambulances found matching your search."
            : "No ambulances found."}
        </div>
      ) : (
        <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 p-3 text-left font-semibold">
                  Image
                </th>
                <th className="border border-gray-300 p-3 text-left font-semibold">
                  Name
                </th>
                <th className="border border-gray-300 p-3 text-left font-semibold">
                  Vehicle No.
                </th>
                <th className="border border-gray-300 p-3 text-left font-semibold">
                  Driver
                </th>
                <th className="border border-gray-300 p-3 text-left font-semibold">
                  Phone
                </th>
                <th className="border border-gray-300 p-3 text-left font-semibold">
                  Location
                </th>
                <th className="border border-gray-300 p-3 text-left font-semibold">
                  City
                </th>
                <th className="border border-gray-300 p-3 text-left font-semibold">
                  Status
                </th>
                <th className="border border-gray-300 p-3 text-left font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAmbulances.map((ambulance) => (
                <tr key={ambulance._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                      {(() => {
                        const img = getEntityImageUrl(ambulance, "imageUrl");
                        return img ? (
                          <img
                            src={img}
                            alt={ambulance.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-gray-500 text-xs font-medium">
                              {ambulance.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                  </td>
                  <td className="border border-gray-300 p-3">
                    {ambulance.name}
                  </td>
                  <td className="border border-gray-300 p-3">
                    {ambulance.vehicleNumber}
                  </td>
                  <td className="border border-gray-300 p-3">
                    {ambulance.driverName}
                  </td>
                  <td className="border border-gray-300 p-3">
                    {ambulance.phone}
                  </td>
                  <td className="border border-gray-300 p-3">
                    {ambulance.location}
                  </td>
                  <td className="border border-gray-300 p-3">
                    {ambulance.city}
                  </td>
                  <td className="border border-gray-300 p-3">
                    <div className="space-y-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          ambulance.isAvailable
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {ambulance.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </td>
                  <td className="border border-gray-300 p-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openFaqModal(ambulance)}
                        className="text-purple-600 hover:text-purple-800 p-1 rounded hover:bg-purple-50"
                        title="Manage FAQs"
                      >
                        <HelpCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEdit(ambulance)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(ambulance._id)}
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
          title={editing ? "Edit Ambulance" : "Add Ambulance"}
          onClose={() => setModalOpen(false)}
          className="max-w-4xl"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Ambulance Name"
                className="input-field"
              />
              <input
                name="vehicleNumber"
                value={form.vehicleNumber}
                onChange={handleChange}
                required
                placeholder="Vehicle Number"
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="driverName"
                value={form.driverName}
                onChange={handleChange}
                required
                placeholder="Driver Name"
                className="input-field"
              />
              <input
                name="driverPhone"
                value={form.driverPhone}
                onChange={handleChange}
                required
                placeholder="Driver Phone"
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                placeholder="City"
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

            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              placeholder="Location (e.g., Hospital Name, Area)"
              className="input-field"
            />

            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={form.isAvailable}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Available for Service
                </span>
              </label>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Ambulance Image
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
                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg border border-gray-300 flex items-center space-x-2 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600">
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
              disabled={isSubmitting}
              className="btn-primary w-full flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {editing ? "Updating..." : "Adding..."}
                </>
              ) : editing ? (
                "Update Ambulance"
              ) : (
                "Add Ambulance"
              )}
            </button>
          </form>
        </Modal>
      )}

      {/* FAQ Management Modal */}
      {faqModalOpen && selectedAmbulance && (
        <FAQModal
          isOpen={faqModalOpen}
          onClose={() => setFaqModalOpen(false)}
          entityType="ambulance"
          entityId={selectedAmbulance._id}
          entityName={selectedAmbulance.name}
        />
      )}
    </div>
  );
}
