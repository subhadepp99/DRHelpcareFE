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
    <div className="card hover:shadow-lg transition-all duration-200 w-full h-full min-h-[160px] bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700">
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-start justify-between flex-1">
          <div className="flex-1 min-w-0 pr-4">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
              {title}
            </p>
            <p className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {typeof value === "number" ? value.toLocaleString() : value || 0}
            </p>

            {/* Growth indicator */}
            {growth !== undefined && (
              <div className="flex items-center mb-2">
                {growth > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                ) : growth < 0 ? (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 mr-2 flex-shrink-0" />
                )}
                <span
                  className={`text-sm font-semibold ${
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
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  from last period
                </span>
              </div>
            )}

            {/* Period stats */}
            {periodStats && (
              <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-600">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  This period: {periodStats.toLocaleString()}
                </p>
              </div>
            )}
          </div>

          <div className={`p-4 rounded-xl ${color} flex-shrink-0 shadow-lg`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
