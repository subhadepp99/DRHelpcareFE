"use client";

import { useState } from "react";
import { Phone, Mail, Clock } from "lucide-react";

export default function AppointmentModal({ doctor, onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    datetime: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // TODO: Add API integration to submit appointment request
    setSubmitted(true);
    setTimeout(onClose, 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black bg-opacity-20">
      <div className="bg-white dark:bg-gray-800 rounded-l-xl shadow-lg w-full max-w-md p-6 relative h-full flex flex-col justify-center">
        <button
          className="absolute top-6 right-6 text-2xl text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">Book Appointment</h2>
        <div className="mb-4">
          <p className="font-semibold">{doctor?.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {doctor?.specialization}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Your Name"
            className="input-field"
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            type="email"
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
          <input
            name="datetime"
            value={form.datetime}
            onChange={handleChange}
            required
            type="datetime-local"
            className="input-field"
          />
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Notes (optional)"
            className="input-field"
          />
          <button type="submit" className="btn-primary w-full py-1.5">
            Book Appointment
          </button>
        </form>
        {submitted && (
          <div className="text-green-600 font-bold text-center mt-2">
            Appointment requested!
          </div>
        )}
      </div>
    </div>
  );
}
