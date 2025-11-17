"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { getEntityImageUrl, debugApiConfig } from "@/utils/imageUtils";

export default function DepartmentCard({ department }) {
  const router = useRouter();
  // department = { _id, name, heading, imageUrl, description, doctors: [...] }

  const handleClick = () => {
    const depName = encodeURIComponent(
      department?.name || department?.heading || ""
    );
    router.push(`/search?type=doctors&department=${depName}`);
  };

  return (
    <div
      className="w-56 bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col  cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
      onClick={handleClick}
    >
      {/* min-h-[240px] */}
      <div className="relative w-full h-24 mb-3 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
        {(() => {
          // Debug API configuration on first load
          if (!window.debugLogged) {
            debugApiConfig();
            window.debugLogged = true;
          }

          const imageSrc = getEntityImageUrl(department, "imageUrl");

          if (imageSrc) {
            return (
              <>
                <img
                  src={imageSrc}
                  alt={department?.heading || department?.name || "Department"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target;
                    const fallback = target.nextSibling;
                    if (target && fallback) {
                      target.style.display = "none";
                      fallback.style.display = "flex";
                    }
                  }}
                  onLoad={() => {}}
                />
                <div
                  className="w-full h-full flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800"
                  style={{ display: "none" }}
                >
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-1">
                      Image unavailable
                    </div>
                    <div className="text-xs">
                      {department?.heading || department?.name || "Department"}
                    </div>
                  </div>
                </div>
              </>
            );
          } else {
            return (
              <div className="w-full h-full flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-1">No image</div>
                  <div className="text-xs">
                    {department?.heading || department?.name || "Department"}
                  </div>
                </div>
              </div>
            );
          }
        })()}
      </div>
      <h3 className="font-bold text-base mb-2">
        {department?.heading || department?.name || "Department"}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm line-clamp-2 flex-1">
        {department?.description || ""}
      </p>
      {/* {department.doctors?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-auto pt-2">
          <span className="font-semibold text-xs">Doctors:</span>
          {department.doctors.slice(0, 2).map((doc) => (
            <span key={doc._id || doc} className="text-primary-600 text-xs">
              {typeof doc === "object" ? doc.name : doc}
            </span>
          ))}
          {department.doctors.length > 2 && (
            <span className="text-xs text-gray-500 ml-1">
              +{department.doctors.length - 2} more
            </span>
          )}
        </div>
      )} */}
    </div>
  );
}
