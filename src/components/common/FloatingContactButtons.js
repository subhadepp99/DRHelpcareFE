"use client";

import { Phone, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function FloatingContactButtons() {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  // Contact numbers - you can customize these
  const phoneNumber = "+919242141716";
  const whatsappNumber = "+919242141716";

  // Hide buttons on admin, register, and login pages
  const shouldHide = pathname?.startsWith("/admin") || 
                     pathname === "/register" || 
                     pathname === "/login";

  const handleCall = () => {
    window.open(`tel:${phoneNumber}`, "_blank");
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hi, I need assistance from Dr Help");
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  if (shouldHide) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-2 sm:gap-3">
      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsApp}
        className="group relative flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        aria-label="Contact via WhatsApp"
        title="WhatsApp"
      >
        <MessageCircle className="w-4 h-4 sm:w-6 sm:h-6" />

        {/* Tooltip */}
        <span className="absolute right-12 sm:right-16 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Chat on WhatsApp
        </span>

        {/* Ripple effect */}
        <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20"></span>
      </button>

      {/* Call Button */}
      <button
        onClick={handleCall}
        className="group relative flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        aria-label="Call us"
        title="Call"
      >
        <Phone className="w-4 h-4 sm:w-6 sm:h-6" />

        {/* Tooltip */}
        <span className="absolute right-12 sm:right-16 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Call us now
        </span>

        {/* Ripple effect */}
        <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></span>
      </button>
    </div>
  );
}
