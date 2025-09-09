"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { getEntityImageUrl } from "@/utils/imageUtils";

export default function DepartmentCard({ department }) {
  const router = useRouter();
  // department = { _id, name, heading, imageUrl, description, doctors: [...] }

  const handleClick = () => {
    const depName = encodeURIComponent(
      department?.name || department?.heading || ""
    );
    console.log("DepartmentCard clicked:", {
      department,
      depName,
      name: department?.name,
      heading: department?.heading,
    });
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
          const imageSrc = getEntityImageUrl(department, "imageUrl");
          return imageSrc ? (
            <Image
              src={imageSrc}
              alt={department?.heading || department?.name || "Department"}
              fill
              className="object-cover"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null;
        })()}
        <div
          className="w-full h-full flex items-center justify-center text-sm text-gray-500 dark:text-gray-400"
          style={{
            display: getEntityImageUrl(department, "imageUrl")
              ? "none"
              : "flex",
          }}
        >
          No image
        </div>
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
