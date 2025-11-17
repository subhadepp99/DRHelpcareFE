"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  Upload,
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  ArrowLeft,
} from "lucide-react";
import { useApi } from "@/hooks/useApi";
import toast from "react-hot-toast";

export default function NewDoctorPage() {
  const router = useRouter();
  const { post } = useApi();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

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

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key.startsWith("address.")) {
          const addressKey = key.split(".")[1];
          formData.append(`address[${addressKey}]`, data[key]);
        } else {
          formData.append(key, data[key]);
        }
      });

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await post("/doctors", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Doctor added successfully!");
      router.push("/admin/doctors");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add doctor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Add New Doctor
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Fill in the doctor's information below
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Image Upload */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Profile Photo
              </h3>
            </div>
            <div className="card-body">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-12 h-12 text-gray-400" />
                  )}
                </div>

                <label className="btn-secondary cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Recommended: Square image, at least 400x400px
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Basic Information
                </h3>
              </div>
              <div className="card-body space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      {...register("name", { required: "Name is required" })}
                      type="text"
                      className="input-field"
                      placeholder="Enter doctor's full name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Email *
                    </label>
                    <input
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Invalid email address",
                        },
                      })}
                      type="email"
                      className="input-field"
                      placeholder="doctor@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Phone Number *
                    </label>
                    <input
                      {...register("phone", { required: "Phone is required" })}
                      type="tel"
                      className="input-field"
                      placeholder="+91 9876543210"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="licenseNumber"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      License Number *
                    </label>
                    <input
                      {...register("licenseNumber", {
                        required: "License number is required",
                      })}
                      type="text"
                      className="input-field"
                      placeholder="Medical license number"
                    />
                    {errors.licenseNumber && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.licenseNumber.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Professional Information
                </h3>
              </div>
              <div className="card-body space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="specialization"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Specialization *
                    </label>
                    <select
                      {...register("specialization", {
                        required: "Specialization is required",
                      })}
                      className="input-field"
                    >
                      <option value="">Select Specialization</option>
                      <option value="cardiology">Cardiology</option>
                      <option value="dermatology">Dermatology</option>
                      <option value="neurology">Neurology</option>
                      <option value="pediatrics">Pediatrics</option>
                      <option value="orthopedics">Orthopedics</option>
                      <option value="gynecology">Gynecology</option>
                      <option value="psychiatry">Psychiatry</option>
                      <option value="radiology">Radiology</option>
                      <option value="anesthesiology">Anesthesiology</option>
                      <option value="pathology">Pathology</option>
                    </select>
                    {errors.specialization && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.specialization.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="qualification"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Qualification *
                    </label>
                    <input
                      {...register("qualification", {
                        required: "Qualification is required",
                      })}
                      type="text"
                      className="input-field"
                      placeholder="MBBS, MD, etc."
                    />
                    {errors.qualification && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.qualification.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="experience"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Experience (Years) *
                    </label>
                    <input
                      {...register("experience", {
                        required: "Experience is required",
                        min: {
                          value: 0,
                          message: "Experience must be positive",
                        },
                      })}
                      type="number"
                      className="input-field"
                      placeholder="5"
                    />
                    {errors.experience && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.experience.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="consultationFee"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Consultation Fee (₹) *
                    </label>
                    <input
                      {...register("consultationFee", {
                        required: "Consultation fee is required",
                        min: { value: 0, message: "Fee must be positive" },
                      })}
                      type="number"
                      className="input-field"
                      placeholder="500"
                    />
                    {errors.consultationFee && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.consultationFee.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Address Information
                </h3>
              </div>
              <div className="card-body space-y-4">
                <div>
                  <label
                    htmlFor="address.street"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Street Address
                  </label>
                  <input
                    {...register("address.street")}
                    type="text"
                    className="input-field"
                    placeholder="Street address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="address.city"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      City
                    </label>
                    <input
                      {...register("address.city")}
                      type="text"
                      className="input-field"
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="address.state"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      State
                    </label>
                    <input
                      {...register("address.state")}
                      type="text"
                      className="input-field"
                      placeholder="State"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="address.zipCode"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      ZIP Code
                    </label>
                    <input
                      {...register("address.zipCode")}
                      type="text"
                      className="input-field"
                      placeholder="ZIP Code"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? (
              <div className="spinner mr-2"></div>
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Add Doctor
          </button>
        </div>
      </form>
    </div>
  );
}
