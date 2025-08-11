"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import Modal from "@/components/common/Modal";

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
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchPharmacies();
  }, []);
  const fetchPharmacies = async () => {
    setLoading(true);
    try {
      const res = await get("/pharmacies?limit=1000");
      setPharmacies(res.data.pharmacies || []);
    } catch {
      setPharmacies([]);
    }
    setLoading(false);
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
    await del(`/pharmacies/${id}`);
    fetchPharmacies();
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let parsedAddress = {};
    try {
      parsedAddress = JSON.parse(form.address);
    } catch {
      alert("Address must be valid JSON");
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
    if (editing) await put(`/pharmacies/${editing._id}`, payload);
    else await post("/pharmacies", payload);
    setModalOpen(false);
    fetchPharmacies();
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
        <p>Loading...</p>
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
                  >
                    <Trash2 className="inline-block w-5 h-5" />
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
            <button type="submit" className="btn-primary w-full">
              {editing ? "Update Pharmacy" : "Add Pharmacy"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
