"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Stethoscope,
  Building2,
  Pill,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  UserPlus,
  Edit,
} from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { formatDistanceToNow } from "date-fns";

export default function RecentActivity() {
  const { get } = useApi();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      // Try to fetch real data, fallback to mock
      const response = await get("/dashboard/activity");
      setActivities(response.data.activities || []);
    } catch (error) {
      // Mock realistic activity data
      const mockActivities = [
        {
          id: 1,
          type: "doctor_added",
          message: "Dr. Sarah Johnson was added to Cardiology department",
          user: "Admin User",
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          icon: Stethoscope,
          color: "text-blue-600",
        },
        {
          id: 2,
          type: "appointment_booked",
          message: "New appointment booked with Dr. Michael Brown",
          user: "John Doe",
          timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
          icon: Calendar,
          color: "text-green-600",
        },
        {
          id: 3,
          type: "clinic_registered",
          message: "City Care Clinic registered successfully",
          user: "System",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          icon: Building2,
          color: "text-purple-600",
        },
        {
          id: 4,
          type: "pharmacy_added",
          message: "MedPlus Pharmacy added to network",
          user: "Admin User",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
          icon: Pill,
          color: "text-orange-600",
        },
        {
          id: 5,
          type: "user_registered",
          message: "New user registration: Alice Smith",
          user: "System",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
          icon: UserPlus,
          color: "text-indigo-600",
        },
        {
          id: 6,
          type: "doctor_updated",
          message: "Dr. Robert Wilson updated profile information",
          user: "Dr. Robert Wilson",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
          icon: Edit,
          color: "text-yellow-600",
        },
      ];

      setActivities(mockActivities);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="spinner w-6 h-6"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <div
                className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${activity.color}`}
              >
                <activity.icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.message}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    by {activity.user}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(activity.timestamp, {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0">
                <Clock className="w-4 h-4 text-gray-400" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
