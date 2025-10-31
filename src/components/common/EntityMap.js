"use client";

import { useEffect, useRef } from "react";
import { ExternalLink } from "lucide-react";
import { loadGoogleMapsPlaces } from "@/utils/googlePlaces";

export default function EntityMap({
  lat,
  lng,
  title = "Location",
  heightClass = "h-64",
  showDirections = true,
}) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    let marker;
    (async () => {
      if (!lat || !lng) return;
      await loadGoogleMapsPlaces();
      if (!(window.google && window.google.maps)) return;
      if (!mapRef.current) return;

      const center = { lat: Number(lat), lng: Number(lng) };
      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 15,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      });
      marker = new window.google.maps.Marker({
        position: center,
        map,
        title,
      });
      mapInstance.current = map;
    })();

    return () => {
      if (marker) marker.setMap(null);
    };
  }, [lat, lng, title]);

  const openDirections = () => {
    if (!lat || !lng) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };

  if (!lat || !lng) return null;

  return (
    <div>
      <div
        className={`w-full ${heightClass} rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700`}
      >
        <div ref={mapRef} className="w-full h-full" />
      </div>
      {showDirections && (
        <button
          onClick={openDirections}
          className="mt-3 inline-flex items-center px-3 py-2 rounded-md bg-primary-600 hover:bg-primary-700 text-white text-sm"
        >
          <ExternalLink className="w-4 h-4 mr-2" /> Get Directions
        </button>
      )}
    </div>
  );
}
