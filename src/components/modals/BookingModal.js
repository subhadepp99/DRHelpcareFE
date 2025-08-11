"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Clock,
  User,
  CreditCard,
  CheckCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { format, addDays, isSameDay, isAfter, startOfDay } from "date-fns";
import { useApi } from "@/hooks/useApi";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

export default function BookingModal({ doctor, isOpen, onClose }) {
  const { post } = useApi();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1); // 1: Date/Time, 2: Details, 3: Payment, 4: Confirmation
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      patientName: `${user?.firstName} ${user?.lastName}` || "",
      phone: user?.phone || "",
      email: user?.email || "",
      reason: "",
      paymentMethod: "card",
    },
  });

  // Generate available dates (next 14 days)
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(new Date(), i + 1);
    return {
      date,
      available: true, // You can implement actual availability logic
    };
  });

  // Generate time slots
  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
  ];

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleNextStep = () => {
    if (step === 1 && (!selectedDate || !selectedTime)) {
      toast.error("Please select date and time");
      return;
    }
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const bookingData = {
        doctorId: doctor._id,
        patientId: user.id,
        date: selectedDate,
        time: selectedTime,
        ...data,
      };

      // Simulate booking API call
      const response = await post("/bookings", bookingData);

      setBookingId(response.data.bookingId || "BK" + Date.now());
      setStep(4);
      toast.success("Appointment booked successfully!");
    } catch (error) {
      toast.error("Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedDate(null);
    setSelectedTime(null);
    setBookingId(null);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all w-full max-w-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Book Appointment with Dr. {doctor.name}
              </h3>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                {[
                  { number: 1, title: "Date & Time" },
                  { number: 2, title: "Details" },
                  { number: 3, title: "Payment" },
                  { number: 4, title: "Confirmation" },
                ].map((stepItem, index) => (
                  <div key={stepItem.number} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step >= stepItem.number
                          ? "bg-primary-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {step > stepItem.number ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        stepItem.number
                      )}
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stepItem.title}
                    </span>
                    {index < 3 && (
                      <div
                        className={`mx-4 h-0.5 w-12 ${
                          step > stepItem.number
                            ? "bg-primary-600"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 min-h-[400px]">
              {/* Step 1: Date & Time Selection */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Select Date
                    </h4>
                    <div className="grid grid-cols-7 gap-2">
                      {availableDates.map((dateItem, index) => (
                        <button
                          key={index}
                          onClick={() => handleDateSelect(dateItem.date)}
                          disabled={!dateItem.available}
                          className={`p-3 text-center rounded-lg border transition-colors ${
                            selectedDate &&
                            isSameDay(selectedDate, dateItem.date)
                              ? "bg-primary-600 text-white border-primary-600"
                              : dateItem.available
                              ? "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                              : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          <div className="text-xs font-medium">
                            {format(dateItem.date, "EEE")}
                          </div>
                          <div className="text-sm font-bold">
                            {format(dateItem.date, "d")}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedDate && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Select Time for {format(selectedDate, "MMMM d, yyyy")}
                      </h4>
                      <div className="grid grid-cols-4 gap-3">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => handleTimeSelect(time)}
                            className={`p-3 text-center rounded-lg border transition-colors ${
                              selectedTime === time
                                ? "bg-primary-600 text-white border-primary-600"
                                : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 2: Patient Details */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Patient Details
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Patient Name *
                      </label>
                      <input
                        {...register("patientName", {
                          required: "Name is required",
                        })}
                        className="input-field"
                        placeholder="Enter patient name"
                      />
                      {errors.patientName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.patientName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number *
                      </label>
                      <input
                        {...register("phone", {
                          required: "Phone is required",
                        })}
                        className="input-field"
                        placeholder="Enter phone number"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Invalid email address",
                        },
                      })}
                      className="input-field"
                      placeholder="Enter email address"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Reason for Visit
                    </label>
                    <textarea
                      {...register("reason")}
                      rows={3}
                      className="input-field"
                      placeholder="Briefly describe your symptoms or reason for visit"
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Payment Details
                  </h4>

                  {/* Appointment Summary */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 dark:text-white mb-3">
                      Appointment Summary
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Doctor:
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          Dr. {doctor.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Date:
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {selectedDate && format(selectedDate, "MMM d, yyyy")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Time:
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {selectedTime}
                        </span>
                      </div>
                      <div className="flex justify-between font-medium text-lg pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-gray-900 dark:text-white">
                          Total:
                        </span>
                        <span className="text-primary-600 dark:text-primary-400">
                          ₹{doctor.consultationFee}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white mb-3">
                      Payment Method
                    </h5>
                    <div className="space-y-3">
                      <label className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900">
                        <input
                          {...register("paymentMethod")}
                          type="radio"
                          value="card"
                          className="text-primary-600"
                        />
                        <CreditCard className="w-5 h-5 mx-3 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">
                          Credit/Debit Card
                        </span>
                      </label>
                      <label className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900">
                        <input
                          {...register("paymentMethod")}
                          type="radio"
                          value="upi"
                          className="text-primary-600"
                        />
                        <div className="w-5 h-5 mx-3 bg-primary-600 rounded text-white text-xs flex items-center justify-center font-bold">
                          U
                        </div>
                        <span className="text-gray-900 dark:text-white">
                          UPI Payment
                        </span>
                      </label>
                      <label className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900">
                        <input
                          {...register("paymentMethod")}
                          type="radio"
                          value="wallet"
                          className="text-primary-600"
                        />
                        <div className="w-5 h-5 mx-3 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">
                          W
                        </div>
                        <span className="text-gray-900 dark:text-white">
                          Digital Wallet
                        </span>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Confirmation */}
              {step === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-center space-y-6"
                >
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Appointment Confirmed!
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Your appointment has been successfully booked.
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-left">
                    <h5 className="font-medium text-gray-900 dark:text-white mb-3">
                      Booking Details
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Booking ID:
                        </span>
                        <span className="text-gray-900 dark:text-white font-mono">
                          {bookingId}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Doctor:
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          Dr. {doctor.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Date & Time:
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {selectedDate && format(selectedDate, "MMM d, yyyy")}{" "}
                          at {selectedTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You will receive a confirmation SMS and email shortly.
                    Please arrive 15 minutes before your appointment time.
                  </p>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
              <div>
                {step > 1 && step < 4 && (
                  <button
                    onClick={handlePreviousStep}
                    className="btn-secondary"
                  >
                    Previous
                  </button>
                )}
              </div>

              <div className="flex space-x-3">
                <button onClick={handleClose} className="btn-secondary">
                  {step === 4 ? "Close" : "Cancel"}
                </button>

                {step < 3 && (
                  <button onClick={handleNextStep} className="btn-primary">
                    Next Step
                  </button>
                )}

                {step === 3 && (
                  <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? (
                      <div className="spinner mr-2"></div>
                    ) : (
                      <CreditCard className="w-4 h-4 mr-2" />
                    )}
                    Confirm & Pay
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
