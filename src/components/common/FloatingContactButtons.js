"use client";

import { Phone, MessageCircle } from "lucide-react";
import { useState } from "react";

export default function FloatingContactButtons() {
  const [isExpanded, setIsExpanded] = useState(false);

  // Contact numbers - you can customize these
  const phoneNumber = "+919242141716";
  const whatsappNumber = "+919242141716";

  const handleCall = () => {
    window.open(`tel:${phoneNumber}`, "_blank");
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hi, I need assistance from Dr Help");
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsApp}
        className="group relative flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        aria-label="Contact via WhatsApp"
        title="WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />

        {/* Tooltip */}
        <span className="absolute right-16 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Chat on WhatsApp
        </span>

        {/* Ripple effect */}
        <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20"></span>
      </button>

      {/* Call Button */}
      <button
        onClick={handleCall}
        className="group relative flex items-center justify-center w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        aria-label="Call us"
        title="Call"
      >
        <Phone className="w-6 h-6" />

        {/* Tooltip */}
        <span className="absolute right-16 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Call us now
        </span>

        {/* Ripple effect */}
        <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></span>
      </button>
    </div>
  );
}
