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
  const { put, get } = useApi();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedClinicId, setSelectedClinicId] = useState(
    doctor?.clinicDetails?.[0]
      ? String(
          doctor.clinicDetails[0].clinic?._id || doctor.clinicDetails[0].clinic
        )
      : ""
  );
  const [scheduleDrafts, setScheduleDrafts] = useState({}); // key: clinicId or 'general' -> schedule array
  // Recurrence controls
  const [recurrenceScope, setRecurrenceScope] = useState("week"); // 'week' | 'month' | 'range'
  const [selectedWeekdays, setSelectedWeekdays] = useState(new Set()); // 0=Sun..6=Sat
  const [rangeEndDate, setRangeEndDate] = useState(null);
  const [templateSource, setTemplateSource] = useState("selected"); // 'selected' | 'default'

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

  // Seed drafts from doctor when modal opens or doctor changes
  useEffect(() => {
    if (!doctor) return;
    const nextDrafts = {};
    nextDrafts["general"] = Array.isArray(doctor.bookingSchedule)
      ? doctor.bookingSchedule
      : [];
    (doctor.clinicDetails || []).forEach((cd) => {
      const key = String(cd.clinic?._id || cd.clinic);
      nextDrafts[key] = Array.isArray(cd.clinicSchedule)
        ? cd.clinicSchedule
        : [];
    });
    setScheduleDrafts(nextDrafts);
    const currentKey = selectedClinicId || "general";
    setSchedule(nextDrafts[currentKey] || []);
    setSelectedDate(null);
  }, [doctor]);

  // Load schedule when clinic selection changes, preserving previous draft
  const handleClinicChange = (newClinicId) => {
    const currentKey = selectedClinicId || "general";
    setScheduleDrafts((prev) => ({
      ...prev,
      [currentKey]: Array.isArray(schedule) ? schedule : [],
    }));
    setSelectedClinicId(newClinicId);
    setSelectedDate(null);
    const targetKey = newClinicId || "general";
    setSchedule((prev) => {
      // will be replaced by effect below via scheduleDrafts update
      return Array.isArray(scheduleDrafts[targetKey])
        ? scheduleDrafts[targetKey]
        : [];
    });
  };

  useEffect(() => {
    const key = selectedClinicId || "general";
    if (
      scheduleDrafts &&
      Object.prototype.hasOwnProperty.call(scheduleDrafts, key)
    ) {
      const next = scheduleDrafts[key];
      setSchedule(Array.isArray(next) ? next : []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClinicId, scheduleDrafts]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    // Initialize weekday selection to selected date's weekday if empty
    if (!selectedWeekdays || selectedWeekdays.size === 0) {
      const wd = new Date(date).getDay();
      setSelectedWeekdays(new Set([wd]));
    }
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

  const toggleWeekday = (wd) => {
    setSelectedWeekdays((prev) => {
      const next = new Set(prev);
      if (next.has(wd)) next.delete(wd);
      else next.add(wd);
      return next;
    });
  };

  const getWeekBounds = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const start = new Date(d);
    start.setDate(d.getDate() - day);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  };

  const getMonthBounds = (date) => {
    const d = new Date(date);
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  };

  const buildSlotsFromTemplate = (baseDate) => {
    const baseSchedule = getScheduleForDate(baseDate);
    if (templateSource === "selected" && baseSchedule) {
      return (baseSchedule.slots || []).map((s) => ({
        startTime: s.startTime,
        endTime: s.endTime,
        isAvailable: true,
        maxBookings: Number(s.maxBookings) || 1,
        currentBookings: 0,
      }));
    }
    return defaultTimeSlots.map((time) => ({
      startTime: time,
      endTime: addMinutes(time, 30),
      isAvailable: true,
      maxBookings: 1,
      currentBookings: 0,
    }));
  };

  const addRecurringSchedules = () => {
    if (!selectedDate) {
      toast.error("Please select a date first");
      return;
    }
    // Determine range
    let rangeStart = startOfDay(new Date(selectedDate));
    let rangeEnd = null;
    if (recurrenceScope === "week") {
      const { start, end } = getWeekBounds(rangeStart);
      rangeStart = start;
      rangeEnd = end;
    } else if (recurrenceScope === "month") {
      const { start, end } = getMonthBounds(rangeStart);
      rangeStart = start;
      rangeEnd = end;
    } else if (recurrenceScope === "range") {
      if (!rangeEndDate) {
        toast.error("Please select an end date for the range");
        return;
      }
      rangeEnd = new Date(rangeEndDate);
      rangeEnd.setHours(23, 59, 59, 999);
      if (isAfter(rangeStart, rangeEnd)) {
        toast.error("End date must be after start date");
        return;
      }
      // Guard extreme ranges
      const maxDays = 180;
      const daysDiff = Math.ceil(
        (rangeEnd - rangeStart) / (1000 * 60 * 60 * 24)
      );
      if (daysDiff > maxDays) {
        toast.error(`Range too large (>${maxDays} days)`);
        return;
      }
    }

    const weekdays =
      selectedWeekdays.size > 0
        ? new Set(selectedWeekdays)
        : new Set([new Date(selectedDate).getDay()]);

    const todayStart = startOfDay(new Date());
    const toAdd = [];
    let cursor = new Date(rangeStart);
    while (cursor <= rangeEnd) {
      const day = cursor.getDay();
      const isFutureOrToday =
        !isAfter(todayStart, cursor) || isSameDay(todayStart, cursor);
      if (weekdays.has(day) && isFutureOrToday) {
        const exists = schedule.some((s) =>
          isSameDay(new Date(s.date), cursor)
        );
        if (!exists) {
          toAdd.push(new Date(cursor));
        }
      }
      cursor = addDays(cursor, 1);
    }

    if (toAdd.length === 0) {
      toast("No new dates to add for selected recurrence");
      return;
    }

    const slotsTemplate = buildSlotsFromTemplate(selectedDate);
    const newSchedules = toAdd.map((d) => ({
      date: d,
      isAvailable: true,
      slots: slotsTemplate.map((s) => ({ ...s })),
    }));

    setSchedule((prev) => [...prev, ...newSchedules]);
    const skipped = Math.max(
      0,
      Math.ceil((rangeEnd - rangeStart) / (1000 * 60 * 60 * 24)) +
        1 -
        toAdd.length
    );
    toast.success(
      `Added ${newSchedules.length} dates${
        skipped ? `, skipped ${skipped}` : ""
      }`
    );
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
      if (selectedClinicId) {
        await put(
          `/doctors/${doctor._id}/clinics/${selectedClinicId}/schedule`,
          {
            clinicSchedule: schedule,
          }
        );
      } else {
        await put(`/doctors/${doctor._id}/schedule`, {
          bookingSchedule: schedule,
        });
      }
      toast.success("Schedule saved successfully");
      if (onScheduleUpdate) {
        onScheduleUpdate({
          scope: selectedClinicId ? "clinic" : "general",
          clinicId: selectedClinicId || null,
          schedule,
        });
      }
      // update local drafts so switching back keeps saved data
      const key = selectedClinicId || "general";
      setScheduleDrafts((prev) => ({
        ...prev,
        [key]: Array.isArray(schedule) ? schedule : [],
      }));
      // refresh from server to ensure consistent state and IDs
      try {
        const res = await get(`/doctors/${doctor._id}`, { silent: true });
        const fresh = res?.data?.data || res?.data || null;
        if (fresh) {
          const nextDrafts = {};
          nextDrafts["general"] = Array.isArray(fresh.bookingSchedule)
            ? fresh.bookingSchedule
            : [];
          (fresh.clinicDetails || []).forEach((cd) => {
            const ckey = String(cd.clinic?._id || cd.clinic);
            nextDrafts[ckey] = Array.isArray(cd.clinicSchedule)
              ? cd.clinicSchedule
              : [];
          });
          setScheduleDrafts(nextDrafts);
          const currentKey = selectedClinicId || "general";
          setSchedule(nextDrafts[currentKey] || []);
        }
      } catch {}
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
            className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all w-full max-w-7xl h-[92vh] flex flex-col"
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
              <div className="flex items-center gap-3">
                {doctor?.clinicDetails?.length > 0 && (
                  <select
                    className="input-field"
                    value={selectedClinicId}
                    onChange={(e) => handleClinicChange(e.target.value)}
                    title="Select Clinic (empty = General schedule)"
                  >
                    <option value="">General</option>
                    {doctor.clinicDetails.map((cd) => (
                      <option
                        key={String(cd.clinic?._id || cd.clinic)}
                        value={String(cd.clinic?._id || cd.clinic)}
                      >
                        {cd.clinicName || cd.clinic?.name || "Clinic"}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Calendar Section */}
              <div className="w-2/3 p-6 border-r border-gray-200 dark:border-gray-700 overflow-auto">
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
              <div className="w-1/3 p-6 overflow-auto">
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

                    {/* Recurrence Controls */}
                    <div className="space-y-3 mb-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        Repeat
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                          (lbl, idx) => (
                            <label
                              key={idx}
                              className={`px-2 py-1 text-xs rounded border cursor-pointer ${
                                selectedWeekdays.has(idx)
                                  ? "bg-primary-600 text-white border-primary-600"
                                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              <input
                                type="checkbox"
                                className="hidden"
                                checked={selectedWeekdays.has(idx)}
                                onChange={() => toggleWeekday(idx)}
                              />
                              {lbl}
                            </label>
                          )
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            name="rec-scope"
                            checked={recurrenceScope === "week"}
                            onChange={() => setRecurrenceScope("week")}
                          />
                          This week
                        </label>
                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            name="rec-scope"
                            checked={recurrenceScope === "month"}
                            onChange={() => setRecurrenceScope("month")}
                          />
                          This month
                        </label>
                        <label className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <input
                              type="radio"
                              name="rec-scope"
                              checked={recurrenceScope === "range"}
                              onChange={() => setRecurrenceScope("range")}
                            />
                            Range until
                          </span>
                          <input
                            type="date"
                            className="input-field py-1 px-2 text-xs"
                            disabled={recurrenceScope !== "range"}
                            value={
                              rangeEndDate
                                ? format(new Date(rangeEndDate), "yyyy-MM-dd")
                                : ""
                            }
                            onChange={(e) =>
                              setRangeEndDate(
                                e.target.value ? new Date(e.target.value) : null
                              )
                            }
                          />
                        </label>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            name="rec-template"
                            checked={templateSource === "selected"}
                            onChange={() => setTemplateSource("selected")}
                          />
                          Use selected date's slots
                        </label>
                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            name="rec-template"
                            checked={templateSource === "default"}
                            onChange={() => setTemplateSource("default")}
                          />
                          Use default slots
                        </label>
                        <button
                          type="button"
                          onClick={addRecurringSchedules}
                          className="ml-auto px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                        >
                          Add Recurring
                        </button>
                      </div>
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
