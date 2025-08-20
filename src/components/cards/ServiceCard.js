"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function ServiceCard({
  icon: Icon,
  title,
  description,
  color,
  href,
}) {
  const router = useRouter();

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="card cursor-pointer hover:shadow-xl hover:shadow-primary-200/50 transition-all duration-300 h-full"
      onClick={() => router.push(href)}
    >
      <div className="p-6 text-center h-full flex flex-col">
        <div
          className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium text-sm group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
          <span>Explore Service</span>
          <ArrowRight className="w-3 h-3 ml-2 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
}
