"use client";

import { motion } from "framer-motion";
import { Star, Shield, ThumbsUp } from "lucide-react";
import ReactStars from "react-rating-stars-component";
import { format } from "date-fns";

export default function ReviewCard({ review }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-4 last:pb-0"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
              {review.patientName.charAt(0)}
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-gray-900 dark:text-white">
                {review.patientName}
              </h4>
              {review.verified && (
                <Shield
                  className="w-4 h-4 text-green-500"
                  title="Verified Patient"
                />
              )}
            </div>
            <div className="flex items-center space-x-2">
              <ReactStars
                count={5}
                value={review.rating}
                size={14}
                edit={false}
                activeColor="#f59e0b"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {format(new Date(review.date), "MMM dd, yyyy")}
              </span>
            </div>
          </div>
        </div>

        <button className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
          <ThumbsUp className="w-3 h-3" />
          <span>Helpful</span>
        </button>
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed ml-13">
        {review.comment}
      </p>
    </motion.div>
  );
}
