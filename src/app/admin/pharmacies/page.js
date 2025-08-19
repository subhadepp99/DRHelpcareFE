"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import Modal from "@/components/common/Modal";
import toast from "react-hot-toast"; // Import toast

const initialForm = {
  name: "",
  licenseNumber: "",
  email: "",
  phone: "",
  address: "",
  services: "",
  is24Hours: false,
};

export default function PharmaciesPage() {
  const { get, post, put, del } = useApi();
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true); // Renamed to loading
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for form submission
  const [isDeleting, setIsDeleting] = useState(false); // New state for deletion
  const [error, setError] = useState(null); // New state for errors
  const [form, setForm] = useState(initialForm);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const fetchPharmacies = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
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
    setModalOpen(true);
  };

  const openEdit = (pharmacy) => {
    setForm({
      name: pharmacy.name || "",
      licenseNumber: pharmacy.licenseNumber || "",
      email: pharmacy.email || "",
      phone: pharmacy.phone || "",
      address: JSON.stringify(pharmacy.address || {}, null, 2),
      services: (pharmacy.services || []).join(", "),
      is24Hours: !!pharmacy.is24Hours,
    });
    setEditing(pharmacy);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Confirm delete?")) return;
    setIsDeleting(true); // Set deleting state
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
      setIsDeleting(false); // Reset deleting state
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Set submitting state
    let parsedAddress = {};
    try {
      parsedAddress = JSON.parse(form.address);
    } catch (err) {
      toast.error("Invalid JSON in address field.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      name: form.name,
      licenseNumber: form.licenseNumber,
      email: form.email,
      phone: form.phone,
      address: parsedAddress,
      services: form.services
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      is24Hours: form.is24Hours,
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
      setIsSubmitting(false); // Reset submitting state
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Pharmacies Management</h1>
        <button
          className="btn-primary flex items-center space-x-2"
          onClick={openAdd}
        >
          <Plus className="w-4 h-4" /> <span>Add Pharmacy</span>
        </button>
      </div>
      {loading ? (
        <p>Loading pharmacies...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : pharmacies.length === 0 ? (
        <p className="text-center text-gray-500">No pharmacies found.</p>
      ) : (
        <table className="w-full table-auto border-collapse border">
          <thead>
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">License Number</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">City</th>
              <th className="border p-2">24 Hours</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pharmacies.map((pharmacy) => (
              <tr key={pharmacy._id} className="hover:bg-gray-100">
                <td className="border p-2">{pharmacy.name}</td>
                <td className="border p-2">{pharmacy.licenseNumber}</td>
                <td className="border p-2">{pharmacy.email}</td>
                <td className="border p-2">{pharmacy.phone}</td>
                <td className="border p-2">{pharmacy.address?.city || "-"}</td>
                <td className="border p-2">
                  {pharmacy.is24Hours ? "Yes" : "No"}
                </td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => openEdit(pharmacy)}
                    className="text-blue-600"
                  >
                    <Edit className="inline-block w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(pharmacy._id)}
                    className="text-red-600"
                    disabled={isDeleting} // Disable delete button while deleting
                  >
                    {isDeleting ? (
                      "Deleting..."
                    ) : (
                      <Trash2 className="inline-block w-5 h-5" />
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
          title={editing ? "Edit Pharmacy" : "Add Pharmacy"}
          onClose={() => setModalOpen(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Name"
              className="input-field"
            />
            <input
              name="licenseNumber"
              value={form.licenseNumber}
              onChange={handleChange}
              required
              placeholder="License Number"
              className="input-field"
            />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="Email"
              className="input-field"
            />
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="input-field"
            />
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Address (JSON)"
              className="input-field"
              rows={4}
            />
            <input
              name="services"
              value={form.services}
              onChange={handleChange}
              placeholder="Services (comma separated)"
              className="input-field"
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="is24Hours"
                checked={form.is24Hours}
                onChange={handleChange}
              />
              <span>Open 24 Hours</span>
            </label>
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
