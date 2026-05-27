"use client";

import { useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { useApi } from "@/hooks/useApi";

export default function BackfillImagesButton({
  endpoint,
  label = "Backfill Images",
  target = "images",
  onComplete,
  className = "",
}) {
  const { post } = useApi();
  const [loading, setLoading] = useState(false);

  const handleBackfill = async () => {
    if (
      !confirm(
        `Backfill ${target} into client/src/sources and update the database links?`
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      const response = await post(endpoint, {}, { timeout: 300000 });
      const data = response.data || {};
      toast.success(
        data.message ||
          `Backfill complete: ${data.converted || 0} converted, ${
            data.skipped || 0
          } skipped`
      );
      if (onComplete) onComplete();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to backfill images");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBackfill}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
    >
      {loading ? (
        <RefreshCw className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      <span>{loading ? "Backfilling..." : label}</span>
    </button>
  );
}
