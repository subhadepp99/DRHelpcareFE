"use client";

import { RefreshCw, AlertCircle } from "lucide-react";

export default function StatsCard({
  title,
  value,
  icon: Icon,
  color,
  change,
  trend,
  growth,
  periodStats,
  href,
  hasError,
  errorType,
  onRetry,
}) {
  const handleClick = () => {
    if (href && !hasError) {
      window.location.href = href;
    }
  };

  const handleRetry = (e) => {
    e.stopPropagation();
    if (onRetry && errorType) {
      onRetry(errorType);
    }
  };

  // Show error state only if this specific card has an error
  const showError = hasError && errorType;

  return (
    <div
      className={`card hover:shadow-lg transition-all duration-200 w-full h-full min-h-[160px] bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 ${
        href && !showError ? "cursor-pointer" : ""
      } ${showError ? "border-2 border-red-200 dark:border-red-700" : ""}`}
      onClick={href && !showError ? handleClick : undefined}
    >
      <div className="card-body p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {title}
            </h3>
            {showError ? (
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-lg font-bold text-red-600 dark:text-red-400">
                  Unavailable
                </span>
              </div>
            ) : (
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {value}
              </div>
            )}
          </div>
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              showError ? "bg-red-100 dark:bg-red-900" : color
            }`}
          >
            {showError ? (
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            ) : (
              <Icon className="w-8 h-8 text-white" />
            )}
          </div>
        </div>

        {showError ? (
          <div className="flex items-center justify-between">
            <span className="text-sm text-red-600 dark:text-red-400">
              Data unavailable
            </span>
            {onRetry && (
              <button
                onClick={handleRetry}
                className="flex items-center gap-1 px-3 py-1 text-xs bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-300 rounded-full transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Retry
              </button>
            )}
          </div>
        ) : (
          <>
            {growth !== null && growth !== undefined && (
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Growth
                </span>
                <span
                  className={`text-sm font-medium ${
                    growth >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {growth >= 0 ? "+" : ""}
                  {growth}%
                </span>
              </div>
            )}

            {periodStats !== null && periodStats !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  This Period
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {periodStats}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
