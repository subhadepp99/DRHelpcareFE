"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, Plus, Trash2, Save } from "lucide-react";
import { format, addDays, startOfDay, isSameDay, isAfter } from "date-fns";
import { useApi } from "@/hooks/useApi";
import toast from "react-hot-toast";

export default function DoctorScheduleModal({
  doctor,
  isOpen,
  onClose,
  onScheduleUpdate,
}) {
  const { put } = useApi();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate calendar dates for current month
  const generateCalendarDates = () => {
    const start = startOfDay(currentMonth);
    const dates = [];

    // Add previous month's end dates
    const firstDay = new Date(start.getFullYear(), start.getMonth(), 1);
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(firstDay);
      date.setDate(date.getDate() - i - 1);
      dates.push({ date, isCurrentMonth: false });
    }

    // Add current month dates
    const lastDay = new Date(start.getFullYear(), start.getMonth() + 1, 0);
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(start.getFullYear(), start.getMonth(), i);
      dates.push({ date, isCurrentMonth: true });
    }

    // Add next month's start dates
    const lastDayOfWeek = lastDay.getDay();
    for (let i = 1; i <= 6 - lastDayOfWeek; i++) {
      const date = new Date(lastDay);
      date.setDate(date.getDate() + i);
      dates.push({ date, isCurrentMonth: false });
    }

    return dates;
  };

  const calendarDates = generateCalendarDates();

  // Default time slots
  const defaultTimeSlots = [
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

  useEffect(() => {
    if (doctor && doctor.bookingSchedule) {
      setSchedule(doctor.bookingSchedule);
    }
  }, [doctor]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const addSchedule = () => {
    if (!selectedDate) {
      toast.error("Please select a date first");
      return;
    }

    const existingSchedule = schedule.find((s) =>
      isSameDay(new Date(s.date), selectedDate)
    );
    if (existingSchedule) {
      toast.error("Schedule already exists for this date");
      return;
    }

    const newSchedule = {
      date: selectedDate,
      isAvailable: true,
      slots: defaultTimeSlots.map((time) => ({
        startTime: time,
        endTime: addMinutes(time, 30),
        isAvailable: true,
        maxBookings: 1,
        currentBookings: 0,
      })),
    };

    setSchedule([...schedule, newSchedule]);
    toast.success("Schedule added for selected date");
  };

  const addMinutes = (time, minutes) => {
    const [hours, mins] = time.split(":").map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60);
    const newMins = totalMinutes % 60;
    return `${newHours.toString().padStart(2, "0")}:${newMins
      .toString()
      .padStart(2, "0")}`;
  };

  const removeSchedule = (date) => {
    setSchedule(schedule.filter((s) => !isSameDay(new Date(s.date), date)));
    toast.success("Schedule removed");
  };

  const toggleSlotAvailability = (date, slotIndex) => {
    setSchedule(
      schedule.map((s) => {
        if (isSameDay(new Date(s.date), date)) {
          const newSlots = [...s.slots];
          newSlots[slotIndex].isAvailable = !newSlots[slotIndex].isAvailable;
          return { ...s, slots: newSlots };
        }
        return s;
      })
    );
  };

  const updateSlotMaxBookings = (date, slotIndex, value) => {
    setSchedule(
      schedule.map((s) => {
        if (isSameDay(new Date(s.date), date)) {
          const newSlots = [...s.slots];
          newSlots[slotIndex].maxBookings = Math.max(1, parseInt(value) || 1);
          return { ...s, slots: newSlots };
        }
        return s;
      })
    );
  };

  const saveSchedule = async () => {
    try {
      setLoading(true);
      await put(`/doctors/${doctor._id}`, { bookingSchedule: schedule });
      toast.success("Schedule saved successfully");
      if (onScheduleUpdate) {
        onScheduleUpdate(schedule);
      }
    } catch (error) {
      toast.error("Failed to save schedule");
    } finally {
      setLoading(false);
    }
  };

  const getScheduleForDate = (date) => {
    return schedule.find((s) => isSameDay(new Date(s.date), date));
  };

  const isDateAvailable = (date) => {
    const scheduleItem = getScheduleForDate(date);
    return scheduleItem && scheduleItem.isAvailable;
  };

  const getAvailableSlotsCount = (date) => {
    const scheduleItem = getScheduleForDate(date);
    if (!scheduleItem) return 0;
    return scheduleItem.slots.filter((slot) => slot.isAvailable).length;
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
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all w-full max-w-6xl max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Manage Booking Schedule - Dr. {doctor?.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Set availability and time slots for specific dates
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex h-[calc(90vh-120px)]">
              {/* Calendar Section */}
              <div className="w-2/3 p-6 border-r border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    {format(currentMonth, "MMMM yyyy")}
                  </h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        setCurrentMonth(
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() - 1
                          )
                        )
                      }
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => setCurrentMonth(new Date())}
                      className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      Today
                    </button>
                    <button
                      onClick={() =>
                        setCurrentMonth(
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() + 1
                          )
                        )
                      }
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      →
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400"
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarDates.map(({ date, isCurrentMonth }, index) => {
                    const scheduleItem = getScheduleForDate(date);
                    const isAvailable = isDateAvailable(date);
                    const availableSlots = getAvailableSlotsCount(date);
                    const isPast = isAfter(startOfDay(new Date()), date);
                    const isSelected =
                      selectedDate && isSameDay(date, selectedDate);

                    return (
                      <div
                        key={index}
                        onClick={() => !isPast && handleDateClick(date)}
                        className={`
                          p-2 text-center text-sm cursor-pointer border rounded-lg min-h-[60px] flex flex-col items-center justify-center
                          ${
                            !isCurrentMonth
                              ? "text-gray-300 dark:text-gray-600"
                              : ""
                          }
                          ${
                            isPast
                              ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                              : ""
                          }
                          ${
                            isSelected
                              ? "border-2 border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                              : ""
                          }
                          ${
                            scheduleItem
                              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700"
                              : ""
                          }
                          ${
                            !isAvailable && scheduleItem
                              ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700"
                              : ""
                          }
                          hover:${!isPast ? "bg-gray-50 dark:bg-gray-700" : ""}
                        `}
                      >
                        <span className="font-medium">{format(date, "d")}</span>
                        {scheduleItem && (
                          <div className="text-xs mt-1">
                            <div
                              className={`w-2 h-2 rounded-full mx-auto mb-1 ${
                                isAvailable ? "bg-green-500" : "bg-red-500"
                              }`}
                            ></div>
                            <span className="text-xs">
                              {availableSlots} slots
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Schedule Details Section */}
              <div className="w-1/3 p-6">
                {selectedDate ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                        Schedule for {format(selectedDate, "MMM d, yyyy")}
                      </h4>
                      <button
                        onClick={addSchedule}
                        className="flex items-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </button>
                    </div>

                    {getScheduleForDate(selectedDate) ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Available Slots
                          </span>
                          <button
                            onClick={() => removeSchedule(selectedDate)}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {getScheduleForDate(selectedDate).slots.map(
                            (slot, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                              >
                                <input
                                  type="checkbox"
                                  checked={slot.isAvailable}
                                  onChange={() =>
                                    toggleSlotAvailability(selectedDate, index)
                                  }
                                  className="text-primary-600"
                                />
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {slot.startTime} - {slot.endTime}
                                  </div>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      Max:
                                    </span>
                                    <input
                                      type="number"
                                      min="1"
                                      value={slot.maxBookings}
                                      onChange={(e) =>
                                        updateSlotMaxBookings(
                                          selectedDate,
                                          index,
                                          e.target.value
                                        )
                                      }
                                      className="w-16 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                                    />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      ({slot.currentBookings} booked)
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                        <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                        <p>No schedule set for this date</p>
                        <p className="text-sm">
                          Click "Add" to create a schedule
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                    <p>Select a date to manage schedule</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {schedule.length} dates scheduled
              </div>
              <div className="flex space-x-3">
                <button onClick={onClose} className="btn-secondary">
                  Cancel
                </button>
                <button
                  onClick={saveSchedule}
                  disabled={loading}
                  className="btn-primary flex items-center"
                >
                  {loading ? (
                    <div className="spinner mr-2"></div>
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Schedule
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
