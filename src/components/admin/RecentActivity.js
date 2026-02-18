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
  Activity,
} from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { formatDistanceToNow } from "date-fns";

const ACTIVITY_META = {
  doctor_added: { icon: Stethoscope, color: "text-blue-600" },
  doctor_updated: { icon: Edit, color: "text-yellow-600" },
  clinic_added: { icon: Building2, color: "text-purple-600" },
  clinic_registered: { icon: Building2, color: "text-purple-600" },
  pharmacy_added: { icon: Pill, color: "text-orange-600" },
  appointment_booked: { icon: Calendar, color: "text-green-600" },
  appointment_completed: { icon: CheckCircle, color: "text-green-600" },
  appointment_cancelled: { icon: AlertCircle, color: "text-red-600" },
  user_registered: { icon: UserPlus, color: "text-indigo-600" },
  user_updated: { icon: User, color: "text-slate-600" },
};

export default function RecentActivity() {
  const { get } = useApi();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      const response = await get("/dashboard/activity");
      const fetched =
        response.data?.data?.activities || response.data?.activities || [];

      const normalized = fetched.map((activity) => {
        const meta = ACTIVITY_META[activity.type] || {
          icon: Activity,
          color: "text-gray-600",
        };
        const timestamp = new Date(activity.timestamp || activity.createdAt);
        const activityUser =
          typeof activity.user === "string"
            ? activity.user
            : activity.user?.name ||
              [activity.user?.firstName, activity.user?.lastName]
                .filter(Boolean)
                .join(" ") ||
              activity.user?.username ||
              "System";

        return {
          id: activity.id || activity._id,
          type: activity.type,
          message: activity.message || "Activity update",
          user: activityUser || "System",
          timestamp: Number.isNaN(timestamp.getTime()) ? new Date() : timestamp,
          icon: meta.icon,
          color: meta.color,
        };
      });

      setActivities(normalized);
    } catch (error) {
      setActivities([]);
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
