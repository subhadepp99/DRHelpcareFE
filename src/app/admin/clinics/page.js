"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Upload, X, HelpCircle } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { useAuthStore } from "@/store/authStore";
import Modal from "@/components/common/Modal";
import StatesDropdown from "@/components/common/StatesDropdown";
import FAQModal from "@/components/modals/FAQModal";
import toast from "react-hot-toast";
import { getEntityImageUrl } from "@/utils/imageUtils";

const initialForm = {
  name: "",
  description: "",
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
  pinLocation: "",
};

export default function AdminClinics() {
  const { get, post, put, del } = useApi();
  const { user } = useAuthStore();
  const [clinics, setClinics] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [search, setSearch] = useState("");
  // Tag states for services and facilities
  const [servicesTags, setServicesTags] = useState([]);
  const [facilitiesTags, setFacilitiesTags] = useState([]);

  useEffect(() => {
    fetchClinics();
  }, []);

  // Live search with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchClinics(search.trim());
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  async function fetchClinics(term = "") {
    setFetching(true);
    try {
      const qs = term ? `&search=${encodeURIComponent(term)}` : "";
      const res = await get(`/clinics?limit=1000${qs}`);
      setClinics(res.data.clinics || res.data.data?.clinics || []);
    } catch (err) {
      toast.error("Failed to fetch clinics.");
      setClinics([]);
    } finally {
      setFetching(false);
    }
  }

  const openAdd = () => {
    if (user?.role === "userDoctor") {
      toast.error("You do not have permission to add clinics.");
      return;
    }
    setForm(initialForm);
    setEditing(null);
    setImageFile(null);
    setImagePreview("");
    setModalOpen(true);
    setServicesTags([]);
    setFacilitiesTags([]);
  };

  const openFaqModal = (clinic) => {
    setSelectedClinic(clinic);
    setFaqModalOpen(true);
  };

  // Helper function to safely parse array data that might be stringified multiple times
  const safeParseArray = (value) => {
    if (!value) return [];
    
    // Helper to check if a value is "empty" (should be filtered out)
    const isEmpty = (val) => {
      if (!val) return true;
      if (typeof val !== 'string') return true;
      const trimmed = val.trim();
      // Check for various empty patterns
      return trimmed === '' || 
             trimmed === '[]' || 
             trimmed === '""' || 
             trimmed === "''" ||
             trimmed === 'null' ||
             trimmed === 'undefined' ||
             /^\[["']*\]$/.test(trimmed) || // Matches [], [""], [''], etc.
             /^["']+$/.test(trimmed);        // Matches "", '', """, etc.
    };
    
    // Helper to aggressively clean a string value
    const cleanString = (str) => {
      if (typeof str !== 'string') return str;
      
      let cleaned = str.trim();
      
      // Remove all types of brackets and quotes from the edges until we get clean content
      let prevLength = -1;
      while (cleaned.length > 0 && cleaned.length !== prevLength) {
        prevLength = cleaned.length;
        
        // Remove leading/trailing quotes and brackets
        cleaned = cleaned.replace(/^[\[\]"']+/, '').replace(/[\[\]"']+$/, '').trim();
        
        // Remove escape characters
        cleaned = cleaned.replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(/\\'/g, "'");
      }
      
      return cleaned;
    };
    
    // If already an array, recursively clean each item
    if (Array.isArray(value)) {
      const cleanedArray = value.map(item => {
        if (typeof item === 'string') {
          // Skip empty items immediately
          if (isEmpty(item)) return null;
          
          // First try to clean the string aggressively
          let cleaned = cleanString(item);
          
          // After cleaning, check if it's empty
          if (isEmpty(cleaned)) return null;
          
          // If it still looks like it needs parsing, recurse
          if (cleaned.startsWith('[') || cleaned.startsWith('"')) {
            const parsed = safeParseArray(cleaned);
            return parsed.length > 0 ? parsed : null;
          }
          
          // Final check: if the cleaned string contains commas, it might be multiple values
          if (cleaned.includes(',')) {
            return cleaned.split(',').map(s => cleanString(s)).filter(s => s && !isEmpty(s));
          }
          
          return cleaned;
        }
        return null;
      }).flat(); // Flatten in case of nested arrays
      
      return cleanedArray.filter(item => item && !isEmpty(item));
    }
    
    // If it's a string, try to parse it (handling multiple levels of stringification)
    if (typeof value === 'string') {
      let current = value.trim();
      
      // Check if it's empty before processing
      if (isEmpty(current)) return [];
      
      // Remove surrounding quotes if present
      if ((current.startsWith('"') && current.endsWith('"')) || 
          (current.startsWith("'") && current.endsWith("'"))) {
        current = current.slice(1, -1).trim();
        if (isEmpty(current)) return [];
      }
      
      // Try to parse as JSON up to 5 times (handle multiple stringification)
      let attempts = 0;
      while (attempts < 5 && typeof current === 'string' && (current.startsWith('[') || current.startsWith('"'))) {
        try {
          const parsed = JSON.parse(current);
          if (Array.isArray(parsed)) {
            // Check if the array is effectively empty
            if (parsed.length === 0 || parsed.every(isEmpty)) return [];
            // Recursively clean the parsed array
            return safeParseArray(parsed);
          }
          current = parsed;
          if (typeof current === 'string') {
            current = current.trim();
            if (isEmpty(current)) return [];
          }
        } catch {
          // If JSON parse fails, try manual cleanup
          break;
        }
        attempts++;
      }
      
      // If we ended up with a string that looks like a list, split by comma
      if (typeof current === 'string') {
        // Final empty check
        if (isEmpty(current)) return [];
        
        // Clean up escaped characters
        current = current.replace(/\\"/g, '"').replace(/\\\\/g, '\\').trim();
        
        // If it still looks like JSON, try one more parse
        if (current.startsWith('[')) {
          try {
            const parsed = JSON.parse(current);
            if (Array.isArray(parsed)) {
              if (parsed.length === 0 || parsed.every(isEmpty)) return [];
              return safeParseArray(parsed);
            }
          } catch {
            // Continue to comma split fallback
          }
        }
        
        // Split by comma as final fallback
        return current
          .split(',')
          .map(s => cleanString(s))
          .filter(s => s && !isEmpty(s));
      }
      
      // If we get here with a plain string, clean and return it
      return [cleanString(current)].filter(s => s && !isEmpty(s));
    }
    
    return [];
  };

  const openEdit = (clinic) => {
    if (user?.role === "userDoctor") {
      toast.error("You do not have permission to edit clinics.");
      return;
    }
    
    // Parse services and facilities safely
    const servicesArray = safeParseArray(clinic.services);
    const facilitiesArray = safeParseArray(clinic.facilities);
    
    setServicesTags(servicesArray);
    setFacilitiesTags(facilitiesArray);

    setForm({
      name: clinic.name || "",
      description: clinic.description || "",
      registrationNumber: clinic.registrationNumber || "",
      email: clinic.email || "",
      phone: clinic.phone || "",
      address: clinic.address || "",
      place: clinic.place || "",
      state: clinic.state || "",
      zipCode: clinic.zipCode || "",
      country: clinic.country || "India",
      services: "", // Will be shown in tags
      facilities: "", // Will be shown in tags
      imageUrl: clinic.imageUrl || "",
      pinLocation: clinic.pinLocation || "",
    });
    setEditing(clinic);
    setImageFile(null);
    setImagePreview(clinic.imageUrl || "");
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (user?.role === "userDoctor") {
      toast.error("You do not have permission to delete clinics.");
      return;
    }
    if (!confirm("Confirm delete?")) return;
    setIsDeleting(true);
    try {
      await del(`/clinics/${id}`);
      toast.success("Clinic deleted successfully!");
      fetchClinics();
    } catch (err) {
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

  // Helpers to add/remove tokens
  const addTokens = (value) =>
    value
      .split(/,|\n/)
      .map((t) => t.trim())
      .filter(Boolean);

  const onServicesKeyDown = (e) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      if (form.services && form.services.trim()) {
        const tokens = addTokens(form.services);
        if (tokens.length > 0) {
          setServicesTags((prev) => Array.from(new Set([...prev, ...tokens])));
          setForm((prev) => ({ ...prev, services: "" }));
        }
      }
    }
  };

  const onServicesBlur = () => {
    if (form.services && form.services.trim()) {
      const tokens = addTokens(form.services);
      if (tokens.length > 0) {
        setServicesTags((prev) => Array.from(new Set([...prev, ...tokens])));
        setForm((prev) => ({ ...prev, services: "" }));
      }
    }
  };

  const removeServiceTag = (tag) => {
    setServicesTags((prev) => prev.filter((t) => t !== tag));
  };

  const onFacilitiesKeyDown = (e) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      if (form.facilities && form.facilities.trim()) {
        const tokens = addTokens(form.facilities);
        if (tokens.length > 0) {
          setFacilitiesTags((prev) =>
            Array.from(new Set([...prev, ...tokens]))
          );
          setForm((prev) => ({ ...prev, facilities: "" }));
        }
      }
    }
  };

  const onFacilitiesBlur = () => {
    if (form.facilities && form.facilities.trim()) {
      const tokens = addTokens(form.facilities);
      if (tokens.length > 0) {
        setFacilitiesTags((prev) => Array.from(new Set([...prev, ...tokens])));
        setForm((prev) => ({ ...prev, facilities: "" }));
      }
    }
  };

  const removeFacilityTag = (tag) => {
    setFacilitiesTags((prev) => prev.filter((t) => t !== tag));
  };

  async function onSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    if (user?.role === "userDoctor") {
      toast.error("You do not have permission to add or update clinics.");
      setIsSubmitting(false);
      return;
    }

    // Ensure services and facilities are properly formatted (tags + any remaining text)
    const pendingServices = addTokens(form.services || "");
    const servicesArray = Array.from(
      new Set([...(servicesTags || []), ...pendingServices])
    );

    const pendingFacilities = addTokens(form.facilities || "");
    const facilitiesArray = Array.from(
      new Set([...(facilitiesTags || []), ...pendingFacilities])
    );

    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Add all form fields
      formData.append("name", form.name);
      if (form.description)
        formData.append("description", form.description);
      if (form.registrationNumber)
        formData.append("registrationNumber", form.registrationNumber);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("address", form.address);
      formData.append("place", form.place);
      formData.append("state", form.state);
      formData.append("zipCode", form.zipCode);
      formData.append("country", form.country);
      formData.append("services", JSON.stringify(servicesArray));
      formData.append("facilities", JSON.stringify(facilitiesArray));

      // Add image file if selected
      if (imageFile) {
        formData.append("image", imageFile);
      } else if (form.imageUrl) {
        formData.append("imageUrl", form.imageUrl);
      }


      if (editing) {
        await put(`/clinics/${editing._id}`, formData);
        toast.success("Clinic updated successfully!");
      } else {
        await post("/clinics", formData);
        toast.success("Clinic added successfully!");
      }
      setModalOpen(false);
      fetchClinics();
    } catch (err) {
      toast.error(
        "Failed to save clinic: " +
          (err?.response?.data?.message || err.message || "Unknown error")
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
        <div className="flex items-center gap-3 flex-1">
          <h1 className="text-2xl font-semibold">Clinics Management</h1>
          <div className="flex items-center gap-2 ml-auto md:ml-6">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, phone, email or place"
                className="input-field w-56 md:w-72 pr-8"
              />
              {search ? (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
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
                  <td className="border border-gray-300 p-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                      {clinic.imageUrl ? (
                        <img
                          src={getEntityImageUrl(clinic, "imageUrl")}
                          alt={clinic.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-500 text-xs font-medium">
                            {clinic.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
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
                        onClick={() => openFaqModal(clinic)}
                        className="text-purple-600 hover:text-purple-800 p-1 rounded hover:bg-purple-50"
                        title="Manage FAQs"
                      >
                        <HelpCircle className="w-4 h-4" />
                      </button>
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
          className="max-w-4xl"
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={form.description || ""}
                onChange={onChange}
                placeholder="Enter clinic description..."
                rows="4"
                className="input-field resize-none"
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
              <div>
                <input
                  name="services"
                  value={form.services}
                  onChange={onChange}
                  onKeyDown={onServicesKeyDown}
                  onBlur={onServicesBlur}
                  placeholder="Type a service and press Enter or comma"
                  className="input-field"
                />
                {servicesTags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {servicesTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded"
                      >
                        {tag}
                        <button
                          type="button"
                          className="ml-2 text-primary-700 hover:text-primary-900"
                          onClick={() => removeServiceTag(tag)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <input
                  name="facilities"
                  value={form.facilities}
                  onChange={onChange}
                  onKeyDown={onFacilitiesKeyDown}
                  onBlur={onFacilitiesBlur}
                  placeholder="Type a facility and press Enter or comma"
                  className="input-field"
                />
                {facilitiesTags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {facilitiesTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded"
                      >
                        {tag}
                        <button
                          type="button"
                          className="ml-2 text-primary-700 hover:text-primary-900"
                          onClick={() => removeFacilityTag(tag)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Pin Location Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pin Location (Google Maps Link)
                <span className="text-xs text-gray-500 ml-2">(Optional)</span>
              </label>
              <div className="flex gap-2">
                <input
                  name="pinLocation"
                  type="text"
                  placeholder="Paste coordinates (lat,lng), address, or Google Maps URL"
                  className="input-field flex-1"
                  value={form.pinLocation}
                  onChange={onChange}
                />
                <button
                  type="button"
                  onClick={() => {
                    const defaultLocation = form.pinLocation || `${form.name || 'Clinic'}, ${form.place || form.state || 'Midnapore'}, India`;
                    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(defaultLocation)}`;
                    window.open(mapUrl, '_blank', 'width=800,height=600');
                    toast.success('Select a location on the map, then copy the URL and paste it here');
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded whitespace-nowrap"
                >
                  📍 Choose on Map
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Examples: 22.123456,88.123456 or Hospital Name, City, State
              </p>
              {form.pinLocation && (
                <div className="mt-2">
                  <p className="text-xs text-gray-600 mb-1">Preview:</p>
                  <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-300 bg-gray-100">
                    <iframe
                      src={(() => {
                        const location = form.pinLocation.trim();
                        const coordMatch = location.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
                        if (coordMatch) {
                          return `https://www.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&output=embed`;
                        }
                        if (location.includes('google.com/maps') && location.includes('@')) {
                          const coordMatch = location.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
                          if (coordMatch) {
                            return `https://www.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&output=embed`;
                          }
                        }
                        return `https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;
                      })()}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Location Preview"
                    ></iframe>
                  </div>
                </div>
              )}
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
              disabled={isSubmitting}
              className="btn-primary w-full flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {editing ? "Updating..." : "Adding..."}
                </>
              ) : editing ? (
                "Update Clinic"
              ) : (
                "Add Clinic"
              )}
            </button>
          </form>
        </Modal>
      )}

      {/* FAQ Management Modal */}
      {faqModalOpen && selectedClinic && (
        <FAQModal
          isOpen={faqModalOpen}
          onClose={() => setFaqModalOpen(false)}
          entityType="clinic"
          entityId={selectedClinic._id}
          entityName={selectedClinic.name}
        />
      )}
    </div>
  );
}
