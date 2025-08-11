"use client";

import { useState, useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import { Plus, Edit, Trash2 } from "lucide-react";
import Modal from "@/components/common/Modal";

const specializations = [
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Gynecology",
  "Psychiatry",
  "Radiology",
  "Anesthesiology",
  "Pathology",
  "Emergency",
  "General",
  "Others",
];

const initialForm = {
  name: "",
  email: "",
  phone: "",
  specialization: "",
  qualification: "",
  experience: "",
  licenseNumber: "",
  consultationFee: "",
  photoUrl: "",
};

export default function AdminDoctorsPage() {
  const { get, post, put, del } = useApi();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  // You can expand the form as required for your model
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    qualification: "",
    experience: "",
    licenseNumber: "",
    consultationFee: "",
    photoUrl: "", // Ensure photoUrl is always present
  });

  // Fetch doctors from the API using the Node backend endpoint
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await get("/doctors"); // Adjust if your base API path is different
      setDoctors(res.data.doctors || res.data.data?.doctors || []);
    } catch {
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const openAddModal = () => {
    setEditingDoctor(null);
    setForm({
      name: "",
      email: "",
      phone: "",
      specialization: "",
      qualification: "",
      experience: "",
      licenseNumber: "",
      consultationFee: "",
      photoUrl: "", // Ensure photoUrl is reset
    });
    setModalOpen(true);
  };

  const openEditModal = (doc) => {
    setEditingDoctor(doc);
    setForm({
      name: doc.name || "",
      email: doc.email || "",
      phone: doc.phone || "",
      specialization: doc.specialization || specializations[0],
      qualification: doc.qualification || "",
      experience: doc.experience ? String(doc.experience) : "",
      licenseNumber: doc.licenseNumber || "",
      consultationFee: doc.consultationFee ? String(doc.consultationFee) : "",
      photoUrl: doc.photoUrl || "",
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this doctor?")) {
      try {
        await del(`/doctors/${id}`);
        setDoctors((prev) => prev.filter((doc) => doc._id !== id));
      } catch (err) {
        alert("Failed to delete doctor: " + (err?.message || "Unknown error"));
      }
    }
  };

  // Handles regular input and file input for photo

  function handleInputChange(e) {
    const { name, value, files } = e.target;
    if (name === "photo" && files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = () =>
        setForm((prev) => ({ ...prev, photoUrl: reader.result }));
      reader.readAsDataURL(files[0]);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (editingDoctor) {
  //     await put(`/doctors/${editingDoctor._id}`, form);
  //   } else {
  //     await post("/doctors", form);
  //   }
  //   setModalOpen(false);
  //   fetchDoctors();
  // };

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...form,
      experience: Number(form.experience),
      consultationFee: Number(form.consultationFee),
      photoUrl: form.photoUrl || "", // Always include photoUrl
    };

    try {
      if (editingDoctor) {
        await put(`/doctors/${editingDoctor._id}`, payload);
        setDoctors((prev) =>
          prev.map((doc) =>
            doc._id === editingDoctor._id ? { ...doc, ...payload } : doc
          )
        );
      } else {
        const res = await post("/doctors", payload);
        setDoctors((prev) => [...prev, res.data]);
      }
      setModalOpen(false);
    } catch (err) {
      alert("Could not save doctor: " + err.message);
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
      ) : (
        <table className="w-full text-left border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Photo</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Specialization</th>
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
                  {doc.photoUrl ? (
                    <img
                      src={doc.photoUrl}
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
                <td className="border p-2">{doc.specialization}</td>
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
                  >
                    <Trash2 className="w-5 h-5" />
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
            <input
              name="name"
              required
              placeholder="Name"
              className="input-field"
              value={form.name}
              onChange={handleChange}
            />
            <input
              name="email"
              required
              type="email"
              placeholder="Email"
              className="input-field"
              value={form.email}
              onChange={handleChange}
            />
            <input
              name="phone"
              required
              placeholder="Phone"
              className="input-field"
              value={form.phone}
              onChange={handleChange}
            />
            <select
              name="specialization"
              required
              placeholder="Specialization"
              className="input-field"
              value={form.specialization}
              onChange={handleChange}
            >
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec.charAt(0).toUpperCase() + spec.slice(1)}
                </option>
              ))}
            </select>
            <input
              name="qualification"
              required
              placeholder="Qualification"
              className="input-field"
              value={form.qualification}
              onChange={handleChange}
            />
            <input
              name="experience"
              type="number"
              placeholder="Experience (years)"
              className="input-field"
              value={form.experience}
              onChange={handleChange}
            />
            <input
              name="licenseNumber"
              placeholder="License Number"
              className="input-field"
              value={form.licenseNumber}
              onChange={handleChange}
            />
            <input
              name="consultationFee"
              type="number"
              placeholder="Consultation Fee"
              className="input-field"
              value={form.consultationFee}
              onChange={handleChange}
            />
            {/* Doctor Photo Upload */}

            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Doctor Photo
              </span>
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md"
              />
            </label>
            {/* Photo Preview */}
            {form.photoUrl && (
              <img
                src={form.photoUrl}
                alt="Doctor Preview"
                className="w-20 h-20 rounded-full object-cover mx-auto mt-2"
              />
            )}
            <button type="submit" className="btn-primary w-full">
              {editingDoctor ? "Update Doctor" : "Add Doctor"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
