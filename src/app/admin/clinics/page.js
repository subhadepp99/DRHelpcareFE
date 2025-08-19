"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import Modal from "@/components/common/Modal";
import toast from "react-hot-toast"; // Import toast

const initialForm = {
  name: "",
  registrationNumber: "",
  email: "",
  phone: "",
  address: "",
  services: "",
  facilities: "",
};

export default function AdminClinics() {
  const { get, post, put, del } = useApi();
  const [clinics, setClinics] = useState([]);
  const [fetching, setFetching] = useState(true); // Renamed loading to fetching
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for form submission
  const [isDeleting, setIsDeleting] = useState(false); // New state for deletion
  const [form, setForm] = useState(initialForm);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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
    setModalOpen(true);
  };
  const openEdit = (clinic) => {
    setForm({
      name: clinic.name || "",
      registrationNumber: clinic.registrationNumber || "",
      email: clinic.email || "",
      phone: clinic.phone || "",
      address: JSON.stringify(clinic.address || {}, null, 2),
      services: (clinic.services || []).join(", "),
      facilities: (clinic.facilities || []).join(", "),
    });
    setEditing(clinic);
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
  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  async function onSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
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
      registrationNumber: form.registrationNumber,
      email: form.email,
      phone: form.phone,
      address: parsedAddress,
      services: form.services
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      facilities: form.facilities
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
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
      <div className="flex justify-between items-center mb-4">
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
        <p>Loading clinics...</p>
      ) : clinics.length === 0 ? (
        <p className="text-center text-gray-500">No clinics found.</p>
      ) : (
        <table className="w-full table-auto border-collapse border">
          <thead>
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Reg. No.</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">City</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clinics.map((clinic) => (
              <tr key={clinic._id} className="hover:bg-gray-100">
                <td className="border p-2">{clinic.name}</td>
                <td className="border p-2">{clinic.registrationNumber}</td>
                <td className="border p-2">{clinic.email}</td>
                <td className="border p-2">{clinic.phone}</td>
                <td className="border p-2">{clinic.address?.city || "-"}</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => openEdit(clinic)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="inline-block w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(clinic._id)}
                    className="text-red-600 hover:text-red-800"
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
          title={editing ? "Edit Clinic" : "Add Clinic"}
          onClose={() => setModalOpen(false)}
        >
          <form onSubmit={onSubmit} className="space-y-3">
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              required
              placeholder="Name"
              className="input-field"
            />
            <input
              name="registrationNumber"
              value={form.registrationNumber}
              onChange={onChange}
              required
              placeholder="Registration Number"
              className="input-field"
            />
            <input
              name="email"
              value={form.email}
              onChange={onChange}
              type="email"
              placeholder="Email"
              className="input-field"
            />
            <input
              name="phone"
              value={form.phone}
              onChange={onChange}
              placeholder="Phone"
              className="input-field"
            />
            <textarea
              name="address"
              value={form.address}
              onChange={onChange}
              placeholder='Address JSON e.g. {"city":"Delhi"}'
              className="input-field"
              rows={4}
            />
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
                ? "Update"
                : "Add"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
