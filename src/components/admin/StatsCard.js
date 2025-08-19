"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatsCard({
  title,
  value,
  icon: Icon,
  color,
  change,
  trend,
  growth,
  periodStats,
}) {
  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="card-body p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              {typeof value === "number" ? value.toLocaleString() : value || 0}
            </p>

            {/* Growth indicator */}
            {growth !== undefined && (
              <div className="flex items-center">
                {growth > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
                ) : growth < 0 ? (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-2" />
                ) : (
                  <div className="w-4 h-4 mr-2" />
                )}
                <span
                  className={`text-sm font-medium ${
                    growth > 0
                      ? "text-green-600 dark:text-green-400"
                      : growth < 0
                      ? "text-red-600 dark:text-red-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {growth > 0
                    ? `+${growth}%`
                    : growth < 0
                    ? `${growth}%`
                    : "0%"}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                  from last period
                </span>
              </div>
            )}

            {/* Period stats */}
            {periodStats && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  This period: {periodStats.toLocaleString()}
                </p>
              </div>
            )}
          </div>

          <div className={`p-4 rounded-full ${color} ml-4`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
